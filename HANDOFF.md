# Handoff: Ultraa Albums homepage

Finished in a Claude Code session on 6 November 2026, starting from the Manus build (commit `50cc0df`). All work is in small local commits; nothing has been pushed.

## Run it

```sh
pnpm install --frozen-lockfile
pnpm dev        # http://localhost:3000
pnpm build && pnpm preview   # production build on http://localhost:3000
```

Node 22 or newer. `index.html` is generated from `src/content.js` by `scripts/render-home.mjs` on every dev/build run and is git-ignored.

## What changed, in short

- **3D hero fixed and rebuilt.** The album's page photos pointed at `/manus-storage/…`, which does not exist here, so the scene threw and the opening never ran. Textures now come from local images. The album was rebuilt as a real hinged book: three designed spreads, leaves that bend as they turn, gold-foil cover frame, gilded page edges, brass corners, studio reflections, on a linen ground with a light pool and hairline orbit rings.
- **Hero layout.** Copy left, large album right (stacked under 60rem). The hero fits one screen at 1280×800 and 1440×900 with h1, sentence, both buttons, the fact and the whole album visible.
- **Contact form works without a backend.** With no endpoint it opens the visitor's email app addressed to ultraaalbums@gmail.com and says so beside the button; without JavaScript the native form action is the same `mailto:`. With `VITE_ULTRAA_FORM_ENDPOINT` set it POSTs as before. No fake success state anywhere. `.env.example` added.
- **Before/after restructured** as `{ before, after }` file pairs. The old version showed one photo with two CSS filters, and its Before/After labels were on the wrong sides.
- **Copy bugs.** The Photo Books row no longer says "finish choices listed below"; the nav says "Album options" to match the section (anchor `#album-options`).
- **Leftovers removed.** The design-notes HTML comment, `public/manus-routes.json`, `app.config.ts` (nothing imported them) and five unused full-size originals.
- **Lockfile** (`pnpm-lock.yaml`) and a README that matches what runs.

## Owner decisions that override the brief

These came from the owner during the session. Each contradicts a line in `BRIEF.md`, and each is recorded here and in the CSS stamp.

| Decision | Brief rule it overrides | How it is contained |
| --- | --- | --- |
| Scroll-driven album: the hero pins for 70svh and scroll opens/closes the cover | "No scroll-triggered reveals, parallax or scroll-linked animation" | Scroll moves only the cover, on a critically damped spring (no bounce, reversible). Off under reduced motion (no pin, book open). |
| Page turns, by click, drag, pager buttons or the audience switch only (not scroll) | "No carousels, no timed tabs" | Never automatic or timed; keyboard pager with disabled ends; reduced motion makes turns instant. |
| Once-only section reveals (fade + 1rem rise, 70ms stagger, capped at 350ms) | Same scroll ban | Content visible without JS (`html.js` gate); nothing re-hides; off under reduced motion. |
| Hero background: linen ground, radial light pool, orbit rings | "No gradients" (the light pool is a radial falloff) | Flat linen in CSS; the pool and rings are inside the 3D scene, move only with the cover and pages, never loop. |

## Other decisions (with defaults you can override)

- **No package tiers.** No public Essential/Premium/Ultimate tiers exist, so "Album options" compares the four real formats with only published facts. "Not listed" marks unknowns. No prices anywhere; the button is "Get a quote".
- **No Journal section.** The official blog exposes no verifiable titles (see `PRODUCT.md`). The nav links to the live archive.
- **Contacts are the real ones.** taste-skill house rule 9 says "no phone in a real format; contacts on `.example`". That rule is for invented businesses; this is a real client and both the brief and the session prompt require the real phone and email. The checker's `phone-number` FAIL is a judged false positive.
- **Address omitted.** The published address has a house number and postcode, which taste-skill rule 9 bans; phone, email and Messenger cover contact.
- **Before/after kept, as a stand-in.** It demonstrates what editing does using generated photos. It is not presented as client work (alt text says "fictional"), and the copy makes no results claim. Replace both files of each pair with a real Ultraa edit.
- **Audience switch → spread.** "For couples" opens the album at spread 1, "For photographers" at spread 3 (the designed layout), while the h1 and sentence change.
- **The 3D still frames.** `album-closed-*` (no JavaScript) and `album-open-*` (WebGL unavailable, or a shader fails to compile) are rendered from the same scene, so the hand-off to the live canvas lines up.

## Verified sources

