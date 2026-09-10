#!/usr/bin/env node
/**
 * Drift lint: every `acc …` invocation in the HAND-WRITTEN pages must name a
 * command and flags that exist in the CLI source right now. The generated
 * command reference follows the CLI on its own; this catches the tutorial that
 * still types a renamed flag.
 *
 * What is checked
 *   - fenced code blocks with no language or a shell language (bash, sh, shell,
 *     zsh, console, text) — each line, split on && || | ;
 *   - inline code spans that contain `acc `
 *   - the command path (`acc services env list`) and every `--flag` / `-f`
 *     token, against the command's own options plus its ancestors' and the
 *     root's (Commander accepts parent options after the subcommand)
 *
 * What is skipped
 *   - generated pages (scripts/lib/generated-files.mjs)
 *   - content/docs/legacy/** and changelog.mdx: historical by design
 *   - placeholders: a token containing < > [ ] { } $ or … where a command or
 *     flag name is expected (`acc <command> --help`, `--<flag>`)
 *
 * Exit 1 on any finding (set CLI_DRIFT_WARN_ONLY=1 to report without failing).
 * Findings are also appended to $GITHUB_STEP_SUMMARY when it is set.
 */
import { appendFileSync, readFileSync, readdirSync, statSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { allowedOptions, displayOf, loadCliModel } from './lib/cli-model.mjs';
import { GENERATED_FILES } from './lib/generated-files.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const CONTENT = join(REPO_ROOT, 'content/docs');
const SKIP_PREFIXES = ['content/docs/legacy/'];
const SKIP_FILES = new Set([...GENERATED_FILES, 'content/docs/changelog.mdx']);
const SHELL_LANGS = new Set(['', 'bash', 'sh', 'shell', 'zsh', 'console', 'text', 'txt']);
const PLACEHOLDER = /[<>[\]{}$…]|\.\.\./;

let model;
try {
  model = loadCliModel({ repoRoot: REPO_ROOT });
} catch (err) {
  console.error(`❌ ${err.message}`);
  process.exit(1);
}

function mdxFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) mdxFiles(full, files);
    else if (entry.endsWith('.mdx') || entry.endsWith('.md')) files.push(full);
  }
  return files;
}

/** Shell-ish tokenizer: whitespace separated, quotes keep their content together. */
function tokenize(text) {
  const tokens = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(text))) tokens.push(m[1] ?? m[2] ?? m[3]);
  return tokens;
}

/** Every `acc …` command in a shell line (pipes and chains split). */
function invocations(line) {
  const out = [];
  const cleaned = line.replace(/^\s*[$>]\s+/, '').replace(/\\$/, '');
  for (const segment of cleaned.split(/\s*(?:&&|\|\||\||;)\s*/)) {
    const tokens = tokenize(segment);
    const at = tokens.findIndex((t) => t === 'acc' || t.endsWith('/acc'));
    if (at !== -1) out.push(tokens.slice(at + 1));
  }
  return out;
}

const findings = [];
let checked = 0;

function check(file, lineNo, args, source) {
  const shown = `acc ${args.join(' ')}`.trim();
  // Walk the command path.
  let node = model.root;
  let i = 0;
  while (i < args.length) {
    const tok = args[i];
    if (tok.startsWith('-')) break;
    if (PLACEHOLDER.test(tok)) {
      if (node === model.root) return; // `acc <command> …` is a documentation placeholder
      break; // positional argument
    }
    const child = node.children.find((c) => c.name === tok);
    if (!child) {
      if (node === model.root) {
        findings.push({ file, lineNo, shown, source, problem: `unknown command \`acc ${tok}\`` });
        return;
      }
      break; // positional argument such as a service name
    }
    node = child;
    i++;
  }
  checked++;
  const allowed = allowedOptions(node);
  const names = new Set(allowed.flatMap((o) => o.names));
  const valueFlags = new Set(allowed.filter((o) => o.takesValue).flatMap((o) => o.names));
  for (; i < args.length; i++) {
    const tok = args[i];
    if (!tok.startsWith('-') || tok === '-' || tok === '--') continue;
    const flag = tok.split('=')[0];
    if (PLACEHOLDER.test(flag)) continue;
    if (names.has(flag)) {
      if (valueFlags.has(flag) && !tok.includes('=')) i++; // skip the value token
      continue;
    }
    // Combined short flags like -yp.
    if (/^-[a-zA-Z]{2,}$/.test(flag) && [...flag.slice(1)].every((c) => names.has(`-${c}`))) continue;
    const accepts = [...new Set(allowed.map((o) => o.names.at(-1)))].sort().join(', ');
    findings.push({
      file,
      lineNo,
      shown,
      source,
      problem: `unknown flag \`${flag}\` for \`${displayOf(node) === 'acc' ? 'acc' : displayOf(node).replace(/ [<[].*$/, '')}\` (accepts: ${accepts})`,
    });
  }
}

for (const file of mdxFiles(CONTENT)) {
  const rel = relative(REPO_ROOT, file);
  if (SKIP_FILES.has(rel) || SKIP_PREFIXES.some((p) => rel.startsWith(p))) continue;
  const lines = readFileSync(file, 'utf8').split('\n');
  let fence = null; // { lang }
  lines.forEach((line, idx) => {
    const lineNo = idx + 1;
    const f = line.match(/^\s*(```|~~~)\s*([A-Za-z0-9_-]*)/);
    if (f) {
      fence = fence ? null : { lang: f[2].toLowerCase() };
      return;
    }
    if (fence) {
      if (!SHELL_LANGS.has(fence.lang)) return;
      for (const args of invocations(line)) check(rel, lineNo, args, 'code block');
      return;
    }
    for (const span of line.matchAll(/`([^`]+)`/g)) {
      if (!/\bacc\b/.test(span[1])) continue;
      for (const args of invocations(span[1])) check(rel, lineNo, args, 'inline code');
    }
  });
}

const summary = [];
if (findings.length === 0) {
  summary.push(`✅ ${checked} acc invocation(s) in hand-written pages match the CLI (${model.pkg.name}@${model.pkg.version}).`);
} else {
  summary.push(`## ⚠️ ${findings.length} stale acc invocation(s) in hand-written pages (${model.pkg.name}@${model.pkg.version})`, '');
  for (const f of findings) summary.push(`- \`${f.file}:${f.lineNo}\` (${f.source}): \`${f.shown}\` → ${f.problem}`);
  summary.push('', 'Fix the page, or regenerate the reference if the CLI is what changed.');
}
const text = summary.join('\n');
console.log(text);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`);
if (findings.length > 0 && process.env.CLI_DRIFT_WARN_ONLY !== '1') process.exit(1);
