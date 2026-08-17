---
description: Step-by-step guide to deploying an Astro site to decentralized infrastructure with Alternate Futures.
---

# Deploy an Astro Site

Deploy an Astro site to Alternate Clouds, the decentralized cloud platform from Alternate Futures. Astro ships static HTML by default, so its output maps directly onto IPFS-backed hosting with no server runtime required.

## Prerequisites

Before you begin, make sure you have:

- **An Alternate Clouds account** - [Sign up here](https://app.alternatefutures.ai)
- **The Alternate Clouds CLI (`acc`) installed** - `npm install -g @alternatefutures/acc`
- **Node.js 18 or later** - [Download here](https://nodejs.org/en/download)
- **An Astro project** (or create one below)

## Quick Deploy (Existing Astro Project)

If you already have an Astro project, deploy it in three commands:

```bash
# Build the production output
npm run build

# Authenticate (opens a browser)
acc login

# Deploy the service
acc services deploy
```

::: tip Output Directory
Astro outputs to `./dist` by default. Set `distDir` to `dist` in your `acc.config` so the CLI uploads the right folder.
:::

::: info What this maps to in code
The commands above are the ones the CLI actually registers — see [the CLI's actual command surface](https://github.com/alternatefutures/alternate-clouds-cli/blob/main/src/cli.ts) (`login`, `logout`, `projects`, `services`, `deployments`, `ssh`, `billing`). The deploy subcommand lives at `acc services deploy [id]`.
:::

## Step 1: Create a New Astro Project

If you do not have a project yet, start from our template or create one from scratch.

### Option A: Use the AF Template (Recommended)

```bash
# Clone the Alternate Clouds Astro template
git clone https://github.com/alternatefutures/template-cloud-astro my-astro-site
cd my-astro-site

# Install dependencies
npm install
```

### Option B: Create from Scratch

```bash
# Create a new Astro project
npm create astro@latest my-astro-site
cd my-astro-site

# Install dependencies
npm install
```

When prompted by the Astro CLI, choose your preferred template (blog, portfolio, minimal, etc.).

## Step 2: Verify Static Output

Astro generates static HTML by default, which is exactly what you need for decentralized hosting. Verify your `astro.config.mjs` is set to static output:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Static output is the default - no 'output' setting needed
  // output: 'static',  // This is the default

  // Optional: Set the site URL for canonical links and sitemap
  site: 'https://my-astro-site.com',

  // Optional: Set a base path if deploying to a subdirectory
  // base: '/my-site/',
});
```

::: warning SSR Mode
If your project uses `output: 'server'` or `output: 'hybrid'`, you will need to change it to `output: 'static'` (or remove the `output` option entirely) for decentralized hosting. Server-rendered pages require a runtime server, which is not available on static hosting.

To convert SSR pages to static:
- Replace `export const prerender = false` with `export const prerender = true` (or remove it)
- Move dynamic data fetching to client-side JavaScript
- Use `getStaticPaths()` for dynamic routes
:::

### What Works with Static Astro

| Feature | Supported | Notes |
|---------|-----------|-------|
| Static pages (`.astro`) | Yes | Full support |
| Markdown/MDX content | Yes | Full support |
| Content Collections | Yes | Full support |
| View Transitions | Yes | Client-side navigation |
| React/Vue/Svelte islands | Yes | Hydration works normally |
| `getStaticPaths()` | Yes | Dynamic routes at build time |
| Image optimization | Yes | Built-in `<Image />` component |
| CSS/Tailwind | Yes | Full support |
| SSR (`output: 'server'`) | No | Use static output instead |
| Server endpoints | No | Use external API or cloud functions |

## Step 3: Build Your Project

```bash
# Build the static output
npm run build

# Preview locally (optional)
npm run preview
```

The build output will be in the `./dist` directory.

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
  "slug": "my-astro-site",
  "buildCommand": "npm run build",
  "distDir": "dist"
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

## Using Astro Integrations

Astro's integration ecosystem works seamlessly with Alternate Futures. Here are common setups:

### Tailwind CSS

```bash
# Add Tailwind integration
npx astro add tailwind
```

No additional configuration needed for deployment.

### React Components (Islands)

```bash
# Add React integration
npx astro add react
```

Use React components as interactive islands within your Astro pages:

```astro
---
import Counter from '../components/Counter.tsx';
---

<html>
  <body>
    <h1>My Astro Site</h1>
    <!-- This React component hydrates on the client -->
    <Counter client:load />
  </body>
</html>
```

### Sitemap

```bash
# Add sitemap integration
npx astro add sitemap
```

Make sure to set the `site` property in `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://my-astro-site.com',
  integrations: [sitemap()],
});
```

## Automating Deployments with CI/CD

Deploy automatically on every push using GitHub Actions:

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

See [CI/CD Integration](./cicd.md) for more providers.

## Using the SDK

Deploy programmatically with the Alternate Futures SDK:

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
const results = await af.ipfs().addFromPath('./dist');
console.log('Deployed! CID:', results[0].cid);
```

::: info What this maps to in code
Signatures and the `UploadResult` shape (`{ cid, size, path }`) come from [the SDK IPFS client](https://github.com/alternatefutures/alternate-clouds-sdk/blob/main/src/clients/ipfs.ts): `add(file: IpfsFile)` for a single file, `addFromPath(path)` for a directory.
:::

## Common Issues

### "Build fails with 'Cannot use import statement outside a module'"

Make sure your `package.json` includes `"type": "module"` (Astro requires ESM).

### "Images not loading after deployment"

- Use Astro's built-in `<Image />` component for optimized images
- Make sure image paths are relative, not absolute
- If using `public/` folder images, reference them with a leading `/`

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/hero.png';
---

<!-- Optimized image (recommended) -->
<Image src={myImage} alt="Hero image" />

<!-- Public folder image -->
<img src="/images/logo.png" alt="Logo" />
```

### "Dynamic routes return 404"

Make sure all dynamic routes use `getStaticPaths()`:

```astro
---
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<h1>{post.data.title}</h1>
```

### "Content Collections not building"

- Verify your content is in the `src/content/` directory
- Check that `src/content/config.ts` defines your collections correctly
- Run `astro check` to validate your project

### "Build output is unexpectedly large"

- Use `astro build --verbose` to see what is being included
- Remove unused integrations
- Optimize images before adding them to your project
- Use Astro's built-in image optimization

## Next Steps

- [Custom Domains](./custom-domains.md) - Connect your own domain
- [CI/CD Integration](./cicd.md) - Automate deployments
- [Storage Management](./storage.md) - Choose the right storage network
- [Deploy Next.js](./deploy-nextjs.md) - Deploy a Next.js app
- [Deploy React](./deploy-react.md) - Deploy a React/Vite app
