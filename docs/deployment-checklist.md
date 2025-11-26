# Contact Form Deployment Checklist

Use this checklist to ensure all steps are completed before and after deployment.

## Pre-Deployment Checklist

### ✅ Azure AD App Registration

- [ ] Created App Registration in Azure Portal
- [ ] Name: "Connected Website Contact Form"
- [ ] Single tenant configuration
- [ ] Added Mail.Send permission
- [ ] Granted admin consent for Mail.Send
- [ ] Created client secret (24-month expiry)
- [ ] Recorded Tenant ID
- [ ] Recorded Client ID (Application ID)
- [ ] Recorded Client Secret value
- [ ] Verified sender email is valid Exchange mailbox

### ✅ hCaptcha Configuration

- [ ] Created hCaptcha account
- [ ] Created new site: "Connected Website"
- [ ] Added hostnames:
  - [ ] `connectedsystemsau.github.io`
  - [ ] `www.connectedsys.com.au` (if using custom domain)
  - [ ] `localhost` (for testing)
- [ ] Recorded Site Key (public)
- [ ] Recorded Secret Key (private)

### ✅ CSRF Secret Generation

- [ ] Generated CSRF secret using one of:
  - Linux/Mac: `openssl rand -base64 32`
  - Windows PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))`
- [ ] Verified secret is at least 32 characters
- [ ] Stored secret securely (not in plain text)

### ✅ GitHub Repository Setup

- [ ] Forked/cloned repository
- [ ] Set up OIDC Workload Identity:
  - [ ] Created service principal: "GitHub-ConnectedWebsite"
  - [ ] Granted Contributor role on resource group
  - [ ] Created federated credential for GitHub Actions
  - [ ] Recorded service principal Client ID
- [ ] Configured GitHub Secrets (10 total):
  - [ ] `AZURE_CLIENT_ID` - Service principal client ID
  - [ ] `AZURE_TENANT_ID` - Azure AD tenant ID
  - [ ] `AZURE_SUBSCRIPTION_ID` - Target subscription ID
  - [ ] `HCAPTCHA_SECRET` - hCaptcha secret key
  - [ ] `HCAPTCHA_SITE_KEY` - hCaptcha site key (public)
  - [ ] `CSRF_SECRET` - Generated CSRF secret
  - [ ] `GRAPH_CLIENT_ID` - App Registration client ID
  - [ ] `GRAPH_CLIENT_SECRET` - App Registration client secret
  - [ ] `RECIPIENT_EMAIL` - Where submissions are sent
  - [ ] `SENDER_EMAIL` - Valid Exchange mailbox
  - [ ] `CORS_ORIGIN` - Comma-separated allowed origins

### ✅ Local Testing

- [ ] Installed all prerequisites:
  - [ ] Node.js 20+
  - [ ] .NET 8 SDK
  - [ ] Azure Functions Core Tools
  - [ ] Azurite
- [ ] Cloned repository
- [ ] Installed frontend dependencies: `npm install`
- [ ] Created `.env.local` with test configuration
- [ ] Started Azurite: `azurite --silent --location ./azurite`
- [ ] Configured `api/local.settings.json` with test values
- [ ] Started Function App: `cd api && func start`
- [ ] Started frontend: `npm run dev`
- [ ] Tested contact form at `http://localhost:3000/#contact`
- [ ] Verified CSRF token generation
- [ ] Verified form submission (with test hCaptcha)
- [ ] Verified submission in Azurite Table Storage
- [ ] No console errors

## Deployment Checklist

### ✅ Infrastructure Deployment

- [ ] Reviewed `infra/main.bicep` for any customizations
- [ ] Updated `infra/main.parameters.json` if needed
- [ ] Triggered infrastructure deployment:
  - [ ] Manual: Actions → Deploy Infrastructure → Run workflow
  - [ ] Or pushed changes to `infra/**`
- [ ] Verified workflow completed successfully
- [ ] Checked Azure Portal for resources:
  - [ ] Resource Group: `connected-website-rg`
  - [ ] Function App: `connected-web-prod-func`
  - [ ] App Service Plan: `connected-web-prod-plan`
  - [ ] Storage Account: `connectedwebprodst`
  - [ ] Table: `contactsubmissions`
  - [ ] Application Insights: `connected-web-prod-ai`
  - [ ] Log Analytics: `connected-web-prod-la`
