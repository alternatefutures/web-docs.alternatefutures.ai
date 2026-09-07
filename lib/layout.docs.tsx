import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { SidebarPageItem, SidebarSectionHeader } from '@/components/sidebar-parts';
import { baseOptions } from './layout.shared';
import { source } from './source';

/** One set of DocsLayout props for every route that renders the docs chrome
 *  (the docs pages and the brand guide), so the sidebar is identical. */
export function docsLayoutProps(): Omit<DocsLayoutProps, 'children'> {
  return {
    ...baseOptions(),
    tree: source.getPageTree(),
    sidebar: {
      components: {
        Separator: SidebarSectionHeader,
        Item: SidebarPageItem,
      },
    },
  };
}
