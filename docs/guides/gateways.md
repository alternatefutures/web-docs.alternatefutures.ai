---
description: Create dedicated IPFS gateways with custom domains for fast, reliable access to your decentralized content on Alternate Futures.
---

# Private Gateways

Create dedicated IPFS gateways with custom domains for fast, reliable access to your decentralized content.

## What are Private Gateways?

Private Gateways are dedicated IPFS gateway infrastructure that provides:

- **Custom Domains** - Access content via your own domain
- **Enhanced Performance** - Dedicated resources for faster loading
- **CDN Integration** - Global edge caching
- **Access Control** - Restrict who can access your content
- **Custom Configuration** - Configure caching, headers, and more

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

::: code-group

```bash [CLI]
# Create a new private gateway
acc gateways create

# You'll be prompted for:
# - Gateway name
# - Zone/Domain to use
```

```typescript [SDK]
import { AlternateFuturesSdk } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  personalAccessToken: process.env.AF_TOKEN
});

// Create a private gateway
const gateway = await af.privateGateway().create({
  name: 'My Gateway',
  zoneId: 'zone-id' // DNS zone for your domain
});

console.log('Gateway created:', gateway.name);
console.log('Gateway slug:', gateway.slug);
```

:::

## Listing Gateways

::: code-group

```bash [CLI]
# List all private gateways
acc gateways list
```

```typescript [SDK]
// List all gateways
const gateways = await af.privateGateway().list();

gateways.forEach(gw => {
  console.log(`${gw.name} (${gw.slug})`);
  console.log(`Zone: ${gw.zone.id}`);
});
```

:::

## Viewing Gateway Details

::: code-group

```bash [CLI]
# Get details for a specific gateway
acc gateways detail

# You'll be prompted to select the gateway
```

```typescript [SDK]
// Get gateway by ID
const gateway = await af.privateGateway().get({ id: 'gateway-id' });

console.log('Name:', gateway.name);
console.log('Slug:', gateway.slug);
console.log('Created:', gateway.createdAt);

// Get gateway by slug
const gatewayBySlug = await af.privateGateway().getBySlug({
  slug: 'my-gateway'
});
```

:::

## Updating a Gateway

::: code-group

```bash [CLI]
# Update gateway configuration
acc gateways update

# You'll be prompted to:
# 1. Select the gateway
# 2. Enter new name
```

```typescript [SDK]
// Update gateway
await af.privateGateway().update({
  id: 'gateway-id',
  name: 'Updated Gateway Name'
});
```

:::

## Deleting a Gateway

::: code-group

```bash [CLI]
# Delete a gateway
acc gateways delete

# You'll be prompted to select which gateway to delete
```

```typescript [SDK]
// Delete a gateway
await af.privateGateway().delete({ id: 'gateway-id' });
```

:::

## Setting Up Custom Domain

After creating a gateway, configure a custom domain:

### 1. Add DNS Records

Add a CNAME record pointing to your gateway:

```
Type: CNAME
Name: gateway (or @)
Value: <gateway-slug>.af-gateway.app
TTL: 3600
```

### 2. Create Domain in Alternate Futures

```bash
acc domains create \
  --hostname gateway.yourdomain.com \
  --gateway-id <gateway-id>
```

### 3. Verify Domain

```bash
acc domains verify --domain-id <domain-id>
```

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

## Gateway Configuration

### Caching Strategy

Private gateways automatically cache content with:

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

### 3. Preloading

Preload frequently accessed content:
```bash
# Pin content to your gateway
acc storage pin <CID> --gateway-id <gateway-id>
```

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
