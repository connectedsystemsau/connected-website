# Connected Website API

Azure Functions-based contact form API with hCaptcha, CSRF protection, Azure Table Storage, and MS Graph email delivery.

## Features

- ✅ hCaptcha validation
- ✅ CSRF token protection with HMAC signing
- ✅ Azure Table Storage for submission persistence
- ✅ MS Graph API for email delivery via Exchange
- ✅ CORS configuration
- ✅ Comprehensive logging with Application Insights
- ✅ Input validation and sanitization

## Prerequisites

- .NET 8.0 SDK
- Azure Functions Core Tools v4
- Azure subscription
- Azure AD App Registration with Mail.Send permissions
- hCaptcha account

## Local Development

### 1. Install Dependencies

```bash
cd api
dotnet restore
```

### 2. Configure Local Settings

Update `local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet",
    "AZURE_STORAGE_CONNECTION_STRING": "UseDevelopmentStorage=true",
    "HCAPTCHA_SECRET": "your-hcaptcha-secret-key",
    "CORS_ORIGIN": "http://localhost:3000",
    "CSRF_SECRET": "your-csrf-secret-minimum-32-chars",
    "TENANT_ID": "your-azure-ad-tenant-id",
    "CLIENT_ID": "your-app-registration-client-id",
    "CLIENT_SECRET": "your-client-secret",
    "RECIPIENT_EMAIL": "contact@connectedsys.com.au",
    "SENDER_EMAIL": "noreply@connectedsys.com.au"
  }
}
```

### 3. Start Azure Storage Emulator (Azurite)

```bash
# Install Azurite if not already installed
npm install -g azurite

# Start Azurite
azurite --silent --location ./azurite --debug ./azurite/debug.log
```

### 4. Run Function App

```bash
cd api
func start
```

The API will be available at `http://localhost:7071/api`

## API Endpoints

### GET /api/csrf-token

Generate a CSRF token for form submission.

**Response:**
```json
{
  "token": "base64-encoded-token",
  "timestamp": "unix-timestamp",
  "signature": "hmac-signature"
}
```

### POST /api/contact

Submit contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "phone": "+61 400 000 000",
  "message": "I'd like to discuss a project",
  "hCaptchaToken": "hcaptcha-response-token",
  "csrfToken": "token-from-csrf-endpoint",
  "csrfTimestamp": "timestamp-from-csrf-endpoint",
  "csrfSignature": "signature-from-csrf-endpoint"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your message. We'll be in touch soon.",
  "submissionId": "guid"
}
```

## Azure AD App Registration Setup

### 1. Create App Registration

1. Go to Azure Portal → Azure Active Directory → App registrations
2. Click "New registration"
3. Name: `Connected Website Contact Form`
4. Supported account types: Single tenant
5. Redirect URI: Not required
6. Click "Register"

### 2. Configure API Permissions

1. Go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Select "Application permissions"
5. Add `Mail.Send`
6. Click "Grant admin consent"

### 3. Create Client Secret

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Description: `Function App Secret`
4. Expires: 24 months (or as per policy)
5. Click "Add"
6. **Copy the secret value immediately** (won't be shown again)

### 4. Note Required Values

- **Tenant ID**: Found on the Overview page
- **Client ID (Application ID)**: Found on the Overview page
- **Client Secret**: The value you just copied

## Infrastructure Deployment

### 1. Set Up Azure CLI

```bash
az login
az account set --subscription "your-subscription-name-or-id"
```

### 2. Create Resource Group

```bash
az group create \
  --name connected-website-rg \
  --location australiaeast
```

### 3. Deploy Infrastructure

```bash
az deployment group create \
  --resource-group connected-website-rg \
  --template-file infra/main.bicep \
  --parameters \
    environment=prod \
    location=australiaeast \
    hcaptchaSecret='your-hcaptcha-secret' \
    csrfSecret='your-csrf-secret-minimum-32-chars' \
    tenantId='your-tenant-id' \
    clientId='your-client-id' \
    clientSecret='your-client-secret' \
    recipientEmail='contact@connectedsys.com.au' \
    senderEmail='noreply@connectedsys.com.au' \
    corsOrigin='https://www.connectedsys.com.au,https://connectedsystemsau.github.io'
