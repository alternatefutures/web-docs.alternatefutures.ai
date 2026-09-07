import { getLLMText, source } from '@/lib/source';
import { agentContext } from '@/lib/agent-context';
import { appName, siteDescription, siteUrl } from '@/lib/shared';

export const revalidate = false;

export async function GET() {
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);
  const header = [`# ${appName}`, '', `> ${siteDescription}`, '', agentContext(siteUrl), '', '---', ''].join('\n');

  return new Response(header + scanned.join('\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
