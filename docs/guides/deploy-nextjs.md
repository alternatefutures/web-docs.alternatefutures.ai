---
description: Step-by-step guide to deploying a Next.js application to decentralized infrastructure with Alternate Futures.
---

# Deploy a Next.js App

Deploy a Next.js app to Alternate Clouds, the decentralized cloud platform from Alternate Futures. Alternate Clouds serves static output, so this guide walks through configuring Next.js for static export and deploying the result.

## Prerequisites

Before you begin, make sure you have:

- **An Alternate Clouds account** - [Sign up here](https://app.alternatefutures.ai)
- **The Alternate Clouds CLI (`acc`) installed** - `npm install -g @alternatefutures/acc`
- **Node.js 18 or later** - [Download here](https://nodejs.org/en/download)
- **A Next.js project** (or create one below)

## Quick Deploy (Existing Next.js Project)

If you already have a Next.js project, deploy it in three commands:

```bash
# Build the static export
npm run build

# Authenticate (opens a browser)
acc login

# Deploy the service
acc services deploy
```

::: tip Output Directory
Next.js static export outputs to `./out` by default. Set `distDir` to `out` in your `acc.config` so the CLI uploads the right folder.
:::

::: info What this maps to in code
These are the commands the CLI actually registers — see [the CLI's actual command surface](https://github.com/alternatefutures/alternate-clouds-cli/blob/main/src/cli.ts) (`login`, `logout`, `projects`, `services`, `deployments`, `ssh`, `billing`). Deploy lives at `acc services deploy [id]`.
:::

## Step 1: Create a New Next.js Project

If you do not have a project yet, start from our template or create one from scratch.

### Option A: Use the AF Template (Recommended)

```bash
# Clone the Alternate Clouds Next.js template
git clone https://github.com/alternatefutures/template-cloud-nextjs my-nextjs-app
cd my-nextjs-app

# Install dependencies
npm install
```

### Option B: Create from Scratch

```bash
# Create a new Next.js project
npx create-next-app@latest my-nextjs-app
cd my-nextjs-app
```

## Step 2: Configure for Static Export

Alternate Futures hosts static sites on decentralized storage. Next.js needs to be configured for static export.

Edit your `next.config.js` (or `next.config.mjs`):

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // Optional: Change the output directory (default is 'out')
  // distDir: 'dist',

  // Optional: Add a trailing slash to all routes
  trailingSlash: true,

  // Optional: Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

::: warning Important
Static export does not support these Next.js features:
- Server-Side Rendering (SSR) with `getServerSideProps`
- API Routes (`/pages/api/*`)
- Middleware
- Incremental Static Regeneration (ISR)
- Image Optimization (use `unoptimized: true`)

If your app uses these features, you will need to refactor to use client-side data fetching or static generation (`getStaticProps`) instead.
:::

### What Works in Static Export

| Feature | Supported | Notes |
|---------|-----------|-------|
| Static pages | Yes | All pages render at build time |
| `getStaticProps` | Yes | Data fetched at build time |
| `getStaticPaths` | Yes | Dynamic routes with known paths |
| Client-side fetching | Yes | `useEffect`, SWR, React Query |
| CSS Modules | Yes | Full support |
| Tailwind CSS | Yes | Full support |
| Next.js App Router | Yes | With `generateStaticParams` |
| `next/image` | Partial | Set `unoptimized: true` |
| `next/link` | Yes | Client-side navigation works |
| `getServerSideProps` | No | Use `getStaticProps` instead |
| API Routes | No | Use external API or cloud functions |
| Middleware | No | Handle in client or at CDN level |

## Step 3: Build Your Project

```bash
# Build the static export
npm run build
```

This generates your static site in the `./out` directory. You can preview it locally:

```bash
# Preview the build output
npx serve out
```

## Step 4: Authenticate with Alternate Clouds

If you have not already authenticated:

```bash
# Interactive login (opens browser)
acc login

# Or use a Personal Access Token
export AF_TOKEN=pat_your_token_here
```

## Step 5: Initialize and Deploy

```bash
Set the build fields in your `acc.config`:

```json
{
  "slug": "my-nextjs-app",
  "buildCommand": "npm run build",
  "distDir": "out"
}
```

Then deploy:

```bash
# Deploy to decentralized storage
acc services deploy
```

::: info What this maps to in code
`slug`, `buildCommand`, and `distDir` are real fields in the [acc.config schema](https://github.com/alternatefutures/alternate-clouds-cli/blob/main/src/utils/configuration/types.ts).
:::

You should see output like:

```
  Building site...
  Uploading files to IPFS...
  Deployment successful!
  CID: bafybei...
  URL: https://ipfs.io/ipfs/bafybei...
```

## Step 6: Set Up a Custom Domain (Optional)

Add your domain from the [Alternate Clouds dashboard](https://app.alternatefutures.ai) under your project's Domains settings, then configure your DNS:

| Record Type | Name | Value |
|-------------|------|-------|
| CNAME | `@` | Your AF gateway URL |
| TXT | `_dnslink` | `dnslink=/ipfs/<your-cid>` |

See [Custom Domains](./custom-domains.md) for detailed DNS configuration.

## Automating Deployments with CI/CD

Deploy automatically on every push to your main branch using GitHub Actions:

```yaml
# .github/workflows/deploy.yml
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
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to Alternate Clouds
        run: npx @alternatefutures/acc services deploy
        env:
          AF_TOKEN: ${{ secrets.AF_TOKEN }}
```

See [CI/CD Integration](./cicd.md) for GitLab CI, CircleCI, and other providers.

## Using the SDK

You can also deploy programmatically with the Alternate Futures SDK:

```typescript
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: process.env.AF_PROJECT_ID,
  }),
  // Required — the SDK throws EnvNotSetError if these are unset
  ipfsStorageApiUrl: process.env.SDK__IPFS__STORAGE_API_URL,
  uploadProxyApiUrl: process.env.SDK__UPLOAD_PROXY_API_URL,
});

// Upload the build directory. addFromPath() returns an array of results.
const results = await af.ipfs().addFromPath('./out');
console.log('Deployed! CID:', results[0].cid);
```

::: info What this maps to in code
Signatures and the `UploadResult` shape (`{ cid, size, path }`) come from [the SDK IPFS client](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/clients/ipfs.ts): `add(file: IpfsFile)` for a single file, `addFromPath(path)` for a directory.
:::

## Common Issues

### "Error: Image Optimization is not compatible with `output: 'export'`"

Add `images: { unoptimized: true }` to your `next.config.js`. See Step 2 above.

### "Error: `getServerSideProps` is not supported with `output: 'export'`"

Replace `getServerSideProps` with `getStaticProps` for data that can be fetched at build time, or use client-side fetching with `useEffect` or a library like SWR:

```tsx
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Page() {
  const { data, error } = useSWR('/api/data', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{data.message}</div>;
}
```

### "Build output is empty"

- Verify `output: 'export'` is set in `next.config.js`
- Check that your build command is `next build` (not `next start`)
- Make sure the `out` directory exists after running `npm run build`

### "404 errors on page refresh"

Static exports need trailing slashes for proper routing. Add `trailingSlash: true` to your `next.config.js`.

## Next Steps

- [Custom Domains](./custom-domains.md) - Connect your own domain
- [CI/CD Integration](./cicd.md) - Automate deployments
- [Storage Management](./storage.md) - Choose the right storage network
- [Deploy React](./deploy-react.md) - Deploy a React/Vite app
- [Deploy Astro](./deploy-astro.md) - Deploy an Astro site
