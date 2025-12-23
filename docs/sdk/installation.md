# SDK Installation

Complete guide to installing and configuring the Alternate Futures SDK.

## Requirements

- **Node.js 18.0.0 or higher** - [Download here](https://nodejs.org/)
- **npm, pnpm, or yarn** - Package manager

Check your Node.js version:

```bash
node --version  # Should be v18.0.0 or higher
```

## Installation

::: code-group

```bash [npm]
npm install @alternatefutures/sdk
```

```bash [pnpm]
pnpm add @alternatefutures/sdk
```

```bash [yarn]
yarn add @alternatefutures/sdk
```

:::

## Platform-Specific Imports

The SDK provides different entry points for Node.js and browser environments.

### Node.js

For server-side applications, use the `/node` entry point:

```typescript
import {
  AlternateFuturesSdk,
  PersonalAccessTokenService
} from '@alternatefutures/sdk/node';
```

The Node.js version includes:
- File system operations (upload directories)
- Full IPFS functionality
- Server-side authentication flows

### Browser

For browser applications, use the default import:

```typescript
import {
  AlternateFuturesSdk,
  StaticAccessTokenService
} from '@alternatefutures/sdk';
```

The browser version has a narrower feature set optimized for web applications.

## Authentication Methods

The SDK supports multiple authentication approaches. Choose the one that fits your use case.

### 1. Personal Access Token (Recommended for Servers)

Best for: Server-side applications, scripts, CI/CD pipelines.

```typescript
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const accessTokenService = new PersonalAccessTokenService({
  personalAccessToken: process.env.AF_TOKEN,
  projectId: process.env.AF_PROJECT_ID,
});

const af = new AlternateFuturesSdk({
  accessTokenService,
});
```

**Get your token:**
1. Log in to [app.alternatefutures.ai](https://app.alternatefutures.ai)
2. Go to Settings > API Keys
3. Create a new Personal Access Token
4. Copy the token (starts with `pat_`)

### 2. Static Access Token (Browser Apps)

Best for: Client-side applications where the token is already available.

```typescript
import { AlternateFuturesSdk, StaticAccessTokenService } from '@alternatefutures/sdk';

const accessTokenService = new StaticAccessTokenService({
  token: 'your-jwt-token',
  projectId: 'your-project-id',
});

const af = new AlternateFuturesSdk({
  accessTokenService,
});
```

### 3. Application Access Token (SDK-Powered Apps)

Best for: Building applications that authenticate users via Alternate Futures.

```typescript
import { AlternateFuturesSdk, ApplicationAccessTokenService } from '@alternatefutures/sdk';

const accessTokenService = new ApplicationAccessTokenService({
  clientId: 'your-client-id',
});

const af = new AlternateFuturesSdk({
  accessTokenService,
});

// User login flow
await accessTokenService.login();
```

## Environment Configuration

### Environment Variables

Store your credentials securely using environment variables:

```bash
# .env
AF_TOKEN=pat_your_personal_access_token_here
AF_PROJECT_ID=prj_your_project_id_here
```

**Important:** Add `.env` to your `.gitignore` to avoid committing secrets.

### Loading Environment Variables

**Node.js with dotenv:**

```typescript
import 'dotenv/config';
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN!,
    projectId: process.env.AF_PROJECT_ID!,
  }),
});
```

**Vite (browser):**

```typescript
// Vite automatically loads .env files
const token = import.meta.env.VITE_AF_TOKEN;
```

**Next.js:**

```typescript
// Use NEXT_PUBLIC_ prefix for client-side access
const token = process.env.NEXT_PUBLIC_AF_TOKEN;
```

## TypeScript Configuration

The SDK includes TypeScript definitions. For optimal type checking, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Importing Types

```typescript
import {
  AlternateFuturesSdk,
  PersonalAccessTokenService,
  type Site,
  type Deployment,
  type Domain,
  type IpnsRecord,
  type Project,
  type StoragePin,
  type AFFunction,
} from '@alternatefutures/sdk/node';
```

## SDK Client Reference

The SDK exposes multiple clients for different features:

| Client | Access Method | Description |
|--------|---------------|-------------|
| Sites | `af.sites()` | Manage static sites and deployments |
| Projects | `af.projects()` | Manage projects |
| Domains | `af.domains()` | Custom domain configuration |
| Storage | `af.storage()` | Manage stored files |
| IPFS | `af.ipfs()` | Direct IPFS operations (Node.js only) |
| IPNS | `af.ipns()` | IPNS record management |
| ENS | `af.ens()` | ENS domain integration |
| Functions | `af.functions()` | Serverless functions |
| Applications | `af.applications()` | SDK-powered app management |
| Private Gateways | `af.privateGateways()` | IPFS gateway management |
| User | `af.user()` | User account information |
| Billing | `af.billing()` | Billing and usage data |

## Complete Example

Here's a complete example showing SDK initialization and common operations:

```typescript
import 'dotenv/config';
import {
  AlternateFuturesSdk,
  PersonalAccessTokenService,
  type Site,
  type StoragePin,
} from '@alternatefutures/sdk/node';

async function main() {
  // Initialize SDK
  const accessTokenService = new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN!,
    projectId: process.env.AF_PROJECT_ID!,
  });

  const af = new AlternateFuturesSdk({
    accessTokenService,
  });

  // List all sites
  const sites: Site[] = await af.sites().list();
  console.log('Sites:', sites.map(s => s.name));

  // Upload a file to IPFS
  const uploadResult = await af.ipfs().add('./dist');
  console.log('Uploaded CID:', uploadResult.pin.cid);

  // List storage
  const pins: StoragePin[] = await af.storage().list();
  console.log('Stored files:', pins.length);

  // Get project info
  const projects = await af.projects().list();
  console.log('Projects:', projects.map(p => p.name));
}

main().catch(console.error);
```

## Custom Configuration

### Custom API Endpoints

For self-hosted or development environments:

```typescript
const af = new AlternateFuturesSdk({
  accessTokenService,
  graphqlServiceApiUrl: 'https://custom-api.example.com/graphql',
  ipfsStorageApiUrl: 'https://custom-ipfs.example.com',
  uploadProxyApiUrl: 'https://custom-uploads.example.com',
});
```

## Troubleshooting

### "AuthorizationError"

- Verify your token is correct and not expired
- Ensure the project ID matches an accessible project
- Check that your token has the necessary permissions

### "SdkRequiredNodeRuntimeError"

This error occurs when using Node.js-specific features (like `af.ipfs()`) in a browser environment. Use the browser-compatible methods instead.

### "EnvNotSetError"

Required environment variables are missing. Ensure these are set:
- `SDK__GRAPHQL_API_URL`
- `SDK__IPFS__STORAGE_API_URL`
- `SDK__UPLOAD_PROXY_API_URL`

When using the standard SDK installation, these are configured automatically.

### TypeScript Import Errors

If you see TypeScript errors with imports, ensure:
1. Your `moduleResolution` is set to `bundler` or `node16`
2. You're importing from the correct entry point (`/node` vs default)

## Next Steps

- **[Quick Start](./quickstart)** - Get started in 5 minutes
- **[API Reference](./api)** - Complete SDK API documentation
- **[CLI Documentation](/cli/)** - Command-line interface
- **[Guides](/guides/)** - Tutorials and best practices
