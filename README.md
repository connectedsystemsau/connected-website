# Connected Website

Public marketing website for Connected Systems - an Australian software development consultancy specializing in Microsoft enterprise technologies.

## Overview

The Connected Website is a modern, secure web application featuring:
- **Frontend**: Next.js 16 static site with MDX support (deployed to GitHub Pages)
- **Backend**: Serverless Azure Functions API for contact form processing
- **Security**: Multi-layer protection with CSRF tokens, hCaptcha, and CORS
- **Infrastructure**: Automated deployment via GitHub Actions and Bicep

## Quick Start

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Azure Functions Core Tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local)
- [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite) (for local storage)

### Local Development

```bash
# Clone repository
git clone https://github.com/connectedsystemsau/connected-website.git
cd connected-website

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Run Backend Locally

```bash
# Start Azurite (in separate terminal)
azurite --silent --location ./azurite

# Navigate to API folder
cd api

# Copy local settings
cp local.settings.json.example local.settings.json

# Start Function App
func start
```

API available at [http://localhost:7071](http://localhost:7071)

## Project Structure

```
connected-website/
├── api/                    # Azure Functions backend
│   ├── ContactFormFunction.cs
│   ├── Startup.cs
│   └── README.md
├── docs/                   # Documentation
│   ├── deployment-guide.md
│   └── contact-form-integration.md
├── infra/                  # Infrastructure as Code (Bicep)
│   ├── main.bicep
│   └── main.parameters.json
├── src/                    # Next.js frontend
│   ├── app/               # Pages and layouts
│   ├── components/        # React components
│   ├── hooks/             # Custom hooks
│   └── lib/               # Utilities
└── .github/workflows/     # CI/CD pipelines
```

## Features

### Frontend
✅ Static site generation (GitHub Pages compatible)  
✅ MDX support for content pages  
✅ Tailwind CSS v4 with dark mode  
✅ Responsive design (mobile-first)  
✅ Animated hero section with typewriter effect  
✅ Service specialization pages  
✅ Secure contact form with validation  

### Backend
✅ Serverless Azure Functions  
✅ CSRF protection with HMAC-SHA256  
✅ hCaptcha bot protection  
✅ Azure Table Storage persistence  
✅ Email via Microsoft Graph (Exchange)  
✅ Application Insights monitoring  
✅ CORS configuration  

### Infrastructure
✅ Infrastructure as Code (Bicep)  
✅ GitHub Actions CI/CD  
✅ OIDC authentication (no stored credentials)  
✅ Cost-optimized architecture (~$2.50/month)  

## Documentation

- **[API Documentation](api/README.md)** - Backend Function App details
- **[Deployment Guide](docs/deployment-guide.md)** - Complete deployment walkthrough
- **[Contact Form Integration](docs/contact-form-integration.md)** - Frontend implementation details

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production (static export) |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:7071
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
```

### Backend (api/local.settings.json)

```json
{
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "HCAPTCHA_SECRET": "0x0000000000000000000000000000000000000000",
    "CORS_ORIGIN": "http://localhost:3000",
    "CSRF_SECRET": "your-secret-min-32-chars",
    "TENANT_ID": "your-tenant-id",
    "CLIENT_ID": "your-client-id",
    "CLIENT_SECRET": "your-client-secret",
    "RECIPIENT_EMAIL": "contact@connectedsys.com.au",
    "SENDER_EMAIL": "noreply@connectedsys.com.au"
  }
}
```

## Deployment

### Automatic Deployment

Push to `master` branch triggers automated deployment:
- Infrastructure changes → Azure resources update
- API changes → Function App redeploys  
- Frontend changes → GitHub Pages updates

```bash
git add .
git commit -m "Your changes"
git push origin master
```

### Manual Deployment

See the [Deployment Guide](docs/deployment-guide.md) for detailed instructions on:
- Azure AD App Registration setup
- GitHub Secrets configuration
- Infrastructure provisioning
- Function App deployment
- Frontend configuration

## Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, MDX
- **Backend**: .NET 8, Azure Functions v4
- **Storage**: Azure Table Storage
- **Email**: Microsoft Graph API
- **Monitoring**: Application Insights
- **Security**: hCaptcha, HMAC-SHA256 CSRF tokens
- **Infrastructure**: Azure Bicep
- **CI/CD**: GitHub Actions with OIDC

## Security

- ✅ CSRF tokens with HMAC signing (30-minute expiry)
- ✅ hCaptcha bot protection
- ✅ CORS with origin validation
- ✅ HTTPS-only in production
- ✅ Secrets in Azure Key Vault
- ✅ OIDC authentication (passwordless)
- ✅ Input validation and sanitization

## Contributing

1. Create a feature branch
2. Make changes and test locally
3. Ensure all tests pass: `npm run lint`
4. Submit a pull request

## Troubleshooting

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Function App Won't Start
```bash
# Verify Azurite is running
azurite --silent --location ./azurite

# Check Function App dependencies
cd api
dotnet restore
```

### CORS Errors
1. Verify `CORS_ORIGIN` in `api/local.settings.json` matches frontend URL
2. Restart Function App after config changes

See more in the [Deployment Guide](docs/deployment-guide.md#troubleshooting).

## License

Proprietary - Connected Systems © 2025

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)
- [Bicep Documentation](https://docs.microsoft.com/azure/azure-resource-manager/bicep/)

---

**Need help?** Check the [documentation](docs/) or review the [deployment guide](docs/deployment-guide.md).
