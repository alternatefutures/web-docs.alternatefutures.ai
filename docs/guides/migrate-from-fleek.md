---
description: Step-by-step guide to migrate your sites, IPFS content, domains, and CI/CD from Fleek to Alternate Futures.
---

# Migrate from Fleek

Fleek has pivoted away from Web3 hosting to focus on AI inference. If you have sites, storage, or deployments on Fleek, this guide walks you through migrating everything to Alternate Futures.

**Time to complete:** 15-30 minutes per site

## What Changes

| Feature | Fleek | Alternate Futures |
|---------|-------|-------------------|
| **CLI command** | `fleek` | `af` |
| **Package name** | `@fleekxyz/cli` | `@alternatefutures/cli` |
| **SDK package** | `@fleekxyz/sdk` | `@alternatefutures/sdk` |
| **Config file** | `fleek.json` | `af.config.json` |
| **Token env var** | `FLEEK_TOKEN` | `AF_TOKEN` |
| **Project env var** | `FLEEK_PROJECT_ID` | `AF_PROJECT_ID` |
| **IPFS support** | Yes | Yes |
| **Arweave support** | Limited | Full |
| **Filecoin support** | No | Yes |
| **AI agents** | No | Yes (Eliza, ComfyUI, custom) |
| **Observability** | No | Yes (OpenTelemetry) |

## Before You Start

1. **Export your Fleek data** before Fleek's service fully shuts down:
   - Download your deployed site files
   - Note your IPFS CIDs for any pinned content
   - Export your domain configuration
   - Save any environment variables

2. **Create an Alternate Futures account** at [app.alternatefutures.ai](https://app.alternatefutures.ai)

3. **Install the Alternate Futures CLI:**
   ```bash
   npm install -g @alternatefutures/cli
   af login
   ```

## Step 1: Migrate Your Site

### From Fleek CLI to AF CLI

If you were deploying with the Fleek CLI, the process is very similar with Alternate Futures.

**Old (Fleek):**
```bash
fleek sites init
fleek sites deploy
```

**New (Alternate Futures):**
```bash
af sites init
af sites deploy
```

The `af sites init` command creates an `af.config.json` file. If you had a `fleek.json`, here is how the configuration maps:

**Fleek config (`fleek.json`):**
```json
{
  "id": "site-id",
  "name": "my-site",
  "distDir": "./dist",
  "buildCommand": "npm run build"
}
```

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

const result = await af.ipfs().add('./dist');
```

The SDK API is largely compatible. The main changes are the import path and environment variable names.

## Step 2: Migrate IPFS Content

If you have content pinned on Fleek's IPFS infrastructure, you should re-pin it on Alternate Futures before Fleek's pinning service goes offline.

```bash
# If you have the original files, re-upload them
af storage add ./my-files

# Or upload from a directory
af ipfs add ./my-content
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

```bash
# Add your domain to your AF site
af domains create --siteSlug my-site --hostname yourdomain.com

# Verify DNS configuration
af domains verify --hostname yourdomain.com
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
  run: npx @alternatefutures/cli sites deploy
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

```bash
# Link your ENS domain to your AF site
af ens create --domain mysite.eth --siteSlug my-site

# Verify the configuration
af ens verify --domain mysite.eth
```

## Step 6: Clean Up

1. Remove the Fleek CLI: `npm uninstall -g @fleekxyz/cli`
2. Delete `fleek.json` from your projects
3. Update any documentation referencing Fleek
4. Remove Fleek environment variables from your CI/CD

## What Alternate Futures Adds

Beyond replacing Fleek's functionality, Alternate Futures provides additional features:

- **Filecoin storage** -- Cheaper long-term archival (~$0.03/GB/month)
- **AI agent deployment** -- Deploy Eliza chatbots, ComfyUI image generators
- **Observability** -- OpenTelemetry-based APM with distributed tracing
- **Cloud functions** -- Serverless edge functions with optional SGX encryption
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
