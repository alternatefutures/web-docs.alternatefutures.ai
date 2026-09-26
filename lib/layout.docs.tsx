import Link from 'next/link';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { SidebarFolderNode, SidebarPageItem, SidebarSectionHeader } from '@/components/sidebar-parts';
import { baseOptions } from './layout.shared';
import { source } from './source';

/** One set of DocsLayout props for every route that renders the docs chrome
 *  (the docs pages and the brand guide), so the sidebar is identical. */
export function docsLayoutProps(): Omit<DocsLayoutProps, 'children'> {
  return {
    ...baseOptions(),
    tree: source.getPageTree(),
    sidebar: {
      footer: (
        <nav key="more-resources" aria-label="More resources" className="flex flex-wrap gap-x-4 gap-y-2 px-2 py-2 text-xs text-fd-muted-foreground">
          <Link className="hover:text-fd-foreground" href="/legacy">Legacy docs</Link>
        </nav>
      ),
      components: {
        Separator: SidebarSectionHeader,
        Item: SidebarPageItem,
        Folder: SidebarFolderNode,
      },
    },
  };
}
