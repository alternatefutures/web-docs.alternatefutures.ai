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
 * What is left out, on purpose (the docs describe only what a customer can use):
 *   1. Vendor names (scripts/lib/provider-scrub.mjs): types, fields, arguments
 *      and enum values whose NAME carries a compute vendor are omitted, vendor
 *      names in descriptions are rewritten, and the output is asserted clean.
 *      DOCS_INCLUDE_PROVIDER_TYPES=1 keeps them.
 *   2. Retired hosting product (sites, IPFS storage, functions, IPNS, ENS,
 *      zones, applications, private gateways) and admin-only or unreleased
 *      surfaces (domains, DNS records): types declared under those schema
 *      section banners and root fields under those `# Label` comments are
 *      omitted. Field names ending in `Service(s)` are always kept, because the
 *      schema files one of them under a legacy comment. Subscriptions are
 *      omitted too: no client uses them and no transport is configured.
 *      DOCS_INCLUDE_RETIRED_SURFACES=1 keeps them.
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
const CURATE = process.env.DOCS_INCLUDE_RETIRED_SURFACES !== '1';

// Section banners (types) and root-field labels (operations) of surfaces a
// customer cannot use today. Matched against the RAW schema comment text.
const EXCLUDED_SECTION_RE = /^(SITES|FUNCTIONS|DOMAINS|DNS RECORD|DOMAIN REGISTRATION|IPFS\/STORAGE|STORAGE ANALYTICS|STORAGE TRACKING|SUBSCRIPTIONS)\b/i;
const EXCLUDED_LABEL_RE = /^(sites?\b|ipns|private gateways?|functions?\b|zones?\b|storage\b|ens\b|applications?\b|domains?\b|web3 domains?|domain registration|dns record)/i;
// Root fields named after the retired product, whatever comment they sit under.
// Surfaces that are merged and deployed but not usable by customers yet (the
// swarm runtime control plane, identity issuer keys and the secret backend are
// not provisioned). Hidden until launch: set DOCS_INCLUDE_UNRELEASED_SURFACES=1
// in af-deploy-common.yml (or delete this filter) when the feature goes live.
const UNRELEASED_NAME_RE = /^(swarm|identit|runtime|proofProviders|agentIam)|Swarm|A2a|Runtime(Agent|State|McpServer|Model|Secret)|Identity(Import|VerificationPolicy|Card|Credential|ProofRequest|Delegation)|^(rotate|deactivate)Identity$|CapabilityInvocation/;
const HIDE_UNRELEASED = process.env.DOCS_INCLUDE_UNRELEASED_SURFACES !== '1';
const LEGACY_NAME_RE = /ipfs|ipns|arns|\bens\b|^sites?(?![a-z])|^pins?(?![a-z])|pinned|zone|privateGateway|afFunction|filecoin|arweave/i;
const PROTECTED_FIELD_RE = /Services?$/;

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
// (a banner may carry extra comment lines; the first one is the title).
// Inside Query/Mutation, the FIRST line of a `# …` comment block labels the
// fields that follow; continuation lines are prose, not labels.
const ACRONYMS = new Set(['ipns', 'ipfs', 'ssl', 'dns', 'api', 'gpu', 'tee', 'cvm', 'sdl', 'url', 'id', 'ai', 'ml', 'pat', 'oauth', 'ssh', 'http', 'https', 'json', 'ws', 'cli', 'sdk', 'rpc', 'tls', 'jwt', 'ipv4', 'ipv6', 'cpu', 'ram', 'ens', 'cdn', 'fqdn', 'uuid', 'pats', 'apm', 'af']);
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
  if (/^sites/i.test(raw)) return 'Deployments';
  return sentenceCase(tidyCopy(raw));
}

