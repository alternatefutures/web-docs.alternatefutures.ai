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
| [Framework Integration](#framework-integration) | React hooks, Svelte stores, SvelteKit server-side |

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

## Framework Integration

The SDK works seamlessly with modern frontend frameworks. This section provides production-ready patterns for React and Svelte applications.

### Initializing the SDK

::: code-group

```tsx [React]
// src/lib/af-client.ts
import { AlternateFuturesSdk, StaticAccessTokenService } from '@alternatefutures/sdk';

let afInstance: AlternateFuturesSdk | null = null;

export function getAFClient(token: string, projectId: string): AlternateFuturesSdk {
  if (!afInstance) {
    const accessTokenService = new StaticAccessTokenService({
      token,
      projectId,
    });
    afInstance = new AlternateFuturesSdk({ accessTokenService });
  }
  return afInstance;
}

// For authenticated contexts, create a hook
// src/hooks/useAFClient.ts
import { useMemo } from 'react';
import { useAuth } from './useAuth'; // Your auth context
import { getAFClient } from '../lib/af-client';

export function useAFClient() {
  const { token, projectId } = useAuth();

  return useMemo(() => {
    if (!token || !projectId) return null;
    return getAFClient(token, projectId);
  }, [token, projectId]);
}
```

```svelte [Svelte]
<!-- src/lib/af-client.ts -->
<script context="module" lang="ts">
import { AlternateFuturesSdk, StaticAccessTokenService } from '@alternatefutures/sdk';
import { derived, type Readable } from 'svelte/store';
import { authStore } from './stores/auth'; // Your auth store

let afInstance: AlternateFuturesSdk | null = null;

function createClient(token: string, projectId: string): AlternateFuturesSdk {
  const accessTokenService = new StaticAccessTokenService({
    token,
    projectId,
  });
  return new AlternateFuturesSdk({ accessTokenService });
}

// Reactive SDK client that updates when auth changes
export const afClient: Readable<AlternateFuturesSdk | null> = derived(
  authStore,
  ($auth) => {
    if (!$auth.token || !$auth.projectId) return null;
    if (!afInstance) {
      afInstance = createClient($auth.token, $auth.projectId);
    }
    return afInstance;
  }
);
</script>
```

:::

### Fetching and Displaying Sites

::: code-group

```tsx [React]
// src/components/SitesList.tsx
import { useState, useEffect } from 'react';
import type { Site } from '@alternatefutures/sdk';
import { useAFClient } from '../hooks/useAFClient';

interface SitesListState {
  sites: Site[];
  loading: boolean;
  error: string | null;
}

export function SitesList() {
  const af = useAFClient();
  const [state, setState] = useState<SitesListState>({
    sites: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!af) return;

    let cancelled = false;

    async function fetchSites() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const sites = await af.sites().list();
        if (!cancelled) {
          setState({ sites, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to fetch sites',
          }));
        }
      }
    }

    fetchSites();

    return () => {
      cancelled = true;
    };
  }, [af]);

  if (state.loading) {
    return <div className="loading">Loading sites...</div>;
  }

  if (state.error) {
    return <div className="error">Error: {state.error}</div>;
  }

  if (state.sites.length === 0) {
    return <div className="empty">No sites found. Create your first site!</div>;
  }

  return (
    <ul className="sites-list">
      {state.sites.map((site) => (
        <li key={site.id} className="site-item">
          <h3>{site.name}</h3>
          <p className="slug">{site.slug}</p>
          <span className="deployments">
            {site.deployments?.length ?? 0} deployments
          </span>
        </li>
      ))}
    </ul>
  );
}
```

```svelte [Svelte]
<!-- src/components/SitesList.svelte -->
<script lang="ts">
  import type { Site } from '@alternatefutures/sdk';
  import { afClient } from '$lib/af-client';
  import { onMount } from 'svelte';

  let sites: Site[] = [];
  let loading = true;
  let error: string | null = null;

  // Reactive fetch when client becomes available
  $: if ($afClient) {
    fetchSites();
  }

  async function fetchSites() {
    if (!$afClient) return;

    loading = true;
    error = null;

    try {
      sites = await $afClient.sites().list();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to fetch sites';
    } finally {
      loading = false;
    }
  }
</script>

{#if loading}
  <div class="loading">Loading sites...</div>
{:else if error}
  <div class="error">Error: {error}</div>
{:else if sites.length === 0}
  <div class="empty">No sites found. Create your first site!</div>
{:else}
  <ul class="sites-list">
    {#each sites as site (site.id)}
      <li class="site-item">
        <h3>{site.name}</h3>
        <p class="slug">{site.slug}</p>
        <span class="deployments">
          {site.deployments?.length ?? 0} deployments
        </span>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .sites-list {
    list-style: none;
    padding: 0;
  }
  .site-item {
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }
  .slug {
    color: #666;
    font-family: monospace;
  }
</style>
```

:::

### File Upload with Progress Indicator

::: code-group

```tsx [React]
// src/components/FileUploader.tsx
import { useState, useCallback } from 'react';
import type { UploadProgress, UploadPinResponse } from '@alternatefutures/sdk';
import { useAFClient } from '../hooks/useAFClient';

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  result: UploadPinResponse | null;
}

export function FileUploader() {
  const af = useAFClient();
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    result: null,
  });

  const handleProgressUpdate = useCallback((progress: UploadProgress) => {
    if (progress.totalSize) {
      const percent = Math.round((progress.loadedSize / progress.totalSize) * 100);
      setState(prev => ({ ...prev, progress: percent }));
    }
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !af) return;

    setState({
      uploading: true,
      progress: 0,
      error: null,
      result: null,
    });

    try {
      // Read file as ArrayBuffer
      const content = await file.arrayBuffer();

      const result = await af.storage().uploadFile({
        file: {
          content,
          path: file.name,
        },
        onUploadProgress: handleProgressUpdate,
      });

      setState({
        uploading: false,
        progress: 100,
        error: null,
        result,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        uploading: false,
        error: err instanceof Error ? err.message : 'Upload failed',
      }));
    }
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        onChange={handleFileChange}
        disabled={state.uploading || !af}
      />

      {state.uploading && (
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${state.progress}%` }}
          />
          <span className="progress-text">{state.progress}%</span>
        </div>
      )}

      {state.error && (
        <div className="error">Upload failed: {state.error}</div>
      )}

      {state.result && (
        <div className="success">
          <p>File uploaded successfully!</p>
          <code>CID: {state.result.pin.cid}</code>
          {state.result.duplicate && (
            <p className="note">This file was already uploaded.</p>
          )}
        </div>
      )}
    </div>
  );
}
```

```svelte [Svelte]
<!-- src/components/FileUploader.svelte -->
<script lang="ts">
  import type { UploadProgress, UploadPinResponse } from '@alternatefutures/sdk';
  import { afClient } from '$lib/af-client';

  let uploading = false;
  let progress = 0;
  let error: string | null = null;
  let result: UploadPinResponse | null = null;

  function handleProgressUpdate(progressData: UploadProgress) {
    if (progressData.totalSize) {
      progress = Math.round((progressData.loadedSize / progressData.totalSize) * 100);
    }
  }

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !$afClient) return;

    uploading = true;
    progress = 0;
    error = null;
    result = null;

    try {
      // Read file as ArrayBuffer
      const content = await file.arrayBuffer();

      result = await $afClient.storage().uploadFile({
        file: {
          content,
          path: file.name,
        },
        onUploadProgress: handleProgressUpdate,
      });

      progress = 100;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Upload failed';
    } finally {
      uploading = false;
    }
  }
