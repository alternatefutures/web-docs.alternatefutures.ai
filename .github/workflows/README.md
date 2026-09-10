# GitHub Actions Workflows

This directory contains automated workflows for the Alternate Futures documentation repository.

## How the docs ship

- **Deployment is Vercel's job.** The Vercel project is git-linked to this repo and
  deploys `main` on every push (`vercel.json`: `framework: null`, build `pnpm run build`,
  output `out/`). Vercel runs only the Next.js build, so the live site always shows the
  **committed** `content/docs/cli/commands.mdx` and `content/docs/sdk/api.mdx`.
- **These workflows regenerate and publish the references.** They regenerate the CLI/SDK
  references from the source repos, build the site, upload `out/` as an artifact, and,
  when the committed references are stale, **commit them straight to the branch** (with
  `DOCS_BOT_TOKEN`), which Vercel then deploys. If that push is refused (no token, or the
  branch rule blocks it), they open a pull request instead; the same step closes stale PRs.
- **"Merged to main is final."** Every ecosystem repo carries `.github/workflows/docs-update.yml`
  (CLI, web app, API, SDK) that sends `repository_dispatch: docs-update` to this repo on
  every push to `main` (SDK also on `develop` until its `main` is current). So a merge
  anywhere → docs rebuild → regenerated references → live site, with no clicks. Repos that
  have nothing generated yet (web app, API) still trigger a rebuild, so future generators
  need no new plumbing.

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
- `GH_PAT` secret here (read access to the private `alternate-clouds-cli`), and `GH_PAT` in
  each source repo (Contents: write on this repo) so `docs-update.yml` can dispatch
- `DOCS_BOT_TOKEN` secret here: a token that may push to `main` past the branch rule (a
  PAT, classic or fine-grained, owned by an admin or bypass actor of the rule; `enforce_admins`
  is off). The push clears the `http.https://github.com/.extraheader` credential that
  `actions/checkout` persists, otherwise it runs as `github-actions[bot]` and fails GH006. Without it the
  workflow falls back to pull requests.
- Repo setting "Allow GitHub Actions to create and approve pull requests" (enabled), for the
  fallback PR path

**Adding a new repo to the ecosystem:** copy `docs-update.yml` from any source repo, add the
`GH_PAT` secret, done. Add a generator here only if the repo has a source of truth worth a
page (candidates: GraphQL schema reference and template catalog from `alternate-clouds-api`).

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
