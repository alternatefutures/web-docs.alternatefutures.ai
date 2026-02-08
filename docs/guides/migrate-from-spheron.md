---
description: Step-by-step guide to migrate your sites, storage, and deployments from Spheron to Alternate Futures decentralized hosting.
---

# Migrate from Spheron

Spheron has pivoted away from Web3 hosting to focus on GPU compute and AI inference. If you have sites, storage, or deployments on Spheron, this guide walks you through migrating everything to Alternate Futures.

**Time to complete:** 15-30 minutes per site

## What Changes

| Feature | Spheron | Alternate Futures |
|---------|---------|-------------------|
| **CLI command** | `spheron` | `af` |
| **Package name** | `@spheron/cli` | `@alternatefutures/cli` |
| **SDK package** | `@spheron/storage` | `@alternatefutures/sdk` |
| **Config file** | `spheron.json` | `af.config.json` |
| **Token env var** | `SPHERON_TOKEN` | `AF_TOKEN` |
| **IPFS support** | Yes | Yes |
| **Arweave support** | Yes | Yes (full) |
| **Filecoin support** | Yes | Yes |
| **AI agents** | No | Yes (Eliza, ComfyUI, custom) |
| **Observability** | No | Yes (OpenTelemetry) |
| **Cloud functions** | No | Yes (SGX encryption) |
| **ENS integration** | Limited | Full |

::: tip Spheron GPU Users
If you used Spheron primarily for GPU compute, that functionality is separate from web hosting. This guide covers migrating your **web hosting, static sites, and storage**. For compute workloads, see [Cloud Functions](./functions.md) and [Managing Agents](./agents.md).
:::

## Before You Start

1. **Export your Spheron data** before Spheron's hosting services are fully discontinued:
   - Download your deployed site source files
   - Note your IPFS CIDs for any pinned content
   - Export your domain configuration and DNS records
   - Save any environment variables from your Spheron dashboard

