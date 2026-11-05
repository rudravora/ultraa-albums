# Manus brief v2: Ultraa Albums homepage (grounded in the real skills)

Attach to Manus with this prompt: current logo, 3-4 screenshots of ultraaalbums.com, the catalog PDF from the site footer.

---

## 0. Mission

Redesign the homepage of **ultraaalbums.com**, a Mumbai studio that designs and manufactures premium photo albums (wedding and event albums for photographers and their clients). This is a **design competition entry**, judged on how professional, polished, current and well-built the UI and frontend are. Aim for an award-level result that looks made for this client, not templated. **Light mode only.** Homepage first; build it as a design system so the other pages can reuse it.

Do not ask me questions. Where a skill says "ask once", the answers are in section 2: treat this as "go ahead".

## 1. Skills: read them first, then follow them

Read each SKILL.md (and the reference files it tells you to load) before designing. If you can run Node 22+ and Chrome, run the checkers named in section 9. If you cannot, review against the same lists by hand and say so in your report.

- taste-skill: https://github.com/leonxlnx/taste-skill (skills/taste-skill/SKILL.md, plus references/copy.md, system.md, layout-v4.md, sections.md)
- hallmark: https://github.com/nutlope/hallmark (skills/hallmark/SKILL.md, plus layout.md, anatomy.md, imagery.md, craft.md, gates.md)
- impeccable: https://github.com/pbakaus/impeccable (SKILL.md and reference/craft-floor.md; Persuade mode)
- apple-design: https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md
- better-typography: https://github.com/jakubkrehel/skills/blob/main/skills/better-typography/SKILL.md
- motion-design: https://github.com/lottiefiles/motion-design-skill (skills/motion-design/SKILL.md and its reference/ files)
- laws-of-ux: https://github.com/keysjoao/laws-of-ux-skills (laws-of-ux, laws-of-ux-review, laws-of-ux-checklist)

**Precedence when they disagree:** (1) the hard bans in taste-skill, hallmark and impeccable, (2) this brief, (3) everything else. If one skill allows something another bans, the ban wins. State any conflict you resolved in the final report.

## 2. Answers to the skills' intake questions

- **Page kind (taste-skill):** physical product plus assisted service (not software, not a place). Photographs lead; flat grounds, real icons, hover layer only.
- **Mode (impeccable):** Persuade. Full commitment to one clear point of view: the finished album is the hero of every section.
- **Genre and tone (hallmark):** editorial, with a luxury tone. Deal and pick a light theme that fits, and say which.
- **Motion archetype (motion-design):** Premium (see section 5).
- **Audience:** two audiences on one page: photographers and studios (B2B) and couples and families (clients).
- **Main action:** one wording everywhere (nav, hero, close): **Start your album**. A secondary action: **Get a quote**.
- **Material, real:** Ultraa Albums; Mumbai; ships worldwide; products Luxury Albums, Flush Mount Albums, Photo Books, Layflat Albums (also slip-in albums and boxes/bags in the catalog PDF); services Photo Editing, Album Design, Wedding Photography; the process as the live site states it: Transfer photos online, Get a design, Printing, Shipping; contact details (phone, email, Messenger/WhatsApp) copied **exactly** from the live site and catalog; the existing "Pay Online" PayPal link kept as a small utility link; three real blog post titles taken from the live site's blog.
- **Material, absent (never put these on the page):** studio logos, testimonials, star ratings, customer counts, awards, press lines, invented statistics.
- **Pictures:** none supplied. Generate stand-ins (section 7). The client's photos replace them later.

## 3. Hard rules (these override any trend)

Copy and content
- No eyebrows or kickers above headings. No labels in tracked capitals or small caps. No section numbers.
- No invented proof. No placeholder text, no "sample" tags, no brackets, no lorem ipsum, no empty links.
- No "Learn more", "Read more", "Discover", "Explore" or "Click here". Buttons are a verb plus what you get ("See flush mount albums", "Get a quote").
- No metaphors, slogans, questions as headlines, exclamation marks, or filler words (seamless, effortless, cutting-edge, unlock, elevate, powerful, robust).
- No caption or description under any image. Alt text is separate and required.
- Each fact appears once, with one wording.

