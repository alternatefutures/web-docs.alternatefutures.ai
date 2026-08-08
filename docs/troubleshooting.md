---
description: Solutions for common issues with Alternate Futures deployments, DNS, builds, IPFS pinning, and SSL certificates.
---

# Troubleshooting

Solutions for common issues when deploying and managing sites on Alternate Futures.

## Deployment Errors

### "Command not found: acc"

The CLI is not installed or not in your PATH.

**Fix:**

```bash
# Install the CLI globally
npm install -g @alternatefutures/cli

# Verify installation
acc --version

# If still not found, check your npm global bin directory
npm config get prefix
```

If the global bin directory is not in your PATH, add it:

```bash
# macOS/Linux
export PATH="$(npm config get prefix)/bin:$PATH"

# Add to your shell profile for persistence
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc
```

### "Authentication failed" or "Invalid token"

Your session has expired or your token is incorrect.

**Fix:**

```bash
# Re-authenticate interactively
acc login

# Or verify your token
echo $AF_TOKEN

# Generate a new Personal Access Token
acc pat create --name "New Token"
```

Common causes:
- Token was copied with extra whitespace
- Token has expired
- Token does not have the required permissions
- Environment variable `AF_TOKEN` is not set

### "No files found to deploy"

The output directory is empty or does not exist.

**Fix:**

```bash
# Verify the directory exists and has files
ls -la ./dist

# Make sure you ran the build command first
npm run build

# Check your af.config.json for the correct output directory
cat af.config.json

# The CLI resolves af.config using the lookup order in
# src/utils/configuration/getConfiguration.ts
```

### "Deployment timed out"

The upload took too long, usually due to a large deployment or slow connection.

**Fix:**

```bash
# Try deploying again (network issues are often temporary)
acc services deploy

# For large deployments, check your file count and total size
du -sh ./dist
find ./dist -type f | wc -l
```

Tips for large deployments:
- Remove unnecessary files (source maps, test files, documentation)
- Optimize images before deploying
- Check for accidentally included `node_modules` or `.git` directories

### "Deployment failed: file too large"

Individual files exceed the size limit for the selected storage network.

**Fix:**

- IPFS has a per-file limit of approximately 1GB
- Compress large assets (images, videos) before deploying
- Consider using Filecoin for very large files
- Split large datasets into smaller chunks

## DNS Issues

### "Custom domain not resolving"

Your domain is not pointing to your deployment.

**Fix:**

1. Verify your DNS records are correct:

| Record Type | Name | Expected Value |
|-------------|------|----------------|
| CNAME | `www` | Your AF gateway URL |
| TXT | `_dnslink` | `dnslink=/ipfs/<your-cid>` |

2. Check DNS propagation (can take up to 48 hours):

```bash
# Check DNS records
dig your-domain.com CNAME
dig _dnslink.your-domain.com TXT

# Or use an online tool
# https://www.whatsmydns.net/
```

3. Common mistakes:
   - Using `A` record instead of `CNAME` for the domain
   - Missing the `_dnslink` prefix on the TXT record
   - DNS proxy (e.g., Cloudflare orange cloud) interfering with resolution

### "DNS_PROBE_FINISHED_NXDOMAIN"

The domain does not exist or nameservers are not configured.

**Fix:**

- Verify you own the domain and it has not expired
- Check that your domain registrar has the correct nameservers set
- If using Cloudflare, make sure the domain is active in your Cloudflare dashboard
- Wait for nameserver changes to propagate (up to 48 hours)

### "ERR_NAME_NOT_RESOLVED" after changing DNS

DNS changes have not propagated yet.

**Fix:**

- Wait 15-30 minutes for most DNS providers
- Full global propagation can take up to 48 hours
- Clear your local DNS cache:

```bash
# macOS
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches

# Windows
ipconfig /flushdns
```

### "DNSLink not updating after new deployment"

The `_dnslink` TXT record still points to the old CID.

**Fix:**

- Update the `_dnslink` TXT record with the new CID from your latest deployment
- If using IPNS, the record updates automatically (see [IPNS Records](./guides/ipns.md))
- Consider setting up IPNS for automatic DNS updates on each deployment

## Build Failures

### "Build command failed with exit code 1"

Your project's build command encountered an error.

**Fix:**

```bash
# Run the build command locally to see the full error output
npm run build

# Common fixes:
# 1. Install missing dependencies
npm install

# 2. Fix TypeScript errors
npx tsc --noEmit

# 3. Check for missing environment variables
# Some frameworks require env vars at build time
```

