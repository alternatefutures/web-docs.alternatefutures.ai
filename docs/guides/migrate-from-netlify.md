---
description: Move your static sites, serverless functions, and custom domains from Netlify to Alternate Futures for decentralized hosting.
---

# Migrate from Netlify

Move your static sites from Netlify onto Alternate Clouds — decentralized hosting from Alternate Futures with IPFS, Filecoin, and Arweave storage.

**Time to complete:** 15-30 minutes per site

## Why Migrate?

| Feature | Netlify | Alternate Futures |
|---------|---------|-------------------|
| **Hosting model** | Centralized (AWS) | Decentralized (IPFS/Arweave/Filecoin) |
| **Censorship resistance** | No | Yes |
| **Permanent storage** | No | Yes (Arweave) |
| **Pricing model** | Credit-based (usage metering) | Transparent per-network pricing |
| **Vendor lock-in** | Yes (Netlify-specific features) | No (standard IPFS/web protocols) |
| **Crypto payments** | No | Yes (ETH, AR, FIL, SOL) |
| **AI agents** | No | Yes |
| **Web3 integration** | No | ENS, IPNS, wallets |

::: tip Best For
Migrating from Netlify works best for **static sites** and **JAMstack apps** (Next.js static export, Gatsby, Hugo, Astro, etc.). Server-side rendering and Netlify Functions can be replaced with [Cloud Functions](./functions.md).
:::

## Prerequisites