Layout and visuals
- Hero: headline of 7 words or fewer, one sentence of 12 words or fewer, one or two actions, all visible at 1280x800 without scrolling. The first screen also holds one hard fact from the real material (for example "Delivered worldwide from Mumbai").
- Six to nine sections including hero and footer, about 450 visible words in total, about 45 words per screen. One section per screen; equal left and right content edges; a capped, centred container.
- No card inside a card. No same-size icon-plus-heading-plus-text card rows as page structure. No emoji or unicode glyphs as icons (use one consistent icon set).
- No gradient text, no purple/violet anywhere, no purple-to-blue gradient, no hard offset shadows, no decorative glass or blur, no grain texture, no shader effects.
- No logo marquee, no carousels, no timed tabs, no tilt effects.
- Every visual must render (no empty ground) at 1440, 1024, 768 and 390.

Code
- Every colour and font goes through a token on `:root`; no literal colours or font-family past the token block.
- Never `transition: all`; never animate width, height, top or left. `overflow-x: clip` on html and body.
- `:focus-visible` on every interactive element. Content visible with scripting off.
- A `prefers-reduced-motion` fallback for every animation.

## 4. Brand tokens and typography

Keep the existing logo. The brand color may shift slightly toward a richer, more premium shade of the current hue.

```css
:root {
  --ink: #171717;  --muted: #6b6b6b;
  --paper: #faf9f7; --surface: #ffffff; --border: #e7e2dc;
  --accent: #9a5b43; --accent-strong: #713b2c;
  --radius-sm: 6px; --radius-md: 12px; --radius-lg: 20px;
  --shadow-card: 0 8px 30px rgb(23 23 23 / 8%);
  --content-max: 1200px;
}
```

Typography (better-typography, impeccable craft floor):
- Use a distinctive self-hosted display serif for headlines only, and a clean sans for everything else. Never a system face as the display voice. Three font families at most, and load every weight and style you use.
- Body 16px or more in rem. Unitless line-height: about 1.1 for display, 1.2 to 1.3 for headings, 1.5 to 1.6 for body. Measure 65 to 75 characters. Display no larger than 6rem; tracking never tighter than -0.04em; body tracking zero.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs. Tabular numbers on prices. Form inputs 16px or more. Headings never smaller than body text. Heads use one weight and one colour.
- Contrast: body 4.5:1, large text 3:1.
- Theme the browser surfaces too: text selection, caret, scrollbar, focus ring, underline offset.

## 5. Motion (motion-design "Premium" archetype, apple-design principles)

- Premium archetype: durations 350-600 ms, easing cubic-bezier(0.4, 0, 0.2, 1), no overshoot. Hover feedback under 100 ms; press under 150 ms; entrances 30-50% longer than exits. Dramatic reveal 600-1200 ms, used once.
- Animate only transform and opacity. Stagger totals stay under 500 ms. No element travels more than a third of the screen without an intermediate keyframe.
- Hover layer on everything clickable: linked cards lift 2px, photos zoom 1.02-1.03 inside their frame, buttons step on hover and press on click, underlines draw. Nothing tilts.
- Apple principles: respond on pointer-down, not release; keep motion interruptible (animate from the current value, never lock input); use critically damped springs by default with no bounce; honour `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast`.
- **No scroll-triggered reveals, parallax or scroll-linked animation.** Nothing moves because the page scrolled.
- **One signature moment:** in the hero, the product render of the album opens once on load (cover lifts, pages fan slightly) as a rendered 3D product, with a still fallback. It is skipped under reduced motion. Everything else stays quiet.

## 6. Homepage structure (9 sections)

Header (not counted): logo, Products (simple dropdown), Services, How it works, Packages, Journal, Contact, primary button "Start your album", and a small "Pay online" utility link. Solid paper background, no frosted glass. Mobile: full-screen menu. Remove the old "UK" dropdown and fold international delivery into the hero fact.

