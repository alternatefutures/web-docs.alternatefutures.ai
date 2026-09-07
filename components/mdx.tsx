import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Callout } from 'fumadocs-ui/components/callout';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Card, Cards } from 'fumadocs-ui/components/card';
import type { MDXComponents } from 'mdx/types';
import { agentContext } from '@/lib/agent-context';
import { siteUrl } from '@/lib/shared';

/** Renders the shared agent-context block so /ai-agents never drifts from
 *  what the Copy for AI button and /llms.txt actually emit. */
function AgentContext() {
  return (
    <pre className="whitespace-pre-wrap text-[0.8125rem] leading-relaxed">
      <code>{agentContext(siteUrl)}</code>
    </pre>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    AgentContext,
    Callout,
    Card,
    Cards,
    Tab,
    Tabs,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
