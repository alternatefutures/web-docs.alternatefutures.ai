/**
 * Shared model of the `acc` CLI, parsed statically from the CLI source
 * (Commander registrations). No build of the CLI is required.
 *
 * Used by:
 *   - scripts/generate-cli-docs.mjs   (the command reference page)
 *   - scripts/check-cli-drift.mjs     (hand-written pages vs the real CLI)
 *
 * Nesting is recovered from the receiver of each `.command(` call:
 *   const cmd = program.command('services')   → node "services", bound to `cmd`
 *   cmd.command('list')                        → child of services
 *   const env = cmd.command('env')             → child of services, bound to `env`
 *   env.command('list [service]')              → child of env  ⇒ acc services env list
 *
 * CLI repo location:
 *   - AF_CLI_REPO env var, else
 *   - ../alternate-clouds-cli (local sibling checkout), else
 *   - ./alternate-clouds-cli (CI checkout inside this repo)
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

/** Command groups mirroring src/cli.ts COMMAND_GROUPS (display order). */
export const GROUPS = [
  { title: 'Account', dirs: ['auth', 'whoami'] },
  {
    title: 'Compute',
    dirs: ['projects', 'services', 'deployments', 'regions', 'templates', 'ssh', 'cp', 'attest'],
  },
  { title: 'Chat', dirs: ['chat'] },
  { title: 'Billing', dirs: ['billing', 'pat'] },
];

/** Commands registered directly on the program in src/cli.ts. */
export const ROOT_COMMANDS = ['login', 'logout', 'whoami'];

/** Options Commander adds to every command. */
export const IMPLICIT_OPTIONS = [
  { flag: '-V, --version', description: 'print CLI version', names: ['-V', '--version'], takesValue: false },
  { flag: '-h, --help', description: 'help for any command', names: ['-h', '--help'], takesValue: false },
];

export function findCliRepo(repoRoot) {
  return [
    process.env.AF_CLI_REPO,
    resolve(repoRoot, '../alternate-clouds-cli'),
    resolve(repoRoot, 'alternate-clouds-cli'),
  ]
    .filter(Boolean)
    .find((p) => existsSync(join(p, 'src/commands')));
}

// String literal matched with its own delimiter (', " or `), tolerating the
// other two quote chars inside. STR2/STR3 renumber the backreference for use
// as the 2nd/3rd literal in one pattern.
const STR = `(['"\`])((?:\\\\.|(?!\\1).)*)\\1`;
const STR2 = STR.replace(/\\1/g, '\\3');
const STR3 = STR.replace(/\\1/g, '\\5');
const T_CALL = `t\\(\\s*(['"\`])([A-Za-z0-9_.-]+)\\1\\s*\\)`;

