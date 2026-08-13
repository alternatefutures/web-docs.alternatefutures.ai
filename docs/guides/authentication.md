---
description: Authenticate with Alternate Futures using email magic links, SMS OTP, Web3 wallets, or social OAuth providers.
---

# Authentication

Alternate Futures supports multiple authentication methods for maximum flexibility.

## Authentication Methods

### Email Magic Link

Passwordless authentication via email:

1. Enter your email address
2. Check your inbox for the magic link
3. Click the link to sign in

### SMS OTP

Passwordless authentication via a one-time code:

1. Enter your phone number
2. Receive a 6-digit code by text
3. Enter the code to sign in

::: tip What this maps to in code
See the [SMS OTP endpoint](https://github.com/alternatefutures/service-auth/blob/main/src/routes/auth/sms.ts) — it generates a 6-digit code and verifies it at `/auth/sms/verify`.
:::

### Web3 Wallets

Sign in with an Ethereum wallet using the "Sign in with Ethereum" (SIWE) standard:

- **MetaMask**
- **WalletConnect**

Other EVM-compatible wallets (Coinbase Wallet, Rainbow) generally work through the same SIWE flow.

::: info Solana not yet supported
Solana wallets (including Phantom) are not currently supported — the wallet flow rejects Solana addresses and asks you to use an Ethereum wallet.
:::

::: tip What this maps to in code
See the [Web3 wallet (SIWE) handler](https://github.com/alternatefutures/service-auth/blob/main/src/routes/auth/wallet.ts).
:::

### Social OAuth

Sign in with an existing account:

- **Google**
- **GitHub**
- **Twitter/X**
- **Discord**

::: tip What this maps to in code
Providers are registered in the [OAuth provider configuration](https://github.com/alternatefutures/service-auth/blob/main/src/services/oauth.service.ts). Apple Sign In is temporarily disabled; Facebook is not yet available.
:::

## Account Linking

::: warning Coming Soon
Account linking via the web interface is currently in development.
:::

You can link multiple authentication methods to a single account:

1. Sign in with your primary method
2. Go to Settings → Connected Accounts
3. Click "Link" next to any authentication method
4. Complete the linking flow

This allows you to sign in using any linked method.

## API Authentication

For programmatic access (CLI/SDK), use API keys:

### Creating an API Key

::: warning Coming Soon
API key management via the web interface is currently in development. In the meantime, contact support to have API keys generated for your account.
:::

1. Go to [API Keys](https://app.alternatefutures.ai/api-keys)
2. Click "Create New Key"
3. Set permissions and expiration
4. Copy the key (shown only once!)

### Using API Keys

**CLI:**
```bash
export AF_TOKEN="af_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export AF_PROJECT_ID="your-project-id"
acc projects list
```

**SDK:**
```typescript
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: process.env.AF_PROJECT_ID,
  }),
});
```

## Security Best Practices

- **Never commit API keys** to version control
- Use environment variables for keys
- Set appropriate permissions on API keys
- Rotate keys regularly
- Use short expiration times for temporary access
- Enable 2FA when available

## Next Steps

- [API Keys Guide](./api-keys.md) - Manage API keys and permissions
- [Dashboard Overview](./dashboard.md) - Navigate the web interface