- [ ] Verified Function App app settings configured:
  - [ ] `HCAPTCHA_SECRET`
  - [ ] `CSRF_SECRET`
  - [ ] `CORS_ORIGIN`
  - [ ] `TENANT_ID`
  - [ ] `CLIENT_ID`
  - [ ] `CLIENT_SECRET`
  - [ ] `RECIPIENT_EMAIL`
  - [ ] `SENDER_EMAIL`
  - [ ] `AZURE_STORAGE_CONNECTION_STRING`

### ✅ Function App Deployment

- [ ] Triggered function app deployment:
  - [ ] Manual: Actions → Deploy Function App → Run workflow
  - [ ] Or pushed changes to `api/**`
- [ ] Verified workflow completed successfully
- [ ] Tested CSRF endpoint:
  - [ ] `curl https://connected-web-prod-func.azurewebsites.net/api/csrf-token`
  - [ ] Received valid JSON response with token, timestamp, signature
- [ ] Checked Function App logs in Azure Portal
- [ ] No errors in Application Insights

### ✅ Frontend Configuration

- [ ] Updated production environment:
  - [ ] Added `NEXT_PUBLIC_API_URL` to GitHub workflow env
  - [ ] Added `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` to GitHub Secrets
  - [ ] Value: Production hCaptcha site key (not secret)
- [ ] Updated `.github/workflows/deploy.yml` or `.github/workflows/nextjs.yml`:
  ```yaml
  env:
    NEXT_PUBLIC_API_URL: https://connected-web-prod-func.azurewebsites.net
    NEXT_PUBLIC_HCAPTCHA_SITE_KEY: ${{ secrets.HCAPTCHA_SITE_KEY }}
  ```
- [ ] Committed and pushed changes
- [ ] Verified GitHub Pages deployment completed
- [ ] Visited production site
- [ ] No console errors

## Post-Deployment Testing

### ✅ API Testing

- [ ] Test CSRF token generation:
  ```bash
  curl https://connected-web-prod-func.azurewebsites.net/api/csrf-token
  ```
- [ ] Received valid response with 3 fields
- [ ] Token is base64-encoded string
- [ ] Timestamp is Unix timestamp
- [ ] Signature is HMAC-SHA256 hash

### ✅ Contact Form Testing

- [ ] Navigate to production site contact section
- [ ] Test validation errors:
  - [ ] Submit empty form → All required field errors shown
  - [ ] Invalid email → Email format error shown
  - [ ] Short name → Name length error shown
  - [ ] Short message → Message length error shown
- [ ] Test successful submission:
  - [ ] Fill all required fields with valid data
  - [ ] Click "Send Message"
  - [ ] hCaptcha appears and completes
  - [ ] Loading state shows (button disabled, spinner visible)
  - [ ] Success message appears
  - [ ] Form resets
- [ ] Test email delivery:
  - [ ] Check recipient inbox (`RECIPIENT_EMAIL`)
  - [ ] Email received from sender address
  - [ ] Subject: "New Contact Form Submission"
  - [ ] All form fields included in body
  - [ ] Reply-To set to submitter's email

### ✅ Azure Verification

- [ ] Check Table Storage:
  - [ ] Navigate to Storage Account → Tables → `contactsubmissions`
  - [ ] Submission record exists
  - [ ] PartitionKey = "ContactForm"
  - [ ] RowKey = GUID
  - [ ] All fields present (Name, Email, Company, Phone, Message, SubmittedAt, Status)
- [ ] Check Application Insights:
  - [ ] Navigate to Application Insights → Logs
  - [ ] Run query:
    ```kusto
    traces
    | where message contains "Contact form"
    | order by timestamp desc
    | take 10
    ```
  - [ ] Submission logged successfully
  - [ ] No errors in exceptions table

### ✅ Security Testing

- [ ] CORS validation:
  - [ ] Attempt to call API from unauthorized origin
  - [ ] Should receive CORS error
- [ ] CSRF validation:
  - [ ] Submit form with expired token (>30 minutes old)
  - [ ] Should receive "Token expired" error
  - [ ] Submit form with invalid signature
  - [ ] Should receive validation error
- [ ] hCaptcha validation:
  - [ ] Verify hCaptcha widget appears on production
  - [ ] Test keys no longer auto-pass
- [ ] HTTPS enforcement:
  - [ ] Verify Function App only accepts HTTPS
  - [ ] No HTTP endpoint accessible

## Monitoring Setup

### ✅ Application Insights Configuration

- [ ] Navigate to Application Insights in Azure Portal
- [ ] Set up alerts:
  - [ ] Failed requests (>5% error rate)
  - [ ] High response time (>5 seconds)
  - [ ] Availability (uptime <99%)
