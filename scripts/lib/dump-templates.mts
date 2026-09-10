// Runs under tsx (scripts/generate-template-docs.mjs spawns it): loads the API
// server's template registry and prints every template as JSON. Definitions
// compute values at load time (base64 defaults, shared runtimes), so executing
// the registry is the only faithful source; the registry has no dependencies
// beyond Node built-ins, so no `pnpm install` of the API repo is needed.
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const repo = process.env.AF_API_REPO;
if (!repo) {
  console.error('AF_API_REPO is not set');
  process.exit(1);
}
const mod = await import(pathToFileURL(join(repo, 'src/templates/registry.ts')).href);
process.stdout.write(JSON.stringify(mod.getAllTemplates()));