```

### 4. Deploy Function App

```bash
cd api
dotnet publish --configuration Release --output ./output
func azure functionapp publish connected-web-prod-func
```

## GitHub Actions Deployment

### 1. Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `AZURE_CLIENT_ID`: Azure service principal client ID
- `AZURE_TENANT_ID`: Azure AD tenant ID
- `AZURE_SUBSCRIPTION_ID`: Azure subscription ID
- `HCAPTCHA_SECRET`: hCaptcha secret key
- `CSRF_SECRET`: Random 32+ character string for CSRF signing
- `GRAPH_CLIENT_ID`: App registration client ID
- `GRAPH_CLIENT_SECRET`: App registration client secret
- `RECIPIENT_EMAIL`: Email address to receive form submissions
- `SENDER_EMAIL`: Email address to send from (must be valid Exchange mailbox)
- `CORS_ORIGIN`: Comma-separated allowed origins

### 2. Set Up Federated Identity (Workload Identity)

For passwordless authentication from GitHub Actions:

```bash
# Create service principal
az ad sp create-for-rbac \
  --name "GitHub-ConnectedWebsite" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/connected-website-rg

# Add federated credential
az ad app federated-credential create \
  --id <application-id> \
  --parameters '{
    "name": "GitHub-Actions",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:connectedsystemsau/connected-website:ref:refs/heads/master",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

### 3. Trigger Deployment

Deployments trigger automatically on push to `master` branch:
- Infrastructure: When files in `infra/` change
- Function App: When files in `api/` change

Manual trigger: Go to Actions → Select workflow → Run workflow

## Security Considerations

### CSRF Protection

The API implements double-submit cookie pattern with HMAC signing:

1. Client requests CSRF token from `/api/csrf-token`
2. Token is signed with HMAC-SHA256 using secret key
3. Client includes token, timestamp, and signature in form submission
4. Server validates signature and checks token age (max 30 minutes)

### hCaptcha

- Validates on server-side with hCaptcha API
- Includes remote IP for fraud prevention
- Token is single-use

### CORS

- Explicitly configured allowed origins
- Credentials support enabled for CSRF token cookies
- Preflight requests handled automatically

### Input Validation

- Required fields checked
- Email format validated
- Message length limits (enforced by hCaptcha timeout)

## Monitoring

### Application Insights

View logs and metrics:

```bash
az monitor app-insights metrics show \
  --app connected-web-prod-ai \
  --resource-group connected-website-rg \
  --metric requests/count
```

### Query Logs

```kusto
traces
| where message contains "Contact form"
| order by timestamp desc
| take 50
```

### View Submissions

```bash
az storage entity query \
  --account-name connectedwebprodst \
  --table-name contactsubmissions \
  --filter "PartitionKey eq 'ContactForm'"
```

## Troubleshooting

### Function App Not Starting

Check Application Settings are configured:

```bash
az functionapp config appsettings list \
  --name connected-web-prod-func \
  --resource-group connected-website-rg
```

### Email Not Sending

1. Verify sender email has a valid Exchange mailbox
2. Check Mail.Send permission is granted with admin consent
3. Verify client secret hasn't expired
4. Check Application Insights logs for Graph API errors

### CORS Errors

1. Verify `CORS_ORIGIN` includes your domain
2. Check Function App CORS settings match environment variable
3. Ensure protocol (https) matches exactly

### hCaptcha Validation Failing

1. Verify `HCAPTCHA_SECRET` is correct
2. Check hCaptcha site key matches on frontend
3. Ensure hCaptcha token isn't expired (2 minute timeout)

## Frontend Integration Example

```typescript
// 1. Get CSRF token
const csrfResponse = await fetch('https://your-function-app.azurewebsites.net/api/csrf-token');
const csrf = await csrfResponse.json();

// 2. Render hCaptcha
// (using @hcaptcha/react-hcaptcha or similar)

// 3. Submit form
const response = await fetch('https://your-function-app.azurewebsites.net/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    company: formData.company,
    phone: formData.phone,
    message: formData.message,
    hCaptchaToken: hcaptchaToken,
    csrfToken: csrf.token,
    csrfTimestamp: csrf.timestamp,
    csrfSignature: csrf.signature,
  }),
});

const result = await response.json();
```

## Cost Estimation

**Consumption Plan (Pay-per-execution):**
- Storage Account: ~$0.05/month (minimal usage)
- Function App: ~$0.20/month (first 1M executions free)
- Application Insights: ~$2.30/month (first 5GB free)

**Estimated Total: ~$2.50/month** for typical contact form usage (<1000 submissions/month)

## License

Proprietary - Connected Systems © 2025
