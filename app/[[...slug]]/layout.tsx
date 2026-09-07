import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { docsLayoutProps } from '@/lib/layout.docs';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayout {...docsLayoutProps()}>{children}</DocsLayout>;
}
