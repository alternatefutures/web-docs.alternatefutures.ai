import type { ReactNode } from 'react';

/**
 * Icons referenced from content/docs/meta.json as `---[Name]Label---`.
 * Brand marks in the docs chrome: black on light, off-white (#F9F5EE) on dark
 * (og, 2026-09-08), as separate assets (public/*.svg, public/*-dark.svg).
 * Never CSS-filter or invert a brand asset (inverted blue = yellow).
 */
function BrandMark({ light, dark, width }: { light: string; dark: string; width: number }) {
  return (
    <span className="inline-flex h-4 shrink-0 items-center justify-center" style={{ width }} aria-hidden>
      <img src={light} alt="" width={width} height={16} className="dark:hidden" />
      <img src={dark} alt="" width={width} height={16} className="hidden dark:inline" />
    </span>
  );
}

export function resolveIcon(name?: string): ReactNode {
  switch (name) {
    case 'AlternateFutures':
      // AF monogram, viewBox 35x32.
      return <BrandMark light="/logo.svg" dark="/logo-dark.svg" width={17} />;
    case 'AlternateClouds':
      // AC mark from the web app, viewBox 134x122.
      return <BrandMark light="/ac-mark.svg" dark="/ac-mark-dark.svg" width={18} />;
    default:
      return undefined;
  }
}