- [ ] Configure alert notification email
- [ ] Test alert by triggering condition

### ✅ Cost Monitoring

- [ ] Set up Azure Cost Management alert:
  - [ ] Budget: $10/month
  - [ ] Alert at 80% ($8/month)
- [ ] Review cost analysis:
  - [ ] Navigate to Subscription → Cost Management → Cost analysis
  - [ ] Filter by resource group: `connected-website-rg`
  - [ ] Expected monthly cost: ~$2.50

## Documentation Checklist

- [ ] Reviewed all documentation:
  - [ ] `README.md` - Project overview
  - [ ] `api/README.md` - API documentation
  - [ ] `docs/deployment-guide.md` - Deployment steps
  - [ ] `docs/contact-form-integration.md` - Frontend details
  - [ ] `docs/implementation-summary.md` - What was built
- [ ] Updated any custom configurations
- [ ] Documented any deviations from standard setup
- [ ] Shared documentation with team

## Maintenance Checklist

### ✅ Regular Tasks

#### Weekly
- [ ] Check Application Insights for errors
- [ ] Review submission logs in Table Storage
- [ ] Verify email delivery working

#### Monthly
- [ ] Review cost analysis
- [ ] Check for dependency updates: `npm outdated` and `dotnet list package --outdated`
- [ ] Review Application Insights metrics

#### Quarterly
- [ ] Review and rotate CSRF secret
- [ ] Update dependencies: `npm update` and `dotnet add package`
- [ ] Review security best practices

#### Annually
- [ ] Rotate client secret (App Registration)
- [ ] Review and update CORS origins
- [ ] Audit access permissions
- [ ] Review and optimize Azure resources

## Rollback Plan

### If Deployment Fails

1. **Infrastructure Issues**
   - [ ] Check GitHub Actions logs for error details
   - [ ] Review Azure Portal deployment history
   - [ ] Rollback via Azure Portal: Resource Group → Deployments → Previous successful deployment → Redeploy
   - [ ] Or re-run previous successful GitHub Actions workflow

2. **Function App Issues**
   - [ ] Check Function App logs: `az webapp log tail --name connected-web-prod-func --resource-group connected-website-rg`
   - [ ] Verify app settings configured correctly
   - [ ] Restart Function App: `az functionapp restart --name connected-web-prod-func --resource-group connected-website-rg`
   - [ ] Redeploy previous version from GitHub Actions

3. **Frontend Issues**
   - [ ] Check GitHub Pages deployment status
   - [ ] Verify environment variables in workflow
   - [ ] Revert to previous commit: `git revert HEAD && git push`
   - [ ] Re-run GitHub Pages workflow

## Success Criteria

All items below must be true for a successful deployment:

- ✅ All resources created in Azure
- ✅ Function App responds to API calls
- ✅ CSRF token generation works
- ✅ Contact form submits successfully
- ✅ Email delivered to recipient
- ✅ Submission stored in Table Storage
- ✅ No errors in Application Insights
- ✅ CORS working from production site
- ✅ hCaptcha verification working
- ✅ All tests passing
- ✅ Monitoring alerts configured
- ✅ Documentation complete

## Troubleshooting Reference

| Issue | Check | Solution |
|-------|-------|----------|
| API not responding | Function App status | Restart via Azure Portal |
| CORS errors | CORS_ORIGIN setting | Update app setting, restart |
| Email not sending | Mail.Send permission | Grant admin consent, restart |
| hCaptcha failing | Secret key | Verify in app settings |
| CSRF errors | CSRF_SECRET | Regenerate and update |
| No submissions stored | Storage connection | Check connection string |
| High costs | Resource metrics | Review and optimize plan |

## Sign-Off

- [ ] Infrastructure deployment verified
- [ ] Function App deployment verified  
- [ ] Frontend deployment verified
- [ ] End-to-end testing completed
- [ ] Monitoring configured
- [ ] Documentation reviewed
- [ ] Team notified

**Deployed by:** _________________  
**Date:** _________________  
**Version:** _________________  

## Next Steps After Deployment

1. Monitor Application Insights for 24 hours
2. Send test submissions from different browsers
3. Verify email delivery reliability
4. Share production URL with stakeholders
5. Set up regular backup schedule
6. Document any issues encountered
7. Plan for future enhancements

---

**Status**: 
- [ ] Not Started
- [ ] In Progress  
- [ ] Completed ✅

**Notes:**
_Use this space to document any deviations, issues, or custom configurations made during deployment._
