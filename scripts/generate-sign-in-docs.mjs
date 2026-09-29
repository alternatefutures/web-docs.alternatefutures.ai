#!/usr/bin/env node
/**
 * Generate the sign-in SDK reference (content/docs/sdk/sign-in-api.mdx) from
 * the alternate-auth-sdk repo (packages @alternatefutures/ac-auth,
 * ac-auth-react, ac-auth-next, ac-auth-js) using TypeDoc (markdown plugin).
 *
 * Repo location:
 *   - AF_AUTH_SDK_REPO env var, else
 *   - ../alternate-auth-sdk (local sibling checkout), else
 *   - ./alternate-auth-sdk (CI checkout inside this repo)
 *
 * Visibility (AF_DOCS_PIPELINE.md §4): the sign-in surface is unreleased
 * until the issuer is on production. Without DOCS_INCLUDE_SIGN_IN=1 the page
 * is still generated (so drift detection works) but carries `unreleased:
 * true` in its frontmatter, and lib/source.ts keeps it off the site.
 *
 * Best-effort: exits 0 with a warning if the repo is missing (the committed
 * page then stays as-is); exits 1 only on a real generation failure.
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync, rmSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { assertNoProviders, scrubProviders, tidyCopy } from './lib/provider-scrub.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

const SDK_REPO = [
  process.env.AF_AUTH_SDK_REPO && resolve(process.env.AF_AUTH_SDK_REPO),
  resolve(REPO_ROOT, '../alternate-auth-sdk'),
  resolve(REPO_ROOT, 'alternate-auth-sdk'),
]
  .filter(Boolean)
  .find((p) => existsSync(join(p, 'package.json')));

if (!SDK_REPO) {
  console.warn('⚠️  alternate-auth-sdk repo not found - keeping the committed sdk/sign-in-api.mdx.');
  process.exit(0);
}

const OUTPUT = join(REPO_ROOT, 'content/docs/sdk/sign-in-api.mdx');
const TMP = join(os.tmpdir(), `af-sign-in-typedoc-${Date.now()}`);
const RELEASED = process.env.DOCS_INCLUDE_SIGN_IN === '1';

// Package entry points, in the order the reference should read.
const PACKAGES = [
  { dir: 'packages/ac-auth', entries: ['src/index.ts'] },
  { dir: 'packages/ac-auth-react', entries: ['src/index.ts'] },
  { dir: 'packages/ac-auth-next', entries: ['src/index.ts', 'src/proxy.ts', 'src/react.tsx'] },
  { dir: 'packages/ac-auth-js', entries: ['src/index.ts'] },
].map((p) => ({ ...p, name: JSON.parse(readFileSync(join(SDK_REPO, p.dir, 'package.json'), 'utf8')).name, version: JSON.parse(readFileSync(join(SDK_REPO, p.dir, 'package.json'), 'utf8')).version }));

const entryArgs = PACKAGES.flatMap((p) => p.entries.map((e) => JSON.stringify(join(SDK_REPO, p.dir, e)))).join(' ');

// One self-contained tsconfig covering every package (each has its own,
// extending the repo base). Workspace packages resolve to their source so
// TypeDoc follows cross-package types without a build.
mkdirSync(TMP, { recursive: true });
const tsconfigPath = join(TMP, 'tsconfig.json');
writeFileSync(
  tsconfigPath,
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        jsx: 'react-jsx',
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        verbatimModuleSyntax: true,
        noEmit: true,
        baseUrl: SDK_REPO,
        paths: Object.fromEntries(PACKAGES.map((p) => [p.name, [join(SDK_REPO, p.dir, 'src/index.ts')]])),
        typeRoots: [join(SDK_REPO, 'node_modules/@types')],
      },
      include: PACKAGES.map((p) => join(SDK_REPO, p.dir, 'src/**/*')),
      exclude: [join(SDK_REPO, '**/node_modules'), join(SDK_REPO, '**/dist')],
    },
    null,
    2,
  ),
);

console.log(`📖 Running TypeDoc on ${PACKAGES.map((p) => p.name).join(', ')} ...`);
execSync(
  // Same pins as generate-sdk-docs.mjs: typedoc 0.26 + markdown plugin 4.2 (peer-matched).
  `npx --yes -p typedoc@0.26 -p typedoc-plugin-markdown@4.2 typedoc --plugin typedoc-plugin-markdown --skipErrorChecking --gitRevision main ` +
    `--tsconfig ${JSON.stringify(tsconfigPath)} --out ${JSON.stringify(join(TMP, 'out'))} --readme none --excludePrivate --excludeInternal ${entryArgs}`,
  { cwd: SDK_REPO, stdio: 'inherit' },
);

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
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/(?<!\\)\{/g, '\\{').replace(/(?<!\\)</g, '\\<')))
    .join('');
};

let body = '';
for (const file of walk(join(TMP, 'out')).sort()) {
  const raw = readFileSync(file, 'utf8');
  const lines = raw.split('\n');
  let inFence = false;
  const cleaned = lines
    .map((l) => {
      if (/^\s*(```|~~~)/.test(l)) inFence = !inFence;
      return inFence || /^\s*(```|~~~)/.test(l) ? l : escapeMdx(tidyCopy(scrubProviders(l)));
    })
    .join('\n');
  body += cleaned + '\n\n---\n\n';
}
assertNoProviders(body, 'sign-in SDK reference');

const versions = PACKAGES.map((p) => `${p.name}@${p.version}`).join(', ');
const header = `---
title: "Sign-in SDK reference"
description: "API reference for Sign in with Alternate Clouds: @alternatefutures/ac-auth (core), ac-auth-react (components), ac-auth-next (Next.js) and ac-auth-js (Auth.js), auto-generated from the packages."
${RELEASED ? '' : 'unreleased: true\n'}---

{/* AUTO-GENERATED by scripts/generate-sign-in-docs.mjs from ${versions} - do not edit by hand. */}

`;

writeFileSync(OUTPUT, header + body, 'utf8');
rmSync(TMP, { recursive: true, force: true });
console.log(`✨ Wrote ${OUTPUT} from ${versions}${RELEASED ? '' : ' (unreleased: hidden until DOCS_INCLUDE_SIGN_IN=1)'}`);
