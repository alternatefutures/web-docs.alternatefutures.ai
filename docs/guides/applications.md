---
description: Create OAuth 2.0 applications and manage whitelisted domains for CORS and authentication on Alternate Futures.
---

# Applications

Applications in Alternate Futures allow you to create OAuth applications and manage whitelisted domains for CORS and authentication purposes.

## What are Applications?

Applications are OAuth 2.0 applications that can authenticate users and access the Alternate Futures API on their behalf. Each application has:

- **Client ID** - Public identifier for your application
- **Name** - Human-readable application name
- **Whitelist Domains** - Allowed domains for CORS and OAuth redirects

## Creating an Application

::: code-group

```bash [CLI]
# Create a new application
acc applications create

# You'll be prompted for:
# - Application name
# - Whitelist domains (comma-separated)
```

```typescript [SDK]
import { AlternateFuturesSdk } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  personalAccessToken: process.env.AF_TOKEN
});

// Create an application
const app = await af.applications().create({
  name: 'My Web App',
  whitelistDomains: ['https://myapp.com', 'https://staging.myapp.com']
});

console.log('Client ID:', app.clientId);
```

:::

## Listing Applications

::: code-group

```bash [CLI]
# List all applications
acc applications list
```

```typescript [SDK]
// List all applications
const applications = await af.applications().list();

applications.forEach(app => {
  console.log(`${app.name} (${app.clientId})`);
  console.log(`Domains: ${app.whitelistDomains.join(', ')}`);
});
```

:::

## Updating an Application

::: code-group

```bash [CLI]
# Update an application
acc applications update

# You'll be prompted to:
# 1. Select the application
# 2. Update name and/or whitelist domains
```

```typescript [SDK]
// Update application
await af.applications().update({
  id: 'app-id',
  name: 'Updated Name',
  whitelistDomains: ['https://newdomain.com']
});
```

:::

## Deleting an Application

::: code-group

```bash [CLI]
# Delete an application
acc applications delete

# You'll be prompted to select which application to delete
```

```typescript [SDK]
// Delete an application
await af.applications().delete({ id: 'app-id' });
```

:::

## Use Cases

### Web Application Authentication

Use applications to authenticate users in your web application:

1. Create an application with your production and staging domains whitelisted
2. Use the Client ID in your OAuth flow
3. Users can sign in with their Alternate Futures account
4. Your application receives an access token to make API calls

### CORS Configuration

Whitelist domains are automatically allowed for CORS requests:

```typescript
// This request will succeed if the origin is whitelisted
fetch('https://api.alternatefutures.ai/v1/sites', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

### Multi-Environment Setup

Create separate applications for different environments:

```bash
# Development app
acc applications create
# Name: My App (Dev)
# Domains: http://localhost:3000

# Production app
acc applications create
# Name: My App (Prod)
# Domains: https://myapp.com, https://www.myapp.com
```

## Security Best Practices

::: security Security
- Only whitelist domains you control
- Use HTTPS for all production domains
- Create separate applications for different environments
- Regularly audit your whitelist domains
- Delete unused applications
:::

## Next Steps

- [Authentication](./authentication.md) - Set up authentication methods
- [API Keys](./api-keys.md) - Generate API keys for server-side access
- [CLI Commands](../cli/commands.md) - Complete CLI reference
