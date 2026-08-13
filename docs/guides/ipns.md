---
description: Create mutable pointers to IPFS content with IPNS on Alternate Futures for stable URLs that update without changing links.
---

# IPNS (InterPlanetary Name System)

Use IPNS to create mutable pointers to your IPFS content, enabling dynamic updates without changing URLs.

::: tip What this maps to in code
IPNS is managed entirely through the SDK's [`ipns.ts` client](https://github.com/alternatefutures/package-cloud-sdk/blob/main/src/clients/ipns.ts) (`createRecordForSite`, `listRecords`, `publishRecord`, `resolveName`, `deleteRecord`). The `acc` CLI does not register an `ipns` command ([cli.ts](https://github.com/alternatefutures/cloud-cli/blob/main/src/cli.ts)), so all examples below use the SDK.
:::

## What is IPNS?

IPNS (InterPlanetary Name System) is a system for creating mutable pointers to IPFS content. While IPFS content is immutable (CID changes with each update), IPNS provides:

- **Stable URLs** - Same IPNS name for all versions of your content
- **Dynamic Updates** - Update content without changing the link
- **Human-Readable Names** - Can be linked with ENS domains
- **Decentralized** - No central authority required

## How IPNS Works

```mermaid
graph LR
    A[IPNS Name] --> B[Latest CID]
    B --> C[IPFS Content v3]
    D[Old CID v2] -.-> A
    E[Old CID v1] -.-> A
```

- IPNS name stays constant: `/ipns/k51qzi5uqu5di...`
- Points to current CID: `Qm...` or `bafy...`
- Update by publishing new CID to same IPNS name
- Old versions still accessible via their CIDs

## Creating an IPNS Record

```typescript
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: process.env.AF_PROJECT_ID,
  }),
});

// Create an IPNS record for a site
const ipnsRecord = await af.ipns().createRecordForSite({
  siteId: 'site-id',
});

console.log('IPNS Name:', ipnsRecord.name);
console.log('Current Hash:', ipnsRecord.hash);
```

## Listing IPNS Records

```typescript
// List all IPNS records
const records = await af.ipns().listRecords();

records.forEach(record => {
  console.log(`Name: ${record.name}`);
  console.log(`Hash: ${record.hash}`);
  console.log(`ID: ${record.id}`);
});
```

## Publishing Updates

To point an IPNS name at newly deployed content, publish the new hash to the record:

```typescript
// Publish new content to IPNS
await af.ipns().publishRecord({
  id: 'ipns-record-id',
  hash: 'QmNewContentHash...'
});
```

## Resolving IPNS Names

Check what content an IPNS name currently points to:

```typescript
// Resolve IPNS name
const resolved = await af.ipns().resolveName({
  name: '/ipns/k51qzi5uqu5di...'
});

console.log('Current CID:', resolved);
```

## Deleting an IPNS Record

```typescript
// Delete IPNS record
await af.ipns().deleteRecord({
  id: 'ipns-record-id'
});
```

## Accessing Content via IPNS

Access your content through IPNS:

### Public IPFS Gateways
```
https://ipfs.io/ipns/<ipns-name>
https://dweb.link/ipns/<ipns-name>
https://cloudflare-ipfs.com/ipns/<ipns-name>
```

### Alternate Futures Gateway
```
https://ipfs.alternatefutures.ai/ipns/<ipns-name>
```

### Private Gateway
If you have a private gateway:
```
https://your-gateway.com/ipns/<ipns-name>
```

### ENS Integration
Link your IPNS to ENS:
```
https://yoursite.eth
https://yoursite.eth.link
https://yoursite.eth.limo
```

## Publishing a New Version

Each deployment produces a new IPFS CID. To point an existing IPNS name at that CID, publish it explicitly with the SDK:

```typescript
// After deploying and obtaining the new CID
await af.ipns().publishRecord({
  id: 'ipns-record-id',
  hash: 'QmNewContentHash...',
});
```

The flow:
1. Deploy your site, producing a new IPFS CID
2. Publish the new CID to your existing IPNS record (SDK call above)
3. The IPNS name resolves to the new CID
4. Changes propagate across the IPFS network (typically 1-2 minutes)
5. Users accessing `/ipns/<name>` see the updated content

## Use Cases

### Website Hosting

```
- Deploy: yoursite.com → IPNS → IPFS
- Update: New deployment updates IPNS automatically
- Benefit: Consistent URL, dynamic content
```

### NFT Metadata

