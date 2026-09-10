#!/usr/bin/env node
/**
 * Generate the SDK API reference (content/docs/sdk/api.mdx) from the
 * alternate-clouds-sdk repo using TypeDoc (markdown plugin).
 *
 * SDK repo location:
 *   - AF_SDK_REPO env var, else
 *   - ../alternate-clouds-sdk (local sibling checkout), else
 *   - ./alternate-clouds-sdk (CI checkout inside this repo)
 *
 * Best-effort: exits 0 with a warning if the repo is missing (the committed
 * api.mdx then stays as-is); exits 1 only on a real generation failure.
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync, rmSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

const SDK_REPO = [
  process.env.AF_SDK_REPO && resolve(process.env.AF_SDK_REPO), // absolute: the synthesized tsconfig lives in TMP
  resolve(REPO_ROOT, '../alternate-clouds-sdk'),
  resolve(REPO_ROOT, 'alternate-clouds-sdk'),
]
  .filter(Boolean)
  .find((p) => existsSync(join(p, 'package.json')));

if (!SDK_REPO) {
  console.warn('⚠️  alternate-clouds-sdk repo not found - keeping the committed sdk/api.mdx.');
  process.exit(0);
}

const OUTPUT = join(REPO_ROOT, 'content/docs/sdk/api.mdx');
const TMP = join(os.tmpdir(), `af-sdk-typedoc-${Date.now()}`);

const pkg = JSON.parse(readFileSync(join(SDK_REPO, 'package.json'), 'utf8'));
const entry = ['src/index.ts', 'src/main.ts', 'index.ts']
  .map((e) => join(SDK_REPO, e))
  .find(existsSync);

if (!entry) {
  console.error('❌ Could not find an SDK entry point (src/index.ts).');
  process.exit(1);
}

// TypeDoc reads the SDK's tsconfig.json, which `extends` "@tsconfig/node16" — a
// devDependency. CI checks the SDK out WITHOUT installing (static parse only), so
// the extends target is missing and TS fails with TS6053 before any docs are
// built (--skipErrorChecking only covers type errors, not config errors). When
// the base config is not resolvable, write a self-contained copy of the tsconfig
// (same compilerOptions, absolute paths, emit options dropped) and use that.
function tsconfigForTypedoc() {
  const sdkTsconfigPath = join(SDK_REPO, 'tsconfig.json');
  if (!existsSync(sdkTsconfigPath)) return null;
  let cfg;
  try {
    cfg = JSON.parse(readFileSync(sdkTsconfigPath, 'utf8'));
  } catch {
    return null; // JSONC or similar: let TypeDoc read it as-is
  }
  const ext = cfg.extends;
  const isPackage = typeof ext === 'string' && !ext.startsWith('.') && !ext.startsWith('/');
  if (!isPackage) return null;
  const pkgName = ext.startsWith('@') ? ext.split('/').slice(0, 2).join('/') : ext.split('/')[0];
  if (existsSync(join(SDK_REPO, 'node_modules', pkgName))) return null; // installed: use real config
  console.warn(`⚠️  ${ext} not installed in the SDK checkout - using a self-contained tsconfig.`);
  const co = { ...(cfg.compilerOptions ?? {}) };
  for (const k of ['declaration', 'emitDeclarationOnly', 'outDir', 'rootDir', 'sourceMap', 'incremental', 'tsBuildInfoFile']) delete co[k];
  co.baseUrl = resolve(SDK_REPO, co.baseUrl ?? '.');
  co.skipLibCheck = true;
  const abs = (arr, dflt) => (arr ?? dflt).map((g) => join(SDK_REPO, g));
  const out = {
    compilerOptions: co,
    include: abs(cfg.include, ['src/**/*.ts']),
    exclude: abs(cfg.exclude, ['**/node_modules']),
  };
  mkdirSync(TMP, { recursive: true });
  const p = join(TMP, 'tsconfig.json');
  writeFileSync(p, JSON.stringify(out, null, 2));
  return p;
}
const tsconfigArg = (() => { const p = tsconfigForTypedoc(); return p ? `--tsconfig ${JSON.stringify(p)} ` : ''; })();

// src/index.ts re-exports only the *types* from src/clients/*, so with it as the
// sole entry point TypeDoc omits every client class ("ApplicationsClient ... is
// referenced by AlternateFuturesSdk.applications but not included"). Add the
// client modules as entry points so their methods are documented.
const clientsDir = join(dirname(entry), 'clients');
const clientEntries = existsSync(clientsDir)
  ? readdirSync(clientsDir)
      .filter((f) => f.endsWith('.ts') && !/\.(test|spec)\.ts$/.test(f))
      .map((f) => join(clientsDir, f))
      .sort()
  : [];
const entryArgs = [entry, ...clientEntries].map((e) => JSON.stringify(e)).join(' ');

console.log(`📖 Running TypeDoc on ${entry} ...`);
execSync(
  // `-p` both packages: `npx typedoc --plugin x` installs only typedoc, then fails
  // with ERR_MODULE_NOT_FOUND for the plugin. 4.2.x is the plugin line that peers
  // on typedoc 0.26 (4.3+ needs 0.27).
  // --gitRevision main: source links point at blob/main/<file>#L<n> instead of the
  // checked-out SHA. Without it every merge commit on the SDK's main rewrote all
  // 364 links and produced a content-free drift commit/PR (docs PR #38).
  `npx --yes -p typedoc@0.26 -p typedoc-plugin-markdown@4.2 typedoc --plugin typedoc-plugin-markdown --skipErrorChecking --gitRevision main ` +
    `${tsconfigArg}--out ${JSON.stringify(TMP)} --readme none ${entryArgs}`,
  { cwd: SDK_REPO, stdio: 'inherit' },
);

// Concatenate the generated markdown into one MDX page, escaping MDX-hostile chars.
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

const escapeMdx = (line) => {
  const parts = line.split(/(`+[^`]*`+)/g);
  return parts
    // typedoc-plugin-markdown already emits `\<` / `\{`; escaping those again gives
    // `\\<`, which MDX reads as a literal backslash + a JSX tag and fails to compile.
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/(?<!\\)\{/g, '\\{').replace(/(?<!\\)</g, '\\<')))
    .join('');
};

let body = '';
for (const file of walk(TMP).sort()) {
  const raw = readFileSync(file, 'utf8');
  const lines = raw.split('\n');
  let inFence = false;
  const cleaned = lines
    .map((l) => {
      if (/^\s*(```|~~~)/.test(l)) inFence = !inFence;
      return inFence || /^\s*(```|~~~)/.test(l) ? l : escapeMdx(l);
    })
    .join('\n');
  body += cleaned + '\n\n---\n\n';
}

const header = `---
title: "SDK API reference"
description: "TypeScript SDK API reference, auto-generated from ${pkg.name}@${pkg.version}."
---

{/* AUTO-GENERATED by scripts/generate-sdk-docs.mjs from ${pkg.name}@${pkg.version} - do not edit by hand. */}

`;

writeFileSync(OUTPUT, header + body, 'utf8');
rmSync(TMP, { recursive: true, force: true });
console.log(`✨ Wrote ${OUTPUT} from ${pkg.name}@${pkg.version}`);
