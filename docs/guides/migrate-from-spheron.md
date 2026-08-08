---
description: Step-by-step guide to migrate your sites, storage, and deployments from Spheron to Alternate Futures decentralized hosting.
---

# Migrate from Spheron

Spheron has pivoted away from Web3 hosting to focus on GPU compute and AI inference. If you still run sites, storage, or deployments there, this guide moves all of it onto Alternate Clouds — decentralized hosting from Alternate Futures across IPFS, Filecoin, and Arweave.

**Time to complete:** 15-30 minutes per site

## What Changes

| Feature | Spheron | Alternate Futures |
|---------|---------|-------------------|
| **CLI command** | `spheron` | `acc` |
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

3. **Install the Alternate Clouds CLI:**
   ```bash
   npm install -g @alternatefutures/cli
   acc login
   ```

   ::: warning CLI binary name
   Commands in this guide use `acc`. If your installed version still exposes the legacy `af` binary, update to the latest `@alternatefutures/cli` or substitute `af` for `acc`.
   :::

## Step 1: Migrate Your Site

### From Spheron Dashboard to AF CLI

Spheron used a dashboard-first workflow with Git integration. Alternate Futures provides both CLI and SDK workflows, with a web dashboard coming soon.

**Deploy with the AF CLI:**
```bash
# Navigate to your project directory
cd my-project

# Build your project (if not already built)
npm run build

# Create a service (choose a starter template when prompted)
acc services create

# Deploy it — pass the service id, or omit to pick interactively
acc services deploy [id]
```

These are the real registered commands — see [the acc CLI command set](https://github.com/alternatefutures/cloud-cli/blob/main/src/cli.ts).

If you keep an `af.config.json` in your project, here is how Spheron's configuration maps onto it:

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

> **What this maps to in code:** these fields are the [`af.config` schema](https://github.com/alternatefutures/cloud-cli/blob/main/src/utils/configuration/types.ts).

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

// Upload a directory to IPFS
const [result] = await af.ipfs().addFromPath('./dist');
console.log('CID:', result.cid.toString());
console.log('URL:', `https://ipfs.io/ipfs/${result.cid.toString()}`);
```

> **What this maps to in code:** `addFromPath` returns a `UploadResult[]` of `{ cid, size, path }` — see the [IPFS client return shape (UploadResult)](https://github.com/alternatefutures/package-cloud-sdk/blob/main/src/clients/ipfs.ts).

### Storage Protocol Mapping

If you were using specific storage protocols on Spheron, here is how they map:

| Spheron Protocol | Alternate Clouds equivalent | How to target it |
|-----------------|-----------------------------|------------------|
| `ProtocolEnum.IPFS` | IPFS (default) | Deployed by default |
| `ProtocolEnum.FILECOIN` | Filecoin | Dashboard / SDK (no CLI flag yet) |
| `ProtocolEnum.ARWEAVE` | Arweave | Dashboard / SDK (no CLI flag yet) |

::: info Storage targeting
A per-deploy `--filecoin` / `--arweave` CLI flag is not available yet. Choose the storage network from the dashboard or via the SDK.
:::

## Step 2: Migrate IPFS Content

If you have content pinned on Spheron's IPFS infrastructure, re-pin it on Alternate Futures before Spheron's pinning service goes offline.

There is no direct `acc` storage command today — re-pin through the SDK:

```typescript
const results = await af.ipfs().addFromPath('./my-content');
console.log('CID:', results[0].cid.toString());
```

Your CIDs will remain the same since IPFS content-addressing is deterministic -- the same files always produce the same CID.

### Migrate Arweave Content

Arweave content is permanently stored on-chain, so it does not need to be re-uploaded. However, you should update any URLs or gateways you use to access it:

```bash
# Your existing Arweave transaction IDs still work
# Access via any Arweave gateway:
# https://arweave.net/{TX_ID}

# Target Arweave for new content from the dashboard or SDK
# (no per-deploy CLI flag yet)
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

::: info Where to configure domains
Add custom domains from the [Alternate Clouds dashboard](https://app.alternatefutures.ai) (a CLI `domains` command is not yet available). The dashboard shows the exact DNS records to set at your registrar.
:::

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
Value: [Platform IP shown in the dashboard]
TTL: 3600
```

The dashboard reports verification status once your DNS records propagate.

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
        run: npx @alternatefutures/cli services deploy
        env:
          AF_TOKEN: ${{ secrets.AF_TOKEN }}
          AF_PROJECT_ID: ${{ secrets.AF_PROJECT_ID }}
```

### Add Secrets

1. Go to your GitHub repository **Settings** > **Secrets and variables** > **Actions**
2. Add `AF_TOKEN` -- your personal access token (create one with [`acc pat create`](https://github.com/alternatefutures/cloud-cli/blob/main/src/commands/pat/index.ts) `--name "CI/CD"`)
3. Add `AF_PROJECT_ID` -- your project ID (find it with `acc projects list`)

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
- **Cloud functions** -- Serverless functions (confidential-compute options where available)
- **Observability** -- OpenTelemetry-based APM with distributed tracing, metrics, and logging
- **ENS integration** -- Full ENS domain support with `.eth` names
- **IPNS records** -- Mutable pointers for stable URLs to changing content
- **Private gateways** -- Dedicated IPFS gateways with custom domains (via the SDK)
- **Decentralized container registry** -- Self-hosted Docker registry on Akash
- **Multi-method auth** -- Email, social OAuth, Web3 wallets (SIWE)

## Spheron Features vs Alternate Futures

| Spheron Feature | Alternate Futures Equivalent |
|-----------------|------------------------------|
| Dashboard deployments | CLI + SDK (web dashboard coming soon) |
| GitHub auto-deploy | [CI/CD Integration](./cicd.md) with GitHub Actions |
| IPFS pinning | Built-in IPFS pinning (SDK `af.ipfs().addFromPath()`) |
| Arweave uploads | Arweave storage (dashboard / SDK) |
| Filecoin storage | Filecoin storage (dashboard / SDK) |
| Custom domains | [Custom Domains](./custom-domains.md) with SSL |
| Preview deployments | Each deployment is content-addressed on IPFS |
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
