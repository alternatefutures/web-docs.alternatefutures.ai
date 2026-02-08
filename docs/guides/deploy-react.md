---
description: Step-by-step guide to deploying a React application (Vite or Create React App) to decentralized infrastructure with Alternate Futures.
---

# Deploy a React App

Deploy your React application to decentralized infrastructure using Alternate Futures. This guide covers both Vite-based and Create React App projects.

## Prerequisites

Before you begin, make sure you have:

- **An Alternate Futures account** - [Sign up here](https://app.alternatefutures.ai) (free, no credit card required)
- **The AF CLI installed** - `npm install -g @alternatefutures/cli`
- **Node.js 18 or later** - [Download here](https://nodejs.org/en/download)
- **A React project** (or we will create one below)

## Quick Deploy (Existing React Project)

If you already have a React project, deploy it in three commands:

::: code-group

```bash [Vite]
# Build the production bundle
npm run build

# Initialize AF configuration
af sites init

# Deploy to IPFS
af sites deploy
```

```bash [Create React App]
# Build the production bundle
npm run build

# Initialize AF configuration (set output directory to 'build')
af sites init

# Deploy to IPFS
af sites deploy
```

:::

::: tip Output Directory
- **Vite projects** output to `./dist` by default
- **Create React App projects** output to `./build` by default

Set the correct directory when running `af sites init`.
:::

## Step 1: Create a New React Project

If you do not have a project yet, start from our template or create one from scratch.

### Option A: Use the AF Template (Recommended)

```bash
# Clone the AF-optimized React template
git clone https://github.com/alternatefutures/template-react my-react-app
cd my-react-app

# Install dependencies
npm install
```

### Option B: Create with Vite (Recommended)

```bash
# Create a new React + Vite project
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app

# Install dependencies
npm install
```

### Option C: Create with Create React App

```bash
# Create a new CRA project
npx create-react-app my-react-app --template typescript
cd my-react-app

# Install dependencies
npm install
```

## Step 2: Configure for Deployment

### Vite Configuration

Vite projects work out of the box with Alternate Futures. No additional configuration is needed for basic deployments.

If you need a custom base path, edit `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Set base path if deploying to a subdirectory
  // base: '/my-app/',

  build: {
    // Output directory (default: 'dist')
    outDir: 'dist',

    // Generate source maps for debugging (optional)
    sourcemap: false,
  },
});
```

### Create React App Configuration

CRA projects also work out of the box. If you need a custom base path, set the `homepage` field in `package.json`:

```json
{
  "homepage": ".",
  "scripts": {
    "build": "react-scripts build"
  }
}
```

::: tip Setting `homepage` to `"."`
Setting `homepage` to `"."` ensures all asset paths are relative, which is important for IPFS deployments where your site may be served from different gateway URLs.
:::

## Step 3: Build Your Project

::: code-group

```bash [Vite]
# Build the production bundle
npm run build

# Preview locally (optional)
npm run preview
```

```bash [Create React App]
# Build the production bundle
npm run build

# Preview locally (optional)
npx serve build
```

:::

## Step 4: Authenticate with AF

If you have not already authenticated:

```bash
# Interactive login (opens browser)
af login

# Or use a Personal Access Token
export AF_TOKEN=pat_your_token_here
```

## Step 5: Initialize and Deploy

::: code-group

```bash [Vite]
# Initialize AF site configuration
af sites init

# When prompted, configure:
#   Site name: my-react-app
#   Build command: npm run build
#   Output directory: dist
#   Storage network: ipfs

# Deploy to decentralized storage
af sites deploy
```

```bash [Create React App]
# Initialize AF site configuration
af sites init

# When prompted, configure:
#   Site name: my-react-app
#   Build command: npm run build
#   Output directory: build
#   Storage network: ipfs

# Deploy to decentralized storage
af sites deploy
```

:::

You should see output like:

```
  Building site...
  Uploading files to IPFS...
  Deployment successful!
  CID: bafybei...
  URL: https://ipfs.io/ipfs/bafybei...
```

## Step 6: Handle Client-Side Routing

If your React app uses React Router (or any client-side routing), you need to handle the case where users navigate directly to a route like `/about`. On a traditional server, this would return a 404 because `/about/index.html` does not exist.

### Solution: Add a 404 Redirect

Create a `public/_redirects` file (for Vite) or a `_redirects` file in your `public/` folder (for CRA):

```
/*    /index.html   200
```

This tells the gateway to serve `index.html` for all routes, letting React Router handle the routing.

### Alternative: Use Hash Router

If redirects are not available, switch to `HashRouter`:

```tsx
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  );
}
```

Hash-based URLs (e.g., `/#/about`) work on any static server without configuration.

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

      - name: Deploy to AF
        run: npx @alternatefutures/cli sites deploy ./dist --network ipfs
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
});

// Deploy the build output
const result = await af.ipfs().add('./dist');
console.log('Deployed! CID:', result.pin.cid);
```

## Environment Variables

### Vite

Vite exposes environment variables prefixed with `VITE_` to your application:

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
```

Access them in your code:

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

### Create React App

CRA exposes variables prefixed with `REACT_APP_`:

```bash
# .env
REACT_APP_API_URL=https://api.example.com
REACT_APP_TITLE=My App
```

Access them in your code:

```tsx
const apiUrl = process.env.REACT_APP_API_URL;
```

::: warning Security
Environment variables prefixed with `VITE_` or `REACT_APP_` are embedded in your build output and visible to anyone who inspects your site. Never put secrets (API keys, tokens) in client-side environment variables.
:::

## Common Issues

### "Page not found" on route refresh

Your app uses client-side routing but the static server cannot find the route. See the [Handle Client-Side Routing](#step-6-handle-client-side-routing) section above.

### "Build output is too large"

- Enable code splitting (Vite does this automatically)
- Use `React.lazy()` for route-based code splitting
- Analyze your bundle: `npx vite-bundle-visualizer` (Vite) or `npx source-map-explorer build/static/js/*.js` (CRA)
- Remove unused dependencies

### "Assets not loading after deployment"

- Make sure `base` in `vite.config.ts` is set to `'/'` or `'./'`
- For CRA, set `"homepage": "."` in `package.json`
- Check that asset paths are relative, not absolute

### "Blank white page after deployment"

- Open the browser console for JavaScript errors
- Verify the `index.html` file references the correct bundle paths
- Try building with `npm run build` and testing locally with `npx serve dist` before deploying

## Next Steps

- [Custom Domains](./custom-domains.md) - Connect your own domain
- [CI/CD Integration](./cicd.md) - Automate deployments
- [Storage Management](./storage.md) - Choose the right storage network
- [Deploy Next.js](./deploy-nextjs.md) - Deploy a Next.js app
- [Deploy Astro](./deploy-astro.md) - Deploy an Astro site
