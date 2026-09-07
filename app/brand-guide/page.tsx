import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/lib/source';
import { baseOptions } from '@/lib/layout.shared';
import BrandGuideContent from './brand-guide-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand Guide',
  description:
    'The complete visual identity reference for Alternate Futures - colors, typography, geometric elements, logo usage, voice, and guidelines.',
};

export default function BrandGuidePage() {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      <main className="brand-guide-page">
        <BrandGuideContent />
      </main>
    </DocsLayout>
  );
}
