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

**Unpin unused content (IPFS):** there is no `acc storage` command; manage pins through the SDK.
```typescript
const items = await af.storage().list();
await af.ipfs().unpin('QmOldCID');
```

**Compress Before Upload:**
```bash
# Create compressed archive
tar -czf site.tar.gz dist/

# Deploy the project's service
acc services deploy
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

**Agent Optimization:** choose a smaller/cheaper model when full capability isn't needed — set `model` on the agent to a lighter option.

## Security Best Practices

### API Keys

```bash
# Use environment variables
export AF_TOKEN="af_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Never commit to git
echo "AF_TOKEN=*" >> .gitignore

# Rotate regularly (personal access tokens)
acc pat create --name "ci-2026-q3"
acc pat delete <old-token-id>
```

::: info
Scoped permissions and expiry flags are not yet available on `acc pat create` (it takes only `--name`).
:::

### Content Security

**Verify Content:**
```bash
# Check CID matches content
ipfs add --only-hash file.txt
# Compare with retrieved CID
```

<!-- Removed: `acc sites deploy --sign` — deployment signing is not implemented in the CLI. -->

## Reliability Best Practices

### Redundancy

**Pin on multiple services:** manage pins through the SDK (`af.ipfs()` / `af.storage()`). Provider selection at pin time is not exposed through the CLI.

<!-- Removed: `acc sites deploy --network` — there is no sites command or --network flag. -->

### Monitoring

**Check deployment health:**
```bash
# Verify accessibility via a gateway
curl -I https://gateway.ipfs.io/ipfs/QmXxx
```

<!-- Removed: `acc agents monitor`, `acc billing alert`, `acc sites check` — none of these commands exist. -->

## Development Workflow

### Local Development

```bash
# Use local IPFS node
ipfs daemon

# Deploy your staging project first
AF_PROJECT_ID=$STAGING_PROJECT_ID acc services deploy

# Test thoroughly, then deploy production
AF_PROJECT_ID=$PROD_PROJECT_ID acc services deploy
```

### CI/CD

```yaml
# .github/workflows/deploy.yml
- name: Deploy to staging
  if: github.ref == 'refs/heads/staging'
  run: acc services deploy
  env:
    AF_PROJECT_ID: ${{ secrets.AF_PROJECT_ID_STAGING }}

- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: acc services deploy
  env:
    AF_PROJECT_ID: ${{ secrets.AF_PROJECT_ID_PROD }}
```

## Content Organization

### Naming Conventions

```bash
# Name projects and services descriptively in the dashboard,
# then deploy the selected project's service:
acc services deploy
```

<!-- Removed: --name/--tags flags and `acc agents create` — not implemented in the CLI. -->

### Project Structure

```
my-project/
├── dist/              # Built static files
├── .env              # API keys (not in git!)
├── .gitignore        # Include .env
├── af.config.json    # Alternate Clouds config
└── deploy.sh         # Deployment script
```

The CLI resolves configuration in order `af.config.ts` > `af.config.js` > `af.config.json` — see [getConfiguration.ts](https://github.com/alternatefutures/alternate-clouds-cli/blob/main/src/utils/configuration/getConfiguration.ts).

## Next Steps

- [Storage Management](./storage.md) - Manage storage efficiently
- [Billing](./billing.md) - Understand costs
- [CI/CD Integration](./cicd.md) - Automate deployments
