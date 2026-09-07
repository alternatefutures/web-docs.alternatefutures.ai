'use client';

import { useState } from 'react';
import './brand.css';

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}

const cssVariablesReference = `:root {
  /* Primary */
  --af-brand-blue: #000AFF;
  --af-dark-blue: #0000AF;
  --af-terracotta: #BE4200;

  /* Secondary */
  --af-cream: #F9F5EE;
  --af-medium-blue: #A5B2FF;
  --af-apricot: #FFC7AA;
  --af-sky: #C8E0E4;

  /* Hover states */
  --af-brand-blue-hover: #0008CC;
  --af-brand-blue-pressed: #0006A6;

  /* HSL equivalents */
  --af-brand-blue-hsl: 240, 100%, 50%;
  --af-dark-blue-hsl: 240, 100%, 34%;
  --af-medium-blue-hsl: 231, 100%, 82%;
  --af-terracotta-hsl: 21, 100%, 37%;
}`;

const fileNamingConvention = `{type}-{size}-{color}.svg`;

const cssImportSnippet = `<!-- Instrument Sans (Adobe Typekit) -->
<link rel="stylesheet" href="https://use.typekit.net/qqp2xqh.css" />

<!-- Instrument Serif + JetBrains Mono (Google Fonts) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />`;

