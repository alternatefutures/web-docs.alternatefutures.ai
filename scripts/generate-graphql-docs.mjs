#!/usr/bin/env node
/**
 * Generate the GraphQL API reference (content/docs/api/{queries,mutations,
 * objects,inputs,enums}.mdx) from the API server's schema source,
 * alternate-clouds-api/src/schema/typeDefs.ts (one SDL template literal).
 *
 * API repo location:
 *   - AF_API_REPO env var, else
 *   - ../alternate-clouds-api (local sibling checkout), else
 *   - ./alternate-clouds-api (CI checkout inside this repo)
 *
 * House rule (see scripts/lib/provider-scrub.mjs): the docs never name the
 * compute vendors. Types, fields, arguments and enum values whose NAME carries
 * a vendor are omitted, vendor names inside descriptions are rewritten to the
 * tier they stand for, and the output is asserted clean. Set
 * DOCS_INCLUDE_PROVIDER_TYPES=1 to generate the complete schema instead.
 *
 * Pages link to each other by heading id: Fumadocs slugs `### Project` to
 * `#project`, so a type named X is reachable at /api/<page>#x.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import {
  buildSchema,
  getNamedType,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isSpecifiedScalarType,
  isUnionType,
  print,
} from 'graphql';
import { assertNoProviders, isProviderTerm, scrubProviders, stripProviderAsides, tidyCopy } from './lib/provider-scrub.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const OUT_DIR = join(REPO_ROOT, 'content/docs/api');
const REDACT = process.env.DOCS_INCLUDE_PROVIDER_TYPES !== '1';

const API_REPO = [
  process.env.AF_API_REPO,
  resolve(REPO_ROOT, '../alternate-clouds-api'),
  resolve(REPO_ROOT, 'alternate-clouds-api'),
]
  .filter(Boolean)
  .find((p) => existsSync(join(p, 'src/schema/typeDefs.ts')));
if (!API_REPO) {
  console.error('❌ alternate-clouds-api repo not found. Set AF_API_REPO or clone it as a sibling.');
  process.exit(1);
}
const pkg = JSON.parse(readFileSync(join(API_REPO, 'package.json'), 'utf8'));

// ── SDL: the file is `export const typeDefs = /* GraphQL */ \`…\`` ────────────
const source = readFileSync(join(API_REPO, 'src/schema/typeDefs.ts'), 'utf8');
const sdl = source
  .slice(source.indexOf('`') + 1, source.lastIndexOf('`'))
  .replace(/\\`/g, '`')
  .replace(/\\\\/g, '\\');

// ── Pre-scan: section banners, root-field labels, declaration order ──────────
// Banners look like:   # ====…   /   # SITES & DEPLOYMENTS   /   # ====…
// Inside Query/Mutation, `# Label` comments group the fields that follow.
const ACRONYMS = new Set(['ipns', 'ipfs', 'ssl', 'dns', 'api', 'gpu', 'tee', 'cvm', 'sdl', 'url', 'id', 'ai', 'ml', 'pat', 'oauth', 'ssh', 'http', 'https', 'json', 'ws', 'cli', 'sdk', 'rpc', 'tls', 'jwt', 'ipv4', 'ipv6', 'cpu', 'ram', 'ens', 'cdn', 'fqdn', 'uuid', 'pats', 'apm', 'ipns']);
function sentenceCase(raw) {
  const words = raw.trim().toLowerCase().split(/\s+/).map((w) => {
    const core = w.replace(/[^a-z0-9]/g, '');
    return ACRONYMS.has(core) ? w.toUpperCase() : w;
  });
  const s = words.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function sectionTitle(raw) {
  if (/akash/i.test(raw)) return 'Standard compute deployments';
  if (/phala/i.test(raw)) return 'Confidential compute deployments';
  if (/spheron/i.test(raw)) return 'GPU compute deployments';
  return sentenceCase(raw);
}

const lines = sdl.split('\n');
const sectionOf = new Map();
const declLine = new Map();
const rootLabels = { Query: new Map(), Mutation: new Map(), Subscription: new Map() };
const isBanner = (l) => /^\s*#\s*=+\s*$/.test(l ?? '');
let section = 'Other';
let inRoot = null;
let label = null;
let inDescription = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if ((line.match(/"""/g) ?? []).length % 2 === 1) inDescription = !inDescription;
  if (inDescription) continue;
  if (isBanner(line) && !isBanner(lines[i + 1]) && /^\s*#\s*\S/.test(lines[i + 1] ?? '') && isBanner(lines[i + 2])) {
    section = sectionTitle(lines[i + 1].replace(/^\s*#\s*/, ''));
    continue;
  }
  const decl = line.match(/^\s*(?:extend\s+)?(type|input|enum|union|interface|scalar)\s+([A-Za-z_]\w*)/);
  if (decl) {
    const [, kind, name] = decl;
    if (kind === 'type' && rootLabels[name]) {
      inRoot = name;
      label = null;
    } else {
      inRoot = null;
      if (!sectionOf.has(name)) sectionOf.set(name, section);
      if (!declLine.has(name)) declLine.set(name, i);
    }
    continue;
  }
  if (inRoot) {
    if (/^\s*}\s*$/.test(line)) {
      inRoot = null;
      continue;
    }
    const c = line.match(/^\s*#\s*(.+)$/);
    if (c) {
      // "Service container logs (akash / phala)" → "Service container logs"
      label = sentenceCase(tidyCopy(scrubProviders(stripProviderAsides(c[1]))));
      continue;
    }
    const f = line.match(/^\s*([a-zA-Z_]\w*)\s*[(:]/);
    if (f && label && !rootLabels[inRoot].has(f[1])) rootLabels[inRoot].set(f[1], label);
  }
}

// ── Schema ───────────────────────────────────────────────────────────────────
let schema;
try {
  schema = buildSchema(sdl);
} catch (err) {
  console.error(`❌ typeDefs.ts does not build as a schema: ${err.message}`);
  process.exit(1);
}
const ROOTS = ['Query', 'Mutation', 'Subscription'];
const userTypes = Object.values(schema.getTypeMap()).filter(
  (t) => !t.name.startsWith('__') && !isSpecifiedScalarType(t) && !ROOTS.includes(t.name),
);

// ── Redaction ────────────────────────────────────────────────────────────────
const dropped = new Set();
if (REDACT) for (const t of userTypes) if (isProviderTerm(t.name)) dropped.add(t.name);
const keepNamed = (t) => !dropped.has(getNamedType(t).name);
const keepField = (f) => !(REDACT && isProviderTerm(f.name)) && keepNamed(f.type);
const keepArg = (a) => !(REDACT && isProviderTerm(a.name)) && keepNamed(a.type);
const enumValues = (t) => t.getValues().filter((v) => !(REDACT && isProviderTerm(v.name)));
const unionMembers = (t) => t.getTypes().filter((m) => !dropped.has(m.name));
let changed = true;
while (changed) {
  changed = false;
  for (const t of userTypes) {
    if (dropped.has(t.name)) continue;
    let empty = false;
    if (isObjectType(t) || isInterfaceType(t) || isInputObjectType(t)) empty = Object.values(t.getFields()).filter(keepField).length === 0;
    else if (isEnumType(t)) empty = enumValues(t).length === 0;
    else if (isUnionType(t)) empty = unionMembers(t).length === 0;
    if (empty) {
      dropped.add(t.name);
      changed = true;
    }
  }
}
const kept = userTypes.filter((t) => !dropped.has(t.name));

// ── Rendering helpers ────────────────────────────────────────────────────────
const mdx = (s) => String(s ?? '').replace(/\{/g, '\\{').replace(/</g, '\\<');
const cell = (s) => mdx(tidyCopy(scrubProviders(s))).replace(/\|/g, '\\|').replace(/\s*\r?\n\s*/g, ' ').trim();
const para = (s) => mdx(tidyCopy(scrubProviders(s))).trim();
const code = (s) => `\`${String(s).replace(/\|/g, '\\|')}\``;
const anchor = (name) => name.toLowerCase();
function pageFor(named) {
  if (isSpecifiedScalarType(named) || isScalarType(named) || dropped.has(named.name)) return null;
  if (isInputObjectType(named)) return 'inputs';
  if (isEnumType(named)) return 'enums';
  return 'objects';
}
function typeCell(t) {
  const named = getNamedType(t);
  const page = pageFor(named);
  return page ? `${code(String(t))} · [${named.name}](/api/${page}#${anchor(named.name)})` : code(String(t));
}
function describe(x) {
  const parts = [];
  if (x.description) parts.push(x.description);
  if (x.deprecationReason) parts.push(`Deprecated: ${x.deprecationReason}`);
  return parts.join(' ');
}
function defaultOf(x) {
  const ast = x.astNode?.defaultValue;
  return ast ? ` Default: ${code(print(ast))}.` : '';
}
let usedFootnote = false;
const FOOTNOTE = '\n† Some provider-specific fields or arguments are omitted from this page. Introspection on the endpoint returns the complete live schema.\n';

function header(title, description) {
  return `---
title: "${title}"
description: "${description}"
---

{/* AUTO-GENERATED by scripts/generate-graphql-docs.mjs from ${pkg.name}@${pkg.version}. Do not edit by hand. */}

<Callout type="info">
Generated from the API server source (${pkg.name} ${pkg.version}) on every merge. Endpoint
\`https://api.alternatefutures.ai/graphql\`, header \`Authorization: Bearer <personal access token>\`.
See the [GraphQL API overview](/api) for how to call it.${REDACT ? ' Provider-specific types, fields and arguments are omitted here; introspection on the endpoint returns the complete live schema.' : ''}
</Callout>

`;
}

function fieldsTable(type) {
  const fields = Object.values(type.getFields());
  const shown = fields.filter(keepField);
  const omitted = shown.length < fields.length;
  let s = '| Field | Type | Description |\n|-------|------|-------------|\n';
  for (const f of shown) {
    const args = f.args ? f.args.filter(keepArg) : [];
    const argNote = args.length > 0 ? ` Arguments: ${args.map((a) => code(`${a.name}: ${a.type}`)).join(', ')}.` : '';
    const argOmitted = f.args && args.length < f.args.length;
    if (argOmitted) usedFootnote = true;
    s += `| ${code(f.name)}${argOmitted ? ' †' : ''} | ${typeCell(f.type)} | ${cell(describe(f))}${cell(argNote)}${defaultOf(f)} |\n`;
  }
  if (omitted) {
    usedFootnote = true;
    s += '| † | | Provider-specific fields omitted |\n';
  }
  return `${s}\n`;
}

function renderRootField(f) {
  const args = f.args.filter(keepArg);
  let s = `### ${f.name}\n\n`;
  if (describe(f)) s += `${para(describe(f))}\n\n`;
  if (args.length > 0) {
    s += '| Argument | Type | Description |\n|----------|------|-------------|\n';
    for (const a of args) s += `| ${code(a.name)} | ${typeCell(a.type)} | ${cell(describe(a))}${defaultOf(a)} |\n`;
    s += '\n';
  }
  if (args.length < f.args.length) {
    usedFootnote = true;
    s += 'Some provider-specific arguments are omitted. †\n\n';
  }
  s += `Returns ${typeCell(f.type)}.\n\n`;
  return s;
}

function renderRoot(rootName) {
  const type = schema.getType(rootName);
  if (!type) return '';
  const fields = Object.values(type.getFields()).filter(keepField);
  const labels = rootLabels[rootName];
  const groups = new Map();
  for (const f of fields) {
    const l = labels.get(f.name) ?? 'Other';
    if (!groups.has(l)) groups.set(l, []);
    groups.get(l).push(f);
  }
  let s = '';
  for (const [l, fs] of groups) {
    s += `## ${l}\n\n`;
    for (const f of fs) s += renderRootField(f);
  }
  return s;
}

function groupedBySection(types) {
  const groups = new Map();
  for (const t of [...types].sort((a, b) => (declLine.get(a.name) ?? 0) - (declLine.get(b.name) ?? 0))) {
    const sec = sectionOf.get(t.name) ?? 'Other';
    if (!groups.has(sec)) groups.set(sec, []);
    groups.get(sec).push(t);
  }
  return groups;
}

function write(file, body) {
  const full = body + (usedFootnote ? FOOTNOTE : '');
  usedFootnote = false;
  if (REDACT) assertNoProviders(full, file);
  writeFileSync(join(OUT_DIR, file), full, 'utf8');
}

mkdirSync(OUT_DIR, { recursive: true });

// queries.mdx (+ subscriptions)
{
  let body = header(
    'Queries',
    'Every query the Alternate Clouds GraphQL API exposes, with arguments and return types, generated from the API source.',
  );
  body += renderRoot('Query');
  const sub = schema.getType('Subscription');
  if (sub && Object.values(sub.getFields()).some(keepField)) {
    body += '## Subscriptions\n\nSubscriptions use the same endpoint over WebSocket (graphql-ws).\n\n';
    for (const f of Object.values(sub.getFields()).filter(keepField)) body += renderRootField(f);
  }
  write('queries.mdx', body);
}

// mutations.mdx
{
  let body = header(
    'Mutations',
    'Every mutation the Alternate Clouds GraphQL API exposes, with arguments and return types, generated from the API source.',
  );
  body += renderRoot('Mutation');
  write('mutations.mdx', body);
}

// objects.mdx: object types, interfaces, unions, custom scalars
{
  let body = header(
    'Object types',
    'The object, interface, union and scalar types returned by the Alternate Clouds GraphQL API, grouped by area, generated from the API source.',
  );
  const objects = kept.filter((t) => isObjectType(t) || isInterfaceType(t) || isUnionType(t));
  for (const [sec, types] of groupedBySection(objects)) {
    body += `## ${sec}\n\n`;
    for (const t of types) {
      body += `### ${t.name}\n\n`;
      if (t.description) body += `${para(t.description)}\n\n`;
      if (isUnionType(t)) {
        body += `One of: ${unionMembers(t).map((m) => `[${m.name}](/api/objects#${anchor(m.name)})`).join(', ')}.\n\n`;
        continue;
      }
      if (isInterfaceType(t)) {
        const impls = schema.getImplementations(t).objects.filter((o) => !dropped.has(o.name));
        if (impls.length > 0) body += `Implemented by: ${impls.map((o) => `[${o.name}](/api/objects#${anchor(o.name)})`).join(', ')}.\n\n`;
      } else {
        const ifaces = t.getInterfaces().filter((i) => !dropped.has(i.name));
        if (ifaces.length > 0) body += `Implements: ${ifaces.map((i) => `[${i.name}](/api/objects#${anchor(i.name)})`).join(', ')}.\n\n`;
      }
      body += fieldsTable(t);
    }
  }
  const scalars = kept.filter((t) => isScalarType(t));
  if (scalars.length > 0) {
    body += '## Scalars\n\n| Scalar | Description |\n|--------|-------------|\n';
    for (const s of scalars) body += `| ${code(s.name)} | ${cell(s.description ?? '')} |\n`;
    body += '\n';
  }
  write('objects.mdx', body);
}

// inputs.mdx
{
  let body = header(
    'Input types',
    'The input object types accepted by Alternate Clouds GraphQL queries and mutations, grouped by area, generated from the API source.',
  );
  for (const [sec, types] of groupedBySection(kept.filter(isInputObjectType))) {
    body += `## ${sec}\n\n`;
    for (const t of types) {
      body += `### ${t.name}\n\n`;
      if (t.description) body += `${para(t.description)}\n\n`;
      body += fieldsTable(t);
    }
  }
  write('inputs.mdx', body);
}

// enums.mdx
{
  let body = header(
    'Enums',
    'The enumeration types used by the Alternate Clouds GraphQL API and their values, grouped by area, generated from the API source.',
  );
  for (const [sec, types] of groupedBySection(kept.filter(isEnumType))) {
    body += `## ${sec}\n\n`;
    for (const t of types) {
      body += `### ${t.name}\n\n`;
      if (t.description) body += `${para(t.description)}\n\n`;
      const values = enumValues(t);
      body += '| Value | Description |\n|-------|-------------|\n';
      for (const v of values) body += `| ${code(v.name)} | ${cell(describe(v))} |\n`;
      if (values.length < t.getValues().length) {
        usedFootnote = true;
        body += '| † | Provider-specific values omitted |\n';
      }
      body += '\n';
    }
  }
  write('enums.mdx', body);
}

const count = (pred) => ({ kept: kept.filter(pred).length, dropped: userTypes.filter((t) => dropped.has(t.name) && pred(t)).length });
const stats = {
  objects: count((t) => isObjectType(t) || isInterfaceType(t) || isUnionType(t)),
  inputs: count(isInputObjectType),
  enums: count(isEnumType),
  scalars: count(isScalarType),
  queries: Object.values(schema.getType('Query')?.getFields() ?? {}).filter(keepField).length,
  mutations: Object.values(schema.getType('Mutation')?.getFields() ?? {}).filter(keepField).length,
};
console.log(`✨ Wrote content/docs/api/{queries,mutations,objects,inputs,enums}.mdx from ${API_REPO} (${pkg.name}@${pkg.version})`);
console.log(`   ${JSON.stringify(stats)}`);
if (dropped.size > 0) console.log(`   omitted types (${dropped.size}): ${[...dropped].sort().join(', ')}`);
