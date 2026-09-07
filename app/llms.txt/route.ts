import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';
import { agentContext } from '@/lib/agent-context';
import { appName, siteDescription, siteUrl } from '@/lib/shared';

export const revalidate = false;

// llms.txt (llmstxt.org): H1, blockquote summary, heading-free preamble, then
// H2 file-list sections. Fumadocs renders the page list; we own the header so
// an agent gets the platform facts before the first link.
export function GET() {
  const index = llms(source).index();
  const pages = index.replace(/^# [^\n]*\n+/, '').replace(/^> [^\n]*\n+/, '');
  const body = [
    `# ${appName}`,
    '',
    `> ${siteDescription}`,
    '',
    agentContext(siteUrl),
    '',
    '## Pages',
    '',
    pages.trim(),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
