---
description: Step-by-step guide to migrate your sites, IPFS content, domains, and CI/CD from Fleek to Alternate Futures.
---

# Migrate from Fleek

Fleek has pivoted away from Web3 hosting to focus on AI inference. If you still run sites, storage, or deployments there, this guide moves all of it onto Alternate Clouds — decentralized hosting from Alternate Futures across IPFS, Filecoin, and Arweave.

**Time to complete:** 15-30 minutes per site

## What Changes

| Feature | Fleek | Alternate Futures |
|---------|-------|-------------------|
| **CLI command** | `fleek` | `acc` |
| **Package name** | `@fleekxyz/cli` | `@alternatefutures/cli` |
| **SDK package** | `@fleekxyz/sdk` | `@alternatefutures/sdk` |
| **Config file** | `fleek.json` | `af.config.json` |
| **Token env var** | `FLEEK_TOKEN` | `AF_TOKEN` |
| **Project env var** | `FLEEK_PROJECT_ID` | `AF_PROJECT_ID` |
| **IPFS support** | Yes | Yes |
| **Arweave support** | Limited | Full |
| **Filecoin support** | No | Yes |
| **AI agents** | No | Yes (via `acc services create` templates) |
| **Observability** | No | Yes (OpenTelemetry) |

## Before You Start

1. **Export your Fleek data** before Fleek's service fully shuts down:
   - Download your deployed site files
   - Note your IPFS CIDs for any pinned content
   - Export your domain configuration
   - Save any environment variables

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

### From Fleek CLI to AF CLI

If you were deploying with the Fleek CLI, the process is very similar with Alternate Futures.

**Old (Fleek):**
```bash
fleek sites init
fleek sites deploy
```

**New (Alternate Clouds):**
```bash
# Create a service (choose a starter template when prompted)
acc services create

# Deploy it — pass the service id, or omit to pick interactively
acc services deploy [id]

# List deployments and their URLs
acc deployments
```

Deploys run through `acc services`; the full set of registered top-level commands (`login`, `logout`, `projects`, `services`, `deployments`, `billing`, `ssh`) is defined in [the acc CLI command set](https://github.com/alternatefutures/cloud-cli/blob/main/src/cli.ts).

If you keep an `af.config.json` in your project, here is how a `fleek.json` maps onto it:

**Fleek config (`fleek.json`):**
```json
{
  "id": "site-id",
  "name": "my-site",
  "distDir": "./dist",
  "buildCommand": "npm run build"
}
```

**Alternate Clouds config (`af.config.json`):**
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

> **What this maps to in code:** these fields are the [`af.config` schema (sites: slug/distDir/buildCommand)](https://github.com/alternatefutures/cloud-cli/blob/main/src/utils/configuration/types.ts).

### From Fleek SDK to AF SDK

**Old (Fleek):**
```typescript
import { FleekSdk, PersonalAccessTokenService } from '@fleekxyz/sdk/node';

const fleek = new FleekSdk({
  accessTokenService: new PersonalAccessTokenService({
    personalAccessToken: process.env.FLEEK_TOKEN,
    projectId: process.env.FLEEK_PROJECT_ID,
  }),
});

const result = await fleek.ipfs().add('./dist');
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

// Upload a directory from disk
const [result] = await af.ipfs().addFromPath('./dist');
console.log('CID:', result.cid.toString());
```

The import path and environment variable names change. Note one API difference: `af.ipfs().add()` takes an in-memory `{ path, content }` file, while `af.ipfs().addFromPath('./dist')` uploads a directory and returns a `UploadResult[]` — see the [IPFS client (add / addFromPath)](https://github.com/alternatefutures/package-cloud-sdk/blob/main/src/clients/ipfs.ts).

## Step 2: Migrate IPFS Content

If you have content pinned on Fleek's IPFS infrastructure, you should re-pin it on Alternate Futures before Fleek's pinning service goes offline.

There is no direct `acc` storage command today — re-pin through the SDK:

```typescript
// Re-upload your files; the same bytes always produce the same CID
const results = await af.ipfs().addFromPath('./my-content');
console.log('CID:', results[0].cid.toString());
```

Your CIDs will remain the same since IPFS content-addressing is deterministic -- the same files always produce the same CID.

## Step 3: Migrate Custom Domains

### Export Your DNS Configuration

Before making changes, note your current DNS records:

```bash
# Check current DNS records
dig yourdomain.com A
dig yourdomain.com CNAME
dig yourdomain.com TXT
```

### Configure Domains on Alternate Futures

::: info Where to configure domains
Custom domains are configured from the [Alternate Clouds dashboard](https://app.alternatefutures.ai) (a CLI `domains` command is not yet available). Add your hostname there, then update DNS at your registrar using the records the dashboard shows.
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

See the [Custom Domains guide](./custom-domains.md) for full details.

## Step 4: Migrate CI/CD

### GitHub Actions

**Old (Fleek):**
```yaml
- name: Deploy to Fleek
  run: npx @fleekxyz/cli sites deploy
  env:
    FLEEK_TOKEN: ${{ secrets.FLEEK_TOKEN }}
```

**New (Alternate Futures):**
```yaml
- name: Deploy to Alternate Futures
  run: npx @alternatefutures/cli services deploy
  env:
    AF_TOKEN: ${{ secrets.AF_TOKEN }}
    AF_PROJECT_ID: ${{ secrets.AF_PROJECT_ID }}
```

### Update Repository Secrets

1. Go to your repository **Settings** > **Secrets and variables** > **Actions**
2. Remove `FLEEK_TOKEN` and `FLEEK_PROJECT_ID`
3. Add `AF_TOKEN` with your Alternate Futures personal access token
4. Add `AF_PROJECT_ID` with your project ID

## Step 5: Migrate ENS Domains

If you had ENS domains linked through Fleek:

ENS linking is available through the [Alternate Clouds dashboard](https://app.alternatefutures.ai) and the SDK ENS client (there is no `acc ens` command yet). Point your `.eth` name at the site's IPFS CID or IPNS record from there.

## Step 6: Clean Up

1. Remove the Fleek CLI: `npm uninstall -g @fleekxyz/cli`
2. Delete `fleek.json` from your projects
3. Update any documentation referencing Fleek
4. Remove Fleek environment variables from your CI/CD

## What Alternate Futures Adds

Beyond replacing Fleek's functionality, Alternate Futures provides additional features:

- **Filecoin storage** -- Cost-effective long-term archival (see current pricing in the dashboard)
- **AI agent deployment** -- Deploy agents such as Eliza and ComfyUI via `acc services create` templates
- **Observability** -- OpenTelemetry-based APM with distributed tracing
- **Cloud functions** -- Serverless functions (confidential-compute options where available)
- **Decentralized container registry** -- Self-hosted Docker registry on Akash
- **Multi-method auth** -- Email, social OAuth, Web3 wallets (SIWE)

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

### DNS not resolving after migration

DNS propagation can take up to 48 hours. Check propagation status:
```bash
dig yourdomain.com +trace
```

If using Cloudflare, set the record to "DNS Only" (grey cloud) during migration, then switch to "Proxied" after verification.

## Need Help?

- **[Quick Start Guide](./quickstart.md)** -- Get started with Alternate Futures
- **[CLI Commands](../cli/commands.md)** -- Full CLI reference
- **[SDK Documentation](../sdk/)** -- Programmatic access
- **[GitHub Issues](https://github.com/alternatefutures)** -- Report issues
- **[Discord](https://discord.gg/alternatefutures)** -- Community support
