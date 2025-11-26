@description('The name of the environment (e.g., dev, prod)')
param environment string = 'prod'

@description('Location for all resources')
param location string = resourceGroup().location

@description('hCaptcha secret key')
@secure()
param hcaptchaSecret string

@description('CSRF secret key')
@secure()
param csrfSecret string

@description('Azure AD Tenant ID')
param tenantId string

@description('Azure AD App Registration Client ID')
param clientId string

@description('Azure AD App Registration Client Secret')
@secure()
param clientSecret string

@description('Recipient email address for contact form submissions')
param recipientEmail string

@description('Sender email address (must be a valid mailbox in Exchange)')
param senderEmail string

@description('Allowed CORS origins (comma-separated)')
param corsOrigin string = 'https://connectedsystems.com'

var resourcePrefix = 'connected-web-${environment}'
var storageAccountName = replace('${resourcePrefix}st', '-', '')
var functionAppName = '${resourcePrefix}-func'
var appServicePlanName = '${resourcePrefix}-plan'
var appInsightsName = '${resourcePrefix}-ai'
var logAnalyticsName = '${resourcePrefix}-la'

// Log Analytics Workspace
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

// Storage Account
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
  }
}

// Table Service
resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
}

// Contact Submissions Table
resource contactSubmissionsTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-01-01' = {
  parent: tableService
  name: 'contactsubmissions'
}

// App Service Plan (Consumption)
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {}
}

// Function App
resource functionApp 'Microsoft.Web/sites@2022-09-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${az.environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${az.environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower(functionAppName)
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'AZURE_STORAGE_CONNECTION_STRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${az.environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'HCAPTCHA_SECRET'
          value: hcaptchaSecret
        }
        {
          name: 'CORS_ORIGIN'
          value: corsOrigin
        }
        {
          name: 'CSRF_SECRET'
          value: csrfSecret
        }
        {
          name: 'TENANT_ID'
          value: tenantId
        }
        {
          name: 'CLIENT_ID'
          value: clientId
        }
        {
          name: 'CLIENT_SECRET'
          value: clientSecret
        }
        {
          name: 'RECIPIENT_EMAIL'
          value: recipientEmail
        }
        {
          name: 'SENDER_EMAIL'
          value: senderEmail
        }
      ]
      cors: {
        allowedOrigins: split(corsOrigin, ',')
        supportCredentials: true
      }
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
    }
  }
}

output functionAppName string = functionApp.name
output functionAppUrl string = 'https://${functionApp.properties.defaultHostName}'
output storageAccountName string = storageAccount.name
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
