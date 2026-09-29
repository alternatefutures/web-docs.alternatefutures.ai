import { loader } from 'fumadocs-core/source';
import { docsContentRoute, docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { resolveIcon } from './icons';

// Pages that describe a surface a customer cannot use yet carry
// `unreleased: true` in their frontmatter (AF_DOCS_PIPELINE.md §4). They are
// dropped from the site, the sitemap and llms.txt unless the build sets
// DOCS_INCLUDE_SIGN_IN=1 (the sign-in SDK is the only such surface today).
const INCLUDE_UNRELEASED_PAGES = process.env.DOCS_INCLUDE_SIGN_IN === '1';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    // `unreleased` is an optional boolean like `full`; reusing its schema avoids a direct zod dependency.
    schema: pageSchema.extend({ unreleased: pageSchema.shape.full }),
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
      name: 'af:unreleased',
      transformStorage({ storage }) {
        if (INCLUDE_UNRELEASED_PAGES) return;
        for (const path of storage.getFiles()) {
          const file = storage.read(path);
          if (file?.format === 'page' && (file.data as { unreleased?: boolean }).unreleased) storage.delete(path);
        }
      },
    },
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
