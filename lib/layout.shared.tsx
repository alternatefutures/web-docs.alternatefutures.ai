import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // Parent-company brand: Alternate Futures owns the docs hub chrome;
      // products (Alternate Clouds, Printshot, ...) are sections inside it.
      // Docs chrome: black logo on light, off-white (#F9F5EE) on dark (og,
      // 2026-09-08). The SVGs are var(--fill-0)-driven but load as <img>, which can't
      // read page CSS vars — so each theme gets its own asset. Never use CSS
      // invert() on brand assets (inverted blue = yellow).
      // Brand rule (2026-10-07): the full wordmark must render >=280px wide;
      // where it cannot fit — the nav bar included — use the AF logomark.
      // The two forms are never combined.
      title: (
        <span className="inline-flex">
          <Image
            src="/logo.svg"
            alt="Alternate Futures"
            width={26}
            height={24}
            priority
            className="dark:hidden"
          />
          <Image
            src="/logo-dark.svg"
            alt="Alternate Futures"
            width={26}
            height={24}
            priority
            className="hidden dark:inline"
          />
        </span>
      ),
    },
    // No top links: they would duplicate the sidebar tree (DocsLayout renders
    // links above the tree, pushing the home page down the sidebar).
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