</script>

<div class="file-uploader">
  <input
    type="file"
    on:change={handleFileChange}
    disabled={uploading || !$afClient}
  />

  {#if uploading}
    <div class="progress-container">
      <div class="progress-bar" style="width: {progress}%"></div>
      <span class="progress-text">{progress}%</span>
    </div>
  {/if}

  {#if error}
    <div class="error">Upload failed: {error}</div>
  {/if}

  {#if result}
    <div class="success">
      <p>File uploaded successfully!</p>
      <code>CID: {result.pin.cid}</code>
      {#if result.duplicate}
        <p class="note">This file was already uploaded.</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .progress-container {
    position: relative;
    height: 24px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin: 1rem 0;
  }
  .progress-bar {
    height: 100%;
    background: #4caf50;
    transition: width 0.2s ease;
  }
  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
  }
  .success {
    padding: 1rem;
    background: #e8f5e9;
    border-radius: 4px;
    margin-top: 1rem;
  }
  .error {
    color: #d32f2f;
    margin-top: 1rem;
  }
</style>
```

:::

### Authentication State Management

::: code-group

```tsx [React]
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AlternateFuturesSdk, ApplicationAccessTokenService } from '@alternatefutures/sdk';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  projectId: string | null;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: () => Promise<void>;
  logout: () => void;
  selectProject: (projectId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const CLIENT_ID = import.meta.env.VITE_AF_CLIENT_ID;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    token: null,
    projectId: null,
    error: null,
  });

  const [accessTokenService] = useState(
    () => new ApplicationAccessTokenService({ clientId: CLIENT_ID })
  );

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('af_token');
    const storedProjectId = localStorage.getItem('af_project_id');

    if (storedToken && storedProjectId) {
      setState({
        isAuthenticated: true,
        isLoading: false,
        token: storedToken,
        projectId: storedProjectId,
        error: null,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await accessTokenService.login();

      // After successful login, the token is available
      const token = await accessTokenService.getAccessToken();

      if (token) {
        localStorage.setItem('af_token', token);
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          token,
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Login failed',
      }));
    }
  }, [accessTokenService]);

  const logout = useCallback(() => {
    localStorage.removeItem('af_token');
    localStorage.removeItem('af_project_id');
    setState({
      isAuthenticated: false,
      isLoading: false,
      token: null,
      projectId: null,
      error: null,
    });
  }, []);

  const selectProject = useCallback((projectId: string) => {
    localStorage.setItem('af_project_id', projectId);
    setState(prev => ({ ...prev, projectId }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, selectProject }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Example usage in a component
// src/components/LoginButton.tsx
export function LoginButton() {
  const { isAuthenticated, isLoading, login, logout, error } = useAuth();

  if (isLoading) {
    return <button disabled>Loading...</button>;
  }

  if (isAuthenticated) {
    return <button onClick={logout}>Sign Out</button>;
  }

  return (
    <div>
      <button onClick={login}>Sign In with Alternate Futures</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

```svelte [Svelte]
<!-- src/lib/stores/auth.ts -->
<script context="module" lang="ts">
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { ApplicationAccessTokenService } from '@alternatefutures/sdk';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  projectId: string | null;
  error: string | null;
}

const CLIENT_ID = import.meta.env.VITE_AF_CLIENT_ID;

function createAuthStore() {
  const accessTokenService = new ApplicationAccessTokenService({
    clientId: CLIENT_ID,
  });

  // Initialize from localStorage if in browser
  const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    token: null,
    projectId: null,
    error: null,
  };

  const { subscribe, set, update } = writable<AuthState>(initialState);

  // Check for existing session
  if (browser) {
    const storedToken = localStorage.getItem('af_token');
    const storedProjectId = localStorage.getItem('af_project_id');

    if (storedToken && storedProjectId) {
      set({
        isAuthenticated: true,
        isLoading: false,
        token: storedToken,
        projectId: storedProjectId,
        error: null,
      });
    } else {
      update(state => ({ ...state, isLoading: false }));
    }
  }

  return {
    subscribe,

    async login() {
      update(state => ({ ...state, isLoading: true, error: null }));

      try {
        await accessTokenService.login();
        const token = await accessTokenService.getAccessToken();

        if (token && browser) {
          localStorage.setItem('af_token', token);
          update(state => ({
            ...state,
            isAuthenticated: true,
            isLoading: false,
            token,
          }));
        }
      } catch (err) {
        update(state => ({
          ...state,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Login failed',
        }));
      }
    },

    logout() {
      if (browser) {
        localStorage.removeItem('af_token');
        localStorage.removeItem('af_project_id');
      }
      set({
        isAuthenticated: false,
        isLoading: false,
        token: null,
        projectId: null,
        error: null,
      });
    },

    selectProject(projectId: string) {
      if (browser) {
        localStorage.setItem('af_project_id', projectId);
      }
      update(state => ({ ...state, projectId }));
    },
  };
}

export const authStore = createAuthStore();
</script>

<!-- src/components/LoginButton.svelte -->
<script lang="ts">
  import { authStore } from '$lib/stores/auth';

  const { isAuthenticated, isLoading, error } = $authStore;
</script>

{#if $authStore.isLoading}
  <button disabled>Loading...</button>
{:else if $authStore.isAuthenticated}
  <button on:click={() => authStore.logout()}>Sign Out</button>
{:else}
  <div>
    <button on:click={() => authStore.login()}>
      Sign In with Alternate Futures
    </button>
    {#if $authStore.error}
      <p class="error">{$authStore.error}</p>
    {/if}
  </div>
{/if}

<style>
  .error {
    color: #d32f2f;
    margin-top: 0.5rem;
  }
</style>
```

:::

### SvelteKit Server-Side Integration

For SvelteKit applications, you can also use the SDK on the server side with personal access tokens.

```typescript
// src/routes/api/sites/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';
import { AF_TOKEN, AF_PROJECT_ID } from '$env/static/private';

const accessTokenService = new PersonalAccessTokenService({
  personalAccessToken: AF_TOKEN,
  projectId: AF_PROJECT_ID,
});

const af = new AlternateFuturesSdk({ accessTokenService });

export const GET: RequestHandler = async () => {
  try {
    const sites = await af.sites().list();
    return json({ sites });
  } catch (error) {
    console.error('Failed to fetch sites:', error);
    return json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== 'string') {
      return json(
        { error: 'Site name is required' },
        { status: 400 }
      );
    }

    const site = await af.sites().create({ name });
    return json({ site }, { status: 201 });
  } catch (error) {
    console.error('Failed to create site:', error);
    return json(
      { error: 'Failed to create site' },
      { status: 500 }
    );
  }
};
```

### React Custom Hooks for Common Operations

```tsx
// src/hooks/useSites.ts
import { useState, useEffect, useCallback } from 'react';
import type { Site } from '@alternatefutures/sdk';
import { useAFClient } from './useAFClient';

interface UseSitesResult {
  sites: Site[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createSite: (name: string) => Promise<Site | null>;
  deleteSite: (id: string) => Promise<boolean>;
}

export function useSites(): UseSitesResult {
  const af = useAFClient();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSites = useCallback(async () => {
    if (!af) return;

    setLoading(true);
    setError(null);

    try {
      const result = await af.sites().list();
      setSites(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sites');
    } finally {
      setLoading(false);
    }
  }, [af]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const createSite = useCallback(async (name: string): Promise<Site | null> => {
    if (!af) return null;

    try {
      const site = await af.sites().create({ name });
      setSites(prev => [...prev, site]);
      return site;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create site');
      return null;
    }
  }, [af]);

  const deleteSite = useCallback(async (id: string): Promise<boolean> => {
    if (!af) return false;

    try {
      await af.sites().delete({ id });
      setSites(prev => prev.filter(site => site.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete site');
      return false;
    }
  }, [af]);

  return {
    sites,
    loading,
    error,
    refetch: fetchSites,
    createSite,
    deleteSite,
  };
}

// src/hooks/useStorage.ts
import { useState, useCallback } from 'react';
import type { StoragePin, UploadProgress, UploadPinResponse } from '@alternatefutures/sdk';
import { useAFClient } from './useAFClient';

interface UseStorageResult {
  files: StoragePin[];
  loading: boolean;
  uploading: boolean;
  uploadProgress: number;
  error: string | null;
  fetchFiles: () => Promise<void>;
  uploadFile: (file: File) => Promise<UploadPinResponse | null>;
  deleteFile: (cid: string) => Promise<boolean>;
}

export function useStorage(): UseStorageResult {
  const af = useAFClient();
  const [files, setFiles] = useState<StoragePin[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    if (!af) return;

    setLoading(true);
    setError(null);

    try {
      const result = await af.storage().list();
      setFiles(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  }, [af]);

  const uploadFile = useCallback(async (file: File): Promise<UploadPinResponse | null> => {
    if (!af) return null;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const content = await file.arrayBuffer();

      const result = await af.storage().uploadFile({
        file: { content, path: file.name },
        onUploadProgress: (progress: UploadProgress) => {
          if (progress.totalSize) {
            setUploadProgress(
              Math.round((progress.loadedSize / progress.totalSize) * 100)
            );
          }
        },
      });

      // Refresh file list after upload
      await fetchFiles();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, [af, fetchFiles]);

  const deleteFile = useCallback(async (cid: string): Promise<boolean> => {
    if (!af) return false;

    try {
      await af.storage().delete({ cid });
      setFiles(prev => prev.filter(file => file.cid !== cid));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
      return false;
    }
  }, [af]);

  return {
    files,
    loading,
    uploading,
    uploadProgress,
    error,
    fetchFiles,
    uploadFile,
    deleteFile,
  };
}
```

### Svelte Stores for Common Operations

```typescript
// src/lib/stores/sites.ts
import { writable, derived, get } from 'svelte/store';
import type { Site } from '@alternatefutures/sdk';
import { afClient } from '$lib/af-client';

interface SitesState {
  sites: Site[];
  loading: boolean;
  error: string | null;
}

function createSitesStore() {
  const { subscribe, set, update } = writable<SitesState>({
    sites: [],
    loading: false,
    error: null,
  });

  return {
    subscribe,

    async fetch() {
      const client = get(afClient);
      if (!client) return;

      update(state => ({ ...state, loading: true, error: null }));

      try {
        const sites = await client.sites().list();
        set({ sites, loading: false, error: null });
      } catch (err) {
        update(state => ({
          ...state,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch sites',
        }));
      }
    },

    async create(name: string): Promise<Site | null> {
      const client = get(afClient);
      if (!client) return null;

      try {
        const site = await client.sites().create({ name });
        update(state => ({
          ...state,
          sites: [...state.sites, site],
        }));
        return site;
      } catch (err) {
        update(state => ({
          ...state,
          error: err instanceof Error ? err.message : 'Failed to create site',
        }));
        return null;
      }
    },

    async delete(id: string): Promise<boolean> {
      const client = get(afClient);
      if (!client) return false;

      try {
        await client.sites().delete({ id });
        update(state => ({
          ...state,
          sites: state.sites.filter(site => site.id !== id),
        }));
        return true;
      } catch (err) {
        update(state => ({
          ...state,
          error: err instanceof Error ? err.message : 'Failed to delete site',
        }));
        return false;
      }
    },
  };
}

export const sitesStore = createSitesStore();

// src/lib/stores/storage.ts
import { writable, get } from 'svelte/store';
import type { StoragePin, UploadProgress, UploadPinResponse } from '@alternatefutures/sdk';
import { afClient } from '$lib/af-client';

interface StorageState {
  files: StoragePin[];
  loading: boolean;
  uploading: boolean;
  uploadProgress: number;
  error: string | null;
}

function createStorageStore() {
  const { subscribe, set, update } = writable<StorageState>({
    files: [],
    loading: false,
    uploading: false,
    uploadProgress: 0,
    error: null,
  });

  return {
    subscribe,

    async fetch() {
      const client = get(afClient);
      if (!client) return;

      update(state => ({ ...state, loading: true, error: null }));

      try {
        const files = await client.storage().list();
        update(state => ({ ...state, files, loading: false }));
      } catch (err) {
        update(state => ({
          ...state,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch files',
        }));
      }
    },

    async upload(file: File): Promise<UploadPinResponse | null> {
      const client = get(afClient);
      if (!client) return null;

      update(state => ({
        ...state,
        uploading: true,
        uploadProgress: 0,
        error: null,
      }));

      try {
        const content = await file.arrayBuffer();

        const result = await client.storage().uploadFile({
          file: { content, path: file.name },
          onUploadProgress: (progress: UploadProgress) => {
            if (progress.totalSize) {
              update(state => ({
                ...state,
                uploadProgress: Math.round(
                  (progress.loadedSize / progress.totalSize!) * 100
                ),
              }));
            }
          },
        });

        // Refresh file list
        await this.fetch();
        return result;
      } catch (err) {
        update(state => ({
          ...state,
          error: err instanceof Error ? err.message : 'Upload failed',
        }));
        return null;
      } finally {
        update(state => ({ ...state, uploading: false }));
      }
    },

    async delete(cid: string): Promise<boolean> {
      const client = get(afClient);
      if (!client) return false;

      try {
        await client.storage().delete({ cid });
        update(state => ({
          ...state,
          files: state.files.filter(file => file.cid !== cid),
        }));
        return true;
      } catch (err) {
        update(state => ({
          ...state,
          error: err instanceof Error ? err.message : 'Failed to delete file',
        }));
        return false;
      }
    },
  };
}

export const storageStore = createStorageStore();
```

---

## Related Documentation

- [SDK Overview](./index) - Getting started with the SDK
- [Quick Start](./quickstart) - Deploy your first site in 5 minutes
- [Installation Guide](./installation) - Detailed setup instructions
- [CLI Reference](/cli/commands) - Command-line interface
- [Guides](/guides/) - Tutorials and best practices