```
- Mint NFT with IPNS URI
- Update metadata without changing token
- Benefit: Evolving NFTs, dynamic attributes
```

### Documentation

```
- Docs at /ipns/<name>
- Update docs frequently
- Benefit: Latest version always at same URL
```

### App Updates

```
- dApp hosted on IPNS
- Push updates by deploying new version
- Benefit: Users always get latest version
```

## IPNS vs Direct IPFS

| Feature | IPFS (CID) | IPNS (Name) |
|---------|-----------|-------------|
| **Mutability** | Immutable | Mutable pointer |
| **URL Changes** | Yes (new CID each update) | No (same name) |
| **Speed** | Instant | 1-2 min propagation |
| **Caching** | Aggressive | Limited |
| **Best For** | Archives, versioning | Dynamic content, sites |

## IPNS + ENS

Combine IPNS with ENS for best of both worlds:

```
yoursite.eth → IPNS Name → Latest IPFS CID
```

Benefits:
- Human-readable domain (yoursite.eth)
- Automatic updates (IPNS)
- Decentralized hosting (IPFS)
- One-time ENS setup

Setup:
1. Create IPNS record for site
2. Create ENS record pointing to IPNS
3. Set ENS content hash (one time)
4. All future updates via IPNS automatically

## Performance Considerations

### Propagation Time

IPNS updates take time to propagate:
- **Initial publish**: 1-2 minutes
- **Subsequent updates**: 30-60 seconds
- **Global propagation**: 2-5 minutes

### Caching

IPNS caching is limited compared to IPFS:
- IPFS CIDs: Cached indefinitely
- IPNS names: Short TTL (minutes)
- Impact: More network lookups for IPNS

### Optimization

Improve IPNS performance:
1. **Use private gateway** - Faster resolution
2. **Pre-warm caches** - Access content after publishing
3. **Monitor propagation** - Check resolution before announcing
4. **Combine with CDN** - Cache at application level

## Troubleshooting

### IPNS Resolution Fails

**Problem:** Cannot resolve IPNS name

**Solutions:**
- Wait 2-3 minutes for propagation
- Try different gateway
- Verify the IPNS record exists with the SDK: `af.ipns().listRecords()`
- Check network connectivity to IPFS

### Old Content Still Showing

**Problem:** IPNS shows old version

**Solutions:**
- Clear browser cache
- Wait for propagation (2-5 minutes)
- Verify the publish succeeded with the SDK: `af.ipns().resolveName({ name })`
- Try different IPFS gateway

### Slow Resolution

**Problem:** IPNS resolution takes long

**Solutions:**
- Use private gateway instead of public
- Pre-fetch content after publishing
- Consider caching layer in application
- Check IPFS daemon health

## Advanced: Custom IPNS Keys

For advanced users who want to manage their own IPNS keys:

```bash
# Generate an IPNS key locally with the IPFS CLI
ipfs key gen my-site

# Publish with your custom key
ipfs name publish --key=my-site <CID>
```

::: warning
Alternate Futures manages IPNS keys on your behalf; importing an externally generated key is not currently supported through the SDK. Use the SDK's `createRecordForSite` to have a key provisioned for you.
:::

## Best Practices

::: tip Best Practices
- **Use IPNS for sites** - Dynamic content that updates regularly
- **Use direct CIDs for archives** - Immutable content that never changes
- **Combine with ENS** - Get human-readable domains
- **Monitor propagation** - Check updates went through
- **Cache at app level** - Don't rely solely on IPFS caching
- **Set up monitoring** - Track IPNS resolution times
:::

## IPNS Name Format

IPNS names are cryptographic hashes:

```
CIDv0 (older): QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
CIDv1 (newer): k51qzi5uqu5dgy83yw82...
```

Names are derived from:
- Public key (for self-certifying names)
- Or from peer ID
- Verifiable cryptographically

## Comparison with Traditional DNS

| Feature | DNS | IPNS |
|---------|-----|------|
| **Control** | Centralized registrars | Decentralized, self-sovereign |
| **Censorship** | Possible | Resistant |
| **Cost** | Annual fees | Network costs only |
| **Speed** | Fast (<100ms) | Slower (seconds) |
| **Setup** | Domain purchase | Key generation |

## Next Steps

- [ENS Integration](./ens.md) - Link IPNS with ENS domains
- [Sites](./sites.md) - Deploy sites with IPNS
- [Private Gateways](./gateways.md) - Faster IPNS resolution
- [Storage](./storage.md) - Manage IPFS content