1. **Hero:** audience switch (a segmented control, "For couples" / "For photographers", default couples) that swaps the headline, sentence and photographs but not the layout. One large album render, opening on load. Two actions only.
2. **Products:** a varied-size grid of full-bleed photographs: Luxury Albums, Flush Mount, Photo Books, Layflat, with slip-in albums and boxes if space allows. Each tile has a name, one line and a verb-led link. A different picture per tile.
3. **Craft and materials:** large close-ups of cover, edge, paper and stitching. A swatch picker where choosing a material changes the album photograph.
4. **How it works:** the four real steps (Transfer photos online, Get a design, Printing, Shipping) as a static horizontal timeline with a turnaround line where the client has one. No scroll linking.
5. **Services and editing:** Album Design, Photo Editing, Wedding Photography, each outcome-led, plus a before/after drag slider with three distinct examples.
6. **Packages:** three tiers (Essential, Premium, Ultimate) compared by what the buyer gets: size, page count, cover material, revisions, shipping. Put any price in one data file only, show it only if I give it, otherwise the button is "Get a quote". A toggle for "For photographers" (wholesale) and "For couples".
7. **Journal:** three real blog posts from the live site as photograph-led cards.
8. **Close:** a plain section with the main action and a short contact form (name, phone, email, message, inline validation), plus the real phone and Messenger links.
9. **Footer:** products, services, company, support (FAQ, shipping, catalog download), Privacy, Terms, the real contact details, and one credits line only if you used third-party images.

## 7. Assets

You have full freedom to generate every image. Keep one consistent photographic style: warm window light, neutral stone or linen surfaces, shallow depth of field, one colour grade.
- Album renders must look physically real: stitching, edges, page thickness, true shadows. The product is shown big and whole, never mid-size in a grey rounded panel. A different view in each section.
- Lifestyle and wedding images may be generated but must not resemble any real person, celebrity or brand, and carry no baked-in text or logos except Ultraa's own.
- Do not copy imagery, layouts or copy from zno.com or any other site.
- Export responsive AVIF/WebP with explicit width and height or aspect-ratio to prevent layout shift. Lazy-load below the fold; preload the hero image.

## 8. Code output (Claude Code will polish afterward)

- Next.js (App Router) + TypeScript + Tailwind, or semantic HTML/CSS/JS if you judge it better. Say which and why.
- Components: Header, Hero, Products, Materials, Process, Services, Packages, Journal, Contact, Footer. A tokens file. All copy and data in one content file. A README with run instructions.
- Responsive at 375, 768, 1024 and 1440, mobile-first, touch targets at least 44px. Semantic landmarks, one h1, logical heading order, skip link, alt text, form labels, WCAG 2.2 AA.
- Performance target: Lighthouse 95+ in all four categories; no layout shift; minimal JS.

## 9. Checks to run before you hand back

Fix every FAIL; report anything you judged a false positive with the reason.
- taste-skill: `consistency.mjs`, `check.mjs` (layout, five widths) and `perf.mjs`, as its SKILL.md describes.
- hallmark: `sloplint.mjs --render`, then its judged gates and the finish review.
- impeccable: its `audit` and `polish` passes, plus the craft floor.
- laws-of-ux: `laws-of-ux-checklist` (12 points) and `laws-of-ux-review`.
- better-typography: review the built page against its rules.
- motion-design: run its quality checklist on every animation.

## 10. Handoff for Claude Code

Deliver, alongside the code:
- `DESIGN.md` (a locked description of the system: tokens, type, spacing, components, motion) and `PRODUCT.md` (audiences, goals, tone).
- A handoff report listing every generated stand-in image, every assumed price or fact, which skills you actually loaded, which checkers you could run, and any conflict you resolved.

---

## Follow-up prompts (send after the first result)

1. "Critique the homepage against your own checklists. List the 10 weakest points, then fix them."
2. "Run the hallmark and taste-skill checkers again after the fixes and show the results."
3. "Push the hero harder within the rules: stronger photography, bolder type scale, a sharper hero fact."
4. "Audit typography and motion again, and confirm reduced-motion behaviour."
5. "Extend the system to the Products page and a Product detail page, reusing the tokens and components."