/** `'-p, --project <id-or-name>'` → names + whether a value follows. */
export function parseFlag(flag) {
  const names = [];
  let takesValue = false;
  for (const part of String(flag).split(',')) {
    const token = part.trim().split(/\s+/)[0];
    if (token?.startsWith('-')) names.push(token);
    if (/[<[]/.test(part)) takesValue = true;
  }
  return { names, takesValue };
}

function resolveT(seg, method, en) {
  const m = seg.match(new RegExp(`\\.${method}\\(\\s*${T_CALL}`));
  return m ? (en[m[2]] ?? '') : '';
}

/** Identifier the `.command(` at `idx` is called on, and the variable it is assigned to. */
function receiverAt(content, idx) {
  let j = idx - 1;
  while (j >= 0 && /\s/.test(content[j])) j--;
  if (j < 0) return { receiver: null, assigned: null };
  if (content[j] === ')') return { receiver: '__chain__', assigned: null };
  const end = j + 1;
  while (j >= 0 && /[A-Za-z0-9_$]/.test(content[j])) j--;
  const receiver = content.slice(j + 1, end);
  const before = content.slice(Math.max(0, j - 80), j + 1);
  const am = before.match(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*$/);
  return { receiver, assigned: am ? am[1] : null };
}

/** Every `.command('…')` in a file with its description, options, receiver and assigned variable. */
function parseRegistrations(content, fileLabel, en) {
  const cmdRe = new RegExp(`\\.command\\(\\s*${STR}`, 'g');
  const hits = [];
  let m;
  while ((m = cmdRe.exec(content))) hits.push({ signature: m[2], start: m.index });
  const out = [];
  for (let i = 0; i < hits.length; i++) {
    const seg = content.slice(hits[i].start, hits[i + 1]?.start ?? content.length);
    const desc = seg.match(new RegExp(`\\.description\\(\\s*${STR}`));
    const optRe = new RegExp(
      `\\.option\\(\\s*${STR}\\s*,\\s*${STR2}(?:\\s*,\\s*(?:${STR3}|[^)]+))?`,
      'g',
    );
    const options = [...seg.matchAll(optRe)].map((o) => ({
      flag: o[2],
      description: o[4],
      defaultValue: o[6],
      ...parseFlag(o[2]),
    }));
    // Options described with t('key') do not match optRe's string-literal shape.
    const optTRe = new RegExp(`\\.option\\(\\s*${STR}\\s*,\\s*${T_CALL.replace(/\\1/g, '\\3')}`, 'g');
    for (const o of seg.matchAll(optTRe)) {
      if (!options.some((x) => x.flag === o[2])) {
        options.push({ flag: o[2], description: en[o[4]] ?? '', defaultValue: undefined, ...parseFlag(o[2]) });
      }
    }
    out.push({
      signature: hits[i].signature.replace(/\s+/g, ' ').trim(),
      description: desc ? desc[2] : resolveT(seg, 'description', en),
      options,
      file: fileLabel,
      ...receiverAt(content, hits[i].start),
    });
  }
  return out;
}

/** Root `program` options: `.option(` calls in cli.ts before the first `.command(`. */
function parseRootOptions(cliTs) {
  const firstCommand = cliTs.search(/\.command\(/);
  const head = firstCommand === -1 ? cliTs : cliTs.slice(0, firstCommand);
  const optRe = new RegExp(`\\.option\\(\\s*${STR}\\s*,\\s*(?:${STR2}|${T_CALL.replace(/\\1/g, '\\3')})`, 'g');
  const options = [];
  for (const o of head.matchAll(optRe)) {
    options.push({ flag: o[2], description: o[4] ?? '', defaultValue: undefined, ...parseFlag(o[2]) });
  }
  return options;
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

function makeNode(reg, parent) {
  const node = {
    name: reg.signature.split(' ')[0],
    signature: reg.signature,
    description: reg.description,
    options: reg.options,
    file: reg.file,
    parent,
    children: [],
  };
  parent.children.push(node);
  return node;
}

/** `acc services env list [service]`: parent names without their arguments, own signature. */
export function displayOf(node) {
  const names = [];
  for (let n = node.parent; n && n.parent; n = n.parent) names.unshift(n.name);
  return ['acc', ...names, node.signature].join(' ').replace(/\s+/g, ' ').trim();
}

/** Command path without arguments, e.g. ['services', 'env', 'list']. */
export function pathOf(node) {
  const names = [];
  for (let n = node; n && n.parent; n = n.parent) names.unshift(n.name);
  return names;
}

/** Options accepted on this command: its own, every ancestor's, the root's, plus -h/-V. */
export function allowedOptions(node) {
  const opts = [];
  for (let n = node; n; n = n.parent) opts.push(...(n.options ?? []));
  opts.push(...IMPLICIT_OPTIONS);
  return opts;
}

/**
 * Parse the CLI into a command tree.
 * @returns {{ cliRepo: string, pkg: object, root: object, commands: object[] }}
 *   `root.children` are the top-level commands in registration order;
 *   `commands` is the depth-first flat list (duplicates removed).
 */
export function loadCliModel({ repoRoot, cliRepo = findCliRepo(repoRoot) } = {}) {
  if (!cliRepo) {
    throw new Error('alternate-clouds-cli repo not found. Set AF_CLI_REPO or clone it as a sibling.');
  }
  let en = {};
  try {
    en = JSON.parse(readFileSync(join(cliRepo, 'locales/en.json'), 'utf8'));
  } catch {
    /* no locales file: t() descriptions stay empty */
  }
  const pkg = JSON.parse(readFileSync(join(cliRepo, 'package.json'), 'utf8'));
  const cliTs = readFileSync(join(cliRepo, 'src/cli.ts'), 'utf8');

  const root = { name: 'acc', signature: 'acc', options: parseRootOptions(cliTs), parent: null, children: [], file: 'cli.ts' };

  // Commands registered directly in cli.ts (login/logout/whoami). `help` and
  // `version` are Commander built-ins re-registered for styling.
  for (const reg of parseRegistrations(cliTs, 'cli.ts', en)) {
    if (['help', 'version'].includes(reg.signature.split(' ')[0])) continue;
    makeNode(reg, root);
  }

  // Command groups: one directory per group. index.ts first so the group node
  // exists before sibling files that may register onto it.
  const commandsDir = join(cliRepo, 'src/commands');
  const byDir = new Map();
  for (const file of findCommandFiles(commandsDir)) {
    const rel = file.slice(commandsDir.length + 1);
    const topDir = rel.includes('/') ? rel.split('/')[0] : rel.replace(/\.ts$/, '');
    // src/commands/auth/index.ts is an unregistered legacy module (login/logout
    // are wired directly in cli.ts) — skip it so dead commands don't get documented.
    if (topDir === 'auth') continue;
    if (!byDir.has(topDir)) byDir.set(topDir, []);
    byDir.get(topDir).push({ file, rel });
  }
  for (const [dir, files] of byDir) {
    files.sort((a, b) => (a.rel.endsWith('/index.ts') ? -1 : b.rel.endsWith('/index.ts') ? 1 : a.rel.localeCompare(b.rel)));
    for (const { file, rel } of files) {
      const vars = new Map(); // variable name → node, per file
      const regs = parseRegistrations(readFileSync(file, 'utf8'), rel, en);
      let previous = null;
      for (const reg of regs) {
        let parent;
        if (reg.receiver === 'program') parent = root;
        else if (reg.receiver && vars.has(reg.receiver)) parent = vars.get(reg.receiver);
        else if (reg.receiver === '__chain__' && previous) parent = previous;
        else parent = root.children.find((c) => c.name === dir) ?? root;
        const node = makeNode(reg, parent);
        if (reg.assigned) vars.set(reg.assigned, node);
        previous = node;
      }
    }
  }

  // Depth-first flat list; the same display registered twice keeps the first.
  const commands = [];
  const seen = new Set();
  const walk = (node) => {
    for (const child of node.children) {
      const display = displayOf(child);
      if (!seen.has(display)) {
        seen.add(display);
        commands.push(child);
      }
      walk(child);
    }
  };
  walk(root);

  return { cliRepo, pkg, root, commands };
}
