#!/usr/bin/env node
/**
 * Generate the template catalog (content/docs/templates/catalog.mdx) from the
 * API server's template registry (alternate-clouds-api/src/templates).
 *
 * Details come from the source: the registry is executed
 * (scripts/lib/dump-templates.mts under tsx) rather than parsed, because
 * definitions compute values at load time.
 *
 * Visibility comes from production: the platform hides templates with feature
 * flags stored in its database (`filterAccessibleTemplates`), and neither the
 * web app nor the CLI filters by the source's `releaseStage`. So the catalog
 * lists exactly the IDs the public `templates` query returns to an anonymous
 * caller, which is what a signed-in user sees minus allowlisted ones.
 *   AF_TEMPLATES_ENDPOINT   override the endpoint (default: production)
 *   DOCS_TEMPLATES_OFFLINE=1  skip the live check and fall back to
 *                             `releaseStage !== 'internal'` (local work without network)
 *
 * Composite templates (with `components`) deploy from the web app only; the
 * CLI refuses them (alternate-clouds-cli services/create.ts), so the catalog
 * says so per template instead of printing a CLI command that fails.
 *
 * Vendor-specific fields (pricing, raw deployment manifests) are not
 * documented, and vendor names in copy are rewritten per
 * scripts/lib/provider-scrub.mjs.
 *
 * API repo location: AF_API_REPO, else ../alternate-clouds-api, else ./alternate-clouds-api.
 */
import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { assertNoProviders, isProviderTerm, scrubProviders, tidyCopy } from './lib/provider-scrub.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const OUTPUT = join(REPO_ROOT, 'content/docs/templates/catalog.mdx');
const ENDPOINT = process.env.AF_TEMPLATES_ENDPOINT ?? 'https://api.alternatefutures.ai/graphql';

const API_REPO = [
  process.env.AF_API_REPO,
  resolve(REPO_ROOT, '../alternate-clouds-api'),
  resolve(REPO_ROOT, 'alternate-clouds-api'),
]
  .filter(Boolean)
  .find((p) => existsSync(join(p, 'src/templates/registry.ts')));
if (!API_REPO) {
  console.error('❌ alternate-clouds-api repo not found. Set AF_API_REPO or clone it as a sibling.');
  process.exit(1);
}
const pkg = JSON.parse(readFileSync(join(API_REPO, 'package.json'), 'utf8'));

// ── Details from the source registry ─────────────────────────────────────────
const tsx = join(REPO_ROOT, 'node_modules/.bin/tsx');
const dump = spawnSync(tsx, [join(__dirname, 'lib/dump-templates.mts')], {
  env: { ...process.env, AF_API_REPO: API_REPO },
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});
if (dump.status !== 0) {
  console.error(`❌ could not load the template registry:\n${dump.stderr}`);
  process.exit(1);
}
const all = JSON.parse(dump.stdout);

// ── Visibility from production ───────────────────────────────────────────────
let liveIds = null;
if (process.env.DOCS_TEMPLATES_OFFLINE === '1') {
  console.warn('⚠️  DOCS_TEMPLATES_OFFLINE=1: skipping the live visibility check; listing every template not marked internal.');
} else {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ templates { id } }' }),
      signal: AbortSignal.timeout(20_000),
    });
    const json = await res.json();
    if (!res.ok || json.errors || !Array.isArray(json.data?.templates)) {
      throw new Error(`HTTP ${res.status} ${JSON.stringify(json.errors ?? json).slice(0, 200)}`);
    }
    liveIds = new Set(json.data.templates.map((t) => t.id));
  } catch (err) {
    console.error(`❌ could not read the public template list from ${ENDPOINT}: ${err.message}\n   The committed catalog stays as it is. Set DOCS_TEMPLATES_OFFLINE=1 to generate from the source alone.`);
    process.exit(1);
  }
}
const templates = liveIds ? all.filter((t) => liveIds.has(t.id)) : all.filter((t) => t.releaseStage !== 'internal');
if (liveIds) {
  const notInSource = [...liveIds].filter((id) => !all.some((t) => t.id === id));
  if (notInSource.length > 0) console.warn(`⚠️  production lists templates this checkout does not define (main behind production?): ${notInSource.join(', ')}`);
  const hidden = all.filter((t) => !liveIds.has(t.id)).map((t) => t.id);
  if (hidden.length > 0) console.log(`   hidden by platform flags (not listed): ${hidden.join(', ')}`);
}

