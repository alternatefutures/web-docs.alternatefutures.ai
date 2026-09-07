import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { docsLayoutProps } from '@/lib/layout.docs';
import BrandGuideContent from './brand-guide-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand guide',
  description:
    'The complete visual identity reference for Alternate Futures - colors, typography, geometric elements, logo usage, voice, and guidelines.',
};

export default function BrandGuidePage() {
  return (
    <DocsLayout {...docsLayoutProps()}>
      <main className="brand-guide-page">
        <BrandGuideContent />
      </main>
    </DocsLayout>
  );
}
