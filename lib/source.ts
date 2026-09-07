import { loader } from 'fumadocs-core/source';
import { docsContentRoute, docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { resolveIcon } from './icons';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// Turns the `[Name]` icon tokens in meta.json into elements (see lib/icons.tsx).
function replaceIcon<T extends { icon?: unknown }>(node: T): T {
  if (node.icon === undefined || typeof node.icon === 'string') {
    node.icon = resolveIcon(node.icon as string | undefined);
  }
  return node;
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [
    {
      name: 'af:icons',
      transformPageTree: {
        file: replaceIcon,
        folder: replaceIcon,
        separator: replaceIcon,
      },
    },
  ],
});

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: '/' + [page.locale, ...docsContentRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
