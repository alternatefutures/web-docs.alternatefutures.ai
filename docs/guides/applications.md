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

::: info What this maps to in code
- **SDK:** [applications client](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/clients/applications.ts) — `create({ name, whitelistDomains }) → clientId`, `list`, `update`, `delete`.
- **API:** [`Application` GraphQL type](https://github.com/alternatefutures/alternate-clouds-api/blob/main/src/schema/typeDefs.ts) — `clientId`, `whitelistDomains`.
:::

::: tip CLI
There is no `acc applications` command. Applications are managed entirely through the **SDK / GraphQL API**. The examples below use the SDK.
:::

## Creating an Application

::: code-group

```typescript [SDK]
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: process.env.AF_PROJECT_ID,
  }),
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

::: info
The application record (Client ID and whitelisted domains) is available today. Confirm which parts of the end-to-end OAuth authorization flow are live before building against it.
:::

### CORS and whitelisted domains

Whitelisted domains are stored on the application record and are intended to control which origins may use it:

```typescript
fetch('https://api.alternatefutures.ai/v1/sites', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

::: warning
Confirm the current CORS behavior for `api.alternatefutures.ai` before relying on it in production — enforcement details may change.
:::

### Multi-Environment Setup

Create separate applications for different environments via the SDK:

```typescript
// Development app
await af.applications().create({
  name: 'My App (Dev)',
  whitelistDomains: ['http://localhost:3000']
});

// Production app
await af.applications().create({
  name: 'My App (Prod)',
  whitelistDomains: ['https://myapp.com', 'https://www.myapp.com']
});
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
