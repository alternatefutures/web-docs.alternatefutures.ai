---
description: Get started with the Alternate Futures SDK in under 5 minutes. Deploy sites and upload to IPFS programmatically.
---

# SDK Quickstart

Get started with the Alternate Futures SDK in under 5 minutes.

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

## Basic Setup

### Node.js

```typescript
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

// Create the access token service
const accessTokenService = new PersonalAccessTokenService({
  personalAccessToken: process.env.AF_TOKEN,
  projectId: process.env.AF_PROJECT_ID,
});

// Initialize the SDK
const af = new AlternateFuturesSdk({
  accessTokenService,
});

// You're ready to go!
const sites = await af.sites().list();
console.log('Sites:', sites);
```

### Browser

> **What this maps to in code:** [`StaticAccessTokenService`](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/libs/AccessTokenService/StaticAccessTokenService.ts) takes a single `accessToken` option.

```typescript
import { AlternateFuturesSdk, StaticAccessTokenService } from '@alternatefutures/sdk';

// For browser apps, use StaticAccessTokenService
const accessTokenService = new StaticAccessTokenService({
  accessToken: 'your-access-token',
});

const af = new AlternateFuturesSdk({
  accessTokenService,
});
```

## Common Operations

### List Sites

```typescript
const sites = await af.sites().list();

for (const site of sites) {
  console.log(`${site.name} - ${site.slug}`);
}
```

### Upload to IPFS

> **What this maps to in code:** [`af.ipfs().add`](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/clients/ipfs.ts) takes an `IpfsFile` object `{ content, path? }`; use `addFromPath(path)` to upload from the filesystem.

```typescript
// Node.js only - upload a file from a path
const result = await af.ipfs().addFromPath('./my-file.txt');
console.log('CID:', result.cid.toString());

// Or upload content directly
const contentResult = await af.ipfs().add({
  content: 'Hello, decentralized web!',
  path: 'hello.txt',
});
```

### Manage Storage

```typescript
// List stored files
const pins = await af.storage().list();

// Get a specific file
const file = await af.storage().get({ cid: 'bafybei...' });

// Delete a file
await af.storage().delete({ cid: 'bafybei...' });
```

### Work with Domains

```typescript
// List domains for a site
const domains = await af.domains().listDomainsForSite({ siteId: 'site_abc123' });

// Add a custom domain
const domain = await af.domains().createCustomDomain({
  siteId: 'site_abc123',
  hostname: 'www.example.com',
});
```

### Create IPNS Records

> **What this maps to in code:** [`af.ipns()`](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/clients/ipns.ts) — `createRecordForSite`, `publishRecord`, `listRecords`.

```typescript
// Create an IPNS record for a site
const ipns = await af.ipns().createRecordForSite({ siteId: 'site_abc123' });
console.log('IPNS Name:', ipns.name);

// Publish new content to IPNS (keyed by record id)
await af.ipns().publishRecord({
  id: ipns.id,
  hash: 'bafybei...',
});
```

## Error Handling

::: warning
The exact shape of thrown errors (whether to branch on `error.name` or `error.code`) is not yet finalized in the SDK. Treat the example below as illustrative and inspect the caught error in your environment before depending on a specific field. See the [API Reference](./api#error-handling) for the current contract.
:::

```typescript
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

try {
  const af = new AlternateFuturesSdk({
    accessTokenService: new PersonalAccessTokenService({
      personalAccessToken: process.env.AF_TOKEN,
      projectId: process.env.AF_PROJECT_ID,
    }),
  });

  const sites = await af.sites().list();
} catch (error) {
  if (error.name === 'AuthorizationError') {
    console.error('Invalid or expired token');
  } else if (error.name === 'NotFoundError') {
    console.error('Resource not found');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## TypeScript Support

The SDK is fully typed. Import types for better IDE support:

```typescript
import {
  AlternateFuturesSdk,
  PersonalAccessTokenService,
  type Site,
  type Domain,
  type IpnsRecord,
  type StoragePin,
} from '@alternatefutures/sdk/node';

// Types are automatically inferred
const sites: Site[] = await af.sites().list();
```

## Environment Variables

For security, store your credentials in environment variables:

```bash
# .env
AF_TOKEN=pat_your_personal_access_token
AF_PROJECT_ID=prj_your_project_id
```

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

## Next Steps

- **[Installation Guide](./installation)** - Detailed setup instructions
- **[API Reference](./api)** - Complete SDK API documentation
- **[CLI Documentation](/cli/)** - Command-line interface
- **[Guides](/guides/)** - Tutorials and how-tos
