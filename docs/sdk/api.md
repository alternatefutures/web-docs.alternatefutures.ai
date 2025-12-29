# SDK API Reference

Complete API reference for the `@alternatefutures/sdk` package. This page documents all public types, interfaces, and classes available in the SDK.

## Installation

```bash
npm install @alternatefutures/sdk
```

## Quick Reference

| Category | Types |
|----------|-------|
| [Core](#core-classes) | `AlternateFuturesSdk`, `Client` |
| [Authentication](#authentication) | `PersonalAccessTokenService`, `StaticAccessTokenService`, `ApplicationAccessTokenService` |
| [Sites & Deployments](#sites--deployments) | `Site`, `Deployment`, `Zone` |
| [Domains](#domains) | `Domain`, `DomainStatus` |
| [Storage](#storage) | `StoragePin`, `IpfsFile`, `UploadPinResponse`, `UploadProgress` |
| [IPNS & ENS](#ipns--ens) | `IpnsRecord`, `EnsRecord` |
| [Functions](#functions) | `AFFunction`, `AFFunctionStatus` |
| [Billing](#billing) | `Customer`, `Subscription`, `Invoice`, `Payment`, `PaymentMethod`, `CurrentUsage` |
| [Projects & Applications](#projects--applications) | `Project`, `Application` |
| [Gateways](#gateways) | `PrivateGateway` |

---

## Core Classes

### AlternateFuturesSdk

The main SDK class that provides access to all platform functionality.

```typescript
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const accessTokenService = new PersonalAccessTokenService({
  personalAccessToken: process.env.AF_TOKEN,
  projectId: process.env.AF_PROJECT_ID,
});

const af = new AlternateFuturesSdk({ accessTokenService });

// Access SDK clients
const sites = await af.sites().list();
const storage = await af.storage().list();
```

**Methods:**

| Method | Returns | Description |
|--------|---------|-------------|
| `sites()` | `SitesClient` | Site and deployment management |
| `projects()` | `ProjectsClient` | Project management |
| `domains()` | `DomainsClient` | Custom domain configuration |
| `storage()` | `StorageClient` | File storage operations |
| `ipfs()` | `IpfsClient` | Direct IPFS operations (Node.js only) |
| `ipns()` | `IpnsClient` | IPNS record management |
| `ens()` | `EnsClient` | ENS domain integration |
| `functions()` | `FunctionsClient` | Serverless functions |
| `applications()` | `ApplicationsClient` | OAuth application management |
| `privateGateways()` | `PrivateGatewaysClient` | IPFS gateway management |
| `user()` | `UserClient` | User account information |
| `billing()` | `BillingClient` | Billing and usage data |

### Client

Low-level GraphQL client interface for advanced use cases.

```typescript
import { createClient } from '@alternatefutures/sdk';

const client = createClient({
  // Optional configuration
});

// Execute raw queries
const result = await client.query({
  site: {
    __args: { id: 'site_abc123' },
    id: true,
    name: true,
    slug: true,
  },
});
```

**Methods:**

| Method | Description |
|--------|-------------|
| `query(request)` | Execute a GraphQL query |
| `mutation(request)` | Execute a GraphQL mutation |

---

## Authentication

### PersonalAccessTokenService

Server-side authentication using personal access tokens. Best for backend services, scripts, and CI/CD pipelines.

```typescript
import { PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const accessTokenService = new PersonalAccessTokenService({
  personalAccessToken: process.env.AF_TOKEN,  // Required
  projectId: process.env.AF_PROJECT_ID,       // Required
});
```

**Constructor Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `personalAccessToken` | `string` | Yes | Your personal access token |
| `projectId` | `string` | Yes | Target project ID |

### StaticAccessTokenService

Browser-side authentication when you already have a JWT token.

```typescript
import { StaticAccessTokenService } from '@alternatefutures/sdk';

const accessTokenService = new StaticAccessTokenService({
  token: 'jwt-token',
  projectId: 'project-id',
});
```

**Constructor Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `token` | `string` | Yes | JWT access token |
| `projectId` | `string` | Yes | Target project ID |

### ApplicationAccessTokenService

OAuth-based authentication for building applications with user login.

```typescript
import { ApplicationAccessTokenService } from '@alternatefutures/sdk';

const accessTokenService = new ApplicationAccessTokenService({
  clientId: 'your-client-id',
});

// Trigger user login flow
await accessTokenService.login();
```

**Constructor Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `clientId` | `string` | Yes | Your application's Client ID |

---

## Sites & Deployments

### Site

Represents a deployed static site.

```typescript
import type { Site } from '@alternatefutures/sdk';

const site: Site = await af.sites().get({ slug: 'my-site' });
console.log(site.name, site.slug);
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique site identifier |
| `name` | `string` | Display name |
| `slug` | `string` | URL-friendly identifier |
| `deployments` | `Deployment[]` | List of deployments |
| `domains` | `{ id, hostname }[]` | Associated domains |
| `primaryDomain` | `{ id, hostname }` | Primary domain (optional) |
| `ipnsRecords` | `{ id }[]` | Associated IPNS records |
| `zones` | `{ id, status }[]` | CDN zones |

### Deployment

Represents a single deployment of a site.

```typescript
import type { Deployment } from '@alternatefutures/sdk';

const deployments: Deployment[] = await af.sites().listDeployments({
  siteId: 'site_abc123',
});
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique deployment identifier |
| `status` | `string` | Deployment status |
| `storageType` | `string` | Storage network (IPFS, Arweave) |
| `siteId` | `string` | Parent site ID |
| `cid` | `string` | Content identifier (IPFS CID) |
| `createdAt` | `string` | Creation timestamp |
| `updatedAt` | `string` | Last update timestamp |

### Zone

CDN zone configuration for a site.

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Zone identifier |
| `originUrl` | `string` | Origin server URL |
| `type` | `string` | Zone type |
| `status` | `string` | Zone status |
| `createdAt` | `string` | Creation timestamp |
| `updatedAt` | `string` | Last update timestamp |

---

## Domains

### Domain

Custom domain configuration.

```typescript
import type { Domain } from '@alternatefutures/sdk';

const domain: Domain = await af.domains().create({
  siteId: 'site_abc123',
  hostname: 'www.example.com',
});
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Domain identifier |
| `hostname` | `string` | Full domain name |
| `zone` | `object` | Associated zone |
| `isVerified` | `boolean` | DNS verification status |
| `status` | `DomainStatus` | Current status |
| `dnsConfigs` | `object[]` | Required DNS records |
| `domainType` | `"WEB2" \| "ARNS" \| "ENS" \| "IPNS"` | Domain type |
| `sslStatus` | `"NONE" \| "PENDING" \| "ACTIVE" \| "EXPIRED" \| "FAILED"` | SSL certificate status |
| `createdAt` | `string` | Creation timestamp |
| `updatedAt` | `string` | Last update timestamp |

### DomainStatus

```typescript
type DomainStatus =
  | "ACTIVE"
  | "CREATED"
  | "CREATING"
  | "CREATING_FAILED"
  | "DELETING"
  | "DELETING_FAILED"
  | "VERIFYING"
  | "VERIFYING_FAILED";
```

---

## Storage

### StoragePin

Represents a pinned file in storage.

```typescript
import type { StoragePin } from '@alternatefutures/sdk';

const files: StoragePin[] = await af.storage().list();
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `cid` | `string` | Content identifier |
| `filename` | `string` | Original filename |
| `extension` | `string` | File extension |
| `arweavePin` | `object` | Arweave pin info (if applicable) |
| `arweaveId` | `string` | Arweave transaction ID (optional) |
| `filecoinDealIds` | `string` | Filecoin deal IDs (optional) |

### IpfsFile

Input type for IPFS uploads.

```typescript
import type { IpfsFile } from '@alternatefutures/sdk';

const file: IpfsFile = {
  content: Buffer.from('Hello, World!'),
  path: 'hello.txt',
};
```

**Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `content` | `ArrayBuffer \| string` | Yes | File content |
| `path` | `string` | No | File path/name |

### UploadPinResponse

Response from upload operations.

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `duplicate` | `boolean` | Whether content already existed |
| `pin` | `{ cid, size }` | Pin details |

### UploadProgress

Progress callback data during uploads.

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `loadedSize` | `number` | Bytes uploaded |
| `totalSize` | `number` | Total bytes (optional) |

### UploadContentOptions

Options for content uploads.

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `siteId` | `string` | Target site ID (optional) |
| `functionName` | `string` | Target function name (optional) |

---

## IPNS & ENS

### IpnsRecord

InterPlanetary Naming System record for mutable content addressing.

```typescript
import type { IpnsRecord } from '@alternatefutures/sdk';

const record: IpnsRecord = await af.ipns().create({
  siteId: 'site_abc123',
});

// Update the record to point to new content
await af.ipns().publish({
  name: record.name,
  hash: 'bafybei...',
});
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Record identifier |
| `name` | `string` | IPNS name (k51qzi...) |
| `hash` | `string` | Current IPFS CID |
| `ensRecords` | `{ id }[]` | Linked ENS records |

### EnsRecord

Ethereum Name Service record linking .eth domains to IPFS content.

```typescript
import type { EnsRecord } from '@alternatefutures/sdk';

const ensRecords: EnsRecord[] = await af.ens().list();
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Record identifier |
| `site` | `{ id }` | Associated site |
| `ipnsRecord` | `{ id, name, hash }` | Linked IPNS record |

---

## Functions

### AFFunction

Serverless function definition.

```typescript
import type { AFFunction } from '@alternatefutures/sdk';

const functions: AFFunction[] = await af.functions().list();
```

**Note:** Function properties are inherited from the platform's function schema, excluding internal fields like `projectId` and `site`.

### AFFunctionStatus

```typescript
type AFFunctionStatus = "ACTIVE" | "INACTIVE";
```

---

## Billing

### Customer

Billing customer information.

```typescript
import type { Customer } from '@alternatefutures/sdk';

const customer: Customer = await af.billing().getCustomer();
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Customer identifier |
| `email` | `string` | Email address (optional) |
| `name` | `string` | Display name (optional) |
| `createdAt` | `number` | Unix timestamp |

### Subscription

Active subscription details.

```typescript
import type { Subscription } from '@alternatefutures/sdk';

const subscription: Subscription = await af.billing().getSubscription();
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Subscription identifier |
| `plan` | `"FREE" \| "STARTER" \| "PRO" \| "ENTERPRISE"` | Plan type |
| `status` | `"ACTIVE" \| "CANCELED" \| "PAST_DUE" \| "UNPAID" \| "TRIALING"` | Status |
| `seats` | `number` | Number of seats |
| `basePricePerSeat` | `number` | Price per seat |
| `usageMarkup` | `number` | Usage markup percentage |
| `currentPeriodStart` | `number` | Period start (Unix timestamp) |
| `currentPeriodEnd` | `number` | Period end (Unix timestamp) |
| `trialEnd` | `number` | Trial end date (optional) |
| `cancelAt` | `number` | Cancellation date (optional) |
| `createdAt` | `number` | Creation timestamp |

### Invoice

Billing invoice.

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Invoice identifier |
| `invoiceNumber` | `string` | Human-readable number |
| `status` | `"DRAFT" \| "OPEN" \| "PAID" \| "VOID" \| "UNCOLLECTIBLE"` | Invoice status |
| `currency` | `string` | Currency code (e.g., "USD") |
| `subtotal` | `number` | Subtotal amount |
| `tax` | `number` | Tax amount |
| `total` | `number` | Total amount |
| `amountDue` | `number` | Amount due |
| `amountPaid` | `number` | Amount paid |
| `lineItems` | `InvoiceLineItem[]` | Line items (optional) |
| `periodStart` | `number` | Billing period start (optional) |
| `periodEnd` | `number` | Billing period end (optional) |
| `dueDate` | `number` | Due date (optional) |
| `paidAt` | `number` | Payment date (optional) |
| `pdfUrl` | `string` | PDF download URL (optional) |
| `createdAt` | `number` | Creation timestamp |

### InvoiceLineItem

Individual line item on an invoice.

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Line item identifier |
| `description` | `string` | Item description |
| `quantity` | `number` | Quantity |
| `unitPrice` | `number` | Price per unit |
| `amount` | `number` | Total amount |

### Payment

Payment transaction.

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Payment identifier |
| `amount` | `number` | Payment amount |
| `currency` | `string` | Currency code |
| `status` | `"PENDING" \| "SUCCEEDED" \| "FAILED"` | Payment status |
| `provider` | `string` | Payment provider (optional) |
| `invoiceId` | `string` | Associated invoice ID (optional) |
| `blockchain` | `string` | Blockchain network for crypto (optional) |
| `txHash` | `string` | Transaction hash for crypto (optional) |
| `createdAt` | `number` | Creation timestamp |

### PaymentMethod

Saved payment method.

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Payment method identifier |
| `type` | `"CARD" \| "CRYPTO"` | Payment type |
| `isDefault` | `boolean` | Whether this is the default method |
| `cardBrand` | `string` | Card brand (Visa, Mastercard, etc.) |
| `cardLast4` | `string` | Last 4 digits of card |
| `cardExpMonth` | `number` | Card expiration month |
| `cardExpYear` | `number` | Card expiration year |
| `walletAddress` | `string` | Crypto wallet address (optional) |
| `blockchain` | `string` | Blockchain network (optional) |
| `provider` | `string` | Payment provider (optional) |
| `createdAt` | `number` | Creation timestamp |

### CurrentUsage

Current billing period usage.

```typescript
import type { CurrentUsage } from '@alternatefutures/sdk';

const usage: CurrentUsage = await af.billing().getCurrentUsage();
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `bandwidth` | `UsageMetric` | Bandwidth usage |
| `compute` | `UsageMetric` | Compute usage |
| `requests` | `UsageMetric` | Request count |
| `storage` | `UsageMetric` | Storage usage |
| `total` | `number` | Total cost |
| `periodStart` | `number` | Period start (optional) |
| `periodEnd` | `number` | Period end (optional) |

### UsageMetric

Individual usage metric.

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `quantity` | `number` | Usage quantity |
| `amount` | `number` | Cost amount |

### UsageRecord

Historical usage record.

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Record identifier |
| `metricType` | `"storage" \| "bandwidth" \| "compute" \| "requests"` | Metric type |
| `quantity` | `number` | Usage quantity |
| `unitPrice` | `number` | Price per unit |
| `amount` | `number` | Total amount |
| `periodStart` | `number` | Period start |
| `periodEnd` | `number` | Period end |
| `recordedAt` | `number` | Recording timestamp |
| `createdAt` | `number` | Creation timestamp |

---

## Projects & Applications

### Project

Project configuration and settings.

```typescript
import type { Project } from '@alternatefutures/sdk';

const projects: Project[] = await af.projects().list();
```

**Note:** Project properties are inherited from the platform's project schema, excluding membership-related fields.

### Application

OAuth application for SDK authentication.

```typescript
import type { Application } from '@alternatefutures/sdk';

const apps: Application[] = await af.applications().list();
```

**Properties include:**

| Property | Type | Description |
|----------|------|-------------|
| `whitelistDomains` | `string[]` | Allowed domains for CORS |
| `whiteLabelDomains` | `string[]` | Custom branding domains |

---

## Gateways

### PrivateGateway

Private IPFS gateway configuration.

```typescript
import type { PrivateGateway } from '@alternatefutures/sdk';

const gateways: PrivateGateway[] = await af.privateGateways().list();
```

**Properties include:**

| Property | Type | Description |
|----------|------|-------------|
| `project` | `{ id }` | Parent project |

Additional properties are inherited from the platform's gateway schema.

---

## Error Handling

All SDK methods throw errors that can be caught and handled:

```typescript
import { AlternateFuturesSdk } from '@alternatefutures/sdk/node';

try {
  const site = await af.sites().get({ slug: 'nonexistent' });
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    console.error('Site not found');
  } else if (error.code === 'UNAUTHORIZED') {
    console.error('Check your access token');
  } else {
    throw error;
  }
}
```

---

## TypeScript Support

Import types directly from the SDK:

```typescript
import {
  AlternateFuturesSdk,
  PersonalAccessTokenService,
  type Site,
  type Deployment,
  type Domain,
  type StoragePin,
  type IpnsRecord,
  type EnsRecord,
  type AFFunction,
  type Project,
  type Subscription,
  type Invoice,
  type CurrentUsage,
} from '@alternatefutures/sdk/node';
```

---

## Related Documentation

- [SDK Overview](./index) - Getting started with the SDK
- [Quick Start](./quickstart) - Deploy your first site in 5 minutes
- [Installation Guide](./installation) - Detailed setup instructions
- [CLI Reference](/cli/commands) - Command-line interface
- [Guides](/guides/) - Tutorials and best practices