const CATEGORIES = [
  ['AI_ML', 'AI and machine learning'],
  ['GAME_SERVER', 'Game servers'],
  ['WEB_SERVER', 'Web servers'],
  ['DATABASE', 'Databases'],
  ['STORAGE', 'Storage'],
  ['DEVTOOLS', 'Developer tools'],
  ['CUSTOM', 'Custom'],
];
const categoryLabel = (c) => CATEGORIES.find(([k]) => k === c)?.[1] ?? c;

const mdx = (s) => String(s ?? '').replace(/\{/g, '\\{').replace(/</g, '\\<');
const cell = (s) => mdx(tidyCopy(scrubProviders(s))).replace(/\|/g, '\\|').replace(/\s*\r?\n\s*/g, ' ').trim();
const para = (s) => mdx(tidyCopy(scrubProviders(s))).trim();
const code = (s) => `\`${String(s).replace(/\|/g, '\\|').replace(/`/g, '')}\``;
const anchor = (t) => t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const isComposite = (t) => (t.components?.length ?? 0) > 0;

function gpu(t) {
  const g = t.resources?.gpu;
  if (!g) return '';
  return `${g.units} × ${(g.vendor ?? 'GPU').toUpperCase()}${g.model ? ` ${g.model.toUpperCase()}` : ''}`;
}
function defaultCell(v) {
  if (v.platformInjected) return `set by the platform (${code(v.platformInjected)})`;
  if (v.secret) return v.default == null ? 'none (secret)' : '(secret)';
  if (v.default == null || v.default === '') return 'none';
  const d = String(v.default);
  return code(d.length > 48 ? `${d.slice(0, 45)}…` : d);
}

let out = `---
title: "Template catalog"
description: "Every template you can deploy on Alternate Clouds today, with its resources, ports, environment variables, health check and how to deploy it, generated from the platform source."
---

{/* AUTO-GENERATED by scripts/generate-template-docs.mjs from ${pkg.name}@${pkg.version}. Do not edit by hand. */}

<Callout type="info">
Generated on every merge from the platform's template registry (${pkg.name} ${pkg.version}), filtered
to what the platform currently offers, so it matches the web app and \`acc templates list\`. See the
[templates overview](/templates) for how deployment from a template works.
</Callout>

Deploy a template from the web app's **Deploy a template** page at
\`https://clouds.alternatefutures.ai/deploy\`, or from the CLI with its ID:

\`\`\`bash
acc templates info <template-id>
acc services create --kind template --template <template-id>
\`\`\`

Composite templates (several services deployed together, marked in the table)
deploy from the web app only; the CLI does not support them yet.

## All templates

| Template | ID | Category | Deploy from | GPU | vCPU | Memory | Storage |
|----------|----|----------|-------------|-----|------|--------|---------|
`;

const sorted = [...templates].sort(
  (a, b) =>
    CATEGORIES.findIndex(([k]) => k === a.category) - CATEGORIES.findIndex(([k]) => k === b.category) ||
    Number(!!b.featured) - Number(!!a.featured),
);
for (const t of sorted) {
  out += `| [${cell(t.name)}](#${anchor(t)}) | ${code(t.id)} | ${categoryLabel(t.category)} | ${isComposite(t) ? 'web app' : 'web app or CLI'} | ${gpu(t) || 'no'} | ${t.resources?.cpu ?? '–'} | ${t.resources?.memory ?? '–'} | ${t.resources?.storage ?? '–'} |\n`;
}
out += '\n';

