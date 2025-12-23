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

```typescript
import { AlternateFuturesSdk, StaticAccessTokenService } from '@alternatefutures/sdk';

// For browser apps, use StaticAccessTokenService
const accessTokenService = new StaticAccessTokenService({
  token: 'your-access-token',
  projectId: 'your-project-id',
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

```typescript
// Node.js only - upload a file
const result = await af.ipfs().add('./my-file.txt');
console.log('CID:', result.pin.cid);

// Or upload content directly
const result = await af.ipfs().addFromContent({
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
const domains = await af.domains().listBySite({ siteId: 'site_abc123' });

// Add a custom domain
const domain = await af.domains().create({
  siteId: 'site_abc123',
  hostname: 'www.example.com',
});
```

### Create IPNS Records

```typescript
// Create an IPNS record for a site
const ipns = await af.ipns().create({ siteId: 'site_abc123' });
console.log('IPNS Name:', ipns.name);

// Publish new content to IPNS
await af.ipns().publish({
  name: ipns.name,
  hash: 'bafybei...',
});
```

## Error Handling

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