2. **Create an Alternate Futures account** at [app.alternatefutures.ai](https://app.alternatefutures.ai)

3. **Install the Alternate Futures CLI:**
   ```bash
   npm install -g @alternatefutures/cli
   af login
   ```

## Step 1: Migrate Your Site

### From Spheron Dashboard to AF CLI

Spheron used a dashboard-first workflow with Git integration. Alternate Futures provides both CLI and SDK workflows, with a web dashboard coming soon.

**Deploy with the AF CLI:**
```bash
# Navigate to your project directory
cd my-project

# Build your project (if not already built)
npm run build

# Initialize AF configuration
af sites init

# Deploy to IPFS (default), Filecoin, or Arweave
af sites deploy
```

The `af sites init` command creates an `af.config.json` file. Here is how Spheron's configuration maps:

**Spheron config (via dashboard):**
- Framework: Auto-detected
- Build command: `npm run build`
- Output directory: `./dist`
- Protocol: IPFS / Arweave / Filecoin

**Alternate Futures config (`af.config.json`):**
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

### From Spheron SDK to AF SDK

**Old (Spheron):**
```typescript
import { SpheronClient, ProtocolEnum } from '@spheron/storage';

const client = new SpheronClient({
  token: process.env.SPHERON_TOKEN,
});

const { uploadId, bucketId, protocolLink, dynamicLinks } =
  await client.upload('./dist', {
    protocol: ProtocolEnum.IPFS,
    name: 'my-site',
  });
```

**New (Alternate Futures):**
```typescript
import { AlternateFuturesSdk, PersonalAccessTokenService } from '@alternatefutures/sdk/node';

const af = new AlternateFuturesSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.AF_TOKEN,
    projectId: process.env.AF_PROJECT_ID,
  }),
});

// Upload to IPFS
const result = await af.ipfs().add('./dist');
console.log('CID:', result.pin.cid);
console.log('URL:', `https://ipfs.io/ipfs/${result.pin.cid}`);
```

### Storage Protocol Mapping

If you were using specific storage protocols on Spheron, here is how they map:

| Spheron Protocol | AF Equivalent | CLI Flag |
|-----------------|---------------|----------|
| `ProtocolEnum.IPFS` | IPFS (default) | `af sites deploy` |
| `ProtocolEnum.FILECOIN` | Filecoin | `af sites deploy --filecoin` |
| `ProtocolEnum.ARWEAVE` | Arweave | `af sites deploy --arweave` |

## Step 2: Migrate IPFS Content

If you have content pinned on Spheron's IPFS infrastructure, re-pin it on Alternate Futures before Spheron's pinning service goes offline.

```bash
# If you have the original files, re-upload them
af storage add ./my-files

# Upload a directory to IPFS
af ipfs add ./my-content
```

Your CIDs will remain the same since IPFS content-addressing is deterministic -- the same files always produce the same CID.

### Migrate Arweave Content

Arweave content is permanently stored on-chain, so it does not need to be re-uploaded. However, you should update any URLs or gateways you use to access it:

```bash
# Your existing Arweave transaction IDs still work
# Access via any Arweave gateway:
# https://arweave.net/{TX_ID}

# Deploy new content to Arweave via AF
af sites deploy --arweave
```

## Step 3: Migrate Custom Domains

### Export Your DNS Configuration

Before making changes, note your current DNS records:

```bash
# Check current DNS records
dig yourdomain.com A
dig yourdomain.com CNAME
dig yourdomain.com TXT
```

### Remove Domain from Spheron

1. Go to your Spheron project dashboard
2. Navigate to **Domains**
3. Remove the domain (do not delete DNS records yet)

### Configure Domains on Alternate Futures

```bash
# Add your domain to your AF site
af domains create --siteSlug my-site --hostname yourdomain.com

# Get the required DNS records
af domains detail --hostname yourdomain.com
```

### Update DNS Records

Update your DNS records at your registrar to point to Alternate Futures:

**For subdomains (e.g., www.example.com):**
```
Type: CNAME
Name: www
Value: cname.alternatefutures.ai
TTL: 3600
```

**For root domains (e.g., example.com):**
```
Type: A
Name: @
Value: [Platform IP from af domains detail]
TTL: 3600
```

```bash
# Verify DNS configuration
af domains verify --hostname yourdomain.com
```

See the [Custom Domains guide](./custom-domains.md) for full details.

## Step 4: Migrate CI/CD

### Replace Spheron GitHub Integration

Spheron used a built-in GitHub integration. Replace it with an Alternate Futures deploy workflow.

Remove the Spheron GitHub integration from your repository settings, then create `.github/workflows/deploy.yml`:

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

If your Spheron project used environment variables:

1. Note your variables from the Spheron project dashboard
2. For build-time variables, add them to your CI/CD workflow:
   ```yaml
   - name: Build
     run: npm run build
     env:
       NEXT_PUBLIC_API_URL: ${{ vars.NEXT_PUBLIC_API_URL }}
   ```
3. For runtime variables, configure them in your [Cloud Functions](./functions.md)

## Step 6: Clean Up

1. Remove the Spheron CLI: `npm uninstall -g @spheron/cli`
2. Remove Spheron SDK packages: `npm uninstall @spheron/storage`
3. Delete any Spheron configuration files from your project
4. Remove Spheron environment variables from your CI/CD
5. Disconnect the Spheron GitHub integration from your repository
6. Delete the project from your Spheron dashboard

## What Alternate Futures Adds

Beyond replacing Spheron's hosting functionality, Alternate Futures provides additional features:

- **AI agent deployment** -- Deploy Eliza chatbots, ComfyUI image generators, and custom agents
- **Cloud functions** -- Serverless edge functions with optional SGX encryption
- **Observability** -- OpenTelemetry-based APM with distributed tracing, metrics, and logging
- **ENS integration** -- Full ENS domain support with `.eth` names
- **IPNS records** -- Mutable pointers for stable URLs to changing content
- **Private gateways** -- Dedicated IPFS gateways with custom domains
- **Decentralized container registry** -- Self-hosted Docker registry on Akash
- **Multi-method auth** -- Email, social OAuth, Web3 wallets (SIWE)

## Spheron Features vs Alternate Futures

| Spheron Feature | Alternate Futures Equivalent |
|-----------------|------------------------------|
| Dashboard deployments | CLI + SDK (web dashboard coming soon) |
| GitHub auto-deploy | [CI/CD Integration](./cicd.md) with GitHub Actions |
| IPFS pinning | Built-in IPFS pinning with `af storage add` |
| Arweave uploads | `af sites deploy --arweave` |
| Filecoin storage | `af sites deploy --filecoin` |
| Custom domains | [Custom Domains](./custom-domains.md) with SSL |
| Preview deployments | Every deployment gets a unique CID URL |
| Team collaboration | [Projects](./projects.md) with team management |

## Troubleshooting

### "Package not found" when installing CLI

Make sure you are installing the correct package:
```bash
npm install -g @alternatefutures/cli
```

### CIDs differ after re-uploading

If your CIDs differ after re-uploading the same content, check that:
- You are uploading the exact same files (byte-for-byte)
- Directory structure matches exactly
- No hidden files (like `.DS_Store`) were added or removed

### Build fails during deployment

If your build fails, verify:
1. Your `buildCommand` in `af.config.json` matches what you used on Spheron
2. Your `distDir` points to the correct output directory
3. All required environment variables are set

### DNS not resolving after migration

DNS propagation can take up to 48 hours. Check propagation status:
```bash
dig yourdomain.com +trace
```

If using Cloudflare, set the record to "DNS Only" (grey cloud) during migration, then switch to "Proxied" after verification.

## Next Steps

- **[Quick Start Guide](./quickstart.md)** -- Get started with Alternate Futures
- **[Deploying Sites](./sites.md)** -- Learn about storage networks and deployment options
- **[CLI Commands](../cli/commands.md)** -- Full CLI reference
- **[SDK Documentation](../sdk/)** -- Programmatic access
- **[GitHub Issues](https://github.com/alternatefutures)** -- Report issues
- **[Discord](https://discord.gg/alternatefutures)** -- Community support