export default function BrandGuideContent() {
  const [copiedColor, setCopiedColor] = useState('');

  function copyHex(hex: string) {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(''), 1500);
  }

  return (
    <div className="brand-guide-content">
      {/* Hero Banner */}
      <div className="brand-hero">
        <h1>Alternate Futures Brand Guide</h1>
        <p className="subtitle">The visual identity system for the decentralized cloud</p>
        <img className="deco-star deco-star-1" src="/brand/star-medium-off-white.svg" alt="" role="presentation" />
        <img className="deco-star deco-star-2" src="/brand/star-small-off-white.svg" alt="" role="presentation" />
        <img className="deco-star deco-star-3" src="/brand/star-small-apricot.svg" alt="" role="presentation" />
        <img className="deco-ring" src="/brand/ring-large-brand-blue.svg" alt="" role="presentation" />
        <div className="deco-wave">
          <img src="/brand/wave-off-white-10.svg" alt="" role="presentation" />
        </div>
      </div>

      <p>
        This is the authoritative visual identity reference for all Alternate Futures properties. Every
        public-facing design -- documentation, marketing, social media, pitch materials, and product UI -- must
        adhere to these specifications. The Figma source of truth is{' '}
        <a href="https://www.figma.com/design/wmHC1PQgGehvppFrQnJwW0/AF-Branding-2026">AF-Branding-2026</a>.
      </p>

      {/* ============================================ */}
      {/* SECTION 1: COLOR PALETTE */}
      {/* ============================================ */}

      <div className="section-header">
        <img src="/brand/circle-small-brand-blue.svg" alt="" role="presentation" />
        <h2 id="color-palette">Color Palette</h2>
      </div>

      <p>
        The AF palette is a carefully calibrated system of 7 colors. Brand Blue is the dominant identity color and
        should appear on every composition. The remaining colors serve specific functional and emotional roles.
      </p>

      <h3 id="primary-colors">Primary Colors</h3>

      <div className="color-grid">
        <div className="color-card" onClick={() => copyHex('#000AFF')}>
          <div className="color-swatch" style={{ background: '#000AFF' }}>
            {copiedColor === '#000AFF' && <span className="copied-badge">Copied!</span>}
          </div>
          <div className="color-info">
            <div className="color-name">Brand Blue</div>
            <div className="color-hex">#000AFF</div>
            <div className="color-rgb">RGB: {hexToRgb('#000AFF')}</div>
            <div className="color-hsl">HSL: {hexToHsl('#000AFF')}</div>
            <div className="color-usage">
              Primary identity color. Buttons, links, CTAs, hero backgrounds, accents. Must appear on every
              composition.
            </div>
          </div>
        </div>
        <div className="color-card" onClick={() => copyHex('#0000AF')}>
          <div className="color-swatch" style={{ background: '#0000AF' }}>
            {copiedColor === '#0000AF' && <span className="copied-badge">Copied!</span>}
          </div>
          <div className="color-info">
            <div className="color-name">Dark Blue</div>
            <div className="color-hex">#0000AF</div>
            <div className="color-rgb">RGB: {hexToRgb('#0000AF')}</div>
            <div className="color-hsl">HSL: {hexToHsl('#0000AF')}</div>
            <div className="color-usage">
              Dark mode backgrounds, footer, emphasis blocks, immersive sections. Never use for body text.
            </div>
          </div>
        </div>
        <div className="color-card" onClick={() => copyHex('#BE4200')}>
          <div className="color-swatch" style={{ background: '#BE4200' }}>
            {copiedColor === '#BE4200' && <span className="copied-badge">Copied!</span>}
          </div>
          <div className="color-info">
            <div className="color-name">Terracotta</div>
            <div className="color-hex">#BE4200</div>
            <div className="color-rgb">RGB: {hexToRgb('#BE4200')}</div>
            <div className="color-hsl">HSL: {hexToHsl('#BE4200')}</div>
            <div className="color-usage">
              Warnings, urgency, cost emphasis, competitor comparisons. The &quot;attention&quot; color.
            </div>
          </div>
        </div>
      </div>

      <h3 id="secondary-colors">Secondary Colors</h3>

      <div className="color-grid">
        <div className="color-card" onClick={() => copyHex('#F9F5EE')}>
          <div className="color-swatch" style={{ background: '#F9F5EE', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            {copiedColor === '#F9F5EE' && <span className="copied-badge">Copied!</span>}
          </div>
          <div className="color-info">
            <div className="color-name">Cream / Off-White</div>
            <div className="color-hex">#F9F5EE</div>
            <div className="color-rgb">RGB: {hexToRgb('#F9F5EE')}</div>
            <div className="color-hsl">HSL: {hexToHsl('#F9F5EE')}</div>
            <div className="color-usage">
              Light mode page backgrounds. The warm foundation of the brand. Never use pure white #FFF.
            </div>
          </div>
        </div>
        <div className="color-card" onClick={() => copyHex('#A5B2FF')}>
          <div className="color-swatch" style={{ background: '#A5B2FF' }}>
            {copiedColor === '#A5B2FF' && <span className="copied-badge">Copied!</span>}
          </div>
          <div className="color-info">
            <div className="color-name">Medium Blue</div>
            <div className="color-hex">#A5B2FF</div>
            <div className="color-rgb">RGB: {hexToRgb('#A5B2FF')}</div>
            <div className="color-hsl">HSL: {hexToHsl('#A5B2FF')}</div>
            <div className="color-usage">
              Dark mode primary interactive color. Secondary hover states. Lighter blue accents.
            </div>
          </div>
        </div>
        <div className="color-card" onClick={() => copyHex('#FFC7AA')}>
          <div className="color-swatch" style={{ background: '#FFC7AA' }}>
            {copiedColor === '#FFC7AA' && <span className="copied-badge">Copied!</span>}
          </div>
          <div className="color-info">
            <div className="color-name">Apricot</div>
            <div className="color-hex">#FFC7AA</div>
            <div className="color-rgb">RGB: {hexToRgb('#FFC7AA')}</div>
            <div className="color-hsl">HSL: {hexToHsl('#FFC7AA')}</div>
            <div className="color-usage">
              Warm accents, code language tags, badges, dark mode accent color. Welcoming and approachable.
            </div>
          </div>
        </div>
        <div className="color-card" onClick={() => copyHex('#C8E0E4')}>
          <div className="color-swatch" style={{ background: '#C8E0E4' }}>
            {copiedColor === '#C8E0E4' && <span className="copied-badge">Copied!</span>}
          </div>
          <div className="color-info">
            <div className="color-name">Sky</div>
            <div className="color-hex">#C8E0E4</div>
            <div className="color-rgb">RGB: {hexToRgb('#C8E0E4')}</div>
            <div className="color-hsl">HSL: {hexToHsl('#C8E0E4')}</div>
            <div className="color-usage">Tips, info callouts, feature card backgrounds, data visualization, charts.</div>
          </div>
        </div>
      </div>

      <h3 id="color-combinations">Color Combinations</h3>

      <p>These are the approved color pairings. Every design should use one of these combinations as its foundation.</p>

      <div className="combo-grid">
        <div className="combo-card" style={{ background: '#000AFF', color: '#fff' }}>
          Brand Blue + White
          <span className="combo-label" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Hero, CTA
          </span>
        </div>
        <div className="combo-card" style={{ background: '#F9F5EE', color: '#0000AF' }}>
          Cream + Dark Blue
          <span className="combo-label" style={{ color: 'rgba(0,0,175,0.5)' }}>
            Default pages
          </span>
        </div>
        <div className="combo-card" style={{ background: '#0000AF', color: '#A5B2FF' }}>
          Dark Blue + Medium Blue
          <span className="combo-label" style={{ color: 'rgba(165,178,255,0.5)' }}>
            Dark mode
          </span>
        </div>
        <div className="combo-card" style={{ background: '#0000AF', color: '#FFC7AA' }}>
          Dark Blue + Apricot
          <span className="combo-label" style={{ color: 'rgba(255,199,170,0.5)' }}>
            Dark accent
          </span>
        </div>
        <div className="combo-card" style={{ background: '#F9F5EE', color: '#BE4200' }}>
          Cream + Terracotta
          <span className="combo-label" style={{ color: 'rgba(190,66,0,0.5)' }}>
            Warnings
          </span>
        </div>
        <div className="combo-card" style={{ background: '#000AFF', color: '#FFC7AA' }}>
          Brand Blue + Apricot
          <span className="combo-label" style={{ color: 'rgba(255,199,170,0.5)' }}>
            Warm hero
          </span>
        </div>
      </div>

      <h3 id="css-variables-reference">CSS Variables Reference</h3>

      <p>Use these variables in all web properties:</p>

      <pre>
        <code>{cssVariablesReference}</code>
      </pre>

      <div className="brand-callout brand-callout-warning">
        <div className="brand-callout-title">IMPORTANT: The correct Brand Blue is #000AFF</div>
        <p>
          Do NOT use <code>#0026FF</code> (hue 232). The correct hue is <strong>240</strong> (pure blue), not 232
          (blue-violet). The 8-degree shift is visible and off-brand. Always verify the hex value when implementing.
        </p>
      </div>

      {/* ============================================ */}
      {/* SECTION 2: TYPOGRAPHY */}
      {/* ============================================ */}

      <div className="section-header">
        <img src="/brand/star-small-brand-blue.svg" alt="" role="presentation" />
        <h2 id="typography">Typography</h2>
      </div>

      <p>
        The AF type system uses three typefaces, each with a distinct role. Consistency in font usage is critical to
        brand recognition.
      </p>

      <h3 id="instrument-sans-primary">Instrument Sans -- Primary</h3>

      <p>The workhorse typeface. Used for all body text, headings, navigation, buttons, and UI elements.</p>

      <div className="type-specimen">
        <div className="font-label">Instrument Sans -- Regular 400 / Medium 500 / SemiBold 600 / Bold 700</div>
        <div
          className="sample-display"
          style={{ fontFamily: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif", fontWeight: 700 }}
        >
          Deploy to the decentralized cloud
        </div>
        <div className="sample-body" style={{ fontFamily: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif" }}>
          Alternate Futures provides IPFS, Filecoin, and Arweave hosting with serverless functions and AI agent
          deployment. Build the future with infrastructure that belongs to no one and everyone.
        </div>
        <div className="sample-small" style={{ fontFamily: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif" }}>
          ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !@#$%^&amp;*()
        </div>
      </div>

      <p>
        <strong>Usage:</strong> All headings (h1-h6), body paragraphs, navigation items, button labels, form fields,
        table text, sidebar content, breadcrumbs.
      </p>

      <p>
        <strong>Import:</strong> Already loaded via Adobe Typekit (<code>use.typekit.net/qqp2xqh.css</code>)
      </p>

      <h3 id="instrument-serif-accent">Instrument Serif -- Accent</h3>

      <p>
        The elegant contrast. Used sparingly for taglines, pull quotes, and italic emphasis to add sophistication.
      </p>

      <div className="type-specimen">
        <div className="font-label">Instrument Serif -- Regular 400 / Italic 400i</div>
        <div className="sample-display" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic' }}>
          Infrastructure that flows, not locks
        </div>
        <div className="sample-body" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic' }}>
          &quot;We picked up where the Web3 hosting pioneers left off. True decentralization means your data is never
          held hostage by a single provider.&quot;
        </div>
        <div className="sample-small" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !@#$%^&amp;*()
        </div>
      </div>

      <p>
        <strong>Usage:</strong> Hero taglines, blockquotes, pull quotes, sidebar section titles, testimonial
        attribution. Never use for body text or UI elements.
      </p>

      <p>
        <strong>Import:</strong> Google Fonts (<code>family=Instrument+Serif:ital@0;1</code>)
      </p>

      <h3 id="jetbrains-mono-code">JetBrains Mono -- Code</h3>

      <p>
        The developer typeface. Every code block, inline code reference, terminal output, and technical
        specification uses JetBrains Mono.
      </p>

      <div className="type-specimen">
        <div className="font-label">JetBrains Mono -- Regular 400 / Medium 500 / SemiBold 600 / Bold 700</div>
        <div
          className="sample-display"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: '1.8rem' }}
        >
          af deploy --network ipfs
        </div>
        <div className="sample-code" style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
          const af = new AlternateFuturesSdk({'{'}
          <br />
          {'  '}accessTokenService: new PersonalAccessTokenService({'{'}
          <br />
          {'    '}personalAccessToken: process.env.AF_TOKEN,
          <br />
          {'  '}
          {'}'}),
          <br />
          {'}'});
        </div>
        <div
          className="sample-small"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", marginTop: '12px' }}
        >
          ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 =&gt; !== {'{}'} [] () // /* */
        </div>
      </div>

      <p>
        <strong>Usage:</strong> Code blocks, inline <code>code</code>, terminal commands, API references, file
        paths, hex values, technical labels.
      </p>

      <p>
        <strong>Import:</strong> Google Fonts (<code>family=JetBrains+Mono:wght@400;500;600;700</code>)
      </p>

      <h3 id="type-scale">Type Scale</h3>

      <p>The size scale used across all AF properties. Sizes shown in <code>rem</code> relative to a 16px base.</p>

      <div className="type-scale">
        <div className="type-scale-row">
          <span className="scale-label">6rem / 96px</span>
          <span
            className="scale-sample"
            style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: '3rem', lineHeight: 1 }}
          >
            Display
          </span>
        </div>
        <div className="type-scale-row">
          <span className="scale-label">3rem / 48px</span>
          <span
            className="scale-sample"
            style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: '2.2rem', lineHeight: 1.1 }}
          >
            Page Title (H1)
          </span>
        </div>
        <div className="type-scale-row">
          <span className="scale-label">2rem / 32px</span>
          <span
            className="scale-sample"
            style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: '1.6rem', lineHeight: 1.2 }}
          >
            Section Heading (H2)
          </span>
        </div>
        <div className="type-scale-row">
          <span className="scale-label">1.5rem / 24px</span>
          <span
            className="scale-sample"
            style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 600, fontSize: '1.3rem', lineHeight: 1.3 }}
          >
            Subsection (H3)
          </span>
        </div>
        <div className="type-scale-row">
          <span className="scale-label">1.125rem</span>
          <span
            className="scale-sample"
            style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 600, fontSize: '1.1rem' }}
          >
            Detail Heading (H4)
          </span>
        </div>
        <div className="type-scale-row">
          <span className="scale-label">1rem / 16px</span>
          <span className="scale-sample" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '1rem' }}>
            Body text at the standard reading size
          </span>
        </div>
        <div className="type-scale-row">
          <span className="scale-label">0.875rem</span>
          <span className="scale-sample" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem' }}>
            Code blocks and technical content
          </span>
        </div>
        <div className="type-scale-row">
          <span className="scale-label">0.75rem</span>
          <span className="scale-sample" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: '0.75rem' }}>
            Captions, labels, metadata
          </span>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECTION 3: GEOMETRIC ELEMENTS */}
      {/* ============================================ */}

      <div className="section-header">
        <img src="/brand/star-small-brand-blue.svg" alt="" role="presentation" />
        <h2 id="geometric-elements">Geometric Elements</h2>
      </div>

      <p>
        The AF geometric system is the visual language that makes our brand unmistakable. Stars, circles, rings, and
        waves are used as decorative elements across all materials. The full SVG library contains{' '}
        <strong>129 assets</strong> in 7 brand colors at 4 sizes.
      </p>

      <h3 id="stars">Stars</h3>

      <p>
        Four-pointed stars represent discovery, achievement, and the expansive nature of decentralized
        infrastructure. Scatter 3-5 stars per composition at mixed sizes. Never center them symmetrically.
      </p>

      <div className="elements-gallery">
        <div className="element-card">
          <img src="/brand/star-small-brand-blue.svg" alt="Brand Blue star" />
          <div className="element-name">
            star-small
            <br />
            brand-blue
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/star-small-terracotta.svg" alt="Terracotta star" />
          <div className="element-name">
            star-small
            <br />
            terracotta
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/star-small-apricot.svg" alt="Apricot star" />
          <div className="element-name">
            star-small
            <br />
            apricot
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/star-small-off-white.svg" alt="Off-White star" />
          <div className="element-name">
            star-small
            <br />
            off-white
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/star-small-medium-blue.svg" alt="Medium Blue star" />
          <div className="element-name">
            star-small
            <br />
            medium-blue
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/star-small-sky.svg" alt="Sky star" />
          <div className="element-name">
            star-small
            <br />
            sky
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/star-small-dark-blue.svg" alt="Dark Blue star" />
          <div className="element-name">
            star-small
            <br />
            dark-blue
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/star-medium-brand-blue.svg" alt="Medium Brand Blue star" />
          <div className="element-name">
            star-medium
            <br />
            brand-blue
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/star-medium-terracotta.svg" alt="Medium Terracotta star" />
          <div className="element-name">
            star-medium
            <br />
            terracotta
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/star-medium-apricot.svg" alt="Medium Apricot star" />
          <div className="element-name">
            star-medium
            <br />
            apricot
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/star-large-brand-blue.svg" alt="Large Brand Blue star" />
          <div className="element-name">
            star-large
            <br />
            brand-blue
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/star-xl-brand-blue.svg" alt="XL Brand Blue star" />
          <div className="element-name">
            star-xl
            <br />
            brand-blue
          </div>
        </div>
      </div>

      <h3 id="circles">Circles</h3>

      <p>
        Solid filled circles represent completeness, ROI, and unity. Use for bullet markers, data points, and small
        decorative fills.
      </p>

      <div className="elements-gallery">
        <div className="element-card">
          <img src="/brand/circle-small-brand-blue.svg" alt="Brand Blue circle" />
          <div className="element-name">
            circle-small
            <br />
            brand-blue
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/circle-small-sky.svg" alt="Sky circle" />
          <div className="element-name">
            circle-small
            <br />
            sky
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/circle-small-apricot.svg" alt="Apricot circle" />
          <div className="element-name">
            circle-small
            <br />
            apricot
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/circle-medium-brand-blue.svg" alt="Medium Brand Blue circle" />
          <div className="element-name">
            circle-medium
            <br />
            brand-blue
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/circle-medium-sky.svg" alt="Medium Sky circle" />
          <div className="element-name">
            circle-medium
            <br />
            sky
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/circle-large-brand-blue.svg" alt="Large Brand Blue circle" />
          <div className="element-name">
            circle-large
            <br />
            brand-blue
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/circle-xl-brand-blue.svg" alt="XL Brand Blue circle" />
          <div className="element-name">
            circle-xl
            <br />
            brand-blue
          </div>
        </div>
      </div>

      <h3 id="rings">Rings</h3>

      <p>
        Open rings (stroke-only circles) represent networks, connections, and decentralized infrastructure. Use for
        corner decorations and network visualizations.
      </p>

      <div className="elements-gallery">
        <div className="element-card">
          <img src="/brand/ring-small-brand-blue.svg" alt="Small Brand Blue ring" />
          <div className="element-name">
            ring-small
            <br />
            brand-blue
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/ring-small-apricot.svg" alt="Small Apricot ring" />
          <div className="element-name">
            ring-small
            <br />
            apricot
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/ring-medium-brand-blue.svg" alt="Medium Brand Blue ring" />
          <div className="element-name">
            ring-medium
            <br />
            brand-blue
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/ring-medium-medium-blue.svg" alt="Medium Medium Blue ring" />
          <div className="element-name">
            ring-medium
            <br />
            medium-blue
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/ring-large-brand-blue.svg" alt="Large Brand Blue ring" />
          <div className="element-name">
            ring-large
            <br />
            brand-blue
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/ring-large-terracotta.svg" alt="Large Terracotta ring" />
          <div className="element-name">
            ring-large
            <br />
            terracotta
          </div>
        </div>
        <div className="element-card">
          <img src="/brand/ring-xl-brand-blue.svg" alt="XL Brand Blue ring" />
          <div className="element-name">
            ring-xl
            <br />
            brand-blue
          </div>
        </div>
      </div>

      <h3 id="waves">Waves</h3>

      <p>
        Full-width wave shapes serve as section dividers, footer decorations, and background textures. Available at
        solid, 10%, 20%, and 30% opacity in all 7 brand colors.
      </p>

      <div className="wave-gallery">
        <div className="wave-card">
          <img src="/brand/wave-brand-blue.svg" alt="Brand Blue wave (solid)" />
          <div className="wave-label">wave-brand-blue.svg (solid) -- footer backgrounds, hero transitions</div>
        </div>
        <div className="wave-card">
          <img src="/brand/wave-brand-blue-10.svg" alt="Brand Blue wave (10%)" />
          <div className="wave-label">wave-brand-blue-10.svg (10% opacity) -- subtle section dividers</div>
        </div>
        <div className="wave-card">
          <img src="/brand/wave-brand-blue-20.svg" alt="Brand Blue wave (20%)" />
          <div className="wave-label">wave-brand-blue-20.svg (20% opacity) -- medium emphasis dividers</div>
        </div>
        <div className="wave-card dark-bg">
          <img src="/brand/wave-off-white-10.svg" alt="Off-White wave (10%)" />
          <div className="wave-label">wave-off-white-10.svg (10% opacity on Dark Blue) -- dark mode dividers</div>
        </div>
        <div className="wave-card dark-bg">
          <img src="/brand/wave-off-white.svg" alt="Off-White wave (solid)" />
          <div className="wave-label">
            wave-off-white.svg (solid on Dark Blue) -- dark mode section transitions
          </div>
        </div>
      </div>

      <h3 id="decorative-compositions">Decorative Compositions</h3>

      <p>
        Pre-composed groups of stars, circles, and rings for use as hero decorations and section accents. Three
        color temperature variants: brand (blue-dominant), cool (blue + sky), and warm (terracotta + apricot).
      </p>

      <div className="composition-grid">
        <div className="composition-card">
          <img src="/brand/decorative-medium-brand.svg" alt="Brand decorative composition" />
          <div className="comp-name">decorative-medium-brand</div>
        </div>
        <div className="composition-card">
          <img src="/brand/decorative-medium-cool.svg" alt="Cool decorative composition" />
          <div className="comp-name">decorative-medium-cool</div>
        </div>
        <div className="composition-card">
          <img src="/brand/decorative-medium-warm.svg" alt="Warm decorative composition" />
          <div className="comp-name">decorative-medium-warm</div>
        </div>
        <div className="composition-card">
          <img src="/brand/decorative-large-brand.svg" alt="Large brand decorative composition" />
          <div className="comp-name">decorative-large-brand</div>
        </div>
      </div>

      <h3 id="element-usage-rules">Element Usage Rules</h3>

      <table>
        <thead>
          <tr>
            <th>Rule</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Max 2 element types</strong>
            </td>
            <td>Never use more than 2 geometric types (e.g., stars + rings) in a single composition</td>
          </tr>
          <tr>
            <td>
              <strong>Asymmetric placement</strong>
            </td>
            <td>Stars must be scattered asymmetrically. Never center or arrange them in a grid</td>
          </tr>
          <tr>
            <td>
              <strong>3-5 stars per composition</strong>
            </td>
            <td>Mix sizes (S + M, or S + L). Never use all the same size</td>
          </tr>
          <tr>
            <td>
              <strong>Rings in corners</strong>
            </td>
            <td>Rings work best as corner decorations, partially cropped by the frame</td>
          </tr>
          <tr>
            <td>
              <strong>Waves as dividers</strong>
            </td>
            <td>Waves always span the full width. Use 10% opacity for subtle, solid for strong</td>
          </tr>
          <tr>
            <td>
              <strong>Circles as accents</strong>
            </td>
            <td>Small circles for bullet points and data markers. Never as primary decoration</td>
          </tr>
          <tr>
            <td>
              <strong>Opacity range</strong>
            </td>
            <td>Decorative elements at 6-30% opacity on light backgrounds. 8-20% on dark backgrounds</td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* ============================================ */}
      {/* SECTION 4: LOGO USAGE */}
      {/* ============================================ */}

      <div className="section-header">
        <img src="/brand/ring-medium-brand-blue.svg" alt="" role="presentation" />
        <h2 id="logo-usage">Logo Usage</h2>
      </div>

      <p>
        The AF logo exists in two forms: the <strong>logomark</strong> (&quot;AF&quot; monogram) and the{' '}
        <strong>wordmark</strong> (full &quot;AlternateFutures&quot; text). Both use{' '}
        <code>var(--fill-0, #000AFF)</code> for theme-aware rendering.
      </p>

      <h3 id="logo-variants">Logo Variants</h3>

      <div className="logo-grid">
        <div className="logo-card" style={{ background: '#F9F5EE' }}>
          <img src="/logo.svg" alt="AF logomark on cream" style={{ maxWidth: '60px' }} />
          <div className="logo-label">Logomark on Cream</div>
        </div>
        <div className="logo-card" style={{ background: '#000AFF' }}>
          <img
            src="/logo.svg"
            alt="AF logomark on Brand Blue"
            style={{ maxWidth: '60px', filter: 'brightness(0) invert(1)' }}
          />
          <div className="logo-label" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Logomark on Brand Blue
          </div>
        </div>
        <div className="logo-card" style={{ background: '#0000AF' }}>
          <img
            src="/logo.svg"
            alt="AF logomark on Dark Blue"
            style={{ maxWidth: '60px', filter: 'brightness(0) invert(1)' }}
          />
          <div className="logo-label" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Logomark on Dark Blue
          </div>
        </div>
        <div className="logo-card" style={{ background: '#F9F5EE' }}>
          <img src="/wordmark.svg" alt="AF wordmark on cream" style={{ maxWidth: '280px' }} />
          <div className="logo-label">Full Wordmark on Cream</div>
        </div>
        <div className="logo-card" style={{ background: '#000AFF' }}>
          <img
            src="/wordmark.svg"
            alt="AF wordmark on Brand Blue"
            style={{ maxWidth: '280px', filter: 'brightness(0) invert(1)' }}
          />
          <div className="logo-label" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Full Wordmark on Brand Blue
          </div>
        </div>
        <div className="logo-card" style={{ background: '#0A0A0A' }}>
          <img
            src="/wordmark.svg"
            alt="AF wordmark on black"
            style={{ maxWidth: '280px', filter: 'brightness(0) invert(1)' }}
          />
          <div className="logo-label" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Full Wordmark on Dark
          </div>
        </div>
      </div>

      <h3 id="clear-space">Clear Space</h3>

      <p>
        The minimum clear space around the logo is equal to the height of the &quot;F&quot; in the logomark. No text,
        images, or other design elements should intrude into this space.
      </p>

      <div className="clearspace-demo">
        <div className="clearspace-box">
          <span className="cs-label cs-top">1x height of &quot;F&quot;</span>
          <span className="cs-label cs-right">1x</span>
          <span className="cs-label cs-bottom">1x</span>
          <span className="cs-label cs-left">1x</span>
          <img src="/logo.svg" alt="Logo with clear space" style={{ width: '80px' }} />
        </div>
      </div>

      <h3 id="minimum-size">Minimum Size</h3>

      <ul>
        <li>
          <strong>Logomark:</strong> Minimum 24px wide (digital), 10mm (print)
        </li>
        <li>
          <strong>Wordmark:</strong> Minimum 120px wide (digital), 40mm (print)
        </li>
        <li>Below these sizes, the letterforms become illegible</li>
      </ul>

      <h3 id="approved-backgrounds">Approved Backgrounds</h3>

      <p>The logo may be placed on:</p>

      <table>
        <thead>
          <tr>
            <th>Background</th>
            <th>Logo Color</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Cream <code>#F9F5EE</code>
            </td>
            <td>
              Brand Blue <code>#000AFF</code>
            </td>
            <td>Default / primary usage</td>
          </tr>
          <tr>
            <td>
              White <code>#FFFFFF</code>
            </td>
            <td>
              Brand Blue <code>#000AFF</code>
            </td>
            <td>Acceptable for partner co-branding</td>
          </tr>
          <tr>
            <td>
              Brand Blue <code>#000AFF</code>
            </td>
            <td>
              White <code>#FFFFFF</code>
            </td>
            <td>Hero sections, branded materials</td>
          </tr>
          <tr>
            <td>
              Dark Blue <code>#0000AF</code>
            </td>
            <td>
              White <code>#FFFFFF</code>
            </td>
            <td>Dark mode, footer</td>
          </tr>
          <tr>
            <td>
              Black <code>#0A0A0A</code>
            </td>
            <td>
              White <code>#FFFFFF</code>
            </td>
            <td>Dark mode only</td>
          </tr>
        </tbody>
      </table>

      <div className="brand-callout brand-callout-danger">
        <div className="brand-callout-title">Logo Prohibitions</div>
        <ul>
          <li>Never apply drop shadows, glows, outlines, or bevels to the logo</li>
          <li>Never rotate, skew, stretch, or compress the logo</li>
          <li>Never place the logo on busy photographic backgrounds</li>
          <li>Never change the logo colors to non-brand colors</li>
          <li>Never rearrange or separate the &quot;A&quot; and &quot;F&quot; letterforms</li>
          <li>
            Never use the old <code>#0026FF</code> color in the logo
          </li>
        </ul>
      </div>

      <hr />

      {/* ============================================ */}
      {/* SECTION 5: BRAND VOICE & TONE */}
      {/* ============================================ */}

      <div className="section-header">
        <img src="/brand/star-small-apricot.svg" alt="" role="presentation" />
        <h2 id="brand-voice">Brand Voice &amp; Tone</h2>
      </div>

      <p>
        The AF brand voice is how we sound in every written communication -- docs, blog posts, social media, support
        conversations, and investor materials. It should feel like a conversation with a technically brilliant
        friend who respects your time.
      </p>

      <h3 id="voice-traits">Voice Traits</h3>

      <div className="voice-grid">
        <div className="voice-card">
          <div className="voice-trait">Technical but Accessible</div>
          <div className="voice-desc">
            We write for developers but never assume everyone has the same background. Explain concepts when they
            first appear. Provide runnable examples, not just theory.
          </div>
        </div>
        <div className="voice-card">
          <div className="voice-trait">Confident, Not Arrogant</div>
          <div className="voice-desc">
            We are proud of what we have built but honest about what is still in progress. &quot;We are building the
            future of cloud&quot; -- not &quot;we are better than everyone.&quot;
          </div>
        </div>
        <div className="voice-card">
          <div className="voice-trait">Honest About Limitations</div>
          <div className="voice-desc">
            If a feature is in beta, say so. If there is a known issue, document it. Developers trust transparent
            platforms. They abandon ones that hide problems.
          </div>
        </div>
        <div className="voice-card">
          <div className="voice-trait">Developer-to-Developer</div>
          <div className="voice-desc">
            Write as one builder to another. Skip the corporate voice. Use &quot;you&quot; and &quot;we.&quot; Show
            the actual terminal output. Include error messages and how to fix them.
          </div>
        </div>
        <div className="voice-card">
          <div className="voice-trait">Warm, Not Corporate</div>
          <div className="voice-desc">
            Our cream backgrounds and apricot accents are not decorative -- they signal that this platform welcomes
            you. The voice should match: helpful, patient, and human.
          </div>
        </div>
        <div className="voice-card">
          <div className="voice-trait">Precise and Scannable</div>
          <div className="voice-desc">
            Developers scan, then read. Lead with the answer. Use bullet points for lists. Put commands in code
            blocks. Make every paragraph earn its place.
          </div>
        </div>
      </div>

      <h3 id="tone-spectrum">Tone Spectrum</h3>

      <p>The same voice can shift tone depending on context:</p>

      <table>
        <thead>
          <tr>
            <th>Context</th>
            <th>Tone</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Documentation</strong>
            </td>
            <td>Instructional, precise, neutral</td>
            <td>
              &quot;Run <code>af deploy</code> to push your site to IPFS. The CLI will return a CID and preview
              URL.&quot;
            </td>
          </tr>
          <tr>
            <td>
              <strong>Blog posts</strong>
            </td>
            <td>Conversational, informative</td>
            <td>
              &quot;We shipped a big update this week -- here is what changed and why it matters for your
              workflow.&quot;
            </td>
          </tr>
          <tr>
            <td>
              <strong>Error messages</strong>
            </td>
            <td>Helpful, never blaming</td>
            <td>
              &quot;Deployment failed: the build command exited with code 1. Check your package.json
              scripts.&quot;
            </td>
          </tr>
          <tr>
            <td>
              <strong>Social media</strong>
            </td>
            <td>Energetic, concise</td>
            <td>
              &quot;60% cheaper than Vercel. Same features. Decentralized infrastructure. Your margins intact.&quot;
            </td>
          </tr>
          <tr>
            <td>
              <strong>Investor materials</strong>
            </td>
            <td>Confident, data-driven</td>
            <td>
              &quot;The Web3 hosting market lost its two largest players in 2025. AF captured the vacuum.&quot;
            </td>
          </tr>
          <tr>
            <td>
              <strong>Community/Discord</strong>
            </td>
            <td>Casual, supportive</td>
            <td>
              &quot;Good question! That is a known issue in v0.9.2 -- here is the workaround until the fix
              ships.&quot;
            </td>
          </tr>
        </tbody>
      </table>

      <h3 id="terminology">Terminology</h3>

      <p>Always use these standard terms:</p>

      <table>
        <thead>
          <tr>
            <th>Term</th>
            <th>Usage</th>
            <th>Avoid</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Alternate Futures</strong>
            </td>
            <td>Full company name (first mention in any document)</td>
            <td>&quot;Alt Futures&quot;, &quot;AltFut&quot;, &quot;A.F.&quot;</td>
          </tr>
          <tr>
            <td>
              <strong>AF</strong>
            </td>
            <td>Acceptable abbreviation after first mention</td>
            <td>Any other abbreviation</td>
          </tr>
          <tr>
            <td>
              <strong>deploy</strong>
            </td>
            <td>Lowercase verb for the deployment action</td>
            <td>&quot;push&quot;, &quot;ship&quot;, &quot;launch&quot; (in technical docs)</td>
          </tr>
          <tr>
            <td>
              <strong>site</strong>
            </td>
            <td>A static website deployment</td>
            <td>&quot;app&quot; (when referring to static hosting)</td>
          </tr>
          <tr>
            <td>
              <strong>function</strong>
            </td>
            <td>A serverless cloud function</td>
            <td>&quot;lambda&quot;, &quot;endpoint&quot;</td>
          </tr>
          <tr>
            <td>
              <strong>agent</strong>
            </td>
            <td>An AI agent deployment</td>
            <td>&quot;bot&quot;, &quot;model&quot; (when referring to hosted agents)</td>
          </tr>
          <tr>
            <td>
              <strong>decentralized</strong>
            </td>
            <td>Preferred. Describes the infrastructure model</td>
            <td>&quot;distributed&quot; (unless technically accurate)</td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* ============================================ */}
      {/* SECTION 6: DO / DON'T */}
      {/* ============================================ */}

      <div className="section-header">
        <img src="/brand/ring-medium-brand-blue.svg" alt="" role="presentation" />
        <h2 id="dos-and-donts">Do&apos;s and Don&apos;ts</h2>
      </div>

      <h3 id="color-usage">Color Usage</h3>

      <div className="dodont-grid">
        <div className="dodont-card do-card">
          <div className="dodont-label">DO</div>
          <div className="dodont-text">
            Use Brand Blue <code>#000AFF</code> as the primary accent on every page and composition. It is the
            anchor of the visual system.
          </div>
        </div>
        <div className="dodont-card dont-card">
          <div className="dodont-label">DON&apos;T</div>
          <div className="dodont-text">
            Use <code>#0026FF</code>, <code>#0000FF</code>, or any other blue as a substitute. The 8-degree hue
            shift between 232 and 240 is visible and off-brand.
          </div>
        </div>
        <div className="dodont-card do-card">
          <div className="dodont-label">DO</div>
          <div className="dodont-text">
            Use Cream <code>#F9F5EE</code> as the light mode background. The warm tone is a core part of the brand
            identity.
          </div>
        </div>
        <div className="dodont-card dont-card">
          <div className="dodont-label">DON&apos;T</div>
          <div className="dodont-text">
            Use pure white <code>#FFFFFF</code> as a page background. It looks sterile and clashes with the warm
            palette. White is only for text on dark surfaces.
          </div>
        </div>
        <div className="dodont-card do-card">
          <div className="dodont-label">DO</div>
          <div className="dodont-text">
            Use Terracotta exclusively for warnings and urgency. It signals &quot;pay attention&quot; within the
            palette hierarchy.
          </div>
        </div>
        <div className="dodont-card dont-card">
          <div className="dodont-label">DON&apos;T</div>
          <div className="dodont-text">
            Use Terracotta for primary buttons, headers, or decorative elements. It is not an accent color -- it is
            the alert color.
          </div>
        </div>
      </div>

      <h3 id="typography-1">Typography</h3>

      <div className="dodont-grid">
        <div className="dodont-card do-card">
          <div className="dodont-label">DO</div>
          <div className="dodont-text">
            Use Instrument Serif only for taglines, blockquotes, and pull quotes. It provides elegant contrast at
            specific moments.
          </div>
        </div>
        <div className="dodont-card dont-card">
          <div className="dodont-label">DON&apos;T</div>
          <div className="dodont-text">
            Use Instrument Serif for body text, navigation, buttons, or form fields. The serif font is an accent,
            not a workhorse.
          </div>
        </div>
        <div className="dodont-card do-card">
          <div className="dodont-label">DO</div>
          <div className="dodont-text">
            Use JetBrains Mono for all code. Enable ligatures (<code>font-feature-settings: &apos;liga&apos; 1,
            &apos;calt&apos; 1</code>) for enhanced readability.
          </div>
        </div>
        <div className="dodont-card dont-card">
          <div className="dodont-label">DON&apos;T</div>
          <div className="dodont-text">
            Fall back to system monospace fonts like Menlo, Monaco, or Courier. JetBrains Mono is part of the brand
            experience.
          </div>
        </div>
      </div>

      <h3 id="geometric-elements-1">Geometric Elements</h3>

      <div className="dodont-grid">
        <div className="dodont-card do-card">
          <div className="dodont-label">DO</div>
          <div className="dodont-text">
            Scatter stars asymmetrically at mixed sizes (3-5 per composition). The organic randomness creates visual
            energy.
          </div>
        </div>
        <div className="dodont-card dont-card">
          <div className="dodont-label">DON&apos;T</div>
          <div className="dodont-text">
            Arrange geometric elements in a grid, line them up symmetrically, or center them. That kills the
            dynamic, organic quality of the brand.
          </div>
        </div>
        <div className="dodont-card do-card">
          <div className="dodont-label">DO</div>
          <div className="dodont-text">
            Use max 2 geometric element types per composition (e.g., stars + rings, or waves + circles). Restraint
            creates elegance.
          </div>
        </div>
        <div className="dodont-card dont-card">
          <div className="dodont-label">DON&apos;T</div>
          <div className="dodont-text">
            Mix stars, circles, rings, and waves all at once. More than 2 types creates visual noise, not visual
            identity.
          </div>
        </div>
        <div className="dodont-card do-card">
          <div className="dodont-label">DO</div>
          <div className="dodont-text">
            Use only SVGs from the approved asset library (<code>/brand/</code> directory). These are
            precision-crafted to the brand specifications.
          </div>
        </div>
        <div className="dodont-card dont-card">
          <div className="dodont-label">DON&apos;T</div>
          <div className="dodont-text">
            Create custom geometric elements, use emoji as visual substitutes, or source shapes from icon libraries.
            The brand shapes are not generic.
          </div>
        </div>
      </div>

      <h3 id="voice-and-content">Voice and Content</h3>

      <div className="dodont-grid">
        <div className="dodont-card do-card">
          <div className="dodont-label">DO</div>
          <div className="dodont-text">
            Position Akash, IPFS, Filecoin, Arweave, and ICP as valued infrastructure partners. Their strength is our
            strength.
          </div>
        </div>
        <div className="dodont-card dont-card">
          <div className="dodont-label">DON&apos;T</div>
          <div className="dodont-text">
            Criticize, compare negatively, or dismiss any decentralized infrastructure partner. We are building on
            top of their work.
          </div>
        </div>
        <div className="dodont-card do-card">
          <div className="dodont-label">DO</div>
          <div className="dodont-text">
            Acknowledge beta status, known issues, and work-in-progress features explicitly. Developers trust
            transparency.
          </div>
        </div>
        <div className="dodont-card dont-card">
          <div className="dodont-label">DON&apos;T</div>
          <div className="dodont-text">
            Overstate capabilities, claim production-readiness before it is true, or use superlatives like &quot;the
            best&quot; or &quot;the most powerful.&quot;
          </div>
        </div>
        <div className="dodont-card do-card">
          <div className="dodont-label">DO</div>
          <div className="dodont-text">
            Show real CLI output, actual error messages, and working code examples. Developers verify claims by
            trying them.
          </div>
        </div>
        <div className="dodont-card dont-card">
          <div className="dodont-label">DON&apos;T</div>
          <div className="dodont-text">
            Use stock photography, generic illustrations, or AI-generated images that don&apos;t match the geometric
            brand system.
          </div>
        </div>
      </div>

      <h3 id="photography-and-imagery">Photography and Imagery</h3>

      <div className="dodont-grid">
        <div className="dodont-card do-card">
          <div className="dodont-label">DO</div>
          <div className="dodont-text">
            Use abstract geometric shapes from the SVG library as visual elements. The brand is built on shapes, not
            photos.
          </div>
        </div>
        <div className="dodont-card dont-card">
          <div className="dodont-label">DON&apos;T</div>
          <div className="dodont-text">
            Use stock photography of any kind. If a human image is absolutely required, apply a Brand Blue duotone
            at 30% opacity.
          </div>
        </div>
      </div>

      <hr />

      {/* ============================================ */}
      {/* SECTION 7: DARK MODE */}
      {/* ============================================ */}

      <div className="section-header">
        <img src="/brand/star-small-medium-blue.svg" alt="" role="presentation" />
        <h2 id="dark-mode">Dark Mode</h2>
      </div>

      <p>
        Dark mode is not an inversion -- it is an adaptation. The brand guidelines specify Dark Blue{' '}
        <code>#0000AF</code> as the immersive background color. For extended reading (documentation), we use
        near-black <code>#0A0A0A</code> for reduced eye strain, reserving Dark Blue for footer, hero, and emphasis
        sections.
      </p>

      <h3 id="dark-mode-palette">Dark Mode Palette</h3>

      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Light Mode</th>
            <th>Dark Mode</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Page background</td>
            <td>
              Cream <code>#F9F5EE</code>
            </td>
            <td>
              Near-black <code>#0A0A0A</code>
            </td>
          </tr>
          <tr>
            <td>Card/surface background</td>
            <td>
              White <code>#FFFFFF</code>
            </td>
            <td>
              Dark surface <code>#141414</code>
            </td>
          </tr>
          <tr>
            <td>Primary interactive</td>
            <td>
              Brand Blue <code>#000AFF</code>
            </td>
            <td>
              Medium Blue <code>#A5B2FF</code>
            </td>
          </tr>
          <tr>
            <td>Primary hover</td>
            <td>
              <code>#0008CC</code>
            </td>
            <td>
              <code>#B8C3FF</code>
            </td>
          </tr>
          <tr>
            <td>Accent warm</td>
            <td>
              Terracotta <code>#BE4200</code>
            </td>
            <td>
              Apricot <code>#FFC7AA</code>
            </td>
          </tr>
          <tr>
            <td>Footer / emphasis bg</td>
            <td>
              Brand Blue <code>#000AFF</code>
            </td>
            <td>
              Dark Blue <code>#0000AF</code>
            </td>
          </tr>
          <tr>
            <td>Body text</td>
            <td>
              Dark <code>#1a1a1a</code>
            </td>
            <td>
              Cream <code>#F9F5EE</code>
            </td>
          </tr>
          <tr>
            <td>Geometric elements</td>
            <td>Brand Blue at 6-30% opacity</td>
            <td>Off-White or Medium Blue at 8-20% opacity</td>
          </tr>
        </tbody>
      </table>

      <h3 id="dark-mode-geometric-elements">Dark Mode Geometric Elements</h3>

      <p>All geometric brand elements need dark mode variants:</p>

      <table>
        <thead>
          <tr>
            <th>Light Mode Asset</th>
            <th>Dark Mode Treatment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>star-*-brand-blue.svg</code>
            </td>
            <td>
              Use <code>star-*-off-white.svg</code> or <code>filter: brightness(3)</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>ring-*-brand-blue.svg</code>
            </td>
            <td>
              Apply <code>filter: brightness(3) saturate(0.5)</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>wave-brand-blue-*.svg</code>
            </td>
            <td>
              Use <code>wave-off-white-*.svg</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>decorative-*-brand.svg</code>
            </td>
            <td>
              Use <code>decorative-*-cool.svg</code> or apply <code>filter: brightness(2)</code>
            </td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* ============================================ */}
      {/* SECTION 8: ASSET LIBRARY */}
      {/* ============================================ */}

      <div className="section-header">
        <img src="/brand/circle-small-brand-blue.svg" alt="" role="presentation" />
        <h2 id="asset-library">Asset Library</h2>
      </div>

      <h3 id="full-svg-inventory">Full SVG Inventory</h3>

      <p>
        The complete brand asset library contains <strong>129 SVG elements</strong> organized by type:
      </p>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
            <th>Sizes</th>
            <th>Colors</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Stars</strong>
            </td>
            <td>28</td>
            <td>S (24px), M (48px), L (96px), XL (144px)</td>
            <td>7 brand colors</td>
          </tr>
          <tr>
            <td>
              <strong>Circles</strong>
            </td>
            <td>28</td>
            <td>S (24px), M (48px), L (96px), XL (144px)</td>
            <td>7 brand colors</td>
          </tr>
          <tr>
            <td>
              <strong>Rings</strong>
            </td>
            <td>28</td>
            <td>S (24px), M (48px), L (96px), XL (144px)</td>
            <td>7 brand colors</td>
          </tr>
          <tr>
            <td>
              <strong>Waves</strong>
            </td>
            <td>28</td>
            <td>Full-width (1920px)</td>
            <td>7 colors x (solid + 10% + 20% + 30% opacity)</td>
          </tr>
          <tr>
            <td>
              <strong>Decorative Groups</strong>
            </td>
            <td>12</td>
            <td>S, M, L, XL</td>
            <td>brand, cool, warm variants</td>
          </tr>
          <tr>
            <td>
              <strong>Logos</strong>
            </td>
            <td>2</td>
            <td>Logomark (35x32), Wordmark (600x139)</td>
            <td>
              Theme-aware <code>var(--fill-0)</code>
            </td>
          </tr>
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td>
              <strong>126 + 2 logos</strong>
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <h3 id="file-naming-convention">File Naming Convention</h3>

      <pre>
        <code>{fileNamingConvention}</code>
      </pre>

      <p>Where:</p>

      <ul>
        <li>
          <strong>type:</strong> <code>star</code>, <code>circle</code>, <code>ring</code>, <code>wave</code>,{' '}
          <code>decorative</code>
        </li>
        <li>
          <strong>size:</strong> <code>small</code>, <code>medium</code>, <code>large</code>, <code>xl</code>
        </li>
        <li>
          <strong>color:</strong> <code>brand-blue</code>, <code>dark-blue</code>, <code>medium-blue</code>,{' '}
          <code>terracotta</code>, <code>apricot</code>, <code>sky</code>, <code>off-white</code>
        </li>
        <li>
          <strong>opacity suffix (waves only):</strong> <code>-10</code>, <code>-20</code>, <code>-30</code> (omit
          for solid)
        </li>
      </ul>

      <p>
        Examples: <code>star-small-brand-blue.svg</code>, <code>wave-terracotta-20.svg</code>,{' '}
        <code>decorative-large-warm.svg</code>
      </p>

      <h3 id="source-of-truth">Source of Truth</h3>

      <ul>
        <li>
          <strong>Figma file:</strong>{' '}
          <a href="https://www.figma.com/design/wmHC1PQgGehvppFrQnJwW0/AF-Branding-2026">AF-Branding-2026</a>
        </li>
        <li>
          <strong>SVG source directory:</strong> <code>admin/docs/pitch-deck-assets/</code>
        </li>
        <li>
          <strong>Docs public assets:</strong> <code>docs/public/brand/</code>
        </li>
      </ul>

      <hr />

      {/* ============================================ */}
      {/* SECTION 9: QUICK REFERENCE */}
      {/* ============================================ */}

      <div className="section-header">
        <img src="/brand/star-small-terracotta.svg" alt="" role="presentation" />
        <h2 id="quick-reference">Quick Reference</h2>
      </div>

      <h3 id="brand-compliance-checklist">Brand Compliance Checklist</h3>

      <p>Use this checklist before publishing any external-facing material:</p>

      <ul className="checklist">
        <li>
          <input type="checkbox" disabled />
          <span>
            <strong>Color check:</strong> Only palette colors used? Brand Blue <code>#000AFF</code> present?
          </span>
        </li>
        <li>
          <input type="checkbox" disabled />
          <span>
            <strong>Typography check:</strong> Instrument Sans for body/headings? Instrument Serif for accents only?
            JetBrains Mono for code?
          </span>
        </li>
        <li>
          <input type="checkbox" disabled />
          <span>
            <strong>Element check:</strong> Geometric elements from approved SVG library only? Max 2 types per
            composition?
          </span>
        </li>
        <li>
          <input type="checkbox" disabled />
          <span>
            <strong>Logo check:</strong> Correct clear space? Correct color on correct background? No modifications?
          </span>
        </li>
        <li>
          <input type="checkbox" disabled />
          <span>
            <strong>Tone check:</strong> Developer-to-developer voice? Technical but accessible? Honest about
            limitations?
          </span>
        </li>
        <li>
          <input type="checkbox" disabled />
          <span>
            <strong>Partner check:</strong> Akash, IPFS, Filecoin, Arweave, ICP positioned positively?
          </span>
        </li>
        <li>
          <input type="checkbox" disabled />
          <span>
            <strong>Dark mode check:</strong> Medium Blue for primary interactive? Off-white geometric elements?
            Proper contrast ratios?
          </span>
        </li>
      </ul>

      <h3 id="css-import-snippet">CSS Import Snippet</h3>

      <p>For any new web property, include these imports:</p>

      <pre>
        <code>{cssImportSnippet}</code>
      </pre>

      <h3 id="contact">Contact</h3>

      <p>
        Brand questions and compliance reviews go to the <strong>Brand Guardian</strong> agent or the Creative
        Director (Pixel / Yusuke). For urgent brand violations, flag in the <code>#brand-review</code> channel.
      </p>

      <hr />

      <div style={{ textAlign: 'center', padding: '32px 0', opacity: 0.4 }}>
        <img
          src="/brand/star-small-brand-blue.svg"
          alt=""
          role="presentation"
          style={{ display: 'inline-block', width: '12px', margin: '0 8px' }}
        />
        <img
          src="/brand/star-small-brand-blue.svg"
          alt=""
          role="presentation"
          style={{ display: 'inline-block', width: '8px', margin: '0 8px' }}
        />
        <img
          src="/brand/star-small-brand-blue.svg"
          alt=""
          role="presentation"
          style={{ display: 'inline-block', width: '12px', margin: '0 8px' }}
        />
      </div>
    </div>
  );
}