const lines = sdl.split('\n');
const sectionOf = new Map(); // type name → display section
const rawSectionOf = new Map(); // type name → raw banner text
const declLine = new Map();
const rootLabels = { Query: new Map(), Mutation: new Map(), Subscription: new Map() };
const rootRawLabels = { Query: new Map(), Mutation: new Map(), Subscription: new Map() };
const isBanner = (l) => /^\s*#\s*=+\s*$/.test(l ?? '');
const isComment = (l) => /^\s*#/.test(l ?? '');
let section = 'Other';
let rawSection = '';
let inRoot = null;
let label = null;
let rawLabel = null;
let prevComment = false;
let inDescription = false;
let argDepth = 0; // parenthesis depth inside a root type: >0 means inside an argument list
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if ((line.match(/"""/g) ?? []).length % 2 === 1) inDescription = !inDescription;
  if (inDescription) continue;
  if (isBanner(line)) {
    let j = i + 1;
    const titles = [];
    while (j < lines.length && isComment(lines[j]) && !isBanner(lines[j])) {
      titles.push(lines[j].replace(/^\s*#\s*/, '').trim());
      j++;
    }
    if (titles.length > 0 && isBanner(lines[j])) {
      rawSection = titles[0];
      section = sectionTitle(titles[0]);
      i = j;
    }
    prevComment = false;
    continue;
  }
  const decl = line.match(/^\s*(?:extend\s+)?(type|input|enum|union|interface|scalar)\s+([A-Za-z_]\w*)/);
  if (decl) {
    const [, kind, name] = decl;
    if (kind === 'type' && rootLabels[name]) {
      inRoot = name;
      label = null;
      rawLabel = null;
      argDepth = 0;
    } else {
      inRoot = null;
      if (!sectionOf.has(name)) {
        sectionOf.set(name, section);
        rawSectionOf.set(name, rawSection);
        declLine.set(name, i);
      }
    }
    prevComment = false;
    continue;
  }
  if (inRoot) {
    if (/^\s*}\s*$/.test(line)) {
      inRoot = null;
      prevComment = false;
      continue;
    }
    if (/^\s*$/.test(line)) {
      prevComment = false;
      continue;
    }
    const c = line.match(/^\s*#\s*(.+)$/);
    if (c) {
      // A label is a short heading-like first line ("Service links (…)");
      // a paragraph ("Returns the plaintext value of …") keeps the current label.
      if (!prevComment) {
        const head = c[1].trim().split(/\s+(?:—|:)\s+/)[0].trim();
        const bare = head.replace(/\s*\([^)]*\)/g, '').trim();
        if (bare.length <= 48 && !/[.;,]$/.test(bare) && !/\.\s/.test(bare)) {
          rawLabel = head;
          // "Akash deployments" → tier-specific; file under Deployments. A vendor
          // named only in an aside ("… (akash lease-status)") keeps its label.
          const stripped = stripProviderAsides(head);
          label = isProviderTerm(stripped) ? 'Deployments' : sentenceCase(tidyCopy(scrubProviders(stripped)));
        }
      }
      prevComment = true;
      continue;
    }
    prevComment = false;
    // Only a line at argument depth 0 declares a field. Lines inside a multi-line
    // argument list (`runtimeStateAtVersion(` … `version: String!` … `): X`) are
    // arguments and must not claim a label, or the real `version` query inherits
    // whatever label the enclosing field had.
    const f = argDepth === 0 ? line.match(/^\s*([a-zA-Z_]\w*)\s*[(:]/) : null;
    argDepth = Math.max(0, argDepth + (line.match(/\(/g) ?? []).length - (line.match(/\)/g) ?? []).length);
    if (f && label && !rootLabels[inRoot].has(f[1])) {
      rootLabels[inRoot].set(f[1], label);
      rootRawLabels[inRoot].set(f[1], rawLabel);
    }
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

// ── Omissions: vendor names, retired and admin surfaces ──────────────────────
// 1. Root fields: vendor-named or vendor-typed ones go; so do fields under an
//    excluded `# Label` (unless the name is service-level).
// 2. Types: everything reachable from the kept root fields stays, EXCEPT that a
//    type declared under an excluded banner is only reached when a kept root
//    field uses it directly (argument or return type), never through another
//    type's field (that is how `Project.sites` would drag the retired `Site`
//    back in). Types nothing kept reaches are not documented at all.
const vendorNamed = (name) => REDACT && isProviderTerm(name);
const sectionExcluded = (name) => CURATE && EXCLUDED_SECTION_RE.test(rawSectionOf.get(name) ?? '');
const excludedRoot = { Query: [], Mutation: [] };
// A vendor-named operation goes. A vendor-neutral operation whose RETURN type is
// vendor-specific (deployFromTemplate) stays, with its return type described
// generically. Retired-product operations go by name, by label, or because
// their return/argument types are declared under an excluded banner.
function rootFieldKept(rootName, f) {
  if (vendorNamed(f.name)) return false;
  if (!CURATE) return true;
  if (LEGACY_NAME_RE.test(f.name)) return false;
  if (HIDE_UNRELEASED && UNRELEASED_NAME_RE.test(f.name)) return false;
  const raw = rootRawLabels[rootName]?.get(f.name) ?? '';
  if (EXCLUDED_LABEL_RE.test(raw) && !PROTECTED_FIELD_RE.test(f.name)) return false;
  // Only the RETURN type decides here: input types are filed by the schema
  // authors wherever convenient (CreateServiceInput sits under a legacy banner).
  if (sectionExcluded(getNamedType(f.type).name)) return false;
  return true;
}
const keptRootFields = { Query: [], Mutation: [] };
for (const root of ['Query', 'Mutation']) {
  for (const f of Object.values(schema.getType(root)?.getFields() ?? {})) {
    if (rootFieldKept(root, f)) keptRootFields[root].push(f);
    else if (!vendorNamed(f.name)) excludedRoot[root].push(f.name);
  }
}
const direct = new Set();
for (const root of ['Query', 'Mutation']) {
  for (const f of keptRootFields[root]) {
    if (!vendorNamed(getNamedType(f.type).name)) direct.add(getNamedType(f.type).name);
    for (const a of f.args) if (!vendorNamed(a.name)) direct.add(getNamedType(a.type).name);
  }
}
const reachable = new Set();
const queue = [...direct];
while (queue.length > 0) {
  const name = queue.pop();
  if (reachable.has(name) || vendorNamed(name)) continue;
  const t = schema.getType(name);
  if (!t || t.name.startsWith('__') || isSpecifiedScalarType(t)) continue;
  reachable.add(name);
  const follow = (ref) => {
    const n = getNamedType(ref).name;
    if (vendorNamed(n)) return;
    if (sectionExcluded(n) && !direct.has(n)) return;
    queue.push(n);
  };
  if (isObjectType(t) || isInterfaceType(t) || isInputObjectType(t)) {
    for (const f of Object.values(t.getFields())) {
      if (vendorNamed(f.name)) continue;
      follow(f.type);
      for (const a of f.args ?? []) if (!vendorNamed(a.name)) follow(a.type);
    }
    if (isObjectType(t)) for (const i of t.getInterfaces()) follow(i);
    if (isInterfaceType(t)) for (const o of schema.getImplementations(t).objects) follow(o);
  } else if (isUnionType(t)) {
    for (const m of t.getTypes()) follow(m);
  }
}
const dropped = new Set(userTypes.filter((t) => !reachable.has(t.name)).map((t) => t.name));
const keepNamed = (t) => !dropped.has(getNamedType(t).name);
const keepField = (f) => !vendorNamed(f.name) && keepNamed(f.type);
const keepArg = (a) => !vendorNamed(a.name) && keepNamed(a.type);
const enumValues = (t) => t.getValues().filter((v) => !vendorNamed(v.name));
const unionMembers = (t) => t.getTypes().filter((m) => !dropped.has(m.name));
const keepRootField = (rootName, f) => keptRootFields[rootName].includes(f);
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
// Root fields registered without a `# Label` comment get a label from their name.
function labelFor(rootName, name) {
  const l = rootLabels[rootName].get(name);
  // A service-level field filed under a legacy comment (deleteService under
  // "Functions") is listed with the services.
  if (l && CURATE && EXCLUDED_LABEL_RE.test(rootRawLabels[rootName].get(name) ?? '')) return 'Services';
  if (l) return l;
  if (/github/i.test(name)) return 'GitHub deploy';
  if (/build/i.test(name)) return 'Builds';
  if (/region/i.test(name)) return 'Regions';
  return 'Other';
}
let usedFootnote = false;
const FOOTNOTE = '\n† Some fields, arguments or return types are omitted from this page: provider-specific ones, or ones that belong to retired or admin-only surfaces.\n';

function header(title, description) {
  const omitted = [
    REDACT ? 'provider-specific types, fields and arguments' : null,
    CURATE ? 'operations of the retired hosting product (sites, IPFS storage, functions) and admin-only operations' : null,
  ].filter(Boolean);
  return `---
title: "${title}"
description: "${description}"
---

{/* AUTO-GENERATED by scripts/generate-graphql-docs.mjs from ${pkg.name}@${pkg.version}. Do not edit by hand. */}

<Callout type="info">
Generated from the API server source (${pkg.name} ${pkg.version}) on every merge. Endpoint
\`https://api.alternatefutures.ai/graphql\`, header \`Authorization: Bearer <personal access token>\`.
See the [GraphQL API overview](/api) for how to call it.${omitted.length > 0 ? ` Left out on purpose: ${omitted.join('; ')}.` : ''}
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
    s += '| † | | Some fields omitted |\n';
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
    s += 'Some arguments are omitted. †\n\n';
  }
  if (vendorNamed(getNamedType(f.type).name)) {
    usedFootnote = true;
    s += `Returns a deployment object for the service's compute tier${/\[/.test(String(f.type)) ? 's' : ''} (provider-specific, not documented here). †\n\n`;
  } else {
    s += `Returns ${typeCell(f.type)}.\n\n`;
  }
  return s;
}

function renderRoot(rootName) {
  const type = schema.getType(rootName);
  if (!type) return '';
  const fields = Object.values(type.getFields()).filter((f) => keepRootField(rootName, f));
  const groups = new Map();
  for (const f of fields) {
    const l = labelFor(rootName, f.name);
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

// queries.mdx
{
  let body = header(
    'Queries',
    'Every query the Alternate Clouds GraphQL API exposes, with arguments and return types, generated from the API source.',
  );
  body += renderRoot('Query');
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
        body += '| † | Some values omitted |\n';
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
  queries: Object.values(schema.getType('Query')?.getFields() ?? {}).filter((f) => keepRootField('Query', f)).length,
  mutations: Object.values(schema.getType('Mutation')?.getFields() ?? {}).filter((f) => keepRootField('Mutation', f)).length,
};
console.log(`✨ Wrote content/docs/api/{queries,mutations,objects,inputs,enums}.mdx from ${API_REPO} (${pkg.name}@${pkg.version})`);
console.log(`   ${JSON.stringify(stats)}`);
if (dropped.size > 0) console.log(`   omitted types (${dropped.size}): ${[...dropped].sort().join(', ')}`);
for (const root of ['Query', 'Mutation']) {
  const ex = [...new Set(excludedRoot[root])].sort();
  if (ex.length > 0) console.log(`   omitted ${root} fields (${ex.length}): ${ex.join(', ')}`);
}
