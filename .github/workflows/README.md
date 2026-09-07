# GitHub Actions Workflows

This directory contains automated workflows for the Alternate Futures documentation repository.

## Workflows

### 1. Deploy Documentation (`af-deploy-develop|staging|production.yml` → `af-deploy-common.yml`)
Builds the Fumadocs (Next.js static export) site and deploys it with `sites deploy`.
The shared `af-deploy-common.yml` checks out `alternate-clouds-cli` and
`alternate-clouds-sdk`, regenerates the CLI/SDK references from source
(`pnpm generate:cli` / `generate:sdk`), runs `pnpm build`, and deploys `out/`.

**Triggers (per environment workflow):**
- Push to the environment branch (`develop` / `staging` / `main`)
- Manual workflow dispatch
- `repository_dispatch` type `docs-update` (sent by `alternate-clouds-cli`'s
  `npm-publish.yml` after a release) and `Release`

**Requirements:**
- `AF_API_KEY` secret (per environment) for `sites deploy`
- `GH_PAT` secret for checking out the private CLI/SDK repositories

> The old standalone `deploy.yml` was removed 2026-09-07 - it duplicated the
> production deploy on every push to main and still built VitePress.

---
## Maintenance

All workflows use the latest stable versions of actions. Dependabot is configured to keep these dependencies up to date.