All product facts, links and contacts come from Ultraa's public site and catalog as recorded in `PRODUCT.md` (research date 5 November 2026, by the Manus run). This session did not re-browse the live site; facts were kept, never added.

## Stand-in and generated images (replace before launch)

Every photograph is generated; none is Ultraa's work or evidence of quality.

| Files (`public/assets/images/`) | What it is | Where it shows |
| --- | --- | --- |
| `luxury-cover-*`, `flush-mount-*`, `layflat-spread-*`, `photo-book-*` | Generated product photos (Manus) | Album formats grid |
| `material-leather-*`, `-linen-*`, `-acrylic-*`, `-canvas-*` | Generated cover close-ups (Manus) | Cover materials |
| `design-proofs-*` | Generated worktable photo (Manus) | How it works |
| `editing-01/02/03-after-*` | Generated fictional wedding photos (Manus) | Before/after slider; cropped onto the 3D album's pages |
| `editing-01/02/03-before-*` | Derived in this session from each "after" with ffmpeg (lower contrast and saturation, cooler, darker). Not a real unedited frame | Before/after slider |
| `album-closed-*`, `album-open-*` | Stills rendered from the Three.js album | Hero fallback |
| `../ultraa-logo.png` | Official logo, only 213×71 px, soft on high-DPI screens | Header, footer, favicon |

**Most valuable material to get from Ultraa:** real album photographs (closed, open spread, edge, cover close-ups), three real before/after edit pairs, and a vector or 2× logo.

## Absent (never invented)

Package tiers and prices; blog titles; testimonials, ratings, client logos, counts; album sizes or page counts for Luxury, Flush Mount and Layflat; a form endpoint.

## Skills loaded

All nine were installed with `install-skills.sh` and their SKILL.md files read in this session: taste-skill, hallmark, impeccable, apple-design, better-typography, motion-design, laws-of-ux, laws-of-ux-checklist, laws-of-ux-review. impeccable's `context` launcher ran (checksum-verified engine). The precedence used: the hard bans of taste-skill, hallmark and impeccable, then the brief, then the rest. The owner's explicit in-session requests override all of these (table above).

## Checks

All checks ran against the production build (`pnpm build && pnpm preview`) in headless Chrome on this Mac, WebGL via SwiftShader.

**Lighthouse 12.3** (final build)

| Run | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Desktop | 100 | 100 | 100 | 100 | 0.7 s | 20 ms | 0 |
| Mobile (simulated slow 4G, 4× CPU) | 87–91 over five runs | 100 | 100 | 100 | 3.2–3.8 s (simulated) | 120–150 ms | 0 |

The 95+ target is met on desktop and missed on mobile performance. Lighthouse's LCP-element gatherer errored in this Chrome build, so it never named the element. Measured in the page under 4× CPU and ~1.6 Mbps, LCP is the hero still at about 0.7s. The remaining cost is the 480 KB (125 KB gzip) Three.js chunk, which now loads only after `load` when the main thread is idle. The display font was cut from 132 KB to 57 KB by pinning its weight to 400. Next lever if needed: an async-decoded smaller Three.js build.

**taste-skill** (2.5.0)
- `perf.mjs`: 0 FAIL, 12 WARN (image and JS bytes, font bytes). Layout shift 0.000; LCP is the hero still; one WebGL context.
- `consistency.mjs`: 293 FAIL, 63 WARN, down from 315 FAIL. What remains:
  - 155 `scroll-reveal`, 9 `hidden-content` and 5 `pinned` are the owner's scroll override.
  - About 60 `section-height` / `one-section` / `one-heading` / `section-gaps` / `hero-screen` come from the kit's rule that every section is exactly one or two screens and starts on a screen boundary. The pinned hero shifts that grid by about 630px; sections are sized to their content instead.
  - 29 `container-edges` are the kit's markup conventions (`header.nav`, `.wrap`, `footer.closing`) that this codebase does not use.
  - `photo-print`, `effects-fit` and `shader-lint` misread the product render as a shader effect. Three.js's batching chunk mentions `gl_DrawID`; the scene now falls back to the still if any shader fails to compile.
  - `phone-number` is the client's real phone (see Decisions).
  - `text-only` / `no-visual` (contact, options table), `section-air` (editorial hairline rules) and `copy-headings` (the real step names "Get a design", "Printing") are design and brief choices.
- `assets/layout/check.mjs`: **could not run.** It crashes inside the kit (`r.sections is not iterable`) on this page structure.
- Fixed from its findings: h2 now sits below h1 in the scale; correct image `sizes` (no upscaling); the main action stays visible at 820px; product tiles top-aligned and the section exactly two screens; one split grid for every two-column section; shader-failure fallback.

