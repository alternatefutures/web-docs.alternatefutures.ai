---
title: Brand Guide
description: The complete visual identity reference for Alternate Futures — colors, typography, geometric elements, logo usage, voice, and guidelines.
---

<script setup>
import { ref } from 'vue'

const copiedColor = ref('')

function copyHex(hex) {
  navigator.clipboard.writeText(hex)
  copiedColor.value = hex
  setTimeout(() => { copiedColor.value = '' }, 1500)
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) { h = s = 0 }
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
}
</script>

<style>
/* ===== BRAND GUIDE PAGE STYLES ===== */

/* Hero banner */
.brand-hero {
  background: #000AFF;
  border-radius: 16px;
  padding: 48px 40px;
  margin: -8px 0 40px 0;
  position: relative;
  overflow: hidden;
  color: #fff;
}
.brand-hero h1 {
  font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  font-weight: 700;
  font-size: 2.4rem;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
  color: #fff !important;
  border: none !important;
}
.brand-hero .subtitle {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-size: 1.2rem;
  opacity: 0.85;
  margin: 0;
}
.brand-hero .deco-star {
  position: absolute;
  opacity: 0.18;
  pointer-events: none;
}
.brand-hero .deco-star-1 { top: 16px; right: 24px; width: 48px; }
.brand-hero .deco-star-2 { bottom: 20px; right: 100px; width: 24px; }
.brand-hero .deco-star-3 { top: 40px; right: 140px; width: 32px; }
.brand-hero .deco-ring { position: absolute; bottom: -20px; left: -20px; width: 96px; opacity: 0.1; pointer-events: none; }
.brand-hero .deco-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 68px;
  opacity: 0.12;
  pointer-events: none;
}
.brand-hero .deco-wave img {
  width: 100%;
  height: 100%;
  display: block;
}

/* Section headers with geometric accent */
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 48px 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 3px solid #000AFF;
}
.section-header img {
  width: 28px;
  height: 28px;
  opacity: 0.6;
}
.section-header h2 {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.6rem;
}

/* Color palette grid */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin: 24px 0 32px 0;
}
.color-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  background: #fff;
  cursor: pointer;
}
.color-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
.color-swatch {
  height: 100px;
  display: flex;
  align-items: flex-end;
  padding: 10px 14px;
  position: relative;
}
.color-swatch .copied-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.7);
  color: #fff;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}
.color-info {
  padding: 14px;
}
.color-info .color-name {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 2px;
  font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
}
.color-info .color-hex {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 4px;
}
.color-info .color-rgb,
.color-info .color-hsl {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.75rem;
  color: #888;
  line-height: 1.5;
}
.color-info .color-usage {
  font-size: 0.8rem;
  color: #666;
  margin-top: 8px;
  line-height: 1.4;
  font-style: italic;
}

