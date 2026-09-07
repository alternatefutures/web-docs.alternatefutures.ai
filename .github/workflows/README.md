# GitHub Actions Workflows

This directory contains automated workflows for the Alternate Futures documentation repository.

## How the docs ship

- **Deployment is Vercel's job.** The Vercel project is git-linked to this repo and
  deploys `main` on every push (`vercel.json`: `framework: null`, build `pnpm run build`,
  output `out/`). Vercel runs only the Next.js build, so the live site always shows the
  **committed** `content/docs/cli/commands.mdx` and `content/docs/sdk/api.mdx`.
- **These workflows are a build check + drift detector.** They regenerate the CLI/SDK
  references from the source repos, build the site, upload `out/` as an artifact, and,
  when the committed references are stale, open a pull request with the regenerated
  files. Merging that PR is what updates the live reference.

## Workflows

### 1. Docs build (`af-deploy-develop|staging|production.yml` → `af-deploy-common.yml`)
The shared `af-deploy-common.yml` checks out `alternate-clouds-cli` (`main`, private) and
`alternate-clouds-sdk` (`develop`, public), runs `pnpm generate:cli` / `generate:sdk`,
`pnpm build`, uploads `out/` (`docs-site-<environment>`, 7 days), and on drift opens or
updates the PR on branch `bot/regenerate-references-<branch>` (peter-evans/create-pull-request).

**Triggers (per environment workflow):**
- Push to the environment branch (`develop` / `staging` / `main`)
- Manual workflow dispatch
- Production only: `repository_dispatch` type `docs-update` (sent by `alternate-clouds-cli`'s
  `npm-publish.yml` after a release) and `Release`

**Requirements:**
- `GH_PAT` secret (repo scope on `alternate-clouds-cli`) for checking out the private CLI repo
- Repo setting "Allow GitHub Actions to create and approve pull requests" (enabled)
- `main` branch protection still requires the status check `Quinn-first, then Senku + Lain`
  from the disabled Review Gate, so bot PRs into `main` need an admin merge until that
  required check is removed or the gate is re-enabled

> Until 2026-09-08 the common workflow ended with `npm i -g @alternatefutures/cli && af sites deploy`.
> That package is frozen at 0.3.0 and has no `sites` command, so the step printed the CLI
> help and exited 0 without deploying anything (issue #33). The old standalone `deploy.yml`
> was removed 2026-09-07 - it duplicated the production run and still built VitePress.

### 2. Review Gate (`review-gate.yml`)
Disabled by request. The file keeps a minimal valid header (manual dispatch only) so GitHub
stops flagging a comments-only workflow on every push; the original workflow is preserved
as comments in the same file.

---
## Maintenance

Dependabot keeps action versions current. The stale-reference PR is idempotent: while
drift persists it updates the same branch; once the base branch catches up the PR is
closed and the branch deleted automatically.