**hallmark** `sloplint --render` (puppeteer-core installed in a scratch folder only): **0 FAIL, 0 REFLEX, 0 open WARN.** 19 waived (7b: the brief's pure-white `--surface`; 44c: the album sits low to leave room for the cover swing), 2 answered, 2 dismissed (11: photo zoom required by the brief; 58: the 90-word album-options table). The hero review and the finish review in a fresh-context subagent were **not run**.

**impeccable**: `context` ran. `detect` on the live URL: 0 findings. (On the static files it flagged three `cramped-padding` false positives, because it can't see the bundled CSS.) Audit score:

| Dimension | Score | Note |
| --- | --- | --- |
| Accessibility | 4 | Lighthouse 100; focus rings; labelled controls; reduced motion and contrast handled |
| Performance | 3 | Mobile 87–91 |
| Theming | 4 | Every colour and font via `:root` tokens; light only by brief |
| Responsive | 3 | 375–1440 verified; real touch drag untested |
| Implementation integrity | 4 | Coherent product-specific system |
| **Total** | **18/20** | Excellent |

The polish pass covered every control's states (hover, press, focus, disabled, sending, error, success), the browser surfaces (selection, caret, scrollbar, focus ring, one underline offset), tabular figures in the table, and 44px targets.

**better-typography**: **Approve.**
- Fixed: no caret colour; four drifting underline offsets; raw UI sizes (now `--text-ui` / `--text-small`); the display face's unused weight axis.
- Passing: unitless line-heights, tracking from 0 to −0.028em, three weights, 16px inputs, balanced headings, `pretty` paragraphs, typographic punctuation.
- Not verified: 200% zoom.

**motion-design** checklist (Premium):
- Pass: transform and opacity only in CSS; hover 80ms, press 110ms; reveal stagger 350ms; critically damped springs with no overshoot; follow-through (separate cover and page springs, the leaf's edge leads); same input gives the same motion; reduced-motion alternative for everything; nothing over 5s loops.
- Deviations: the curve is the brief's `cubic-bezier(0.4, 0, 0.2, 1)`, not a pure ease-out. A page turn travels more than a third of the stage, but along a continuous arc, as the owner asked.

**apple-design**:
- Interruptible: springs start from the live value, and a drag can grab a page mid-turn.
- Velocity handoff and momentum projection on release.
- Controls give `:active` feedback on press. A canvas click acts on release so it can be told apart from a drag.
- Reduced motion, reduced transparency and increased contrast are all handled.
- Not done: rubber-banding at the first and last spread.

**laws-of-ux-review**: **51/54 on the 27 applicable laws (57/60 normalised), grade A.** N/A: Cognitive Bias (no social proof by design), Parkinson, Zeigarnik. Partial (1/2):
- Goal-Gradient: the pager shows its ends but no "spread 2 of 3".
- Flow: the pinned hero holds the scroll for 70svh.
- Peak-End: a mailto close cannot confirm delivery.

**laws-of-ux-checklist**: **12/12, SHIP IT** (#7 multi-step progress is N/A).

**Behaviour tests** (Playwright scripts kept outside the repo), all passing on the final build:
- 3D scene ready; audience switch changes copy and spread.
- Scroll opens and closes the cover only.
- Click, drag (with fling), pager and audience switch turn pages.
- Closing on scroll-up carries the turned pages.
- Reduced motion: open, no pin, instant.
- No WebGL: open still. No JS: closed still, `mailto:` form.
- Before/after uses real file pairs and the divider follows the slider.
- Form validation; the mailto status makes no success claim.
- No console errors.
- Viewed at 375, 390, 768, 1024, 1280 and 1440.

## Limitations and known gaps

- WebGL was tested in headless Chrome with SwiftShader (software GL) only. Not tested: a real GPU, Safari or Firefox, or a physical phone. Touch drag was not exercised with real touch input (it uses Pointer Events with `touch-action: pan-y`).
- On phones, the still image (no JS/no WebGL) is framed slightly smaller than the live canvas, because portrait stages widen the live frame. You only see this during the 180ms crossfade.
- The page-turn drag clamps hard at the first and last spread (no rubber-banding).
- Hero texture photos load at 1200px (about 1 MB for the three); the hero still is the LCP, so this does not delay first paint.
- The logo asset is low resolution (see above).
- `PRODUCT.md` predates impeccable's current schema; `impeccable init` can refresh it if wanted.