1. **An Alternate Futures account** -- [Sign up at app.alternatefutures.ai](https://app.alternatefutures.ai)
2. **Node.js 18+** installed
3. **Your project source code** (not just the Netlify deployment)

## Step 1: Install and Authenticate

```bash
# Install the Alternate Clouds CLI
npm install -g @alternatefutures/cli

# Authenticate
acc login
```

::: warning CLI binary name
Commands here use `acc`. If your installed version still exposes the legacy `af` binary, update to the latest `@alternatefutures/cli` or substitute `af` for `acc`.
:::

## Step 2: Update Your Configuration

### Remove Netlify Config

Netlify uses `netlify.toml` for configuration. You will replace this with `af.config.json`.

**Old (`netlify.toml`):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**New (`af.config.json`):**
```json
{
  "sites": [
    {
      "slug": "my-site",
      "distDir": "./dist",
      "buildCommand": "npm run build"
    }
  ]
}
```

> **What this maps to in code:** these fields are the [`af.config` schema](https://github.com/alternatefutures/cloud-cli/blob/main/src/utils/configuration/types.ts).

::: info SPA Redirects
Netlify's `_redirects` file and redirect rules in `netlify.toml` are specific to Netlify. For single-page apps on IPFS, ensure your build produces a `200.html` or `index.html` fallback. Most SPA frameworks handle this automatically.
:::

### Configure Your Build

Build and deploy your site:

```bash
npm run build

# Create a service (choose a starter template when prompted)
acc services create

# Deploy it — pass the service id, or omit to pick interactively
acc services deploy [id]
```

These are the real registered commands — see [the acc CLI command set](https://github.com/alternatefutures/cloud-cli/blob/main/src/cli.ts).

### Framework Output Directories

| Framework | Output Directory | Notes |
|-----------|-----------------|-------|
| Next.js (export) | `./out` | Requires `output: 'export'` in `next.config.js` |
| Gatsby | `./public` | Works as-is |
| React (Vite) | `./dist` | Works as-is |
| React (CRA) | `./build` | Works as-is |
| Vue (Vite) | `./dist` | Works as-is |
| Astro | `./dist` | Works as-is |
| Hugo | `./public` | Works as-is |
| SvelteKit (static) | `./build` | Requires `@sveltejs/adapter-static` |
| Nuxt (static) | `./.output/public` | Requires `nuxi generate` |
| Eleventy | `./_site` | Works as-is |

## Step 3: Migrate Netlify Functions

If you use Netlify Functions, replace them with Alternate Futures [Cloud Functions](./functions.md).

**Old (Netlify Function in `netlify/functions/hello.js`):**
```javascript
export const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Netlify' }),
  };
};
```

**New (AF Cloud Function):**
```javascript
export const main = (params) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Alternate Futures' }),
  };
};
```

Deploy functions from the [Alternate Clouds dashboard](https://app.alternatefutures.ai) or the SDK functions client — there is no `acc functions` command yet.

See the [Cloud Functions guide](./functions.md) for full details on function deployment and environment variables.

## Step 4: Migrate Custom Domains

### Remove Domain from Netlify

1. Go to your Netlify site settings
2. Navigate to **Domain management**
3. Remove the custom domain (do not delete DNS records yet)

### Add Domain to Alternate Futures

::: info Where to configure domains
Add custom domains from the [Alternate Clouds dashboard](https://app.alternatefutures.ai) (a CLI `domains` command is not yet available). The dashboard shows the exact DNS records to set at your registrar.
:::

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
Value: [IP shown in the dashboard]
```

The dashboard reports verification status once your DNS records propagate.

::: warning Netlify DNS Users
If you used Netlify DNS as your nameserver, you will need to either migrate your nameservers to another provider (Cloudflare, Google DNS, etc.) or update records at Netlify DNS to point to Alternate Futures. We recommend migrating to a dedicated DNS provider for more control.
:::

## Step 5: Migrate CI/CD

### Replace Netlify Build Integration

Remove the Netlify GitHub integration and add an Alternate Futures deploy workflow.

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
        run: npx @alternatefutures/cli services deploy
        env:
          AF_TOKEN: ${{ secrets.AF_TOKEN }}
          AF_PROJECT_ID: ${{ secrets.AF_PROJECT_ID }}
```

### Add Secrets

1. Go to your GitHub repository **Settings** > **Secrets and variables** > **Actions**
2. Add `AF_TOKEN` -- your personal access token (create one with [`acc pat create`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/pat/index.ts) `--name "CI/CD"`)
3. Add `AF_PROJECT_ID` -- your project ID (find it with `acc projects list`)

## Step 6: Migrate Environment Variables

If your Netlify project uses environment variables:

1. Export your variables from **Netlify** > **Site settings** > **Environment variables**
2. For build-time variables, add them to your CI/CD workflow:
   ```yaml
   - name: Build
     run: npm run build
     env:
       NEXT_PUBLIC_API_URL: ${{ vars.NEXT_PUBLIC_API_URL }}
       GATSBY_API_KEY: ${{ secrets.GATSBY_API_KEY }}
   ```
3. For runtime variables (functions), configure them in your [Cloud Functions](./functions.md)

## Step 7: Remove Netlify

1. Remove the Netlify GitHub integration from your repository
2. Delete `netlify.toml` from your project
3. Delete the `netlify/` functions directory (if migrated to AF Cloud Functions)
4. Remove `_redirects` and `_headers` files (if present)
5. Optionally uninstall the Netlify CLI: `npm uninstall -g netlify-cli`
6. Delete the site from your Netlify dashboard

## Netlify Features vs Alternate Futures

| Netlify Feature | Alternate Futures Equivalent |
|-----------------|------------------------------|
| Deploy previews | Each deployment is content-addressed on IPFS |
| Netlify Functions | [Cloud Functions](./functions.md) (confidential-compute options where available) |
| Edge Functions | [Cloud Functions](./functions.md) |
| Netlify Analytics | [Observability & APM](./observability.md) |
| Forms | Cloud Functions with form handling |
| Identity | [Authentication](./authentication.md) with multi-method support |
| Large Media | [Storage Management](./storage.md) on IPFS/Filecoin |
| Split testing | Multiple content-addressed deployments |
| `_redirects` / `_headers` | Build-time configuration (framework-level) |

## Troubleshooting

### SPA routing returns 404

On IPFS, there is no server to handle redirects. Ensure your SPA framework generates a `200.html` or that your `index.html` handles client-side routing. Most modern frameworks (React Router, Vue Router) handle this correctly in production builds.

### Build fails during deployment

Verify that:
1. Your `buildCommand` in `af.config.json` matches what Netlify used
2. Your `distDir` points to the correct output directory
3. All required environment variables are set in your CI/CD workflow
4. You are not relying on Netlify-specific build plugins

### DNS not resolving after migration

DNS propagation can take up to 48 hours. Check propagation status:
```bash
dig yourdomain.com +trace
```

If using Cloudflare, set the record to "DNS Only" (grey cloud) during migration, then switch to "Proxied" after verification.

## Next Steps

- **[Deploying Sites](./sites.md)** -- Learn about storage networks and deployment options
- **[Cloud Functions](./functions.md)** -- Replace Netlify Functions
- **[CI/CD Integration](./cicd.md)** -- Advanced CI/CD patterns
- **[Custom Domains](./custom-domains.md)** -- Full domain configuration guide
- **[Best Practices](./best-practices.md)** -- Optimize your deployments
