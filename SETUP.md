# Documentation Setup Guide

This document explains the complete documentation architecture for Alternate Futures.

## Architecture Overview

The documentation is **completely separate** from the main application and consists of three repositories:

1. **`altfutures-docs`** (this repo) - VitePress documentation site
2. **`cloud-cli`** - CLI with auto-documentation generator
3. **`cloud-sdk`** - SDK with TypeDoc generator

## How It Works

### 1. Documentation Repository (`altfutures-docs`)

This repository hosts the documentation website using VitePress. It contains:

- **Hand-written guides** (`docs/guides/`) - Platform guides, tutorials, best practices
- **Auto-generated CLI docs** (`docs/cli/commands.md`) - Generated from cloud-cli
- **Auto-generated SDK docs** (`docs/sdk/api/`) - Generated from cloud-sdk using TypeDoc

### 2. CLI Repository (`cloud-cli`)

The CLI repository contains a documentation generator script:

**Location:** `cloud-cli/scripts/generate-docs.js`

**How to use:**
```bash
cd cloud-cli
pnpm docs:generate
```

**What it does:**
- Introspects all CLI commands
- Extracts command names, descriptions, options
- Generates markdown documentation
- Outputs to `../altfutures-docs/docs/cli/commands.md`

### 3. SDK Repository (`cloud-sdk`)

The SDK repository uses TypeDoc to generate API documentation:

**Location:** `cloud-sdk/scripts/generate-docs.js`
**Config:** `cloud-sdk/typedoc.json`

**How to use:**
```bash
cd cloud-sdk
pnpm docs:generate
```

**What it does:**
- Runs TypeDoc on the TypeScript source
- Generates markdown API reference
- Outputs to `../altfutures-docs/docs/sdk/api/`

## Development Workflow

### Local Development

1. **Clone all three repositories as siblings:**
   ```
   Projects/alternatefutures/
   ├── altfutures-docs/
   ├── cloud-cli/
   └── cloud-sdk/
   ```

2. **Start the docs dev server:**
   ```bash
   cd altfutures-docs
   pnpm install
   pnpm docs:dev
   ```

3. **When CLI or SDK changes, regenerate docs:**
   ```bash
   # From cloud-cli
   pnpm docs:generate

   # From cloud-sdk
   pnpm docs:generate

   # Or from docs repo
   pnpm generate:all
   ```

### Making Changes

#### To Update Platform Guides
Edit files in `altfutures-docs/docs/guides/` directly.

#### To Update CLI Documentation
1. Update command code in `cloud-cli/src/commands/`
2. Run `pnpm docs:generate` from cloud-cli
3. Docs are automatically updated

#### To Update SDK Documentation
1. Update JSDoc comments in `cloud-sdk/src/`
2. Run `pnpm docs:generate` from cloud-sdk
3. TypeDoc regenerates API docs

## CI/CD Pipeline

### GitHub Actions Workflow

The docs repository has a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. **Triggers on:**
   - Push to main branch
   - Manual workflow dispatch
   - Repository dispatch events from CLI/SDK repos

2. **Build process:**
   - Checks out all three repositories
   - Installs dependencies for all repos
   - Runs doc generators for CLI and SDK
   - Builds the VitePress site
   - Deploys to GitHub Pages

### Setting Up Repository Dispatch

To automatically rebuild docs when CLI or SDK changes, add this to CLI/SDK workflows:

```yaml
# In cloud-cli/.github/workflows/publish.yml
- name: Trigger docs rebuild
  if: github.ref == 'refs/heads/main'
  run: |
    curl -X POST \
      -H "Accept: application/vnd.github.v3+json" \
      -H "Authorization: token ${{ secrets.GH_PAT }}" \
      https://api.github.com/repos/alternatefutures/altfutures-docs/dispatches \
      -d '{"event_type":"docs-update"}'
```

## Deployment

### GitHub Pages (Recommended)

1. **Enable GitHub Pages** in repository settings
2. **Set source** to "GitHub Actions"
3. **Push to main** - automatic deployment

The site will be available at: `https://alternatefutures.github.io/altfutures-docs/`

