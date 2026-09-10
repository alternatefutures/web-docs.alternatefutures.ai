import { platform } from './shared';

/**
 * The platform facts an AI agent needs before it can act on anything in these
 * docs. Single source of truth: prepended by the "Copy for AI" button on every
 * page, rendered into /llms.txt, and mirrored in prose on /ai-agents.
 *
 * Keep it short. It rides along with every copied page.
 */
export function agentContext(origin: string): string {
  return [
    'Alternate Clouds is the Alternate Futures cloud platform. It deploys containers, AI agents, GPU workloads, and confidential (TEE) services on decentralized infrastructure from the web app, the acc CLI, or the TypeScript SDK.',
    '',
    `- Docs index for agents: ${origin}/llms.txt`,
    `- Every page in one file: ${origin}/llms-full.txt`,
    `- Any page as Markdown: ${origin}/llms.mdx/<path>/content.md (CLI reference: ${origin}/llms.mdx/cli/commands/content.md)`,
    `- Agent guide: ${origin}/ai-agents`,
    `- Web app: ${platform.appUrl} (sign in with email or an Ethereum wallet; 14-day trial, no card)`,
    `- CLI: npm install -g ${platform.cliPackage} && acc login. Command groups: projects, services, deployments, regions, templates, ssh, cp, attest, chat, billing, pat. Any command accepts --help.`,
    '- Non-interactive use: export AF_TOKEN (from acc pat create) and AF_PROJECT_ID, add -y to skip prompts, run acc whoami --json as a pre-flight check.',
    `- Agent skills plugin for Claude Code, Cursor, and Codex: ${platform.skillsRepo}`,
    '- The retired af CLI (sites, storage, functions, IPFS) is not acc; its commands do not exist. /legacy explains what replaced each part, and old /guides/<af-topic> URLs redirect there.',
  ].join('\n');
}
