import { getPageMarkdownUrl, source } from '@/lib/source';
import { DocsBody, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { AIActions } from '@/components/ai-actions';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';

interface PageParams {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page(props: PageParams) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      {/* Title row: page title on the left, AI hand-off actions top-right on
          every page (they stack under the title on narrow screens). */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <DocsTitle className="min-w-0">{page.data.title}</DocsTitle>
        <AIActions
          title={page.data.title}
          markdownUrl={markdownUrl}
          githubUrl={githubUrl}
          className="shrink-0 sm:pt-1.5"
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageParams): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    // llms.txt convention: advertise the Markdown twin of every page.
    alternates: {
      types: { 'text/markdown': getPageMarkdownUrl(page).url },
    },
  };
}
