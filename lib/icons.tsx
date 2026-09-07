import { Cloud } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Icons referenced from content/docs/meta.json as `---[Name]Label---`.
 * Brand marks follow the brand book: brand-blue on light, off-white on dark,
 * as separate assets. Never CSS-filter or invert a brand asset.
 */
export function resolveIcon(name?: string): ReactNode {
  switch (name) {
    case 'AlternateFutures':
      return (
        <span className="inline-flex size-4 items-center justify-center" aria-hidden>
          <img src="/logo.svg" alt="" width={17} height={16} className="dark:hidden" />
          <img src="/logo-dark.svg" alt="" width={17} height={16} className="hidden dark:inline" />
        </span>
      );
    case 'Cloud':
      return <Cloud aria-hidden />;
    default:
      return undefined;
  }
}
