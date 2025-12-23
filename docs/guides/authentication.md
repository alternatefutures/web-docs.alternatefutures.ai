# Authentication

Alternate Futures supports multiple authentication methods for maximum flexibility.

## Authentication Methods

### Email Magic Link

Passwordless authentication via email:

1. Enter your email address
2. Check your inbox for the magic link
3. Click the link to sign in

### SMS Magic Link

Passwordless authentication via SMS:

1. Enter your phone number
2. Receive a text message with the link
3. Click the link to sign in

### Web3 Wallets

Sign in with your cryptocurrency wallet:

- **MetaMask** - Ethereum wallet
- **Phantom** - Solana wallet
- **WalletConnect** - Universal wallet connection
- **Coinbase Wallet**
- **Rainbow Wallet**

Uses "Sign in with Ethereum" (SIWE) standard for secure authentication.

### Social OAuth

Sign in with your existing accounts:

- **Google**
- **Apple**
- **Twitter**
- **Discord**
- **GitHub**
- **Facebook**

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
export AF_TOKEN="your-personal-access-token"
export AF_PROJECT_ID="your-project-id"
af sites list
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
