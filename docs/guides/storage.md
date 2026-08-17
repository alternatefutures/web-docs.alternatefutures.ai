---
description: Manage decentralized storage across IPFS, Filecoin, and Arweave with the Alternate Futures CLI and SDK.
---

# Storage Management

::: warning Web App Coming Soon
The web interface for storage management is currently in development. Use the [CLI](../cli/) or [SDK](../sdk/) to manage your decentralized storage.
:::

Manage decentralized storage across IPFS, Filecoin, and Arweave.

## Quick Start

Upload a file to decentralized storage in seconds:

Storage is managed through the SDK. (There is no `acc storage` or `acc ipfs` CLI command yet — the CLI surface is login/logout/projects/services/deployments/ssh/billing.)

```typescript
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: '<your-token>',
    projectId: '<your-project-id>',
  }),
});

// Upload a directory (accepts a filesystem path)
const dirResult = await af.storage().uploadDirectory({
  path: './my-folder',
});

console.log('Directory CID:', dirResult.pin.cid);
console.log('Size:', dirResult.pin.size);
```

> **What this maps to in code:** upload/list/get/delete are implemented in [`StorageClient`](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/clients/storage.ts); authentication uses [`PersonalAccessTokenService`](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/libs/AccessTokenService/PersonalAccessTokenService.ts). The [CLI command surface](https://github.com/alternatefutures/alternate-clouds-cli/blob/main/src/cli.ts) does not include storage commands.

## Storage Networks

### IPFS

**Content-addressed storage with pinning:**

- Files identified by CID (Content Identifier)
- Pinned via Pinata, Web3.Storage, or Lighthouse
- Fast retrieval via global gateways
- Mutable pointers via IPNS

**Pricing:** ~$0.15/GB/month

**Use cases:**
- Website hosting
- Dynamic content
- Frequently updated files

### Filecoin

**Decentralized storage marketplace:**

- Storage deals with miners
- Cryptographic proof of storage
- IPFS-compatible CIDs
- Cost-effective for large datasets

**Pricing:** ~$0.03/GB/month

**Use cases:**
- Data archival
- Backup storage
- Large file storage

### Arweave

**Permanent, immutable storage:**

- Pay once, store forever
- Blockweave data structure
- Built-in content delivery
- Immutable by design

**Pricing:** ~$6/GB one-time

**Use cases:**
- NFT metadata
- Legal documents
- Historical records
- Permanent websites

## Uploading Files

When you upload, the content is pinned to IPFS and its CID (Content Identifier) is returned. The CID is a unique hash of the file content — the same content always produces the same CID. Uploads are performed through the SDK (see below); there is no `acc storage`/`acc ipfs` CLI command yet.

### Upload via SDK

`uploadFile` takes a `FileLike` object (with a `name` and contents), not a path string. Construct one from your file contents; for a filesystem path, use `uploadDirectory({ path })`.

```typescript
import { readFile } from 'node:fs/promises';

// Upload a single file (pass a File/FileLike, not a path)
const bytes = await readFile('./report.pdf');
const fileResult = await af.storage().uploadFile({
  file: new File([bytes], 'report.pdf'),
});

console.log('File uploaded!');
console.log('CID:', fileResult.pin.cid);
console.log('Size:', fileResult.pin.size);
console.log('URL:', `https://ipfs.io/ipfs/${fileResult.pin.cid}`);

// Upload a directory (accepts a filesystem path)
const dirResult = await af.storage().uploadDirectory({
  path: './dist',
});

console.log('Directory CID:', dirResult.pin.cid);
```

## Listing Storage Items

```typescript
// List all storage items
const items = await af.storage().list();

items.forEach(item => {
  console.log(`${item.filename} (${item.cid})`);
  console.log(`  Extension: ${item.extension}`);
  if (item.arweaveId) console.log(`  Arweave: ${item.arweaveId}`);
});
```

> `list()` returns `StoragePin[]` with `cid`, `filename`, `extension`, `arweaveId`, and `filecoinDealIds`. File size and creation date are not returned by the SDK.

## Retrieving Files

```typescript
// Get storage-pin details by CID
const file = await af.storage().get({ cid: 'QmXxx...' });

console.log('Filename:', file.filename);
console.log('Extension:', file.extension);
console.log('Arweave ID:', file.arweaveId);
// Build a gateway URL from the CID:
console.log('URL:', `https://ipfs.io/ipfs/${file.cid}`);
```

> `get({ cid })` returns a `StoragePin` (`cid`, `filename`, `extension`, `arweaveId`, `filecoinDealIds`). It does not include size, network, or a URL — construct the gateway URL yourself from `cid`.

### Accessing via IPFS Gateway

Every file stored on IPFS can be accessed via a gateway URL:

```
https://ipfs.io/ipfs/<CID>
https://gateway.pinata.cloud/ipfs/<CID>
```

For faster, branded access, use a [Private Gateway](/guides/gateways):

```
https://<gateway-slug>.<gateway-domain>/ipfs/<CID>
```

> The exact gateway domain is not yet finalized in the published tooling; storage.md and gateways.md currently disagree (`af-gateways.app` vs `af-gateway.app`). Confirm the canonical host before relying on it.

## Deleting Files

```typescript
// Delete a storage item by CID
await af.storage().delete({ cid: 'QmXxx...' });
```

::: warning
Deleting a file unpins it from IPFS. The content may still be available on the network if other nodes have cached or pinned it, but it will no longer be guaranteed to be available.

Arweave content cannot be deleted -- it is permanent by design.
:::

## Pinning Management (IPFS)

### What is Pinning?

Pinning keeps content available on IPFS by ensuring at least one node stores and serves it. Without pinning, content may be garbage-collected and become unavailable.

### Pin Providers

Pinning is handled by the platform's upload service. Provider selection and pin-status reporting are not exposed through the SDK today, so treat the specifics as an infrastructure detail rather than a configurable API.

## IPNS (Mutable Pointers)

IPNS (InterPlanetary Name System) lets you create mutable pointers to IPFS content. This is useful when you want a stable URL that always points to the latest version of your content.

IPNS is available through the SDK (`af.ipns()`); there is no `acc ipns` CLI command. See the [IPNS Guide](/guides/ipns) for the SDK method signatures.

See the [IPNS Guide](/guides/ipns) for full details.

## Storage Pricing

| Network | Pricing Model | Price | Persistence |
|---------|--------------|-------|-------------|
| **IPFS** | Monthly | ~$0.15/GB/month | While pinned |
| **Filecoin** | Monthly | ~$0.03/GB/month | Contract-based |
| **Arweave** | One-time | ~$6/GB | Permanent |

### Cost Examples

- **100MB website on IPFS:** ~$0.015/month
- **1GB app on IPFS:** ~$0.15/month
- **100GB archive on Filecoin:** ~$3/month
- **100MB NFT metadata on Arweave:** ~$0.60 once (free forever after)

See [Billing](/guides/billing) for full pricing details.

## Best Practices

::: tip Storage Tips
- **Choose the right network** for your use case (see [Sites Guide](/guides/sites) for help deciding)
- **Use IPFS for dynamic content** that changes frequently
- **Use Arweave for permanent content** like NFT metadata or legal records
- **Use Filecoin for large archives** where cost is a concern
- **Unpin unused IPFS content** to reduce monthly costs
- **Back up important content** to multiple networks for redundancy
- **Use IPNS** for stable URLs that point to updating content
:::

## Troubleshooting

### Upload Fails

**Problem:** `af.storage().uploadFile()` / `uploadDirectory()` returns an error

**Solutions:**
- Confirm `uploadFile` is passed a `File`/`FileLike` (not a path string) and `uploadDirectory` a valid path
- Verify your access token and project id are set correctly
- Ensure you have sufficient storage quota
- Check file size does not exceed limits

### CID Not Resolving

**Problem:** IPFS gateway returns 404 or timeout

**Solutions:**
- Verify the content is still pinned (`af.storage().list()`)
- Try a different IPFS gateway
- Wait a few minutes for propagation on new uploads
- Check if the CID is correct (copy-paste errors are common)

### Storage Quota Exceeded

**Problem:** Cannot upload new files

**Solutions:**
- Check your credit balance: `acc billing balance`
- Delete unused files via the SDK: `af.storage().delete({ cid })`
- Upgrade your plan for more storage

## Next Steps

- [Deploying Sites](./sites.md) - Deploy sites to storage networks
- [Private Gateways](./gateways.md) - Create branded access URLs
- [IPNS Records](./ipns.md) - Mutable pointers to content
- [Billing](./billing.md) - Understand storage costs
- [CLI Commands](../cli/commands.md) - Full storage CLI reference
- [Best Practices](./best-practices.md) - Optimize storage usage
