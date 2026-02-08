---
description: Move your static sites and serverless functions from Vercel to Alternate Futures for decentralized hosting with IPFS and Arweave.
---

# Migrate from Vercel

Move your static sites from Vercel to Alternate Futures for decentralized hosting with IPFS, Filecoin, and Arweave storage options.

**Time to complete:** 15-30 minutes per site

## Why Migrate?

| Feature | Vercel | Alternate Futures |
|---------|--------|-------------------|
| **Hosting model** | Centralized (AWS) | Decentralized (IPFS/Arweave/Filecoin) |
| **Censorship resistance** | No | Yes |
| **Permanent storage** | No | Yes (Arweave) |
| **Free tier** | Limited (Hobby) | Generous free tier |
| **Vendor lock-in** | Yes (Vercel-specific features) | No (standard IPFS/web protocols) |
| **Crypto payments** | No | Yes (ETH, AR, FIL, SOL) |
| **AI agents** | No | Yes |
| **Web3 integration** | No | ENS, IPNS, wallets |

::: tip Best For
Migrating from Vercel works best for **static sites** and **static exports** (Next.js with `output: 'export'`, React SPAs, Vue, Astro, etc.). Server-side rendering (SSR) features are handled by [Cloud Functions](./functions.md).
:::

## Prerequisites

1. **An Alternate Futures account** -- [Sign up at app.alternatefutures.ai](https://app.alternatefutures.ai)
2. **Node.js 18+** installed
3. **Your project source code** (not just the Vercel deployment)

## Step 1: Install and Authenticate

```bash
# Install the Alternate Futures CLI
npm install -g @alternatefutures/cli

# Authenticate
af login
```

## Step 2: Configure Your Build

### Next.js (Static Export)

Add static export to your `next.config.js`:

```javascript
// next.config.js
const nextConfig = {
  output: 'export',    // Required for static hosting
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Recommended for IPFS compatibility
};

module.exports = nextConfig;
```

Build and deploy:

```bash
npm run build
af sites init          # Set output directory to ./out
af sites deploy
```

### React (Vite or Create React App)

```bash
npm run build
af sites init          # Set output directory to ./dist (Vite) or ./build (CRA)
af sites deploy
```

### Other Frameworks

Any framework that produces static output works. Set the correct output directory:

| Framework | Output Directory |
|-----------|-----------------|
| Next.js (export) | `./out` |
| React (Vite) | `./dist` |
| React (CRA) | `./build` |
| Vue (Vite) | `./dist` |
| Astro | `./dist` |
| SvelteKit (static) | `./build` |
| Nuxt (static) | `./.output/public` |

## Step 3: Migrate Custom Domains

### Remove Domain from Vercel

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Remove the domain (do not delete DNS records yet)

### Add Domain to Alternate Futures

```bash
# Add the domain to your site
af domains create --siteSlug my-site --hostname example.com

# Get the required DNS records
af domains detail --hostname example.com
```

### Update DNS Records

Update your DNS at your registrar:

**For subdomains:**
```
Type: CNAME
Name: www
Value: cname.alternatefutures.ai
```

**For root domains:**
```
Type: A
Name: @
Value: [IP from af domains detail]
```

```bash
# Verify DNS configuration
af domains verify --hostname example.com
```

## Step 4: Migrate CI/CD

### Replace Vercel GitHub Integration

Remove the Vercel GitHub integration and add an Alternate Futures deploy workflow:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Alternate Futures

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        run: npx @alternatefutures/cli sites deploy
        env:
          AF_TOKEN: ${{ secrets.AF_TOKEN }}
          AF_PROJECT_ID: ${{ secrets.AF_PROJECT_ID }}
```

### Add Secrets

1. Go to your GitHub repository **Settings** > **Secrets and variables** > **Actions**
2. Add `AF_TOKEN` -- your personal access token (create one with `af pat create --name "CI/CD"`)
3. Add `AF_PROJECT_ID` -- your project ID (find it with `af projects list`)

## Step 5: Migrate Environment Variables

If your Vercel project uses environment variables:

1. Note your variables from Vercel project settings
2. For build-time variables, add them to your CI/CD workflow
3. For runtime variables (API routes), configure them in your [Cloud Functions](./functions.md)

## Step 6: Remove Vercel

1. Remove the Vercel GitHub integration from your repository
2. Delete `vercel.json` from your project
3. Optionally uninstall the Vercel CLI: `npm uninstall -g vercel`
4. Delete the project from your Vercel dashboard

## Vercel Features vs Alternate Futures

| Vercel Feature | Alternate Futures Equivalent |
|----------------|------------------------------|
| Preview deployments | Every deployment gets a unique CID URL |
| Serverless functions | [Cloud Functions](./functions.md) with SGX encryption |
| Edge functions | Cloud Functions (edge deployment) |
| Analytics | [Observability & APM](./observability.md) |
| Image optimization | Build-time optimization (recommended) |
| ISR/SSR | Static export + Cloud Functions for dynamic routes |
| Cron jobs | Cloud Functions with external scheduling |

## Next Steps

- **[Deploying Sites](./sites.md)** -- Learn about storage networks and deployment options
- **[Cloud Functions](./functions.md)** -- Replace Vercel serverless functions
- **[CI/CD Integration](./cicd.md)** -- Advanced CI/CD patterns
- **[Custom Domains](./custom-domains.md)** -- Full domain configuration guide