### Custom Domain

To use `docs.alternatefutures.com`:

1. Add `CNAME` file to `docs/public/`:
   ```
   docs.alternatefutures.com
   ```

2. Configure DNS:
   ```
   docs.alternatefutures.com  CNAME  alternatefutures.github.io
   ```

3. Enable custom domain in GitHub Pages settings

### Alternative Deployments

#### Cloudflare Pages

```bash
pnpm build
# Upload docs/.vitepress/dist to Cloudflare Pages
```

#### Arweave (DePIN Native!)

```bash
pnpm build
cd docs/.vitepress/dist
turbo upload-folder \
  --folder-path . \
  --index-file index.html \
  --wallet-file wallet.json
```

#### Vercel/Netlify

Connect the repository and set:
- **Build command:** `pnpm build`
- **Output directory:** `docs/.vitepress/dist`

## File Structure

```
altfutures-docs/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD workflow
├── docs/
│   ├── .vitepress/
│   │   ├── config.js           # VitePress configuration
│   │   └── dist/               # Build output (gitignored)
│   ├── index.md                # Homepage
│   ├── guides/                 # Hand-written guides
│   │   ├── index.md
│   │   ├── quickstart.md
│   │   ├── authentication.md
│   │   └── ...
│   ├── cli/                    # CLI documentation
│   │   ├── index.md            # Hand-written overview
│   │   ├── installation.md
│   │   └── commands.md         # AUTO-GENERATED
│   └── sdk/                    # SDK documentation
│       ├── index.md            # Hand-written overview
│       ├── installation.md
│       ├── api.md              # Index for generated docs
│       └── api/                # AUTO-GENERATED (TypeDoc)
├── scripts/
│   ├── generate-cli-docs.js    # Fallback CLI generator
│   └── generate-sdk-docs.js    # Fallback SDK generator
├── package.json
├── README.md
└── SETUP.md                    # This file
```

## Benefits of This Approach

1. **Always Up-to-Date:** Docs regenerate from source code automatically
2. **Single Source of Truth:** Code is the source, docs follow
3. **Public & Searchable:** Docs are public, SEO-friendly, no login required
4. **Better Tooling:** VitePress provides search, navigation, themes
5. **No App Bloat:** Main app stays lightweight
6. **Community Friendly:** Easy for community to contribute
7. **Versioning:** Can maintain docs for different versions

## Maintenance

### Adding New Guides

1. Create `.md` file in `docs/guides/`
2. Add to sidebar in `docs/.vitepress/config.js`
3. Commit and push

### Updating CLI Commands

1. Update command code in cloud-cli
2. Run `pnpm docs:generate` (or let CI handle it)
3. Commit generated docs

### Updating SDK API

1. Update JSDoc/TypeScript in cloud-sdk
2. Run `pnpm docs:generate` (or let CI handle it)
3. Commit generated docs

## Troubleshooting

### Docs not updating?

```bash
# Manually regenerate everything
cd cloud-cli && pnpm docs:generate
cd cloud-sdk && pnpm docs:generate
cd altfutures-docs && pnpm docs:build
```

### TypeDoc errors?

- Ensure TypeScript compiles: `cd cloud-sdk && pnpm tsc`
- Check typedoc.json configuration
- Verify all dependencies installed

### CLI generator errors?

- Ensure cloud-cli builds: `cd cloud-cli && pnpm build`
- Check script paths in generate-docs.js
- Verify sibling directory structure

## Next Steps

1. **Install dependencies:**
   ```bash
   cd altfutures-docs && pnpm install
   cd ../cloud-cli && pnpm install
   cd ../cloud-sdk && pnpm install
   ```

2. **Generate docs:**
   ```bash
   cd altfutures-docs && pnpm generate:all
   ```

3. **Start dev server:**
   ```bash
   pnpm docs:dev
   ```

4. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial docs setup"
   git remote add origin https://github.com/alternatefutures/altfutures-docs.git
   git push -u origin main
   ```

5. **Enable GitHub Pages** in repository settings

## Questions?

See the [VitePress documentation](https://vitepress.dev) for more details on customization.
