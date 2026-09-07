<div align="center">
  <img src="./public/alternate-clouds-logo.svg" alt="Alternate Clouds" width="420" />
</div>

# Alternate Clouds Documentation

Documentation site for the Alternate Clouds platform (docs.alternatefutures.ai).
Built with **Fumadocs** (Next.js, static export), deployed to the platform
itself via `sites deploy`.

- **Guides** - platform usage guides and tutorials (`content/docs/guides`)
- **CLI reference** - AUTO-GENERATED from the `alternate-clouds-cli` source
  (`scripts/generate-cli-docs.mjs` → `content/docs/cli/commands.mdx`)
- **SDK reference** - AUTO-GENERATED from `alternate-clouds-sdk` via TypeDoc
  (`scripts/generate-sdk-docs.mjs` → `content/docs/sdk/api.mdx`)
- **Agent-readable** - `/llms.txt` (platform context + index), `/llms-full.txt`
  (everything), a raw-markdown endpoint per page (`/llms.mdx/<path>/content.md`),
  and a **Copy for AI** button on every page that copies the page plus the
  platform context block from `lib/agent-context.ts`. Human guide: `/ai-agents`.
- **Style guide** - `STYLE.md` (Diátaxis groups, sentence-case titles, voice,
  agent-facing rules). Read before writing a page.

## Development

```bash
pnpm install
pnpm dev                 # dev server on :3000

pnpm generate:cli        # regenerate CLI reference (needs ../alternate-clouds-cli)
pnpm generate:sdk        # regenerate SDK reference (needs ../alternate-clouds-sdk)

pnpm build               # static export to out/
```

The generators locate sibling checkouts automatically; override with
`AF_CLI_REPO` / `AF_SDK_REPO`.

## Structure

```
app/                # Next.js app (routing, layout, llms.txt endpoints)
content/docs/       # All documentation pages (MDX) + meta.json sidebars
scripts/            # CLI/SDK reference generators
public/             # Static assets (logos, icons)
```

## Deployment

Pushes to `develop`/`staging`/`main` deploy via
`.github/workflows/af-deploy-*.yml` → shared `af-deploy-common.yml`, which
checks out the CLI/SDK repos, regenerates the references, builds, and runs
`sites deploy` (currently via the legacy `af` CLI - `acc` has no `sites`
command yet).

A CLI release also triggers a docs rebuild: `alternate-clouds-cli`'s
`npm-publish.yml` sends `repository_dispatch: docs-update` to this repo.

## Rules

- Never hand-edit `content/docs/cli/commands.mdx` or `content/docs/sdk/api.mdx`
  - they are overwritten by the generators.
- The CLI binary is `acc` (`@alternatefutures/acc`). `af` is retired; pages in
  the "Legacy (retired af CLI)" sidebar section are kept for reference only.
