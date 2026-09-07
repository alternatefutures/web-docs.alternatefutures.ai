import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // Parent-company brand: Alternate Futures owns the docs hub chrome;
      // products (Alternate Clouds, Printshot, ...) are sections inside it.
      // Per the brand guide: brand-blue logo on light, off-white (#F9F5EE) on
      // dark. The SVGs are var(--fill-0)-driven but load as <img>, which can't
      // read page CSS vars — so each theme gets its own asset. Never use CSS
      // invert() on brand assets (inverted blue = yellow).
      // Responsive logo per the brand book's two forms — never combined:
      // logomark (AF monogram) on mobile, full wordmark on md+ screens.
      title: (
        <>
          <span className="inline-flex md:hidden">
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
          <span className="hidden md:inline-flex">
            <Image
              src="/wordmark.svg"
              alt="Alternate Futures"
              width={104}
              height={24}
              priority
              className="dark:hidden"
            />
            <Image
              src="/wordmark-dark.svg"
              alt="Alternate Futures"
              width={104}
              height={24}
              priority
              className="hidden dark:inline"
            />
          </span>
        </>
      ),
    },
    // No top links: they would duplicate the sidebar tree (DocsLayout renders
    // links above the tree, pushing the home page down the sidebar).
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
