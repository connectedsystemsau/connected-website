# Contact Form Deployment Guide

Complete step-by-step guide to deploy the Connected Website contact form system.

## Prerequisites

Before starting, ensure you have:
- ✅ Azure subscription
- ✅ GitHub account with repo access
- ✅ Azure CLI installed (`az --version`)
- ✅ .NET 8 SDK installed
- ✅ Azure Functions Core Tools v4 (`func --version`)
- ✅ hCaptcha account (free tier available)

## Part 1: Azure AD App Registration

### 1.1 Create App Registration

1. Navigate to [Azure Portal](https://portal.azure.com)
2. Go to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Configure:
   - **Name**: `Connected Website Contact Form`
   - **Supported account types**: Accounts in this organizational directory only (Single tenant)
   - **Redirect URI**: Leave blank
5. Click **Register**

### 1.2 Configure API Permissions

1. In your new app registration, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Select **Application permissions**
5. Search for and add: `Mail.Send`
6. Click **Grant admin consent** (requires admin privileges)
7. Verify status shows green checkmark

### 1.3 Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Configure:
   - **Description**: `Function App Secret`
   - **Expires**: 24 months (or per your security policy)
4. Click **Add**
5. **IMPORTANT**: Copy the secret **Value** immediately (shown only once)

### 1.4 Record Required Values

From the **Overview** page, note:
- **Application (client) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Directory (tenant) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Client Secret**: `(the value you copied)`

## Part 2: hCaptcha Setup

### 2.1 Create hCaptcha Account

1. Go to [hCaptcha Dashboard](https://dashboard.hcaptcha.com/)
2. Sign up for a free account
3. Verify your email

### 2.2 Get hCaptcha Keys

1. Navigate to **Settings** → **Sites**
2. Add new site:
   - **Site name**: `Connected Website`
   - **Hostnames**: 
     - `connectedsystemsau.github.io`
     - `www.connectedsys.com.au` (if using custom domain)
     - `localhost` (for testing)
3. Click **Save**
4. Record:
   - **Site Key**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (public)
   - **Secret Key**: `0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (private)

## Part 3: GitHub Configuration

### 3.1 Set Up Workload Identity (OIDC)

This enables passwordless authentication from GitHub Actions to Azure.

```bash
# Login to Azure
az login

# Set your subscription
az account set --subscription "Your-Subscription-Name"

# Create a service principal for GitHub
az ad sp create-for-rbac --name "GitHub-ConnectedWebsite" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/connected-website-rg \
  --sdk-auth

# Note the output - you'll need the clientId
```

### 3.2 Add Federated Credential

```bash
# Get the application ID from the service principal
APP_ID=$(az ad sp list --display-name "GitHub-ConnectedWebsite" --query "[0].appId" -o tsv)

# Create federated credential for GitHub Actions
az ad app federated-credential create --id $APP_ID --parameters '{
  "name": "GitHub-Actions-Master",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:connectedsystemsau/connected-website:ref:refs/heads/master",
  "description": "GitHub Actions for master branch",
  "audiences": ["api://AzureADTokenExchange"]
}'
```

### 3.3 Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each:

| Secret Name | Value | Source |
|-------------|-------|--------|
| `AZURE_CLIENT_ID` | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | Service principal client ID |
| `AZURE_TENANT_ID` | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | Azure AD tenant ID |
| `AZURE_SUBSCRIPTION_ID` | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | Your Azure subscription ID |
| `HCAPTCHA_SECRET` | `0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | hCaptcha secret key |
| `CSRF_SECRET` | `(generate with command below)` | Random 32+ character string |
| `GRAPH_CLIENT_ID` | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | App Registration client ID |
| `GRAPH_CLIENT_SECRET` | `xxxxxxxx...` | App Registration client secret |
| `RECIPIENT_EMAIL` | `contact@connectedsys.com.au` | Where submissions are sent |
| `SENDER_EMAIL` | `noreply@connectedsys.com.au` | Valid Exchange mailbox |
| `CORS_ORIGIN` | `https://connectedsystemsau.github.io,https://www.connectedsys.com.au` | Allowed origins |

#### Generate CSRF Secret

```bash
# On Linux/Mac/WSL
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Part 4: Deploy Infrastructure

### 4.1 Create Resource Group (if needed)

```bash
az group create \
  --name connected-website-rg \
  --location australiaeast
```

### 4.2 Deploy via GitHub Actions

**Option A: Manual Trigger**
1. Go to **Actions** tab in GitHub
2. Select **Deploy Infrastructure** workflow
3. Click **Run workflow**
4. Select `master` branch
5. Click **Run workflow**

**Option B: Automatic Trigger**
```bash
# Make a change to infrastructure files
cd infra
# Edit main.bicep or main.parameters.json
git add .
git commit -m "Update infrastructure"
git push origin master
```

### 4.3 Verify Deployment

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Resource Groups** → **connected-website-rg**
3. Verify these resources exist:
   - `connected-web-prod-func` (Function App)
   - `connected-web-prod-plan` (App Service Plan)
   - `connectedwebprodst` (Storage Account)
   - `connected-web-prod-ai` (Application Insights)
   - `connected-web-prod-la` (Log Analytics)

### 4.4 Check Function App Configuration

```bash
# List app settings to verify configuration
az functionapp config appsettings list \
  --name connected-web-prod-func \
  --resource-group connected-website-rg \
  --query "[].{Name:name, Value:value}" \
  --output table
```

Verify these settings exist:
- `HCAPTCHA_SECRET`
- `CSRF_SECRET`
- `CORS_ORIGIN`
- `TENANT_ID`
- `CLIENT_ID`
- `CLIENT_SECRET`
- `RECIPIENT_EMAIL`
- `SENDER_EMAIL`

## Part 5: Deploy Function App Code

### 5.1 Deploy via GitHub Actions

**Option A: Manual Trigger**
1. Go to **Actions** tab in GitHub
2. Select **Deploy Function App** workflow
3. Click **Run workflow**
4. Select `master` branch
5. Click **Run workflow**

**Option B: Automatic Trigger**
```bash
# Make a change to API files
cd api
# Edit any .cs file
git add .
git commit -m "Update function app"
git push origin master
```

### 5.2 Verify Deployment

```bash
# Get Function App URL
az functionapp show \
  --name connected-web-prod-func \
  --resource-group connected-website-rg \
  --query "defaultHostName" \
  --output tsv

# Test CSRF endpoint
curl https://connected-web-prod-func.azurewebsites.net/api/csrf-token
```

Expected response:
```json
{
  "token": "base64-encoded-string",
  "timestamp": "1234567890",
  "signature": "hmac-signature"
}
```

## Part 6: Configure Frontend

### 6.1 Update Environment Variables

Create production environment file or add to your hosting platform:

```env
NEXT_PUBLIC_API_URL=https://connected-web-prod-func.azurewebsites.net
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-production-site-key
```

### 6.2 For GitHub Pages

Add to your build workflow (`.github/workflows/nextjs.yml` or `.github/workflows/deploy.yml`):

```yaml
env:
  NEXT_PUBLIC_API_URL: https://connected-web-prod-func.azurewebsites.net
  NEXT_PUBLIC_HCAPTCHA_SITE_KEY: ${{ secrets.HCAPTCHA_SITE_KEY }}
```

And add `HCAPTCHA_SITE_KEY` to GitHub Secrets (this is the **public** site key, not the secret).

### 6.3 Deploy Frontend

```bash
# Build and deploy (GitHub Actions handles this automatically on push)
git add .
git commit -m "Configure production API endpoint"
git push origin master
```

## Part 7: Testing

### 7.1 Test CSRF Token Generation

```bash
curl https://connected-web-prod-func.azurewebsites.net/api/csrf-token
```

### 7.2 Test Form Submission (with curl)

```bash
# Get CSRF token first
CSRF_RESPONSE=$(curl -s https://connected-web-prod-func.azurewebsites.net/api/csrf-token)
TOKEN=$(echo $CSRF_RESPONSE | jq -r '.token')
TIMESTAMP=$(echo $CSRF_RESPONSE | jq -r '.timestamp')
SIGNATURE=$(echo $CSRF_RESPONSE | jq -r '.signature')

# Submit test form (replace with real hCaptcha token in production)
curl -X POST https://connected-web-prod-func.azurewebsites.net/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://connectedsystemsau.github.io" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"test@example.com\",
    \"company\": \"Test Corp\",
    \"phone\": \"+61 400 000 000\",
    \"message\": \"This is a test message\",
    \"hCaptchaToken\": \"10000000-aaaa-bbbb-cccc-000000000001\",
    \"csrfToken\": \"$TOKEN\",
    \"csrfTimestamp\": \"$TIMESTAMP\",
    \"csrfSignature\": \"$SIGNATURE\"
  }"
```

### 7.3 Test from Website

1. Navigate to your website: `https://connectedsystemsau.github.io/#contact`
2. Fill out the contact form
3. Click **Send Message**
4. Verify:
   - hCaptcha appears
   - Form shows loading state
   - Success message appears
   - Email received at `RECIPIENT_EMAIL`

### 7.4 Verify in Azure Portal

1. Go to **Storage Account** → **Tables** → **contactsubmissions**
2. Verify submission record exists
3. Check **Application Insights** → **Logs** for function execution
4. Check email inbox for delivery

## Part 8: Monitoring

### 8.1 View Application Insights

```bash
# Open Application Insights in browser
az monitor app-insights app show \
  --app connected-web-prod-ai \
  --resource-group connected-website-rg \
  --query "appId" \
  --output tsv
```

Go to: `https://portal.azure.com/#@{tenantId}/resource/subscriptions/{subscriptionId}/resourceGroups/connected-website-rg/providers/microsoft.insights/components/connected-web-prod-ai`

### 8.2 Query Logs

In Application Insights, run Kusto queries:

```kusto
// Recent contact form submissions
traces
| where message contains "Contact form submission"
| order by timestamp desc
| take 20

// Error tracking
exceptions
| order by timestamp desc
| take 20

// Performance metrics
requests
| where name contains "contact"
| summarize avg(duration), count() by name
```

### 8.3 Set Up Alerts

1. In Application Insights, go to **Alerts**
2. Click **New alert rule**
3. Configure alerts for:
   - Failed requests (error rate > threshold)
   - High response time (duration > 5 seconds)
   - Availability (uptime < 99%)

## Troubleshooting

### Issue: "Mail.Send permission not granted"

**Solution**:
1. Verify admin consent granted in App Registration
2. Check permission shows green checkmark
3. Wait 5-10 minutes for propagation
4. Restart Function App

### Issue: "Invalid CORS origin"

**Solution**:
1. Check `CORS_ORIGIN` app setting matches your domain exactly
2. Include protocol (https://)
3. No trailing slashes
4. Comma-separated for multiple origins

### Issue: "hCaptcha validation failed"

**Solution**:
1. Verify `HCAPTCHA_SECRET` is correct
2. Check hCaptcha dashboard for site configuration
3. Ensure frontend site key matches backend secret
4. Verify hostnames configured in hCaptcha

### Issue: "Email not received"

**Solution**:
1. Check `SENDER_EMAIL` is a valid mailbox
2. Verify `RECIPIENT_EMAIL` is correct
3. Check spam/junk folder
4. Review Application Insights for Graph API errors
5. Verify Mail.Send permission granted

### Issue: Function App not responding

**Solution**:
```bash
# Check Function App status
az functionapp show \
  --name connected-web-prod-func \
  --resource-group connected-website-rg \
  --query "state"

# Restart Function App
az functionapp restart \
  --name connected-web-prod-func \
  --resource-group connected-website-rg

# View live logs
az webapp log tail \
  --name connected-web-prod-func \
  --resource-group connected-website-rg
```

## Maintenance

### Update Dependencies

```bash
# Update Function App packages
cd api
dotnet list package --outdated
dotnet add package PackageName --version x.x.x

# Update frontend packages
cd ..
npm outdated
npm update
```

### Rotate Secrets

**Client Secret** (expires every 24 months):
1. Create new secret in App Registration
2. Update `GRAPH_CLIENT_SECRET` in GitHub Secrets
3. Re-run infrastructure deployment
4. Delete old secret after verification

**CSRF Secret** (rotate annually):
1. Generate new secret: `openssl rand -base64 32`
2. Update `CSRF_SECRET` in GitHub Secrets
3. Re-run infrastructure deployment

### Monitor Costs

```bash
# View cost analysis
az consumption usage list \
  --start-date 2025-11-01 \
  --end-date 2025-11-30 \
  --resource-group connected-website-rg
```

Expected monthly costs:
- Storage: ~$0.05
- Function App: ~$0.20 (Consumption plan)
- Application Insights: ~$2.30
- **Total: ~$2.50/month**

## Security Checklist

- [ ] All secrets stored in GitHub Secrets (never in code)
- [ ] CORS properly configured with specific origins
- [ ] HTTPS enforced on all endpoints
- [ ] Mail.Send permission properly scoped
- [ ] hCaptcha configured for production domains
- [ ] Application Insights enabled for monitoring
- [ ] Resource group has proper access controls
- [ ] Service principal has minimum required permissions
- [ ] CSRF secret is cryptographically secure (32+ bytes)
- [ ] Client secrets rotated regularly

## Next Steps

1. ✅ Deploy infrastructure
2. ✅ Deploy function app
3. ✅ Configure frontend
4. ✅ Test end-to-end
5. ⬜ Set up monitoring alerts
6. ⬜ Configure backup/disaster recovery
7. ⬜ Document runbook procedures
8. ⬜ Train team on maintenance

## Support

For issues or questions:
- **Infrastructure**: Check Azure Portal → Resource Health
- **Function App**: Review Application Insights logs
- **Frontend**: Check browser console and Network tab
- **Email**: Verify Exchange mailbox and Graph permissions

## Useful Commands

```bash
# Quick deploy both infrastructure and code
git add .
git commit -m "Deploy contact form system"
git push origin master

# View Function App logs in real-time
func azure functionapp logstream connected-web-prod-func

# Test API locally
cd api
func start

# Build frontend for production
npm run build

# View deployment history
az deployment group list \
  --resource-group connected-website-rg \
  --output table
```
