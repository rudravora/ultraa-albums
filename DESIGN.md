# Design system — Ultraa Albums homepage

## Direction and boundaries

The page uses the Hallmark editorial theme **Atelier**: warm material photography, a restrained serif voice, quiet rules and a product-first frame. The nearest light/roman-serif/warm theme axis is Studio. The brief wins any conflict, so the production choices use its exact paper, ink, muted, border and clay tokens, retain Ultraa’s actual logo color, and avoid both purple and extra interface colors. This is a light interface; white paper bands are not a dark-mode toggle.

The opening argument is an album, not an image in a floating UI card. One full-width stage shows a real Three.js book opening over matte paper; a generated still product image stays present until the renderer and page textures are ready. The rest of the page uses actual album, cover, paper-work and generated wedding photographs in distinct sections. Product values come from the official pages; unknown measurements and package tiers stay unstated.

No eyebrow, kicker, uppercase/tracked label, section number, tagline, metaphor, rhetorical-question heading, empty state filler, unverified proof, image caption, nested card, icon-card row, gradient, purple, glass/blur, hard shadow, marquee, carousel, timed selection or tilt. There is no Journal content block: verified official sources had no titles. The Journal link remains a direct archive link.

## Color, typography and layout tokens

All design colors, type families, sizes, spacing, corner treatment, motion values and stacking levels live in `:root` at the start of `src/site.css`. The core colors are paper `#FAF9F7`, surface `#FFFFFF`, ink `#171717`, muted `#6B6B6B`, border `#E7E2DC`, clay `#9A5B43` and accessible deeper link/focus clay `#713B2C`. Clay is for actions and selected states; it does not become a large page background. The four plain material chips also use root tokens. No code outside that token block hard-codes a CSS color or family.

Headlines use self-hosted Newsreader 400 at optical sizing. Body, nav, controls and specification text use self-hosted Hanken Grotesk 400–700. No third face or browser-default display voice is used. Headings use one color and weight, balance naturally, and use roughly 1.0–1.2 unitless line height; body copy is 16px or larger at about 1.55 with a 68ch cap and zero tracking. The hero heading is fluid and remains below 6rem. Specification numerals use tabular lining figures. Inputs are at least 16px and explicitly labeled.

The content frame is capped at 75rem and centered with equal responsive gutters. It aligns headings, media, table and form. Cards do not become the section scaffold. The product family grid has asymmetric widths; materials use one photo and four plain-word swatch controls; process is a meaningful ordered list separated by thin rules; services sit beside one keyboard-operable image-comparison field; the options are an actual four-row table. The final form has real phone, mailto and Messenger links alongside it. The light logo sits only on matching white header/footer ground because its official PNG has a white field.

## Components and content behavior

**Header:** solid white, ordinary document flow and no blur. At desktop it has the logo, a native Products disclosure, the five other page links, the small Pay online utility and the one repeated primary action. Mobile uses a full-viewport opaque disclosure. Focus remains within the open menu, Escape closes it, and background landmarks become inert until it is closed.

**Hero:** one h1 (at most seven words), one short sentence (at most twelve words), audience switch, one verified fact, and two actions. The initial state is “For couples”; “For photographers” is a manual alternative. The layout stays put while copy and book-page photographs update. The canvas is accessible as one image once ready; otherwise the meaningful still fallback is exposed. No camera orbit or pointer-following tilt exists.

**Materials:** the image appears once and changes when a material is selected. The physical-cover tokens help identify its plain-text swatches. **Before/after:** three separate fictional photo examples; one native range input scrubs an immediate 0–100 split. There is no autoplay, hidden tab, looping or time-based change. The directly manipulated `clip-path` and divider position update from the range value with no transition, and are therefore not an autonomous animation.

**Product comparison:** use only publicly stated sizes, cover choices, page materials/thickness and the distinction between album size and print size. `Not listed by Ultraa.` marks absence instead of inventing a specification. No tier name, price or inclusion is displayed.

**Contact:** endpoint is a deployer-supplied public form URL. The unconfigured HTML state visibly says the form is not connected, disables submit and states no data will be sent; verified telephone and Messenger alternatives remain live, and the email control opens the source-listed `mailto:` destination without printing the address. The configured static form posts multipart data. In JS mode it provides inline validation and announces sending/result states; only an HTTP 2xx response permits the acceptance message. A rejected request or blocked confirmation stays an honest failure.

## Motion specification — Premium (brief section 5)

- Easing is the root `cubic-bezier(0.4, 0, 0.2, 1)` without overshoot. The single album opening is 600ms. The cover physically lifts, turns on its hinge, and settles beneath the printed spread while both page planes fan into alignment within the first 240ms. It runs once; all animation stops at rest.
- CSS control feedback uses transform/opacity only: 80ms hover, 110ms press, and 2px maximum lift. Linked photographs scale to 1.02 in their clipped frame over 80ms. The fallback/canvas opacity exchange lasts 400ms, so its entrance is 50% longer than the exit. No element transitions `all`, width, height, top or left. The image comparison is direct input, not interpolated animation.
- Nothing responds to scroll, no parallax or scroll reveal exists, and the product does not react to pointer movement. The one-way opening is interrupted naturally by device/browser suspension; it never prevents a control response. Page fan settles within the under-500ms stagger budget.
- Under `prefers-reduced-motion: reduce`, Three.js draws the fully opened book and never starts the opening loop. CSS transitions and smooth-anchor movement are removed. An unsupported WebGL context, failed page texture or loading path leaves the still product image in place.
- The page and modal/menu surfaces are fully opaque, so reduced transparency does not reveal a hidden effect; the media query reinforces solid backgrounds. `prefers-contrast: more` strengthens borders and focus rings and darkens running text. All important state changes are also expressed in `aria-pressed`, selected text or live form status.

## Accessibility and responsive states

The document has an English language declaration; skip link; header, one main, eight visible page sections including hero and footer; one h1; correctly nested headings; section labels; real links; a labeled navigation dropdown; and a keyboard-usable mobile disclosure. The range has a label and a native arrow-key/touch keyboard contract. Form errors are field-associated and the result region is announced. Decorative product-thumbnail images use empty alt because the surrounding link carries the complete product name and action; hero, material, process and current comparison views have specific alternatives.

Focus is visible for links, buttons, summaries and fields. The intended target is WCAG 2.2 AA: primary targets are 44px or larger; copy is 16px minimum except concise utility labels and table headers; link/focus clay is the darker supplied token. Layouts are inspected at 375, 390, 768, 1024 and 1440 CSS pixels. Header, image dimensions, media aspect ratios and eager hero preload reduce layout shift. Below-fold photography is lazy loaded.