### "Out of memory during build"

The build process ran out of memory, common with large projects.

**Fix:**

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# For CI/CD, add this to your workflow
env:
  NODE_OPTIONS: "--max-old-space-size=4096"
```

### "Module not found" errors

A dependency is missing or not installed correctly.

**Fix:**

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# If using pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Framework-specific build issues

| Framework | Common Issue | Fix |
|-----------|-------------|-----|
| **Next.js** | Image optimization with static export | Add `images: { unoptimized: true }` to `next.config.js` |
| **Next.js** | `getServerSideProps` with static export | Replace with `getStaticProps` or client-side fetching |
| **React/Vite** | Assets not found | Set `base: './'` in `vite.config.ts` |
| **Astro** | SSR pages in static build | Remove `output: 'server'` from `astro.config.mjs` |
| **Vue** | Public path issues | Set `publicPath: './'` in `vue.config.js` |

## IPFS Pinning Issues

### "CID not found" or "504 Gateway Timeout"

The content is not pinned or the IPFS gateway cannot find it.

**Fix:**

```bash
# Verify the deployment status
acc deployments

# Re-deploy to re-pin the content
acc services deploy
```

Common causes:
- Content was unpinned (free tier has storage limits)
- Gateway is temporarily unavailable
- CID was generated but upload did not complete

### "Content loads slowly on IPFS"

First-time loads on IPFS can be slow because content needs to be discovered on the network.

**Fix:**

- Use a dedicated IPFS gateway for faster access
- Set up a [Private Gateway](./guides/gateways.md) for production sites
- Use IPNS with DNSLink for better caching
- Optimize your build output size (compress images, minify code)

### "Old content still showing after redeployment"

IPFS content is immutable. A new deployment creates a new CID, but DNS or gateway caches may still serve the old content.

**Fix:**

1. Verify the new CID is different from the old one
2. Update your `_dnslink` TXT record with the new CID
3. Clear gateway caches:

```bash
# If using a custom domain with DNSLink
dig _dnslink.your-domain.com TXT
# Verify it shows the new CID
```

4. Wait for DNS TTL to expire (check your TTL setting, lower values update faster)

### "IPFS pinning quota exceeded"

You have reached the storage limit for your plan.

**Fix:**

- Remove services that are no longer needed: `acc services delete <id>`
- Upgrade your plan for more storage
- Use Filecoin for large files (cheaper per GB)
- Check your current credit balance: `acc billing balance`

## SSL Certificate Problems

### "SSL certificate error" or "NET::ERR_CERT_AUTHORITY_INVALID"

The SSL certificate for your custom domain is not valid or not provisioned.

**Fix:**

1. Verify your DNS records are correct (SSL provisioning requires proper DNS)
2. Wait up to 24 hours for certificate provisioning after adding a custom domain
3. Make sure you are not using a self-signed certificate
4. If using Cloudflare:
   - Set SSL mode to "Full (strict)" if using AF's SSL
   - Or set to "Flexible" if Cloudflare handles SSL termination

### "Mixed content" warnings

Your site loads over HTTPS but some resources use HTTP.

**Fix:**

- Update all resource URLs to use `https://` or protocol-relative `//`
- Use relative paths for local assets (e.g., `./images/logo.png` instead of `http://...`)
- Add a Content Security Policy header to block mixed content:

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

### "SSL certificate expired"

The SSL certificate has expired and not been auto-renewed.

**Fix:**

- Verify your DNS records are still correct
- Contact support if auto-renewal failed
- Manually trigger certificate renewal through the dashboard or CLI

### "ERR_SSL_VERSION_OR_CIPHER_MISMATCH"

The client and server cannot agree on an SSL/TLS version or cipher.

**Fix:**

- This usually indicates the SSL certificate is not properly configured for your domain
- Verify your domain's A/CNAME records point to the correct AF gateway
- If using Cloudflare, ensure the SSL/TLS settings are compatible

## Getting More Help

If your issue is not listed here:

1. **Check the logs** - Run your build and deploy commands with verbose output
2. **Search existing issues** - [GitHub Issues](https://github.com/alternatefutures/alternatefutures/issues)
3. **Open a new issue** - Include your error message, CLI version (`acc --version`), and steps to reproduce
4. **Community** - Join our [Discord](https://discord.gg/alternatefutures) for real-time help

When reporting an issue, please include:
- Your operating system and Node.js version
- The AF CLI version (`acc --version`)
- The full error message and stack trace
- Steps to reproduce the problem
- Your framework and its version
