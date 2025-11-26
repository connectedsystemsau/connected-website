using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Azure.Data.Tables;
using System;

[assembly: FunctionsStartup(typeof(ConnectedWebsite.Api.Startup))]

namespace ConnectedWebsite.Api
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddHttpClient();

            // Add Azure Table Storage client
            var storageConnectionString = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING");
            builder.Services.AddSingleton(new TableServiceClient(storageConnectionString));

            // Add CORS if needed
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    var allowedOrigins = Environment.GetEnvironmentVariable("CORS_ORIGIN")?.Split(',') ?? Array.Empty<string>();
                    policy.WithOrigins(allowedOrigins)
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });
        }
    }
}
