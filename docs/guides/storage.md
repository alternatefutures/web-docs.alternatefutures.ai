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

::: code-group

```bash [CLI]
# Upload a file to IPFS
acc storage add ./my-file.pdf

# Upload an entire directory
acc storage add ./my-folder

# Upload directly to IPFS (returns CID)
acc ipfs add ./my-file.pdf
```

```typescript [SDK]
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: '<your-token>',
    projectId: '<your-project-id>',
  }),
});

// Upload a file
const result = await af.storage().uploadFile({
  file: './my-file.pdf',
});

console.log('CID:', result.pin.cid);
console.log('Size:', result.pin.size);

// Upload a directory
const dirResult = await af.storage().uploadDirectory({
  path: './my-folder',
});

console.log('Directory CID:', dirResult.pin.cid);
```

:::

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

### Upload via CLI

```bash
# Upload a single file
acc storage add ./report.pdf

# Upload an entire directory
acc storage add ./build-output

# Upload directly to IPFS (lower level, returns raw CID)
acc ipfs add ./my-image.png
```

When you upload, the file is pinned to IPFS and its CID (Content Identifier) is returned. The CID is a unique hash of the file content -- the same file always produces the same CID.

### Upload via SDK

```typescript
// Upload a single file
const fileResult = await af.storage().uploadFile({
  file: './report.pdf',
});

console.log('File uploaded!');
console.log('CID:', fileResult.pin.cid);
console.log('URL:', `https://ipfs.io/ipfs/${fileResult.pin.cid}`);

// Upload a directory (e.g., a built website)
const dirResult = await af.storage().uploadDirectory({
  path: './dist',
});

console.log('Directory CID:', dirResult.pin.cid);
```

## Listing Storage Items

::: code-group

```bash [CLI]
# List all files in your project's storage
acc storage list
```

```typescript [SDK]
// List all storage items
const items = await af.storage().list();

items.forEach(item => {
  console.log(`${item.name} (${item.cid})`);
  console.log(`  Size: ${item.size}`);
  console.log(`  Created: ${item.createdAt}`);
});
```

:::

## Retrieving Files

::: code-group

```bash [CLI]
# Retrieve a file by name
acc storage get --name my-file.pdf

# Retrieve a file by CID
acc storage get --cid QmXxx...
```

```typescript [SDK]
// Get file details by CID
const file = await af.storage().get({ cid: 'QmXxx...' });

console.log('Name:', file.name);
console.log('Size:', file.size);
console.log('Network:', file.network);
console.log('URL:', file.url);
```

:::

### Accessing via IPFS Gateway

Every file stored on IPFS can be accessed via a gateway URL:

```
https://ipfs.io/ipfs/<CID>
https://gateway.pinata.cloud/ipfs/<CID>
```

For faster, branded access, use a [Private Gateway](/guides/gateways):

```
https://your-gateway.af-gateways.app/ipfs/<CID>
```

## Deleting Files

::: code-group

```bash [CLI]
# Delete a file by name
acc storage delete --name my-file.pdf

# Delete a file by CID
acc storage delete --cid QmXxx...
```

```typescript [SDK]
// Delete a storage item
await af.storage().delete({ cid: 'QmXxx...' });
```

:::

::: warning
Deleting a file unpins it from IPFS. The content may still be available on the network if other nodes have cached or pinned it, but it will no longer be guaranteed to be available.

Arweave content cannot be deleted -- it is permanent by design.
:::

## Pinning Management (IPFS)

### What is Pinning?

Pinning keeps content available on IPFS by ensuring at least one node stores and serves it. Without pinning, content may be garbage-collected and become unavailable.

### Pin Providers

We integrate with multiple pinning services for redundancy:

- **Pinata** - Fast, reliable pinning
- **Web3.Storage** - Free tier available
- **Lighthouse** - Filecoin-backed pinning

### Pin Status

- **Pinned** - Content is actively pinned and available
- **Unpinned** - Content may become unavailable
- **Pinning** - Pin operation in progress
- **Failed** - Pin operation failed (check logs)

## IPNS (Mutable Pointers)

IPNS (InterPlanetary Name System) lets you create mutable pointers to IPFS content. This is useful when you want a stable URL that always points to the latest version of your content.

```bash
# Create an IPNS record
acc ipns create --name my-website

# Publish an IPFS hash to your IPNS name
acc ipns publish --name my-website --hash QmNewHash...

# Resolve an IPNS name to its current content
acc ipns resolve k51qzi5uqu5...
```

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

**Problem:** `acc storage add` returns an error

**Solutions:**
- Check that the file path is correct
- Verify you are authenticated (`acc login`)
- Ensure you have sufficient storage quota
- Check file size does not exceed limits

### CID Not Resolving

**Problem:** IPFS gateway returns 404 or timeout

**Solutions:**
- Verify the content is still pinned (`acc storage list`)
- Try a different IPFS gateway
- Wait a few minutes for propagation on new uploads
- Check if the CID is correct (copy-paste errors are common)

### Storage Quota Exceeded

**Problem:** Cannot upload new files

**Solutions:**
- Check current usage: `acc billing usage`
- Delete unused files: `acc storage delete`
- Upgrade your plan for more storage

## Next Steps

- [Deploying Sites](./sites.md) - Deploy sites to storage networks
- [Private Gateways](./gateways.md) - Create branded access URLs
- [IPNS Records](./ipns.md) - Mutable pointers to content
- [Billing](./billing.md) - Understand storage costs
- [CLI Commands](../cli/commands.md) - Full storage CLI reference
- [Best Practices](./best-practices.md) - Optimize storage usage
