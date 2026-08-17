---
description: Create dedicated IPFS gateways with custom domains for fast, reliable access to your decentralized content on Alternate Futures.
---

# Private Gateways

A private gateway is a dedicated IPFS endpoint you own and map to a custom domain, giving your users fast, branded access to content you store on Alternate Clouds. Gateways are managed through the SDK today.

## What are Private Gateways?

Private Gateways are dedicated IPFS gateway endpoints you own and manage. Each gateway has a `name`, a `slug`, and an associated DNS `zone`, and can be mapped to a custom domain for branded access to your IPFS content.

> **What this maps to in code:** the gateway fields exposed by the API are defined on the [PrivateGateway GraphQL type](https://github.com/alternatefutures/alternate-clouds-api/blob/main/src/schema/typeDefs.ts) (`name`, `slug`, `zone`).

## Why Use Private Gateways?

### Public Gateways vs Private Gateways

**Public Gateways:**
- Shared infrastructure
- Rate limited
- Generic domains (ipfs.io, dweb.link)
- Best for: Testing, public content

**Private Gateways:**
- Dedicated resources
- No rate limits
- Custom domains
- Enhanced security
- Best for: Production applications, branded experiences

## Creating a Private Gateway

Gateways are managed through the SDK (`af.privateGateways()`); there is no `acc gateways` CLI command.

```typescript
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: '<your-project-id>',
  }),
});

// Create a private gateway
const gateway = await af.privateGateways().create({
  name: 'My Gateway',
  zoneId: 'zone-id', // DNS zone for your domain
});

console.log('Gateway created:', gateway.name);
console.log('Gateway slug:', gateway.slug);
```

> **What this maps to in code:** the [AlternateFuturesSdk constructor](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/AlternateFuturesSdk.ts) requires `accessTokenService` and exposes the `privateGateways()` accessor; the [PrivateGatewayClient](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/clients/privateGateway.ts) implements `create({ name, zoneId })`, `list()`, `get({ id })`, `getBySlug({ slug })`, `update({ id, name })`, and `delete({ id })`.

## Listing Gateways

```typescript
// List all gateways
const gateways = await af.privateGateways().list();

gateways.forEach(gw => {
  console.log(`${gw.name} (${gw.slug})`);
  console.log(`Zone: ${gw.zone.id}`);
});
```

## Viewing Gateway Details

```typescript
// Get gateway by ID
const gateway = await af.privateGateways().get({ id: 'gateway-id' });

console.log('Name:', gateway.name);
console.log('Slug:', gateway.slug);
console.log('Created:', gateway.createdAt);

// Get gateway by slug
const gatewayBySlug = await af.privateGateways().getBySlug({
  slug: 'my-gateway'
});
```

## Updating a Gateway

```typescript
// Update gateway
await af.privateGateways().update({
  id: 'gateway-id',
  name: 'Updated Gateway Name'
});
```

## Deleting a Gateway

```typescript
// Delete a gateway
await af.privateGateways().delete({ id: 'gateway-id' });
```

## Setting Up Custom Domain

After creating a gateway, configure a custom domain:

### 1. Add DNS Records

Add a CNAME record pointing to your gateway:

```
Type: CNAME
Name: gateway (or @)
Value: <gateway-slug>.<gateway-domain>
TTL: 3600
```

> The canonical gateway domain is not yet finalized in the published tooling, and this guide and storage.md currently disagree (`af-gateway.app` vs `af-gateways.app`). Confirm the correct host before configuring DNS.

### 2. Create the Domain in Alternate Clouds

Domain management is available through the SDK (`af.domains()`); there is no `acc domains` CLI command. Create the domain against your gateway with the domains client.

### 3. Verify the Domain

Verify the domain through the same `af.domains()` client. See the domains client for the exact method signatures.

## Accessing Content Through Gateway

Once configured, access your IPFS content via:

### By CID
```
https://gateway.yourdomain.com/ipfs/<CID>
```

### By IPNS
```
https://gateway.yourdomain.com/ipns/<IPNS-NAME>
```

### With Path
```
https://gateway.yourdomain.com/ipfs/<CID>/path/to/file.html
```

## Roadmap

::: warning Planned, not yet configurable
The API today exposes only a gateway's `name`, `slug`, and `zone` (create/list/get/update/delete). The capabilities below — edge caching and invalidation, custom TTL and headers, access control (IP allowlist, token auth, geo-blocking, rate limiting), compression, image optimization, DDoS protection, analytics, and uptime SLAs — are on the roadmap and are not configurable through the CLI, SDK, or API yet. Do not rely on them in production.
:::

### Caching Strategy (planned)

- **Edge Caching** - Content cached at CDN edge nodes globally
- **Smart Invalidation** - Automatic cache updates for new versions
- **Custom TTL** - Configure cache duration per content type

### Custom Headers

Configure custom headers for your gateway:

```javascript
// Example: Configure CORS headers
{
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD',
  'Cache-Control': 'public, max-age=31536000',
  'X-Content-Type-Options': 'nosniff'
}
```

### Access Control

Restrict access to your gateway:

- **IP Allowlist** - Only allow specific IP addresses
- **Token Authentication** - Require authentication tokens
- **Geo-Blocking** - Restrict by geographic location
- **Rate Limiting** - Custom rate limits per user/IP

## Use Cases

### E-Commerce Site

```
- Gateway: shop.mystore.com
- Content: IPFS-hosted product images and assets
- Benefit: Fast, reliable asset delivery worldwide
```

### NFT Marketplace

```
- Gateway: assets.nftmarket.io
- Content: NFT images, metadata, and media
- Benefit: Decentralized, censorship-resistant hosting
```

### Video Platform

```
- Gateway: cdn.myvideos.com
- Content: Video files and thumbnails on IPFS
- Benefit: Distributed streaming, reduced bandwidth costs
```

### Documentation Site

```
- Gateway: docs.myapp.com
- Content: Documentation deployed to IPFS
- Benefit: Immutable versions, always available
```

## Performance Optimization

### 1. Enable Compression

Private gateways automatically compress content:
- Gzip compression for text files
- Brotli compression for modern browsers
- Smart compression based on content type

### 2. Image Optimization

Optimize images served through your gateway:
- WebP conversion for supported browsers
- Automatic resizing based on request
- Lazy loading support

### 4. CDN Distribution

Content is automatically distributed to edge nodes:
- 200+ global edge locations
- Automatic routing to nearest node
- DDoS protection included

## Monitoring

### Gateway Analytics

Track gateway performance:
- Request volume
- Bandwidth usage
- Cache hit rates
- Geographic distribution
- Top content (by requests)

### Performance Metrics

Monitor key metrics:
- Average response time
- P95/P99 latency
- Error rates
- Availability (uptime)

## Security

### HTTPS/TLS

All private gateways include:
- Automatic TLS certificates
- Certificate auto-renewal
- TLS 1.3 support
- HSTS (HTTP Strict Transport Security)

### DDoS Protection

Built-in DDoS protection:
- Rate limiting
- Traffic analysis
- Automatic blocking
- Custom rules

### Content Integrity

Ensure content integrity:
- Cryptographic verification of CIDs
- Immutability guarantees
- Origin authentication

## Troubleshooting

### Gateway Not Accessible

**Problem:** Cannot access gateway URL

**Solutions:**
- Verify DNS records are configured correctly
- Check domain verification status
- Ensure gateway is in active state
- Wait for DNS propagation (up to 48 hours)

### Slow Response Times

**Problem:** Gateway responds slowly

**Solutions:**
- Check if content is pinned to gateway
- Verify CDN cache is populated
- Monitor bandwidth usage
- Consider pre-warming cache for popular content

### Custom Domain Not Working

**Problem:** Custom domain shows error

**Solutions:**
- Verify CNAME record is correct
- Check domain verification in dashboard
- Ensure TLS certificate is issued
- Try accessing via default gateway URL first

## Best Practices

::: tip Best Practices
- **Use custom domains** - Professional branding and user trust
- **Enable caching** - Maximize cache hit rates for better performance
- **Monitor usage** - Track bandwidth and request patterns
- **Pin popular content** - Pre-load frequently accessed files
- **Set up alerts** - Get notified of issues or unusual traffic
- **Regular testing** - Verify gateway performance periodically
:::

## Pricing

Private gateways include:
- Dedicated infrastructure
- Unlimited bandwidth (fair use)
- Custom domain support
- CDN distribution
- DDoS protection
- 99.9% uptime SLA

## Next Steps

- [Custom Domains](./custom-domains.md) - Configure custom domains
- [Storage](./storage.md) - Manage IPFS content
- [Sites](./sites.md) - Deploy sites to IPFS
- [Best Practices](./best-practices.md) - Optimization tips
