#!/usr/bin/env node
/**
 * The pages this repo generates from source repos. Single source of truth for:
 *   - the workflow's drift detection + bot commit (`node scripts/lib/generated-files.mjs`
 *     prints them space-separated),
 *   - check-cli-drift.mjs, which lints only hand-written pages.
 */
export const GENERATED_FILES = [
  'content/docs/cli/commands.mdx',
  'content/docs/sdk/api.mdx',
  'content/docs/api/queries.mdx',
  'content/docs/api/mutations.mdx',
  'content/docs/api/objects.mdx',
  'content/docs/api/inputs.mdx',
  'content/docs/api/enums.mdx',
  'content/docs/templates/catalog.mdx',
];

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  process.stdout.write(GENERATED_FILES.join(' '));
}
