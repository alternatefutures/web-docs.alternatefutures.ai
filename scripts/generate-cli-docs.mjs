#!/usr/bin/env node
/**
 * Generate the CLI command reference (content/docs/cli/commands.mdx) by
 * statically parsing the acc CLI source (Commander registrations).
 *
 * CLI repo location:
 *   - AF_CLI_REPO env var, else
 *   - ../alternate-clouds-cli (local sibling checkout), else
 *   - ./alternate-clouds-cli (CI checkout inside this repo)
 *
 * No build of the CLI is required — this reads src/*.ts directly.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

const CLI_REPO = [
  process.env.AF_CLI_REPO,
  resolve(REPO_ROOT, '../alternate-clouds-cli'),
  resolve(REPO_ROOT, 'alternate-clouds-cli'),
]
  .filter(Boolean)
  .find((p) => existsSync(join(p, 'src/commands')));

if (!CLI_REPO) {
  console.error('❌ alternate-clouds-cli repo not found. Set AF_CLI_REPO or clone it as a sibling.');
  process.exit(1);
}

const OUTPUT = join(REPO_ROOT, 'content/docs/cli/commands.mdx');

// MDX-safe: escape chars that would be parsed as JSX/expressions.
const mdx = (s) =>
  String(s ?? '')
    .replace(/\{/g, '\\{')
    .replace(/</g, '\\<');

// Extract every .command('name') block in a file together with its
// .description() and .option() calls, by walking the chained segments.
// Some descriptions are i18n calls: .description(t('patDescription')). Resolve
// them from the CLI's English strings so the reference is not left blank.
let EN_STRINGS = {};
try {
  EN_STRINGS = JSON.parse(readFileSync(join(CLI_REPO, 'locales/en.json'), 'utf8'));
} catch {
  /* no locales file: t() descriptions stay empty */
}
const T_CALL = `t\\(\\s*(['"\`])([A-Za-z0-9_.-]+)\\1\\s*\\)`;
function resolveT(seg, method) {
  const m = seg.match(new RegExp(`\\.${method}\\(\\s*${T_CALL}`));
  return m ? (EN_STRINGS[m[2]] ?? '') : '';
}

function parseCommands(content, fileLabel) {
  const commands = [];
  // String literal matched with its own delimiter (', " or `), tolerating the
  // other two quote chars inside.
  const STR = `(['"\`])((?:\\\\.|(?!\\1).)*)\\1`;
  const STR2 = STR.replace(/\\1/g, '\\3');
  const STR3 = STR.replace(/\\1/g, '\\5');
  const cmdRe = new RegExp(`\\.command\\(\\s*${STR}`, 'g');
  const indices = [];
  let m;
  while ((m = cmdRe.exec(content))) indices.push({ name: m[2], start: m.index });
  for (let i = 0; i < indices.length; i++) {
    const seg = content.slice(indices[i].start, indices[i + 1]?.start ?? content.length);
    const desc = seg.match(new RegExp(`\\.description\\(\\s*${STR}`));
    const optRe = new RegExp(
      `\\.option\\(\\s*${STR}\\s*,\\s*${STR2}(?:\\s*,\\s*(?:${STR3}|[^)]+))?`,
      'g',
    );
    const options = [...seg.matchAll(optRe)].map((o) => ({
      flag: o[2],
      description: o[4],
      defaultValue: o[6],
    }));
    // Options described with t('key') do not match optRe's string-literal shape.
    const optTRe = new RegExp(`\\.option\\(\\s*${STR}\\s*,\\s*${T_CALL.replace(/\\1/g, '\\3')}`, 'g');
    for (const o of seg.matchAll(optTRe)) {
      if (!options.some((x) => x.flag === o[2])) options.push({ flag: o[2], description: EN_STRINGS[o[4]] ?? '', defaultValue: undefined });
    }
    commands.push({
      name: indices[i].name,
      description: desc ? desc[2] : resolveT(seg, 'description'),
      options,
      file: fileLabel,
    });
  }
  return commands;
}

function findCommandFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory() && entry !== 'prompts' && entry !== 'utils' && entry !== '__tests__') {
      findCommandFiles(fullPath, files);
    } else if (entry.endsWith('.ts') && !entry.includes('.test.')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Command groups mirroring src/cli.ts COMMAND_GROUPS
const GROUPS = [
  { title: 'Account', dirs: ['auth', 'whoami'] },
  {
    title: 'Compute',
    dirs: ['projects', 'services', 'deployments', 'regions', 'templates', 'ssh', 'cp', 'attest'],
  },
  { title: 'Chat', dirs: ['chat'] },
  { title: 'Billing', dirs: ['billing', 'pat'] },
];

const commandsDir = join(CLI_REPO, 'src/commands');
const byDir = new Map();

for (const file of findCommandFiles(commandsDir)) {
  const rel = file.slice(commandsDir.length + 1);
  const topDir = rel.includes('/') ? rel.split('/')[0] : rel.replace(/\.ts$/, '');
  // src/commands/auth/index.ts is an unregistered legacy module (login/logout
  // are wired directly in cli.ts) — skip it so dead commands don't get documented.
  if (topDir === 'auth') continue;
  const parsed = parseCommands(readFileSync(file, 'utf8'), rel);
  if (parsed.length === 0) continue;
  if (!byDir.has(topDir)) byDir.set(topDir, []);
  byDir.get(topDir).push(...parsed);
}

// Also parse top-level registrations in cli.ts (login/logout/whoami live there)
const cliTs = readFileSync(join(CLI_REPO, 'src/cli.ts'), 'utf8');
const rootCommands = parseCommands(cliTs, 'cli.ts').filter(
  (c) => !['help', 'version'].includes(c.name.split(' ')[0]),
);

const pkg = JSON.parse(readFileSync(join(CLI_REPO, 'package.json'), 'utf8'));

let out = `---
title: "Command reference"
description: "Complete reference for every acc command and flag, generated from the CLI source."
---

{/* AUTO-GENERATED by scripts/generate-cli-docs.mjs from ${pkg.name}@${pkg.version} — do not edit by hand. */}

<Callout type="info">
Use \`acc <command> --help\` to see detailed help for any command. This page is
auto-generated from the CLI source (v${pkg.version}).
</Callout>

## Global options

- \`--debug\` · enable debug output
- \`--local\` · use local dev services (separate credential slot)
- \`-V, --version\` · print CLI version
- \`-h, --help\` · help for any command

`;

// Inside inline code spans MDX needs no escaping, but table pipes do.
const code = (s) => `\`${String(s ?? '').replace(/\|/g, '\\|')}\``;

function renderCommand(cmd, prefix) {
  const full = `acc ${prefix ? prefix + ' ' : ''}${cmd.name}`.replace(/\s+/g, ' ').trim();
  let s = `### ${code(full)}\n\n`;
  if (cmd.description) s += `${mdx(cmd.description)}\n\n`;
  if (cmd.options.length > 0) {
    s += '| Option | Description |\n|--------|-------------|\n';
    for (const opt of cmd.options) {
      const def = opt.defaultValue ? ` (default: ${code(opt.defaultValue)})` : '';
      const desc = mdx(opt.description).replace(/\|/g, '\\|').replace(/`/g, '');
      s += `| ${code(opt.flag)} | ${desc}${def} |\n`;
    }
    s += '\n';
  }
  return s;
}

for (const group of GROUPS) {
  out += `## ${group.title}\n\n`;

  if (group.title === 'Account') {
    for (const cmd of rootCommands.filter((c) =>
      ['login', 'logout', 'whoami'].includes(c.name.split(' ')[0]),
    )) {
      out += renderCommand(cmd, '');
    }
  }

  for (const dir of group.dirs) {
    const cmds = byDir.get(dir);
    if (!cmds) continue;
    // The index.ts of a group registers subcommands; prefix them with the group name,
    // except the group root itself (registered in cli.ts) and standalone commands.
    const standalone = ['ssh', 'cp', 'attest', 'whoami'];
    const prefix = standalone.includes(dir) ? '' : dir;
    const seen = new Set();
    for (const cmd of cmds) {
      const key = `${prefix} ${cmd.name}`;
      if (seen.has(key)) continue;
      seen.add(key);
      // skip re-registrations of the same name from non-index files
      if (cmd.name === dir) {
        out += renderCommand(cmd, '');
        continue;
      }
      out += renderCommand(cmd, prefix);
    }
  }
}

out += `
## Environment variables

| Variable | Purpose |
|----------|---------|
| \`AF_TOKEN\` | Personal access token (overrides stored login, for CI/agents) |
| \`AF_PROJECT_ID\` | Project to operate on (for CI/agents) |
| \`AF_ORG_ID\` | Organization override |
| \`AF_API_URL\` | Override cloud API base URL |
| \`AF_AUTH_API_URL\` | Override auth service URL |
`;

writeFileSync(OUTPUT, out, 'utf8');
console.log(`✨ Wrote ${OUTPUT} from ${CLI_REPO} (${pkg.name}@${pkg.version})`);