for (const [key, label] of CATEGORIES) {
  const group = sorted.filter((t) => t.category === key);
  if (group.length === 0) continue;
  out += `## ${label}\n\n`;
  for (const t of group) {
    out += `### ${t.name}\n\n`;
    out += `${para(t.description)}\n\n`;
    const facts = [`ID ${code(t.id)}`];
    if (t.featured) facts.push('featured');
    const tags = (t.tags ?? []).filter((tag) => !isProviderTerm(tag));
    if (tags.length > 0) facts.push(`tags ${tags.map(code).join(', ')}`);
    out += `${facts.join(' · ')}\n\n`;
    if (isComposite(t)) {
      out += `- **Deploy**: from the web app only. Composite template (${t.components.map((c) => code(c.name ?? c.id)).join(', ')}); the CLI does not support composite templates yet.\n`;
    } else {
      out += `- **Deploy**: ${code(`acc services create --kind template --template ${t.id}`)} or from the web app.\n`;
    }
    // Image names that carry a vendor term are left out; the source link stays.
    const image = t.dockerImage && !isProviderTerm(t.dockerImage) ? `**Image**: ${code(t.dockerImage)}` : null;
    const src = t.repoUrl && !isProviderTerm(t.repoUrl) ? `[source](${t.repoUrl})` : null;
    if (image || src) out += `- ${[image, src].filter(Boolean).join(' · ')}\n`;
    const r = t.resources ?? {};
    out += `- **Resources**: ${r.cpu} vCPU, ${r.memory} memory, ${r.storage} storage${gpu(t) ? `, GPU ${gpu(t)}` : ''}\n`;
    if (t.ports?.length) {
      out += `- **Ports**: ${t.ports.map((p) => `container ${p.port} as ${p.as}${p.global ? ' (public)' : ' (internal)'}`).join('; ')}\n`;
    }
    if (t.persistentStorage?.length) {
      out += `- **Persistent storage**: ${t.persistentStorage.map((v) => `${code(v.name)} ${v.size} at ${code(v.mountPath)}`).join('; ')}\n`;
    }
    if (t.healthCheck) out += `- **Health check**: ${code(t.healthCheck.path)} on port ${t.healthCheck.port}\n`;
    const caps = [];
    if (t.attestedIdentity) caps.push('attested identity (confidential compute with a verifiable TDX quote)');
    if (t.shellAccess === 'none') caps.push('no interactive shell, by design');
    if (t.companions?.length) caps.push(`companions: ${t.companions.map((c) => code(c.templateId ?? c.id ?? c.name)).join(', ')}`);
    if (t.connectionStrings) caps.push(`exposes connection strings ${Object.keys(t.connectionStrings).map(code).join(', ')} to linked services`);
    if (caps.length > 0) out += `- **Capabilities**: ${caps.join('; ')}\n`;
    out += '\n';
    const envVars = t.envVars ?? [];
    if (envVars.length > 0) {
      out += '| Variable | Required | Default | Description |\n|----------|----------|---------|-------------|\n';
      for (const v of envVars) {
        out += `| ${code(v.key)} | ${v.required && !v.platformInjected ? 'yes' : 'no'} | ${defaultCell(v)} | ${cell(v.description)} |\n`;
      }
      out += '\n';
    } else {
      out += 'No environment variables to configure.\n\n';
    }
  }
}

assertNoProviders(out, 'content/docs/templates/catalog.mdx');
mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, out, 'utf8');
console.log(
  `✨ Wrote ${OUTPUT} from ${API_REPO} (${pkg.name}@${pkg.version}): ${templates.length} templates listed${liveIds ? ' (visibility from production)' : ' (source only)'}, ${all.length - templates.length} not listed`,
);
