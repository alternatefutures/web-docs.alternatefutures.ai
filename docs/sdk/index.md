# SDK Documentation

The Alternate Futures SDK provides a JavaScript/TypeScript library for programmatic access to the platform. Build decentralized applications with IPFS storage, serverless functions, and more.

## Features

- **Type-Safe** - Full TypeScript support with comprehensive type definitions
- **Multi-Platform** - Works in both Node.js and browser environments
- **Complete API Access** - Sites, storage, domains, IPNS, ENS, functions, and billing
- **Multiple Auth Methods** - Personal access tokens, static tokens, and OAuth flows

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

## Quick Start

### Node.js

```typescript
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

// Initialize with personal access token
const accessTokenService = new PersonalAccessTokenService({
  personalAccessToken: process.env.AF_TOKEN,
  projectId: process.env.AF_PROJECT_ID,
});

const af = new AlternateFuturesSdk({
  accessTokenService,
});

// List your sites
const sites = await af.sites().list();
console.log('Sites:', sites);

// Upload to IPFS
const result = await af.ipfs().add('./dist');
console.log('CID:', result.pin.cid);
```

### Browser

```typescript
import { AlternateFuturesSdk, StaticAccessTokenService } from '@alternatefutures/sdk';

const accessTokenService = new StaticAccessTokenService({
  token: 'your-access-token',
  projectId: 'your-project-id',
});

const af = new AlternateFuturesSdk({
  accessTokenService,
});

// Use SDK methods
const sites = await af.sites().list();
```

**Note:** The Node.js version (`@alternatefutures/sdk/node`) provides access to filesystem-dependent features like directory uploads. The browser version has a narrower feature set suitable for web applications.

## SDK Clients

| Client | Method | Description |
|--------|--------|-------------|
| **Sites** | `af.sites()` | Deploy and manage static sites |
| **Projects** | `af.projects()` | Manage projects and settings |
| **Domains** | `af.domains()` | Custom domain configuration |
| **Storage** | `af.storage()` | Manage stored files |
| **IPFS** | `af.ipfs()` | Direct IPFS operations (Node.js only) |
| **IPNS** | `af.ipns()` | IPNS record management |
| **ENS** | `af.ens()` | ENS domain integration |
| **Functions** | `af.functions()` | Serverless function management |
| **Applications** | `af.applications()` | OAuth application management |
| **Private Gateways** | `af.privateGateways()` | IPFS gateway management |
| **User** | `af.user()` | User account information |
| **Billing** | `af.billing()` | Billing and usage data |

## Authentication Options

The SDK supports three authentication methods:

### 1. Personal Access Token (Server-Side)

Best for backend services, scripts, and CI/CD pipelines.

```typescript
import { PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const accessTokenService = new PersonalAccessTokenService({
  personalAccessToken: process.env.AF_TOKEN,
  projectId: process.env.AF_PROJECT_ID,
});
```

### 2. Static Access Token (Browser)

Best for client-side apps where the token is already available.

```typescript
import { StaticAccessTokenService } from '@alternatefutures/sdk';

const accessTokenService = new StaticAccessTokenService({
  token: 'jwt-token',
  projectId: 'project-id',
});
```

### 3. Application Access Token (OAuth)

Best for building applications with user authentication.

```typescript
import { ApplicationAccessTokenService } from '@alternatefutures/sdk';

const accessTokenService = new ApplicationAccessTokenService({
  clientId: 'your-client-id',
});

// Trigger user login
await accessTokenService.login();
```

## Common Examples

### Deploy a Site

```typescript
// Create a new site
const site = await af.sites().create({ name: 'my-site' });

// Upload content to IPFS
const upload = await af.ipfs().add('./dist');

// Create deployment
const deployment = await af.sites().createDeployment({
  siteId: site.id,
  cid: upload.pin.cid,
});
```

### Manage Storage

```typescript
// List all stored files
const files = await af.storage().list();

// Get file details
const file = await af.storage().get({ cid: 'bafybei...' });

// Delete a file
await af.storage().delete({ cid: 'bafybei...' });
```

### Work with IPNS

```typescript
// Create IPNS record
const ipns = await af.ipns().create({ siteId: 'site_abc123' });

// Publish new content
await af.ipns().publish({
  name: ipns.name,
  hash: 'bafybei...',
});

// List all IPNS records
const records = await af.ipns().list();
```

### Custom Domains

```typescript
// Add a domain to a site
const domain = await af.domains().create({
  siteId: 'site_abc123',
  hostname: 'www.example.com',
});

// Verify DNS configuration
const verified = await af.domains().verify({ id: domain.id });
```

## TypeScript Support

The SDK provides full TypeScript definitions:

```typescript
import {
  AlternateFuturesSdk,
  PersonalAccessTokenService,
  type Site,
  type Deployment,
  type Domain,
  type IpnsRecord,
  type StoragePin,
  type Project,
  type AFFunction,
} from '@alternatefutures/sdk/node';

// Types are automatically inferred
const sites: Site[] = await af.sites().list();
```

## Requirements

- Node.js 18.0.0 or higher
- Works in both Node.js and modern browser environments

## Documentation

- **[Installation Guide](./installation)** - Detailed installation and configuration
- **[Quick Start](./quickstart)** - Get started in 5 minutes
- **[API Reference](./api)** - Complete API documentation

## Getting Help

- **[CLI Documentation](/cli/)** - Command-line interface
- **[Guides](/guides/)** - Tutorials and best practices
- **[GitHub Issues](https://github.com/alternatefutures)** - Report bugs or request features
