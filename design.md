# Design System — Yoga with Lisa (v3 — matched to live yogawithlisa.ai)

This app is built as a direct extension of the real **yogawithlisa.ai** site — typography, palette,
spacing, and component patterns were pulled from that live site's computed styles, not invented.

## Reference values pulled from yogawithlisa.ai
- Body background: white `#ffffff`; body text `#111111`.
- Headings: `Playfair Display`, weight 500, tight letter-spacing (-0.5px at ~42px).
- Body/UI font: `Inter`.
- Logo wordmark "yoga with lisa" (lowercase): a display serif, ~48px, letter-spacing 0.96px,
  weight 400 (the live site uses a licensed font called "amandine" — we approximate with
  `Playfair Display` italic, the closest editorial serif available on Google Fonts).
- Nav: transparent + white text over the dark hero image; once scrolled (or on any page without a
  dark hero directly behind it), background becomes warm greige `#E3DDD6` with `#111111` text.
  Mobile menu sheet background: warm off-white `#FAF8F5`.
- Primary button (e.g. "START NOW"): solid black `#111111` background, white text, fully pill
  (`border-radius: 9999px`), padding ~`12px 24px`, Inter, `letter-spacing: 0.3px`, ~14.4px.
- Dark banded sections (e.g. testimonials): background `#1A1A1A`; cards within them `#242424`
  with a hairline `1px solid rgba(255,255,255,0.07)` border, `border-radius: 20px` — no shadows.
- Container: `max-width: 1200px`, `padding: 0 20px`.

## Color tokens
- `--color-white: #ffffff` — primary page background
- `--color-cream: #faf8f5` — warm off-white for alternating light sections / mobile menu
- `--color-taupe: #e3ddd6` — warm greige (scrolled nav bg, secondary chip bg, subtle section tint)
- `--color-dark: #1a1a1a` — dark banded sections + footer
- `--color-dark-card: #242424` — card surface inside dark sections
- `--color-ink: #111111` — primary text on light backgrounds
- `--color-ink-soft: rgba(17,17,17,0.62)` — secondary text on light backgrounds
- `--color-terracotta: #654b36` — warm accent, used sparingly (tag text, hover states, small accents)
- `--color-blush: #f2e4e1` — soft tag-chip background on light sections
- `--color-line: rgba(17,17,17,0.08)` — hairline dividers on light backgrounds
- `--color-line-dark: rgba(255,255,255,0.07)` — hairline dividers on dark backgrounds

No pure black (`#000`) — use `#111111`/`#1a1a1a`. No drop shadows, no gradients (except the hero
legibility scrim), no hard borders beyond the hairline patterns above.

## Typography
- Headings + logo: `Playfair Display` (400/500/600). Italic for emphasis words (stillness,
  MindShift, breathe...). Logo wordmark stays lowercase.
- Body/UI: `Inter`.

## Buttons
- Primary: `--color-ink` (near-black) background, white text, pill, Inter, small tracked-out caps
  copy ("START NOW", "BOOK NOW" — write the copy itself in caps, don't rely on `text-transform`).
- Secondary: transparent background, 1px border (white on dark sections, `--color-ink`/25% on
  light sections), same text treatment.

## Layout
- Page background is white/cream by default (matches the live site's boutique-editorial feel) with
  occasional dark `#1a1a1a` bands for emphasis (hero, footer, a features/testimonial-style band) —
  not an all-dark app.
- Nav is `fixed`, transparent+white only while over the dark hero on the homepage; every other
  page (and the homepage once scrolled) uses the light `--color-taupe` nav.
- Container ~1200px, generous side padding, editorial pacing between sections (80–140px vertical).

## Imagery
- Hero (`/brand/hero.jpg`) and founder/about (`/brand/founder.jpg`) are Lisa's real supplied
  photos — used directly, not placeholders.
- Any future AI-generated placeholder photo of a person for this brand: deep brown skin, natural
  black hair worn up, lean athletic build, dark/candlelit/warm-terracotta color grading matching
  yogawithlisa.ai's mood.
