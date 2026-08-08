---
description: Optimize your Alternate Futures deployments for performance, cost, and reliability with storage, caching, and security best practices.
---

# Best Practices

Optimize your Alternate Futures deployments for performance, cost, and reliability.

## Storage Optimization

### Choose the Right Network

**IPFS:**
- ✅ Frequently updated content
- ✅ Fast content delivery
- ✅ Mutable via IPNS
- ❌ Recurring monthly costs

**Filecoin:**
- ✅ Large datasets
- ✅ Long-term archival
- ✅ Lower cost than IPFS
- ❌ Slower retrieval

**Arweave:**
- ✅ Permanent, immutable content
- ✅ One-time payment
- ✅ NFT metadata, legal docs
- ❌ Higher upfront cost

### File Optimization

**Images:**
```bash
# Compress images before uploading
pngquant *.png --quality=65-80
jpegoptim --max=85 *.jpg

# Use modern formats
cwebp -q 80 image.jpg -o image.webp

# Generate responsive sizes
convert image.jpg -resize 800x image-800.jpg
```

**JavaScript/CSS:**
```bash
# Minify assets
npm run build  # Most frameworks do this automatically

# Tree-shaking (remove unused code)
# Configure in your build tool (Vite, Webpack, etc.)
```

**Enable Compression:**
```javascript
// In your build config
{
  build: {
    compress: true,  // gzip/brotli compression
    minify: true
  }
}
```

### Content Deduplication

IPFS and Filecoin use content-addressing, so identical files are stored only once:

```bash
# Same file content = same CID = no extra storage cost
echo "hello" > file1.txt
echo "hello" > file2.txt
# Both result in same CID: QmT78z...
```

## Performance Optimization

### CDN and Caching

**Use Multiple Gateways:**
```html
<!-- Primary gateway -->
<img src="https://gateway.ipfs.io/ipfs/QmXxx" />

<!-- Fallback gateways -->
<img src="https://dweb.link/ipfs/QmXxx" />
<img src="https://cloudflare-ipfs.com/ipfs/QmXxx" />
```

**Set Cache Headers:**
```javascript
// In your static site
// .htaccess or server config
<filesMatch "\\.(ico|jpg|jpeg|png|gif|webp)$">
  Header set Cache-Control "max-age=31536000, public"
</filesMatch>
```

### Asset Loading

**Lazy Loading:**
```html
<!-- Images -->
<img loading="lazy" src="image.jpg" />

<!-- JavaScript -->
<script defer src="script.js"></script>
```

**Preload Critical Resources:**
```html
<link rel="preload" href="critical.css" as="style" />
<link rel="preload" href="hero.jpg" as="image" />
```

### Framework Optimization

**SvelteKit:**
```javascript
// svelte.config.js
export default {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null,
      precompress: true  // Enables gzip/brotli
    })
  }
};
```

**Next.js:**
```javascript
// next.config.js
module.exports = {
  output: 'export',  // Static export for IPFS
  images: {
    unoptimized: true  // Required for static export
  },
  compress: true
};
```

## Cost Optimization

### Storage Costs

**Unpin Unused Content (IPFS):**
```bash
# List all pinned content
acc storage list --network ipfs --pinned

# Unpin old deployments
acc storage unpin QmOldCID
```

**Use Filecoin for Archives:**
```bash
# Move old content from IPFS to Filecoin
acc storage migrate QmXxx --from ipfs --to filecoin
```

**Compress Before Upload:**
```bash
# Create compressed archive
tar -czf site.tar.gz dist/

# Deploy compressed (auto-extracted)
acc sites deploy site.tar.gz
```

### Bandwidth Costs

**Optimize Images:**
- Use WebP format (30% smaller than JPEG)
- Serve responsive sizes
- Lazy load off-screen images

**Enable CDN Caching:**
- Use Cloudflare or similar in front of IPFS gateway
- Set long cache times for immutable content

**Avoid Unnecessary Requests:**
- Combine CSS/JS files
- Use CSS sprites for icons
- Implement service worker for offline support

### Compute Costs

**Agent Optimization:**
```javascript
// Stop agents when not needed
acc agents stop agent-id

// Start on-demand
acc agents start agent-id

// Use smaller models
{
  model: "gpt-3.5-turbo"  // vs gpt-4
}
```

## Security Best Practices

### API Keys

```bash
# Use environment variables
export AF_TOKEN="af_pat_xxx"

# Never commit to git
echo "AF_TOKEN=*" >> .gitignore

# Rotate regularly
acc api-keys create --expires 90d
acc api-keys revoke old-key-id

# Use minimal permissions
acc api-keys create --permissions agents:read,sites:write
```

### Content Security

**Verify Content:**
```bash
# Check CID matches content
ipfs add --only-hash file.txt
# Compare with retrieved CID
```

**Sign Deployments:**
```bash
# Sign with private key for verification
acc sites deploy ./dist --sign
```

## Reliability Best Practices

### Redundancy

**Pin on Multiple Services:**
```bash
# Primary pinning service
acc storage pin QmXxx --provider pinata

# Backup pinning
acc storage pin QmXxx --provider web3storage
```

**Use Multiple Networks:**
```bash
# Deploy to both IPFS and Arweave
acc sites deploy ./dist --network ipfs
acc sites deploy ./dist --network arweave
```

### Monitoring

**Set Up Alerts:**
```bash
# Monitor agent uptime
acc agents monitor agent-id --alert-email you@example.com

# Monitor bandwidth usage
acc billing alert --type bandwidth --threshold 1TB
```

**Check Deployment Health:**
```bash
# Verify site accessibility
curl -I https://gateway.ipfs.io/ipfs/QmXxx

# Check all gateways
acc sites check site-id --all-gateways
```

## Development Workflow

### Local Development

```bash
# Use local IPFS node
ipfs daemon

# Test locally before deploying
acc sites preview ./dist --local

# Deploy to staging first
acc sites deploy ./dist --name staging

# Test thoroughly, then deploy to production
acc sites deploy ./dist --name production
```

### CI/CD

```yaml
# .github/workflows/deploy.yml
- name: Deploy to staging
  if: github.ref == 'refs/heads/staging'
  run: acc sites deploy ./dist --network ipfs

- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: acc sites deploy ./dist --network arweave
```

## Content Organization

### Naming Conventions

```bash
# Use descriptive names
acc sites deploy ./dist --name "marketing-website-prod"
acc agents create --name "discord-bot-support"

# Include version numbers
acc sites deploy ./dist --name "app-v1.2.0"

# Use tags for organization
acc sites deploy ./dist --tags production,public
```

### Project Structure

```
my-project/
├── dist/              # Built static files
├── .env              # API keys (not in git!)
├── .gitignore        # Include .env
├── af.config.json    # Alternate Futures config
└── deploy.sh         # Deployment script
```

## Next Steps

- [Storage Management](./storage.md) - Manage storage efficiently
- [Billing](./billing.md) - Understand costs
- [CI/CD Integration](./cicd.md) - Automate deployments
