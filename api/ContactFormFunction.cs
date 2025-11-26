using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using Azure.Data.Tables;
using Microsoft.Graph;
using Azure.Identity;

namespace ConnectedWebsite.Api
{
    public class ContactFormFunction
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly TableServiceClient _tableServiceClient;
        private readonly string _hcaptchaSecret;
        private readonly string _corsOrigin;
        private readonly string _csrfSecret;

        public ContactFormFunction(
            IHttpClientFactory httpClientFactory,
            TableServiceClient tableServiceClient)
        {
            _httpClientFactory = httpClientFactory;
            _tableServiceClient = tableServiceClient;
            _hcaptchaSecret = Environment.GetEnvironmentVariable("HCAPTCHA_SECRET");
            _corsOrigin = Environment.GetEnvironmentVariable("CORS_ORIGIN");
            _csrfSecret = Environment.GetEnvironmentVariable("CSRF_SECRET");
        }

        [FunctionName("GetCsrfToken")]
        public async Task<IActionResult> GetCsrfToken(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "csrf-token")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Generating CSRF token");

            try
            {
                // Add CORS headers
                if (!IsValidOrigin(req.Headers["Origin"]))
                {
                    return new StatusCodeResult(403);
                }

                var token = GenerateCsrfToken();
                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
                var signature = SignCsrfToken(token, timestamp);

                return new OkObjectResult(new
                {
                    token,
                    timestamp,
                    signature
                });
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Error generating CSRF token");
                return new StatusCodeResult(500);
            }
        }

        [FunctionName("SubmitContactForm")]
        public async Task<IActionResult> SubmitContactForm(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "contact")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Contact form submission received");

            try
            {
                // Validate CORS origin
                if (!IsValidOrigin(req.Headers["Origin"]))
                {
                    log.LogWarning("Invalid origin: {Origin}", req.Headers["Origin"].FirstOrDefault());
                    return new StatusCodeResult(403);
                }

                // Read request body
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var data = JsonConvert.DeserializeObject<ContactFormSubmission>(requestBody);

                if (data == null)
                {
                    return new BadRequestObjectResult(new { error = "Invalid request data" });
                }

                // Validate CSRF token
                if (!ValidateCsrfToken(data.CsrfToken, data.CsrfTimestamp, data.CsrfSignature))
                {
                    log.LogWarning("Invalid CSRF token");
                    return new BadRequestObjectResult(new { error = "Invalid security token" });
                }

                // Check CSRF token age (max 30 minutes)
                var tokenAge = DateTimeOffset.UtcNow.ToUnixTimeSeconds() - long.Parse(data.CsrfTimestamp);
                if (tokenAge > 1800 || tokenAge < 0)
                {
                    log.LogWarning("CSRF token expired or invalid timestamp");
                    return new BadRequestObjectResult(new { error = "Security token expired" });
                }

                // Validate hCaptcha
                var isCaptchaValid = await ValidateHCaptcha(data.HCaptchaToken, req.HttpContext.Connection.RemoteIpAddress?.ToString());
                if (!isCaptchaValid)
                {
                    log.LogWarning("hCaptcha validation failed");
                    return new BadRequestObjectResult(new { error = "Captcha validation failed" });
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(data.Name) ||
                    string.IsNullOrWhiteSpace(data.Email) ||
                    string.IsNullOrWhiteSpace(data.Message))
                {
                    return new BadRequestObjectResult(new { error = "All fields are required" });
                }

                // Validate email format
                if (!IsValidEmail(data.Email))
                {
                    return new BadRequestObjectResult(new { error = "Invalid email address" });
                }

                // Store in Azure Table Storage
                var submissionId = await StoreSubmission(data, log);

                // Send email via MS Graph
                await SendEmailViaGraph(data, submissionId, log);

                log.LogInformation("Contact form submission processed successfully: {SubmissionId}", submissionId);

                return new OkObjectResult(new
                {
                    success = true,
                    message = "Thank you for your message. We'll be in touch soon.",
                    submissionId
                });
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Error processing contact form submission");
                return new StatusCodeResult(500);
            }
        }

        private bool IsValidOrigin(string origin)
        {
            if (string.IsNullOrEmpty(origin))
                return false;

            var allowedOrigins = _corsOrigin?.Split(',') ?? Array.Empty<string>();
            return allowedOrigins.Any(o => origin.Equals(o.Trim(), StringComparison.OrdinalIgnoreCase));
        }

        private string GenerateCsrfToken()
        {
            var bytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(bytes);
            }
            return Convert.ToBase64String(bytes);
        }

        private string SignCsrfToken(string token, string timestamp)
        {
            var message = $"{token}:{timestamp}";
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_csrfSecret)))
            {
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(message));
                return Convert.ToBase64String(hash);
            }
        }

        private bool ValidateCsrfToken(string token, string timestamp, string signature)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(timestamp) || string.IsNullOrEmpty(signature))
                return false;

            var expectedSignature = SignCsrfToken(token, timestamp);
            return signature == expectedSignature;
        }

        private async Task<bool> ValidateHCaptcha(string token, string remoteIp)
        {
            if (string.IsNullOrEmpty(token))
                return false;

            var client = _httpClientFactory.CreateClient();
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("secret", _hcaptchaSecret),
                new KeyValuePair<string, string>("response", token),
                new KeyValuePair<string, string>("remoteip", remoteIp ?? "")
            });

            var response = await client.PostAsync("https://hcaptcha.com/siteverify", content);
            var responseString = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<HCaptchaResponse>(responseString);

            return result?.Success == true;
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private async Task<string> StoreSubmission(ContactFormSubmission data, ILogger log)
        {
            var tableClient = _tableServiceClient.GetTableClient("contactsubmissions");
            await tableClient.CreateIfNotExistsAsync();

            var submissionId = Guid.NewGuid().ToString();
            var entity = new TableEntity("ContactForm", submissionId)
            {
                { "Name", data.Name },
                { "Email", data.Email },
                { "Company", data.Company ?? "" },
                { "Phone", data.Phone ?? "" },
                { "Message", data.Message },
                { "SubmittedAt", DateTimeOffset.UtcNow.ToString("o") },
                { "Status", "New" }
            };

            await tableClient.AddEntityAsync(entity);
            log.LogInformation("Stored submission in table storage: {SubmissionId}", submissionId);

            return submissionId;
        }

        private async Task SendEmailViaGraph(ContactFormSubmission data, string submissionId, ILogger log)
        {
            var tenantId = Environment.GetEnvironmentVariable("TENANT_ID");
            var clientId = Environment.GetEnvironmentVariable("CLIENT_ID");
            var clientSecret = Environment.GetEnvironmentVariable("CLIENT_SECRET");
            var recipientEmail = Environment.GetEnvironmentVariable("RECIPIENT_EMAIL");
            var senderEmail = Environment.GetEnvironmentVariable("SENDER_EMAIL");

            var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
            var graphClient = new GraphServiceClient(credential);

            var message = new Message
            {
                Subject = $"New Contact Form Submission - {data.Name}",
                Body = new ItemBody
                {
                    ContentType = BodyType.Html,
                    Content = $@"
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Submission ID:</strong> {submissionId}</p>
                        <p><strong>Name:</strong> {data.Name}</p>
                        <p><strong>Email:</strong> {data.Email}</p>
                        <p><strong>Company:</strong> {data.Company ?? "N/A"}</p>
                        <p><strong>Phone:</strong> {data.Phone ?? "N/A"}</p>
                        <p><strong>Message:</strong></p>
                        <p>{data.Message.Replace("\n", "<br/>")}</p>
                        <hr/>
                        <p><small>Submitted at: {DateTimeOffset.UtcNow:yyyy-MM-dd HH:mm:ss} UTC</small></p>
                    "
                },
                ToRecipients = new List<Recipient>
                {
                    new Recipient
                    {
                        EmailAddress = new EmailAddress
                        {
                            Address = recipientEmail
                        }
                    }
                },
                ReplyTo = new List<Recipient>
                {
                    new Recipient
                    {
                        EmailAddress = new EmailAddress
                        {
                            Address = data.Email,
                            Name = data.Name
                        }
                    }
                }
            };

            await graphClient.Users[senderEmail]
                .SendMail(message, false)
                .Request()
                .PostAsync();

            log.LogInformation("Email sent successfully via MS Graph for submission: {SubmissionId}", submissionId);
        }
    }

    public class ContactFormSubmission
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Company { get; set; }
        public string Phone { get; set; }
        public string Message { get; set; }
        public string HCaptchaToken { get; set; }
        public string CsrfToken { get; set; }
        public string CsrfTimestamp { get; set; }
        public string CsrfSignature { get; set; }
    }

    public class HCaptchaResponse
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("challenge_ts")]
        public string ChallengeTimestamp { get; set; }

        [JsonProperty("hostname")]
        public string Hostname { get; set; }

        [JsonProperty("error-codes")]
        public string[] ErrorCodes { get; set; }
    }
}
