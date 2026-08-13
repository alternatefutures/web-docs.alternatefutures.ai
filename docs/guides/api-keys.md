---
description: Generate and manage personal access tokens and API keys for programmatic access to the Alternate Futures platform.
---

# API Keys

::: warning Web App Coming Soon
API key management via the web interface is currently in development. Contact support to have API keys generated for your account.
:::

Generate and manage API keys for programmatic access to Alternate Futures.

## Creating API Keys

1. Go to [API Keys](https://app.alternatefutures.ai/api-keys)
2. Click **Create New Key**
3. Configure the key:
   - **Name** - Descriptive name (e.g., "Production CLI")
   - **Permissions** - Select required permissions
   - **Expiration** - Set expiration date (optional)
4. Click **Create**
5. **Copy the key** (shown only once!)

## Permissions

::: info Roadmap
Scoped permissions are not yet implemented. Token creation currently accepts only a name, organization, and optional expiration — a token has the same access as its owner. The scopes below describe the planned model.
:::

Planned granular permissions:

### Read Permissions

- **agents:read** - List and view agents
- **sites:read** - List and view sites
- **storage:read** - View storage items
- **billing:read** - View usage and billing

### Write Permissions

- **agents:write** - Create, update, delete agents
- **sites:write** - Deploy, update, delete sites
- **storage:write** - Upload, delete storage
- **billing:write** - Manage payment methods

### Special Permissions

- **all** - Full access to all resources (use with caution)

## Using API Keys

### CLI

Set as environment variables:

```bash
export AF_TOKEN="af_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export AF_PROJECT_ID="clx1a2b3c4d5e6f7g8h9"
acc projects list
```

### SDK

Use the PersonalAccessTokenService for server-side applications:

```typescript
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const accessTokenService = new PersonalAccessTokenService({
  personalAccessToken: process.env.AF_TOKEN,
  projectId: process.env.AF_PROJECT_ID,
});

const af = new AlternateFuturesSdk({
  accessTokenService,
});

// Use the SDK
const sites = await af.sites().list();
```

### HTTP API

Include in Authorization header:

```bash
curl https://api.alternatefutures.ai/graphql \
  -H "Authorization: Bearer af_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ sites { id name } }"}'
```

## Managing keys via CLI

Personal access tokens can be managed with the (currently hidden) `pat` command:

```bash
acc pat list
acc pat create --name "Production CI"
acc pat delete <token-id>
```

::: tip What this maps to in code
See the [pat CLI command](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/pat/index.ts). `create` takes only `--name`; there are no `--expires` or `--permissions` flags yet.
:::

## Managing API Keys

### View Keys

See all your API keys:
- **Name** - Key identifier
- **Permissions** - Access level
- **Created** - Creation date
- **Last Used** - Most recent usage
- **Expires** - Expiration date
- **Status** - Active or revoked

### Revoke Keys

Immediately disable a key:

1. Find the key in the list
2. Click **Revoke**
3. Confirm revocation

Revoked keys cannot be reactivated. Create a new key instead.

### Delete Keys

Permanently remove a key:

1. Find the key in the list
2. Click **Delete**
3. Confirm deletion

Deleted keys are removed from all logs and cannot be recovered.

## Security Best Practices

### Do's

- ✅ Use environment variables for keys
- ✅ Set minimal required permissions
- ✅ Use expiration dates for temporary access
- ✅ Rotate keys regularly (every 90 days)
- ✅ Use different keys for different environments
- ✅ Revoke keys immediately if compromised
- ✅ Monitor key usage in the dashboard

### Don'ts

- ❌ Never commit keys to version control
- ❌ Don't use `all` permission unless necessary
- ❌ Don't share keys between projects
- ❌ Don't hardcode keys in source code
- ❌ Don't use production keys in development
- ❌ Don't store keys in plaintext files

## Key Formats

Personal access tokens follow this format:

```
af_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   # production
af_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   # test
```

- Prefix: `af_live_` or `af_test_` (the `af` prefix plus an environment segment)
- Random segment: 32 characters, Base62 (a-z, A-Z, 0-9)

::: tip What this maps to in code
The format is defined by the [token service](https://github.com/alternatefutures/service-auth/blob/main/src/services/token.service.ts) — `af_${environment}_${base62}`.
:::

Project IDs are [cuid](https://github.com/paralleldrive/cuid) values (for example `clx1a2b3c4d5e6f7g8h9`); there is no `prj_` prefix.

## Rate Limits

### API Request Limits

API requests are rate limited, and limits scale with your plan (Free < Pro < Enterprise). Exceeded limits return HTTP 429 (Too Many Requests). Specific per-plan request rates are set by your plan — check your account for current values.

### API Key Creation Limits

To prevent abuse, API key creation has two limits:

**Daily Creation Limit:**
- **Maximum**: 50 API keys per day per user
- **Window**: 24-hour sliding window
- **Reset**: Automatically resets as the window slides

**Total Active Keys Limit:**
- **Maximum**: 500 active API keys per user
- **Scope**: Applies to all non-expired, non-deleted keys
- **Management**: Delete unused keys to free up slots

::: warning Limits Exceeded
**Rate Limit Exceeded:**
If you hit the daily creation limit:
```json
{
  "error": "Rate limit exceeded. You can only create 50 API keys per day. Limit resets at 2024-11-06T15:30:00Z"
}
```

**Max Active Keys Exceeded:**
If you have 500 active keys:
```json
{
  "error": "Maximum active API keys limit reached. You can have up to 500 active keys. Please delete unused keys before creating new ones."
}
```
:::

**Tips to manage your keys:**
- Delete unused or expired keys to stay organized
- Use expiration dates for temporary access
- Monitor your limits via the [`apiKeyRateLimit` query](https://github.com/alternatefutures/service-cloud-api/blob/main/src/schema/typeDefs.ts):
  ```graphql
  query {
    apiKeyRateLimit {
      remaining          # Keys remaining in daily quota
      limit              # Daily creation limit (50)
      resetAt            # When daily limit resets
      activeTokens       # Current number of active keys
      maxActiveTokens    # Maximum active keys allowed (500)
    }
  }
  ```

## Next Steps

- [Authentication](./authentication.md) - Other auth methods
- [CLI Commands](../cli/commands.md) - Use keys with CLI
- [SDK API](../sdk/api.md) - Use keys with SDK