/* Dark mode color cards */
.dark .color-card {
  background: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
}
.dark .color-info .color-name { color: #e0e0e0; }
.dark .color-info .color-hex { color: #aaa; }
.dark .color-info .color-rgb,
.dark .color-info .color-hsl { color: #777; }
.dark .color-info .color-usage { color: #999; }

/* Typography specimens */
.type-specimen {
  background: #F9F5EE;
  border-radius: 12px;
  padding: 32px;
  margin: 16px 0;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.dark .type-specimen {
  background: #141414;
  border-color: rgba(255, 255, 255, 0.08);
}
.type-specimen .font-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #888;
  margin-bottom: 12px;
}
.type-specimen .sample-display {
  font-size: 2.5rem;
  line-height: 1.15;
  margin-bottom: 8px;
  color: #0A0A0A;
}
.dark .type-specimen .sample-display { color: #F9F5EE; }
.type-specimen .sample-body {
  font-size: 1rem;
  line-height: 1.7;
  color: #333;
  margin-bottom: 8px;
}
.dark .type-specimen .sample-body { color: #ccc; }
.type-specimen .sample-small {
  font-size: 0.85rem;
  line-height: 1.6;
  color: #666;
}
.dark .type-specimen .sample-small { color: #999; }
.type-specimen .sample-code {
  font-size: 0.9rem;
  line-height: 1.7;
  color: #333;
  background: rgba(0, 0, 0, 0.04);
  padding: 16px;
  border-radius: 8px;
  margin-top: 12px;
}
.dark .type-specimen .sample-code {
  background: rgba(255, 255, 255, 0.04);
  color: #A5B2FF;
}

/* Size scale */
.type-scale {
  margin: 16px 0;
}
.type-scale-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.dark .type-scale-row { border-color: rgba(255, 255, 255, 0.05); }
.type-scale-row .scale-label {
  flex: 0 0 80px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.7rem;
  color: #999;
}
.type-scale-row .scale-sample {
  flex: 1;
  color: #1a1a1a;
}
.dark .type-scale-row .scale-sample { color: #e0e0e0; }

/* Geometric elements gallery */
.elements-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
  margin: 24px 0 32px 0;
}
.element-card {
  background: #F9F5EE;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}
.element-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}
.dark .element-card {
  background: #141414;
  border-color: rgba(255, 255, 255, 0.08);
}
.element-card img {
  max-width: 64px;
  max-height: 64px;
  margin: 0 auto 12px;
  display: block;
}
.element-card .element-name {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.65rem;
  color: #888;
  word-break: break-all;
}

/* Wave gallery (full-width) */
.wave-gallery {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 24px 0 32px 0;
}
.wave-card {
  background: #F9F5EE;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.wave-card.dark-bg {
  background: #0000AF;
}
.wave-card img {
  width: 100%;
  display: block;
}
.wave-card .wave-label {
  padding: 8px 16px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.7rem;
  color: #888;
}
.wave-card.dark-bg .wave-label { color: rgba(255, 255, 255, 0.6); }
.dark .wave-card { background: #141414; border-color: rgba(255, 255, 255, 0.08); }

/* Decorative compositions */
.composition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin: 24px 0 32px 0;
}
.composition-card {
  background: #F9F5EE;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.dark .composition-card {
  background: #141414;
  border-color: rgba(255, 255, 255, 0.08);
}
.composition-card img {
  max-width: 120px;
  max-height: 140px;
  margin: 0 auto 12px;
  display: block;
}
.composition-card .comp-name {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.7rem;
  color: #888;
}

/* Logo usage section */
.logo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  margin: 24px 0 32px 0;
}
.logo-card {
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 160px;
}
.logo-card img {
  max-width: 200px;
  max-height: 80px;
  margin-bottom: 12px;
}
.logo-card .logo-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.7rem;
  color: #888;
  margin-top: 8px;
}

/* Do/Don't section */
.dodont-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin: 24px 0 32px 0;
}
.dodont-card {
  border-radius: 12px;
  padding: 20px;
  border: 2px solid;
}
.dodont-card.do-card {
  border-color: #000AFF;
  background: rgba(0, 10, 255, 0.03);
}
.dodont-card.dont-card {
  border-color: #BE4200;
  background: rgba(190, 66, 0, 0.03);
}
.dark .dodont-card.do-card {
  background: rgba(0, 10, 255, 0.08);
}
.dark .dodont-card.dont-card {
  background: rgba(190, 66, 0, 0.08);
}
.dodont-card .dodont-label {
  font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.dodont-card.do-card .dodont-label { color: #000AFF; }
.dodont-card.dont-card .dodont-label { color: #BE4200; }
.dodont-card .dodont-text {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #333;
}
.dark .dodont-card .dodont-text { color: #ccc; }

/* Brand voice cards */
.voice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin: 24px 0 32px 0;
}
.voice-card {
  background: #F9F5EE;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #000AFF;
}
.dark .voice-card {
  background: #141414;
}
.voice-card .voice-trait {
  font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: #000AFF;
  margin-bottom: 6px;
}
.dark .voice-card .voice-trait { color: #A5B2FF; }
.voice-card .voice-desc {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #555;
}
.dark .voice-card .voice-desc { color: #aaa; }

/* Spacing and clear space diagrams */
.clearspace-demo {
  display: flex;
  justify-content: center;
  margin: 24px 0;
}
.clearspace-box {
  border: 2px dashed rgba(0, 10, 255, 0.3);
  padding: 40px 60px;
  border-radius: 8px;
  position: relative;
  background: rgba(0, 10, 255, 0.02);
}
.clearspace-box img {
  display: block;
}
.clearspace-box .cs-label {
  position: absolute;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.6rem;
  color: #000AFF;
  opacity: 0.6;
}
.clearspace-box .cs-top { top: 12px; left: 50%; transform: translateX(-50%); }
.clearspace-box .cs-right { right: 12px; top: 50%; transform: translateY(-50%) rotate(90deg); }
.clearspace-box .cs-bottom { bottom: 12px; left: 50%; transform: translateX(-50%); }
.clearspace-box .cs-left { left: 12px; top: 50%; transform: translateY(-50%) rotate(-90deg); }

/* Color combination examples */
.combo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin: 24px 0 32px 0;
}
.combo-card {
  border-radius: 12px;
  overflow: hidden;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  position: relative;
}
.combo-card .combo-label {
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.6rem;
  opacity: 0.6;
}

/* Responsive */
@media (max-width: 640px) {
  .brand-hero { padding: 32px 24px; }
  .brand-hero h1 { font-size: 1.8rem; }
  .color-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  .elements-gallery { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
  .dodont-grid { grid-template-columns: 1fr; }
  .logo-grid { grid-template-columns: 1fr; }
}
</style>

<!-- Hero Banner -->
<div class="brand-hero">
  <h1>Alternate Futures Brand Guide</h1>
  <p class="subtitle">The visual identity system for the decentralized cloud</p>
  <img class="deco-star deco-star-1" src="/brand/star-medium-off-white.svg" alt="" role="presentation" />
  <img class="deco-star deco-star-2" src="/brand/star-small-off-white.svg" alt="" role="presentation" />
  <img class="deco-star deco-star-3" src="/brand/star-small-apricot.svg" alt="" role="presentation" />
  <img class="deco-ring" src="/brand/ring-large-brand-blue.svg" alt="" role="presentation" />
  <div class="deco-wave"><img src="/brand/wave-off-white-10.svg" alt="" role="presentation" /></div>
</div>

This is the authoritative visual identity reference for all Alternate Futures properties. Every public-facing design -- documentation, marketing, social media, pitch materials, and product UI -- must adhere to these specifications. The Figma source of truth is [AF-Branding-2026](https://www.figma.com/design/wmHC1PQgGehvppFrQnJwW0/AF-Branding-2026).

<!-- ============================================ -->
<!-- SECTION 1: COLOR PALETTE -->
<!-- ============================================ -->

<div class="section-header">
  <img src="/brand/circle-small-brand-blue.svg" alt="" role="presentation" />
  <h2 id="color-palette">Color Palette</h2>
</div>

The AF palette is a carefully calibrated system of 7 colors. Brand Blue is the dominant identity color and should appear on every composition. The remaining colors serve specific functional and emotional roles.

### Primary Colors

<div class="color-grid">
  <div class="color-card" @click="copyHex('#000AFF')">
    <div class="color-swatch" style="background: #000AFF;">
      <span v-if="copiedColor === '#000AFF'" class="copied-badge">Copied!</span>
    </div>
    <div class="color-info">
      <div class="color-name">Brand Blue</div>
      <div class="color-hex">#000AFF</div>
      <div class="color-rgb">RGB: {{ hexToRgb('#000AFF') }}</div>
      <div class="color-hsl">HSL: {{ hexToHsl('#000AFF') }}</div>
      <div class="color-usage">Primary identity color. Buttons, links, CTAs, hero backgrounds, accents. Must appear on every composition.</div>
    </div>
  </div>
  <div class="color-card" @click="copyHex('#0000AF')">
    <div class="color-swatch" style="background: #0000AF;">
      <span v-if="copiedColor === '#0000AF'" class="copied-badge">Copied!</span>
    </div>
    <div class="color-info">
      <div class="color-name">Dark Blue</div>
      <div class="color-hex">#0000AF</div>
      <div class="color-rgb">RGB: {{ hexToRgb('#0000AF') }}</div>
      <div class="color-hsl">HSL: {{ hexToHsl('#0000AF') }}</div>
      <div class="color-usage">Dark mode backgrounds, footer, emphasis blocks, immersive sections. Never use for body text.</div>
    </div>
  </div>
  <div class="color-card" @click="copyHex('#BE4200')">
    <div class="color-swatch" style="background: #BE4200;">
      <span v-if="copiedColor === '#BE4200'" class="copied-badge">Copied!</span>
    </div>
    <div class="color-info">
      <div class="color-name">Terracotta</div>
      <div class="color-hex">#BE4200</div>
      <div class="color-rgb">RGB: {{ hexToRgb('#BE4200') }}</div>
      <div class="color-hsl">HSL: {{ hexToHsl('#BE4200') }}</div>
      <div class="color-usage">Warnings, urgency, cost emphasis, competitor comparisons. The "attention" color.</div>
    </div>
  </div>
</div>

### Secondary Colors

<div class="color-grid">
  <div class="color-card" @click="copyHex('#F9F5EE')">
    <div class="color-swatch" style="background: #F9F5EE; border-bottom: 1px solid rgba(0,0,0,0.08);">
      <span v-if="copiedColor === '#F9F5EE'" class="copied-badge">Copied!</span>
    </div>
    <div class="color-info">
      <div class="color-name">Cream / Off-White</div>
      <div class="color-hex">#F9F5EE</div>
      <div class="color-rgb">RGB: {{ hexToRgb('#F9F5EE') }}</div>
      <div class="color-hsl">HSL: {{ hexToHsl('#F9F5EE') }}</div>
      <div class="color-usage">Light mode page backgrounds. The warm foundation of the brand. Never use pure white #FFF.</div>
    </div>
  </div>
  <div class="color-card" @click="copyHex('#A5B2FF')">
    <div class="color-swatch" style="background: #A5B2FF;">
      <span v-if="copiedColor === '#A5B2FF'" class="copied-badge">Copied!</span>
    </div>
    <div class="color-info">
      <div class="color-name">Medium Blue</div>
      <div class="color-hex">#A5B2FF</div>
      <div class="color-rgb">RGB: {{ hexToRgb('#A5B2FF') }}</div>
      <div class="color-hsl">HSL: {{ hexToHsl('#A5B2FF') }}</div>
      <div class="color-usage">Dark mode primary interactive color. Secondary hover states. Lighter blue accents.</div>
    </div>
  </div>
  <div class="color-card" @click="copyHex('#FFC7AA')">
    <div class="color-swatch" style="background: #FFC7AA;">
      <span v-if="copiedColor === '#FFC7AA'" class="copied-badge">Copied!</span>
    </div>
    <div class="color-info">
      <div class="color-name">Apricot</div>
      <div class="color-hex">#FFC7AA</div>
      <div class="color-rgb">RGB: {{ hexToRgb('#FFC7AA') }}</div>
      <div class="color-hsl">HSL: {{ hexToHsl('#FFC7AA') }}</div>
      <div class="color-usage">Warm accents, code language tags, badges, dark mode accent color. Welcoming and approachable.</div>
    </div>
  </div>
  <div class="color-card" @click="copyHex('#C8E0E4')">
    <div class="color-swatch" style="background: #C8E0E4;">
      <span v-if="copiedColor === '#C8E0E4'" class="copied-badge">Copied!</span>
    </div>
    <div class="color-info">
      <div class="color-name">Sky</div>
      <div class="color-hex">#C8E0E4</div>
      <div class="color-rgb">RGB: {{ hexToRgb('#C8E0E4') }}</div>
      <div class="color-hsl">HSL: {{ hexToHsl('#C8E0E4') }}</div>
      <div class="color-usage">Tips, info callouts, feature card backgrounds, data visualization, charts.</div>
    </div>
  </div>
</div>

### Color Combinations

These are the approved color pairings. Every design should use one of these combinations as its foundation.

<div class="combo-grid">
  <div class="combo-card" style="background: #000AFF; color: #fff;">
    Brand Blue + White
    <span class="combo-label" style="color: rgba(255,255,255,0.6);">Hero, CTA</span>
  </div>
  <div class="combo-card" style="background: #F9F5EE; color: #0000AF;">
    Cream + Dark Blue
    <span class="combo-label" style="color: rgba(0,0,175,0.5);">Default pages</span>
  </div>
  <div class="combo-card" style="background: #0000AF; color: #A5B2FF;">
    Dark Blue + Medium Blue
    <span class="combo-label" style="color: rgba(165,178,255,0.5);">Dark mode</span>
  </div>
  <div class="combo-card" style="background: #0000AF; color: #FFC7AA;">
    Dark Blue + Apricot
    <span class="combo-label" style="color: rgba(255,199,170,0.5);">Dark accent</span>
  </div>
  <div class="combo-card" style="background: #F9F5EE; color: #BE4200;">
    Cream + Terracotta
    <span class="combo-label" style="color: rgba(190,66,0,0.5);">Warnings</span>
  </div>
  <div class="combo-card" style="background: #000AFF; color: #FFC7AA;">
    Brand Blue + Apricot
    <span class="combo-label" style="color: rgba(255,199,170,0.5);">Warm hero</span>
  </div>
</div>

### CSS Variables Reference

Use these variables in all web properties:

```css
:root {
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
}
```

::: warning IMPORTANT: The correct Brand Blue is #000AFF
Do NOT use `#0026FF` (hue 232). The correct hue is **240** (pure blue), not 232 (blue-violet). The 8-degree shift is visible and off-brand. Always verify the hex value when implementing.
:::

<!-- ============================================ -->
<!-- SECTION 2: TYPOGRAPHY -->
<!-- ============================================ -->

<div class="section-header">
  <img src="/brand/star-small-brand-blue.svg" alt="" role="presentation" />
  <h2 id="typography">Typography</h2>
</div>

The AF type system uses three typefaces, each with a distinct role. Consistency in font usage is critical to brand recognition.

### Instrument Sans -- Primary

The workhorse typeface. Used for all body text, headings, navigation, buttons, and UI elements.

<div class="type-specimen">
  <div class="font-label">Instrument Sans -- Regular 400 / Medium 500 / SemiBold 600 / Bold 700</div>
  <div class="sample-display" style="font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif; font-weight: 700;">
    Deploy to the decentralized cloud
  </div>
  <div class="sample-body" style="font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;">
    Alternate Futures provides IPFS, Filecoin, and Arweave hosting with serverless functions and AI agent deployment. Build the future with infrastructure that belongs to no one and everyone.
  </div>
  <div class="sample-small" style="font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;">
    ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !@#$%^&*()
  </div>
</div>

**Usage:** All headings (h1-h6), body paragraphs, navigation items, button labels, form fields, table text, sidebar content, breadcrumbs.

**Import:** Already loaded via Adobe Typekit (`use.typekit.net/qqp2xqh.css`)

### Instrument Serif -- Accent

The elegant contrast. Used sparingly for taglines, pull quotes, and italic emphasis to add sophistication.

<div class="type-specimen">
  <div class="font-label">Instrument Serif -- Regular 400 / Italic 400i</div>
  <div class="sample-display" style="font-family: 'Instrument Serif', Georgia, serif; font-style: italic;">
    Infrastructure that flows, not locks
  </div>
  <div class="sample-body" style="font-family: 'Instrument Serif', Georgia, serif; font-style: italic;">
    "We picked up where the Web3 hosting pioneers left off. True decentralization means your data is never held hostage by a single provider."
  </div>
  <div class="sample-small" style="font-family: 'Instrument Serif', Georgia, serif;">
    ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !@#$%^&*()
  </div>
</div>

**Usage:** Hero taglines, blockquotes, pull quotes, sidebar section titles, testimonial attribution. Never use for body text or UI elements.

**Import:** Google Fonts (`family=Instrument+Serif:ital@0;1`)

### JetBrains Mono -- Code

The developer typeface. Every code block, inline code reference, terminal output, and technical specification uses JetBrains Mono.

<div class="type-specimen">
  <div class="font-label">JetBrains Mono -- Regular 400 / Medium 500 / SemiBold 600 / Bold 700</div>
  <div class="sample-display" style="font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 1.8rem;">
    af deploy --network ipfs
  </div>
  <div class="sample-code" style="font-family: 'JetBrains Mono', ui-monospace, monospace;">
    const af = new AlternateFuturesSdk({<br/>
    &nbsp;&nbsp;accessTokenService: new PersonalAccessTokenService({<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;personalAccessToken: process.env.AF_TOKEN,<br/>
    &nbsp;&nbsp;}),<br/>
    });
  </div>
  <div class="sample-small" style="font-family: 'JetBrains Mono', ui-monospace, monospace; margin-top: 12px;">
    ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 => !== {} [] () // /* */
  </div>
</div>

**Usage:** Code blocks, inline `code`, terminal commands, API references, file paths, hex values, technical labels.

**Import:** Google Fonts (`family=JetBrains+Mono:wght@400;500;600;700`)

### Type Scale

The size scale used across all AF properties. Sizes shown in `rem` relative to a 16px base.

<div class="type-scale">
  <div class="type-scale-row">
    <span class="scale-label">6rem / 96px</span>
    <span class="scale-sample" style="font-family: 'Instrument Sans', sans-serif; font-weight: 700; font-size: 3rem; line-height: 1;">Display</span>
  </div>
  <div class="type-scale-row">
    <span class="scale-label">3rem / 48px</span>
    <span class="scale-sample" style="font-family: 'Instrument Sans', sans-serif; font-weight: 700; font-size: 2.2rem; line-height: 1.1;">Page Title (H1)</span>
  </div>
  <div class="type-scale-row">
    <span class="scale-label">2rem / 32px</span>
    <span class="scale-sample" style="font-family: 'Instrument Sans', sans-serif; font-weight: 700; font-size: 1.6rem; line-height: 1.2;">Section Heading (H2)</span>
  </div>
  <div class="type-scale-row">
    <span class="scale-label">1.5rem / 24px</span>
    <span class="scale-sample" style="font-family: 'Instrument Sans', sans-serif; font-weight: 600; font-size: 1.3rem; line-height: 1.3;">Subsection (H3)</span>
  </div>
  <div class="type-scale-row">
    <span class="scale-label">1.125rem</span>
    <span class="scale-sample" style="font-family: 'Instrument Sans', sans-serif; font-weight: 600; font-size: 1.1rem;">Detail Heading (H4)</span>
  </div>
  <div class="type-scale-row">
    <span class="scale-label">1rem / 16px</span>
    <span class="scale-sample" style="font-family: 'Instrument Sans', sans-serif; font-size: 1rem;">Body text at the standard reading size</span>
  </div>
  <div class="type-scale-row">
    <span class="scale-label">0.875rem</span>
    <span class="scale-sample" style="font-family: 'JetBrains Mono', monospace; font-size: 0.875rem;">Code blocks and technical content</span>
  </div>
  <div class="type-scale-row">
    <span class="scale-label">0.75rem</span>
    <span class="scale-sample" style="font-family: 'Instrument Sans', sans-serif; font-size: 0.75rem;">Captions, labels, metadata</span>
  </div>
</div>

<!-- ============================================ -->
<!-- SECTION 3: GEOMETRIC ELEMENTS -->
<!-- ============================================ -->

<div class="section-header">
  <img src="/brand/star-small-brand-blue.svg" alt="" role="presentation" />
  <h2 id="geometric-elements">Geometric Elements</h2>
</div>

The AF geometric system is the visual language that makes our brand unmistakable. Stars, circles, rings, and waves are used as decorative elements across all materials. The full SVG library contains **129 assets** in 7 brand colors at 4 sizes.

### Stars

Four-pointed stars represent discovery, achievement, and the expansive nature of decentralized infrastructure. Scatter 3-5 stars per composition at mixed sizes. Never center them symmetrically.

<div class="elements-gallery">
  <div class="element-card">
    <img src="/brand/star-small-brand-blue.svg" alt="Brand Blue star" />
    <div class="element-name">star-small<br/>brand-blue</div>
  </div>
  <div class="element-card">
    <img src="/brand/star-small-terracotta.svg" alt="Terracotta star" />
    <div class="element-name">star-small<br/>terracotta</div>
  </div>
  <div class="element-card">
    <img src="/brand/star-small-apricot.svg" alt="Apricot star" />
    <div class="element-name">star-small<br/>apricot</div>
  </div>
  <div class="element-card">
    <img src="/brand/star-small-off-white.svg" alt="Off-White star" />
    <div class="element-name">star-small<br/>off-white</div>
  </div>
  <div class="element-card">
    <img src="/brand/star-small-medium-blue.svg" alt="Medium Blue star" />
    <div class="element-name">star-small<br/>medium-blue</div>
  </div>
  <div class="element-card">
    <img src="/brand/star-small-sky.svg" alt="Sky star" />
    <div class="element-name">star-small<br/>sky</div>
  </div>
  <div class="element-card">
    <img src="/brand/star-small-dark-blue.svg" alt="Dark Blue star" />
    <div class="element-name">star-small<br/>dark-blue</div>
  </div>
  <div class="element-card">
    <img src="/brand/star-medium-brand-blue.svg" alt="Medium Brand Blue star" />
    <div class="element-name">star-medium<br/>brand-blue</div>
  </div>
  <div class="element-card">
    <img src="/brand/star-medium-terracotta.svg" alt="Medium Terracotta star" />
    <div class="element-name">star-medium<br/>terracotta</div>
  </div>
  <div class="element-card">
    <img src="/brand/star-medium-apricot.svg" alt="Medium Apricot star" />
    <div class="element-name">star-medium<br/>apricot</div>
  </div>
  <div class="element-card">
    <img src="/brand/star-large-brand-blue.svg" alt="Large Brand Blue star" />
    <div class="element-name">star-large<br/>brand-blue</div>
  </div>
  <div class="element-card">
    <img src="/brand/star-xl-brand-blue.svg" alt="XL Brand Blue star" />
    <div class="element-name">star-xl<br/>brand-blue</div>
  </div>
</div>

### Circles

Solid filled circles represent completeness, ROI, and unity. Use for bullet markers, data points, and small decorative fills.

<div class="elements-gallery">
  <div class="element-card">
    <img src="/brand/circle-small-brand-blue.svg" alt="Brand Blue circle" />
    <div class="element-name">circle-small<br/>brand-blue</div>
  </div>
  <div class="element-card">
    <img src="/brand/circle-small-sky.svg" alt="Sky circle" />
    <div class="element-name">circle-small<br/>sky</div>
  </div>
  <div class="element-card">
    <img src="/brand/circle-small-apricot.svg" alt="Apricot circle" />
    <div class="element-name">circle-small<br/>apricot</div>
  </div>
  <div class="element-card">
    <img src="/brand/circle-medium-brand-blue.svg" alt="Medium Brand Blue circle" />
    <div class="element-name">circle-medium<br/>brand-blue</div>
  </div>
  <div class="element-card">
    <img src="/brand/circle-medium-sky.svg" alt="Medium Sky circle" />
    <div class="element-name">circle-medium<br/>sky</div>
  </div>
  <div class="element-card">
    <img src="/brand/circle-large-brand-blue.svg" alt="Large Brand Blue circle" />
    <div class="element-name">circle-large<br/>brand-blue</div>
  </div>
  <div class="element-card">
    <img src="/brand/circle-xl-brand-blue.svg" alt="XL Brand Blue circle" />
    <div class="element-name">circle-xl<br/>brand-blue</div>
  </div>
</div>

### Rings

Open rings (stroke-only circles) represent networks, connections, and decentralized infrastructure. Use for corner decorations and network visualizations.

<div class="elements-gallery">
  <div class="element-card">
    <img src="/brand/ring-small-brand-blue.svg" alt="Small Brand Blue ring" />
    <div class="element-name">ring-small<br/>brand-blue</div>
  </div>
  <div class="element-card">
    <img src="/brand/ring-small-apricot.svg" alt="Small Apricot ring" />
    <div class="element-name">ring-small<br/>apricot</div>
  </div>
  <div class="element-card">
    <img src="/brand/ring-medium-brand-blue.svg" alt="Medium Brand Blue ring" />
    <div class="element-name">ring-medium<br/>brand-blue</div>
  </div>
  <div class="element-card">
    <img src="/brand/ring-medium-medium-blue.svg" alt="Medium Medium Blue ring" />
    <div class="element-name">ring-medium<br/>medium-blue</div>
  </div>
  <div class="element-card">
    <img src="/brand/ring-large-brand-blue.svg" alt="Large Brand Blue ring" />
    <div class="element-name">ring-large<br/>brand-blue</div>
  </div>
  <div class="element-card">
    <img src="/brand/ring-large-terracotta.svg" alt="Large Terracotta ring" />
    <div class="element-name">ring-large<br/>terracotta</div>
  </div>
  <div class="element-card">
    <img src="/brand/ring-xl-brand-blue.svg" alt="XL Brand Blue ring" />
    <div class="element-name">ring-xl<br/>brand-blue</div>
  </div>
</div>

### Waves

Full-width wave shapes serve as section dividers, footer decorations, and background textures. Available at solid, 10%, 20%, and 30% opacity in all 7 brand colors.

<div class="wave-gallery">
  <div class="wave-card">
    <img src="/brand/wave-brand-blue.svg" alt="Brand Blue wave (solid)" />
    <div class="wave-label">wave-brand-blue.svg (solid) -- footer backgrounds, hero transitions</div>
  </div>
  <div class="wave-card">
    <img src="/brand/wave-brand-blue-10.svg" alt="Brand Blue wave (10%)" />
    <div class="wave-label">wave-brand-blue-10.svg (10% opacity) -- subtle section dividers</div>
  </div>
  <div class="wave-card">
    <img src="/brand/wave-brand-blue-20.svg" alt="Brand Blue wave (20%)" />
    <div class="wave-label">wave-brand-blue-20.svg (20% opacity) -- medium emphasis dividers</div>
  </div>
  <div class="wave-card dark-bg">
    <img src="/brand/wave-off-white-10.svg" alt="Off-White wave (10%)" />
    <div class="wave-label">wave-off-white-10.svg (10% opacity on Dark Blue) -- dark mode dividers</div>
  </div>
  <div class="wave-card dark-bg">
    <img src="/brand/wave-off-white.svg" alt="Off-White wave (solid)" />
    <div class="wave-label">wave-off-white.svg (solid on Dark Blue) -- dark mode section transitions</div>
  </div>
</div>

### Decorative Compositions

Pre-composed groups of stars, circles, and rings for use as hero decorations and section accents. Three color temperature variants: brand (blue-dominant), cool (blue + sky), and warm (terracotta + apricot).

<div class="composition-grid">
  <div class="composition-card">
    <img src="/brand/decorative-medium-brand.svg" alt="Brand decorative composition" />
    <div class="comp-name">decorative-medium-brand</div>
  </div>
  <div class="composition-card">
    <img src="/brand/decorative-medium-cool.svg" alt="Cool decorative composition" />
    <div class="comp-name">decorative-medium-cool</div>
  </div>
  <div class="composition-card">
    <img src="/brand/decorative-medium-warm.svg" alt="Warm decorative composition" />
    <div class="comp-name">decorative-medium-warm</div>
  </div>
  <div class="composition-card">
    <img src="/brand/decorative-large-brand.svg" alt="Large brand decorative composition" />
    <div class="comp-name">decorative-large-brand</div>
  </div>
</div>

### Element Usage Rules

| Rule | Description |
|------|-------------|
| **Max 2 element types** | Never use more than 2 geometric types (e.g., stars + rings) in a single composition |
| **Asymmetric placement** | Stars must be scattered asymmetrically. Never center or arrange them in a grid |
| **3-5 stars per composition** | Mix sizes (S + M, or S + L). Never use all the same size |
| **Rings in corners** | Rings work best as corner decorations, partially cropped by the frame |
| **Waves as dividers** | Waves always span the full width. Use 10% opacity for subtle, solid for strong |
| **Circles as accents** | Small circles for bullet points and data markers. Never as primary decoration |
| **Opacity range** | Decorative elements at 6-30% opacity on light backgrounds. 8-20% on dark backgrounds |

---

<!-- ============================================ -->
<!-- SECTION 4: LOGO USAGE -->
<!-- ============================================ -->

<div class="section-header">
  <img src="/brand/ring-medium-brand-blue.svg" alt="" role="presentation" />
  <h2 id="logo-usage">Logo Usage</h2>
</div>

The AF logo exists in two forms: the **logomark** ("AF" monogram) and the **wordmark** (full "AlternateFutures" text). Both use `var(--fill-0, #000AFF)` for theme-aware rendering.

### Logo Variants

<div class="logo-grid">
  <div class="logo-card" style="background: #F9F5EE;">
    <img src="/logo.svg" alt="AF logomark on cream" style="max-width: 60px;" />
    <div class="logo-label">Logomark on Cream</div>
  </div>
  <div class="logo-card" style="background: #000AFF;">
    <img src="/logo.svg" alt="AF logomark on Brand Blue" style="max-width: 60px; filter: brightness(0) invert(1);" />
    <div class="logo-label" style="color: rgba(255,255,255,0.6);">Logomark on Brand Blue</div>
  </div>
  <div class="logo-card" style="background: #0000AF;">
    <img src="/logo.svg" alt="AF logomark on Dark Blue" style="max-width: 60px; filter: brightness(0) invert(1);" />
    <div class="logo-label" style="color: rgba(255,255,255,0.6);">Logomark on Dark Blue</div>
  </div>
  <div class="logo-card" style="background: #F9F5EE;">
    <img src="/wordmark.svg" alt="AF wordmark on cream" style="max-width: 280px;" />
    <div class="logo-label">Full Wordmark on Cream</div>
  </div>
  <div class="logo-card" style="background: #000AFF;">
    <img src="/wordmark.svg" alt="AF wordmark on Brand Blue" style="max-width: 280px; filter: brightness(0) invert(1);" />
    <div class="logo-label" style="color: rgba(255,255,255,0.6);">Full Wordmark on Brand Blue</div>
  </div>
  <div class="logo-card" style="background: #0A0A0A;">
    <img src="/wordmark.svg" alt="AF wordmark on black" style="max-width: 280px; filter: brightness(0) invert(1);" />
    <div class="logo-label" style="color: rgba(255,255,255,0.6);">Full Wordmark on Dark</div>
  </div>
</div>

### Clear Space

The minimum clear space around the logo is equal to the height of the "F" in the logomark. No text, images, or other design elements should intrude into this space.

<div class="clearspace-demo">
  <div class="clearspace-box">
    <span class="cs-label cs-top">1x height of "F"</span>
    <span class="cs-label cs-right">1x</span>
    <span class="cs-label cs-bottom">1x</span>
    <span class="cs-label cs-left">1x</span>
    <img src="/logo.svg" alt="Logo with clear space" style="width: 80px;" />
  </div>
</div>

### Minimum Size

- **Logomark:** Minimum 24px wide (digital), 10mm (print)
- **Wordmark:** Minimum 120px wide (digital), 40mm (print)
- Below these sizes, the letterforms become illegible

### Approved Backgrounds

The logo may be placed on:

| Background | Logo Color | Notes |
|-----------|-----------|-------|
| Cream `#F9F5EE` | Brand Blue `#000AFF` | Default / primary usage |
| White `#FFFFFF` | Brand Blue `#000AFF` | Acceptable for partner co-branding |
| Brand Blue `#000AFF` | White `#FFFFFF` | Hero sections, branded materials |
| Dark Blue `#0000AF` | White `#FFFFFF` | Dark mode, footer |
| Black `#0A0A0A` | White `#FFFFFF` | Dark mode only |

::: danger Logo Prohibitions
- Never apply drop shadows, glows, outlines, or bevels to the logo
- Never rotate, skew, stretch, or compress the logo
- Never place the logo on busy photographic backgrounds
- Never change the logo colors to non-brand colors
- Never rearrange or separate the "A" and "F" letterforms
- Never use the old `#0026FF` color in the logo
:::

---

<!-- ============================================ -->
<!-- SECTION 5: BRAND VOICE & TONE -->
<!-- ============================================ -->

<div class="section-header">
  <img src="/brand/star-small-apricot.svg" alt="" role="presentation" />
  <h2 id="brand-voice">Brand Voice & Tone</h2>
</div>

The AF brand voice is how we sound in every written communication -- docs, blog posts, social media, support conversations, and investor materials. It should feel like a conversation with a technically brilliant friend who respects your time.

### Voice Traits

<div class="voice-grid">
  <div class="voice-card">
    <div class="voice-trait">Technical but Accessible</div>
    <div class="voice-desc">We write for developers but never assume everyone has the same background. Explain concepts when they first appear. Provide runnable examples, not just theory.</div>
  </div>
  <div class="voice-card">
    <div class="voice-trait">Confident, Not Arrogant</div>
    <div class="voice-desc">We are proud of what we have built but honest about what is still in progress. "We are building the future of cloud" -- not "we are better than everyone."</div>
  </div>
  <div class="voice-card">
    <div class="voice-trait">Honest About Limitations</div>
    <div class="voice-desc">If a feature is in beta, say so. If there is a known issue, document it. Developers trust transparent platforms. They abandon ones that hide problems.</div>
  </div>
  <div class="voice-card">
    <div class="voice-trait">Developer-to-Developer</div>
    <div class="voice-desc">Write as one builder to another. Skip the corporate voice. Use "you" and "we." Show the actual terminal output. Include error messages and how to fix them.</div>
  </div>
  <div class="voice-card">
    <div class="voice-trait">Warm, Not Corporate</div>
    <div class="voice-desc">Our cream backgrounds and apricot accents are not decorative -- they signal that this platform welcomes you. The voice should match: helpful, patient, and human.</div>
  </div>
  <div class="voice-card">
    <div class="voice-trait">Precise and Scannable</div>
    <div class="voice-desc">Developers scan, then read. Lead with the answer. Use bullet points for lists. Put commands in code blocks. Make every paragraph earn its place.</div>
  </div>
</div>

### Tone Spectrum

The same voice can shift tone depending on context:

| Context | Tone | Example |
|---------|------|---------|
| **Documentation** | Instructional, precise, neutral | "Run `af deploy` to push your site to IPFS. The CLI will return a CID and preview URL." |
| **Blog posts** | Conversational, informative | "We shipped a big update this week -- here is what changed and why it matters for your workflow." |
| **Error messages** | Helpful, never blaming | "Deployment failed: the build command exited with code 1. Check your package.json scripts." |
| **Social media** | Energetic, concise | "60% cheaper than Vercel. Same features. Decentralized infrastructure. Your margins intact." |
| **Investor materials** | Confident, data-driven | "The Web3 hosting market lost its two largest players in 2025. AF captured the vacuum." |
| **Community/Discord** | Casual, supportive | "Good question! That is a known issue in v0.9.2 -- here is the workaround until the fix ships." |

### Terminology

Always use these standard terms:

| Term | Usage | Avoid |
|------|-------|-------|
| **Alternate Futures** | Full company name (first mention in any document) | "Alt Futures", "AltFut", "A.F." |
| **AF** | Acceptable abbreviation after first mention | Any other abbreviation |
| **deploy** | Lowercase verb for the deployment action | "push", "ship", "launch" (in technical docs) |
| **site** | A static website deployment | "app" (when referring to static hosting) |
| **function** | A serverless cloud function | "lambda", "endpoint" |
| **agent** | An AI agent deployment | "bot", "model" (when referring to hosted agents) |
| **decentralized** | Preferred. Describes the infrastructure model | "distributed" (unless technically accurate) |

---

<!-- ============================================ -->
<!-- SECTION 6: DO / DON'T -->
<!-- ============================================ -->

<div class="section-header">
  <img src="/brand/ring-medium-brand-blue.svg" alt="" role="presentation" />
  <h2 id="dos-and-donts">Do's and Don'ts</h2>
</div>

### Color Usage

<div class="dodont-grid">
  <div class="dodont-card do-card">
    <div class="dodont-label">DO</div>
    <div class="dodont-text">Use Brand Blue <code>#000AFF</code> as the primary accent on every page and composition. It is the anchor of the visual system.</div>
  </div>
  <div class="dodont-card dont-card">
    <div class="dodont-label">DON'T</div>
    <div class="dodont-text">Use <code>#0026FF</code>, <code>#0000FF</code>, or any other blue as a substitute. The 8-degree hue shift between 232 and 240 is visible and off-brand.</div>
  </div>
  <div class="dodont-card do-card">
    <div class="dodont-label">DO</div>
    <div class="dodont-text">Use Cream <code>#F9F5EE</code> as the light mode background. The warm tone is a core part of the brand identity.</div>
  </div>
  <div class="dodont-card dont-card">
    <div class="dodont-label">DON'T</div>
    <div class="dodont-text">Use pure white <code>#FFFFFF</code> as a page background. It looks sterile and clashes with the warm palette. White is only for text on dark surfaces.</div>
  </div>
  <div class="dodont-card do-card">
    <div class="dodont-label">DO</div>
    <div class="dodont-text">Use Terracotta exclusively for warnings and urgency. It signals "pay attention" within the palette hierarchy.</div>
  </div>
  <div class="dodont-card dont-card">
    <div class="dodont-label">DON'T</div>
    <div class="dodont-text">Use Terracotta for primary buttons, headers, or decorative elements. It is not an accent color -- it is the alert color.</div>
  </div>
</div>

### Typography

<div class="dodont-grid">
  <div class="dodont-card do-card">
    <div class="dodont-label">DO</div>
    <div class="dodont-text">Use Instrument Serif only for taglines, blockquotes, and pull quotes. It provides elegant contrast at specific moments.</div>
  </div>
  <div class="dodont-card dont-card">
    <div class="dodont-label">DON'T</div>
    <div class="dodont-text">Use Instrument Serif for body text, navigation, buttons, or form fields. The serif font is an accent, not a workhorse.</div>
  </div>
  <div class="dodont-card do-card">
    <div class="dodont-label">DO</div>
    <div class="dodont-text">Use JetBrains Mono for all code. Enable ligatures (<code>font-feature-settings: 'liga' 1, 'calt' 1</code>) for enhanced readability.</div>
  </div>
  <div class="dodont-card dont-card">
    <div class="dodont-label">DON'T</div>
    <div class="dodont-text">Fall back to system monospace fonts like Menlo, Monaco, or Courier. JetBrains Mono is part of the brand experience.</div>
  </div>
</div>

### Geometric Elements

<div class="dodont-grid">
  <div class="dodont-card do-card">
    <div class="dodont-label">DO</div>
    <div class="dodont-text">Scatter stars asymmetrically at mixed sizes (3-5 per composition). The organic randomness creates visual energy.</div>
  </div>
  <div class="dodont-card dont-card">
    <div class="dodont-label">DON'T</div>
    <div class="dodont-text">Arrange geometric elements in a grid, line them up symmetrically, or center them. That kills the dynamic, organic quality of the brand.</div>
  </div>
  <div class="dodont-card do-card">
    <div class="dodont-label">DO</div>
    <div class="dodont-text">Use max 2 geometric element types per composition (e.g., stars + rings, or waves + circles). Restraint creates elegance.</div>
  </div>
  <div class="dodont-card dont-card">
    <div class="dodont-label">DON'T</div>
    <div class="dodont-text">Mix stars, circles, rings, and waves all at once. More than 2 types creates visual noise, not visual identity.</div>
  </div>
  <div class="dodont-card do-card">
    <div class="dodont-label">DO</div>
    <div class="dodont-text">Use only SVGs from the approved asset library (<code>/brand/</code> directory). These are precision-crafted to the brand specifications.</div>
  </div>
  <div class="dodont-card dont-card">
    <div class="dodont-label">DON'T</div>
    <div class="dodont-text">Create custom geometric elements, use emoji as visual substitutes, or source shapes from icon libraries. The brand shapes are not generic.</div>
  </div>
</div>

### Voice and Content

<div class="dodont-grid">
  <div class="dodont-card do-card">
    <div class="dodont-label">DO</div>
    <div class="dodont-text">Position Akash, IPFS, Filecoin, Arweave, and ICP as valued infrastructure partners. Their strength is our strength.</div>
  </div>
  <div class="dodont-card dont-card">
    <div class="dodont-label">DON'T</div>
    <div class="dodont-text">Criticize, compare negatively, or dismiss any decentralized infrastructure partner. We are building on top of their work.</div>
  </div>
  <div class="dodont-card do-card">
    <div class="dodont-label">DO</div>
    <div class="dodont-text">Acknowledge beta status, known issues, and work-in-progress features explicitly. Developers trust transparency.</div>
  </div>
  <div class="dodont-card dont-card">
    <div class="dodont-label">DON'T</div>
    <div class="dodont-text">Overstate capabilities, claim production-readiness before it is true, or use superlatives like "the best" or "the most powerful."</div>
  </div>
  <div class="dodont-card do-card">
    <div class="dodont-label">DO</div>
    <div class="dodont-text">Show real CLI output, actual error messages, and working code examples. Developers verify claims by trying them.</div>
  </div>
  <div class="dodont-card dont-card">
    <div class="dodont-label">DON'T</div>
    <div class="dodont-text">Use stock photography, generic illustrations, or AI-generated images that don't match the geometric brand system.</div>
  </div>
</div>

### Photography and Imagery

<div class="dodont-grid">
  <div class="dodont-card do-card">
    <div class="dodont-label">DO</div>
    <div class="dodont-text">Use abstract geometric shapes from the SVG library as visual elements. The brand is built on shapes, not photos.</div>
  </div>
  <div class="dodont-card dont-card">
    <div class="dodont-label">DON'T</div>
    <div class="dodont-text">Use stock photography of any kind. If a human image is absolutely required, apply a Brand Blue duotone at 30% opacity.</div>
  </div>
</div>

---

<!-- ============================================ -->
<!-- SECTION 7: DARK MODE -->
<!-- ============================================ -->

<div class="section-header">
  <img src="/brand/star-small-medium-blue.svg" alt="" role="presentation" />
  <h2 id="dark-mode">Dark Mode</h2>
</div>

Dark mode is not an inversion -- it is an adaptation. The brand guidelines specify Dark Blue `#0000AF` as the immersive background color. For extended reading (documentation), we use near-black `#0A0A0A` for reduced eye strain, reserving Dark Blue for footer, hero, and emphasis sections.

### Dark Mode Palette

| Role | Light Mode | Dark Mode |
|------|-----------|-----------|
| Page background | Cream `#F9F5EE` | Near-black `#0A0A0A` |
| Card/surface background | White `#FFFFFF` | Dark surface `#141414` |
| Primary interactive | Brand Blue `#000AFF` | Medium Blue `#A5B2FF` |
| Primary hover | `#0008CC` | `#B8C3FF` |
| Accent warm | Terracotta `#BE4200` | Apricot `#FFC7AA` |
| Footer / emphasis bg | Brand Blue `#000AFF` | Dark Blue `#0000AF` |
| Body text | Dark `#1a1a1a` | Cream `#F9F5EE` |
| Geometric elements | Brand Blue at 6-30% opacity | Off-White or Medium Blue at 8-20% opacity |

### Dark Mode Geometric Elements

All geometric brand elements need dark mode variants:

| Light Mode Asset | Dark Mode Treatment |
|-----------------|-------------------|
| `star-*-brand-blue.svg` | Use `star-*-off-white.svg` or `filter: brightness(3)` |
| `ring-*-brand-blue.svg` | Apply `filter: brightness(3) saturate(0.5)` |
| `wave-brand-blue-*.svg` | Use `wave-off-white-*.svg` |
| `decorative-*-brand.svg` | Use `decorative-*-cool.svg` or apply `filter: brightness(2)` |

---

<!-- ============================================ -->
<!-- SECTION 8: ASSET LIBRARY -->
<!-- ============================================ -->

<div class="section-header">
  <img src="/brand/circle-small-brand-blue.svg" alt="" role="presentation" />
  <h2 id="asset-library">Asset Library</h2>
</div>

### Full SVG Inventory

The complete brand asset library contains **129 SVG elements** organized by type:

| Category | Count | Sizes | Colors |
|----------|-------|-------|--------|
| **Stars** | 28 | S (24px), M (48px), L (96px), XL (144px) | 7 brand colors |
| **Circles** | 28 | S (24px), M (48px), L (96px), XL (144px) | 7 brand colors |
| **Rings** | 28 | S (24px), M (48px), L (96px), XL (144px) | 7 brand colors |
| **Waves** | 28 | Full-width (1920px) | 7 colors x (solid + 10% + 20% + 30% opacity) |
| **Decorative Groups** | 12 | S, M, L, XL | brand, cool, warm variants |
| **Logos** | 2 | Logomark (35x32), Wordmark (600x139) | Theme-aware `var(--fill-0)` |
| **Total** | **126 + 2 logos** | | |

### File Naming Convention

```
{type}-{size}-{color}.svg
```

Where:
- **type:** `star`, `circle`, `ring`, `wave`, `decorative`
- **size:** `small`, `medium`, `large`, `xl`
- **color:** `brand-blue`, `dark-blue`, `medium-blue`, `terracotta`, `apricot`, `sky`, `off-white`
- **opacity suffix (waves only):** `-10`, `-20`, `-30` (omit for solid)

Examples: `star-small-brand-blue.svg`, `wave-terracotta-20.svg`, `decorative-large-warm.svg`

### Source of Truth

- **Figma file:** [AF-Branding-2026](https://www.figma.com/design/wmHC1PQgGehvppFrQnJwW0/AF-Branding-2026)
- **SVG source directory:** `admin/docs/pitch-deck-assets/`
- **Docs public assets:** `docs/public/brand/`

---

<!-- ============================================ -->
<!-- SECTION 9: QUICK REFERENCE -->
<!-- ============================================ -->

<div class="section-header">
  <img src="/brand/star-small-terracotta.svg" alt="" role="presentation" />
  <h2 id="quick-reference">Quick Reference</h2>
</div>

### Brand Compliance Checklist

Use this checklist before publishing any external-facing material:

- [ ] **Color check:** Only palette colors used? Brand Blue `#000AFF` present?
- [ ] **Typography check:** Instrument Sans for body/headings? Instrument Serif for accents only? JetBrains Mono for code?
- [ ] **Element check:** Geometric elements from approved SVG library only? Max 2 types per composition?
- [ ] **Logo check:** Correct clear space? Correct color on correct background? No modifications?
- [ ] **Tone check:** Developer-to-developer voice? Technical but accessible? Honest about limitations?
- [ ] **Partner check:** Akash, IPFS, Filecoin, Arweave, ICP positioned positively?
- [ ] **Dark mode check:** Medium Blue for primary interactive? Off-white geometric elements? Proper contrast ratios?

### CSS Import Snippet

For any new web property, include these imports:

```html
<!-- Instrument Sans (Adobe Typekit) -->
<link rel="stylesheet" href="https://use.typekit.net/qqp2xqh.css" />

<!-- Instrument Serif + JetBrains Mono (Google Fonts) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
```

### Contact

Brand questions and compliance reviews go to the **Brand Guardian** agent or the Creative Director (Pixel / Yusuke). For urgent brand violations, flag in the `#brand-review` channel.

---

<div style="text-align: center; padding: 32px 0; opacity: 0.4;">
  <img src="/brand/star-small-brand-blue.svg" alt="" role="presentation" style="display: inline-block; width: 12px; margin: 0 8px;" />
  <img src="/brand/star-small-brand-blue.svg" alt="" role="presentation" style="display: inline-block; width: 8px; margin: 0 8px;" />
  <img src="/brand/star-small-brand-blue.svg" alt="" role="presentation" style="display: inline-block; width: 12px; margin: 0 8px;" />
</div>
