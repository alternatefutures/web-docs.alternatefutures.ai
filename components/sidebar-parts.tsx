'use client';
import type { CSSProperties, ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { usePathname } from 'fumadocs-core/framework';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  useFolderDepth,
} from 'fumadocs-ui/components/sidebar/base';
import { cn } from '@/lib/cn';

/**
 * Sidebar tree renderers (content/docs/meta.json), tuned for three visible
 * levels instead of one flat list:
 *
 *   Block header   icon + 15px semibold, rule above       (company / product)
 *   Group label    11px caps, muted, extra air above      (Start here, Guides…)
 *   Page / folder  13px, indented 12px, 32px rows         (the links)
 *   Nested page    inside CLI / SDK / Archive, hangs from a guide line drawn
 *                  under the folder's text
 *
 * Geometry that must stay in sync: folder rows and top-level pages are
 * indented 12px (ms-3); the folder guide line sits at 20px (inset-s-5), which
 * is where the folder's text starts; nested pages start at 28px so their
 * active marker (-8px) lands exactly on the line.
 */

/* One row style for pages and folder rows. Active = accent text, no pill
   (the accent alone carries state, same as the table of contents). */
const ROW = cn(
  'relative flex flex-row items-center gap-2 rounded-md px-2 py-1.5 text-start text-[0.8125rem] leading-5 text-fd-muted-foreground wrap-anywhere transition-colors',
  '[&_svg]:size-4 [&_svg]:shrink-0',
  'hover:text-fd-foreground hover:transition-none',
  'data-[active=true]:text-fd-primary data-[active=true]:font-medium data-[active=true]:hover:text-fd-primary data-[active=true]:hover:transition-colors',
);

/* Nested pages start at 28px (depth 1); deeper levels step by 12px. */
function indentStyle(depth: number): CSSProperties | undefined {
  return depth >= 1 ? { marginInlineStart: `calc(${4 + 3 * depth} * var(--spacing))` } : undefined;
}

function normalizeUrl(url: string) {
  return url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}

function folderContains(folder: PageTree.Folder, pathname: string): boolean {
  if (folder.index && normalizeUrl(folder.index.url) === pathname) return true;
  return folder.children.some((node) =>
    node.type === 'page'
      ? normalizeUrl(node.url) === pathname
      : node.type === 'folder' && folderContains(node, pathname),
  );
}

/** Separators: with an icon = block header; without = group label. */
export function SidebarSectionHeader({ item }: { item: PageTree.Separator }) {
  const depth = useFolderDepth();

  if (item.icon) {
    return (
      <p
        className={cn(
          'flex items-center gap-2 px-2 mt-8 pt-5 mb-2 border-t text-[0.9375rem] font-semibold tracking-tight text-fd-foreground',
          '[&_svg]:size-4 [&_svg]:shrink-0',
          'first:mt-0 first:pt-0 first:border-t-0',
        )}
      >
        {item.icon}
        {item.name}
      </p>
    );
  }

  return (
    <p
      className={cn(
        'mt-6 mb-1 px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-fd-muted-foreground/70',
        depth === 0 && 'first:mt-0',
      )}
      style={{ paddingInlineStart: `calc(${2 + 3 * depth} * var(--spacing))` }}
    >
      {item.name}
    </p>
  );
}

/** Page links: indented under their group label; nested ones hang from the folder line. */
export function SidebarPageItem({ item }: { item: PageTree.Item }) {
  const pathname = usePathname();
  const depth = useFolderDepth();
  const nested = depth >= 1;
  const active = normalizeUrl(item.url) === normalizeUrl(pathname);

  return (
    <SidebarItem
      href={item.url}
      external={item.external}
      active={active}
      icon={item.icon}
      className={cn(
        ROW,
        !nested && 'ms-3',
        nested &&
          "data-[active=true]:before:content-[''] data-[active=true]:before:absolute data-[active=true]:before:-inset-s-2 data-[active=true]:before:inset-y-1.5 data-[active=true]:before:w-px data-[active=true]:before:bg-fd-primary",
      )}
      style={indentStyle(depth)}
    >
      {item.name}
    </SidebarItem>
  );
}

/** Folders (CLI, SDK, Archive): same row style as pages, guide line under the text. */
export function SidebarFolderNode({ item, children }: { item: PageTree.Folder; children: ReactNode }) {
  const pathname = usePathname();
  const depth = useFolderDepth();
  const current = normalizeUrl(pathname);
  const rowClassName = cn(ROW, 'w-full', depth === 0 && 'ms-3');

  return (
    <SidebarFolder
      collapsible={item.collapsible}
      defaultOpen={item.defaultOpen}
      active={folderContains(item, current)}
    >
      {item.index ? (
        <SidebarFolderLink
          href={item.index.url}
          external={item.index.external}
          active={normalizeUrl(item.index.url) === current}
          className={rowClassName}
          style={indentStyle(depth)}
        >
          {item.icon}
          {item.name}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger className={rowClassName} style={indentStyle(depth)}>
          {item.icon}
          {item.name}
        </SidebarFolderTrigger>
      )}
      <SidebarFolderContent className="relative flex flex-col gap-0.5 pt-0.5 before:content-[''] before:absolute before:inset-y-1 before:w-px before:bg-fd-border before:inset-s-5">
        {children}
      </SidebarFolderContent>
    </SidebarFolder>
  );
}
