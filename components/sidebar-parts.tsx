'use client';
import type * as PageTree from 'fumadocs-core/page-tree';
import { usePathname } from 'fumadocs-core/framework';
import { SidebarItem, useFolderDepth } from 'fumadocs-ui/components/sidebar/base';
import { cn } from '@/lib/cn';

/**
 * Section headers for the sidebar tree (content/docs/meta.json).
 *
 * A separator that carries an icon is a block header (company or product): a
 * full-width rule above, bold label, icon. A plain separator is a group label
 * inside a block: small caps, muted. Two levels, nothing deeper.
 */
export function SidebarSectionHeader({ item }: { item: PageTree.Separator }) {
  const depth = useFolderDepth();

  if (item.icon) {
    return (
      <p
        className={cn(
          'flex items-center gap-2 px-2 mt-6 pt-5 mb-1.5 border-t text-sm font-semibold text-fd-foreground',
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
        'mt-5 mb-1 px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-fd-muted-foreground',
        depth === 0 && 'first:mt-0',
      )}
      style={{ paddingInlineStart: `calc(${2 + 3 * depth} * var(--spacing))` }}
    >
      {item.name}
    </p>
  );
}

function normalizeUrl(url: string) {
  return url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}

/**
 * Page links. Same look as the Fumadocs default, with one fix: nested items
 * (inside CLI, SDK, Archive) start to the right of the folder's guide line
 * instead of the highlight pill overlapping it. The active marker sits exactly
 * on that line (the folder content draws it at inset-s-2.5; the item's margin
 * is 18px, so a -8px pseudo lands on it).
 */
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
        'relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere transition-colors',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        'hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none',
        'data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:font-medium data-[active=true]:hover:transition-colors',
        nested &&
          "data-[active=true]:before:content-[''] data-[active=true]:before:absolute data-[active=true]:before:-inset-s-2 data-[active=true]:before:inset-y-2 data-[active=true]:before:w-px data-[active=true]:before:bg-fd-primary",
      )}
      style={nested ? { marginInlineStart: `calc(${1.5 + 3 * depth} * var(--spacing))` } : undefined}
    >
      {item.name}
    </SidebarItem>
  );
}
