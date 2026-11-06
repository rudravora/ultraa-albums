> Superseded in part: see `HANDOFF.md` for the owner's in-session changes (scroll-driven album, page turns, hero background).

# Homepage redesign plan

**Kind:** physical product + assisted service. **site-kind:** other. **Deliverable:** one responsive, light-mode homepage for Ultraa Albums, not a storefront checkout or live order-processing backend.

## Design direction

**Hallmark theme shortlist:** Atelier (0.08), Studio (0.06), Specimen (0.04), all below 0.10. Selected **Atelier**, the light editorial/luxury fit with warm material treatment. The theme checker’s nearest light/roman-serif/warm system is Studio. Both informed the restrained editorial structure; the user's exact tokens (`#FAF9F7`, `#171717`, `#9A5B43`, `#713B2C`) and official logo override their default palette. Specimen's cool blue and Darkroom's dark page were rejected.

**Taste hero deal:** use the `product` stage: one large 3D album. A film treatment was rejected because there is no supplied film; a triptych was rejected because the brief bans carousels and timed switching. The album itself opens once at load, from a present still fallback.

- **Design movement:** contemporary print editorial, translated from a Mumbai album bindery into a calm, confident product catalogue.
- **Core principles:** let the physical album lead; state published options plainly; make the craft inspectable; keep the next action quiet but clear.
- **Color philosophy:** warm paper, ink, and photographs carry most of the page. Use the exact brief tokens and the full-color official logo. Clay is reserved for actions and selected states. Light mode only.
- **Layout paradigm:** full-width product stage under a compact audience-and-copy row; varied product photographs; a material selector; workflow paired with a proof photograph; source-led comparison table; useful contact close. No templated feature-card stack.
- **Signature elements:** a 3D album with photo-textured pages; tactile cover/material photographs with a plain-word selector; one manually operated before/after range control.
- **Interaction philosophy:** actions describe results; visible response starts at press; states remain keyboard and touch operable; no autoplay or hidden actions.
- **Motion:** Premium. One 600ms opening movement with restrained easing; page fan settles with the cover. No overshoot, parallax, scroll movement, or loops. The fallback is present until WebGL is ready. Reduced motion receives the open state without animation. Other state changes are immediate. Controls and full-screen menu are opaque; honor reduced transparency and increased contrast.
- **Typography:** self-hosted Newsreader display serif and self-hosted Hanken Grotesk body/interface, with Georgia/system fallbacks. Semantic role tokens, 16px+ text and inputs, balanced headings, 60–75ch prose, restrained negative tracking, sentence case.
- **Brand essence:** wedding and event albums for photographers and couples, designed and made in Mumbai; **considered, warm, exact**.
- **Brand voice:** straightforward, material-led, concise. Examples: “Wedding albums for couples.” “Made in Mumbai. Ships worldwide.”
- **Wordmark and logo:** use the official current Ultraa Albums logo without redraw or recoloring.
- **Signature brand color:** the brief's clay `#9A5B43`; deeper links use `#713B2C`.

## Homepage argument and sections

1. Solid responsive header with official logo; Products dropdown; Services; How it works; Packages; Journal; Contact; exact main action “Start your album”; small Pay online utility; full-screen mobile menu.
2. One-screen hero with For couples / For photographers control, h1 and one short sentence, the source fact “Made in Mumbai. Ships worldwide.”, “Start your album” and “Get a quote”, and a large 3D book. It opens once on load; still image is the fallback if WebGL is unavailable or loading.
3. Varied four-product image grid: Luxury Albums, Flush Mount, Layflat and Photo Book, each linking to the real official product page; no invented prices.
4. Four-material selector: leather, linen, acrylic and canvas stand-in images.
5. The verified four-step process: Transfer photos online, Get design, Printing, Shipping.
6. Album design, photo editing and wedding photography services; one three-scene generated-photo comparison control.
7. A real-format comparison, not invented Essential/Premium/Ultimate tiers. Show only values verified on official pages, with absent dimensions left unclaimed.
8. Contact close with working phone, email and Messenger; a real POST form using the public build-time `VITE_ULTRAA_FORM_ENDPOINT`. If unset, no data is sent and a truthful error appears. No success state without an OK server response.
9. Compact directory/legal footer. No verified blog titles: omit the Journal content section. The Journal navigation link remains aimed at the official archive. Omit address house number/postcode, testimonials, metrics, package tiers and unverified prices.

## Implementation and structure

Use semantic HTML, CSS and JavaScript, Vite, and Three.js only for the hero object. The site is static; it does not need an application server or database. The form destination is configured by the deployer at build time. Copy and values live in `src/content.js`; `scripts/render-home.mjs` builds the root `index.html` so the page is complete and readable before its enhancements run. Progressive enhancements add 3D, selectors, menu behavior and the contact POST flow.

- `index.html`: generated, content-complete static homepage.
- `src/content.js`: all page data and copy.
- `scripts/render-home.mjs`: static accessible markup generator.
- `src/site.css`: `:root` tokens, responsive layout, states and motion preferences.
- `src/main.js`: audience/material/example controls, mobile menu and honest contact states.
- `src/album-scene.js`: Three.js album geometry, generated page textures, one-time motion and fallback.
- `public/assets/images`, `public/assets/fonts`: optimized generated stand-ins and self-hosted faces.
- `DESIGN.md`, `PRODUCT.md`, `README.md`, `HANDOFF.md` document operation and decisions.

## Source boundaries and decisions

- Uploaded inventory had only the brief and skills reference, not separate logo, screenshots or catalog. Retrieve the official logo and linked PDF from Ultraa's official site; generated images are stand-ins listed in the handoff.
- Official pages verify four product families, the four-step workflow, the stated worldwide delivery and the service names. Product sizes, page/covers are recorded exactly in `PRODUCT.md`.
- No official Essential/Premium/Ultimate tier names or specs verified; compare real album formats instead. Never invent prices, dimensions or page counts.
- Official current blog page, legacy route, posts API and feed expose no verifiable article titles. Omit the section; show no invented stories.
- Use first official telephone number, official email and Messenger. Omit address because the full published address includes a house/building number and postcode banned by the applicable skill rule.
- No form endpoint supplied. Show non-submission accurately until the owner configures one.
- Generated imagery is not client work, not proof of results and not an Ultraa order.

## Project structure

```text
ultraa/
├── index.html
├── src/{content.js,main.js,album-scene.js,site.css}
├── scripts/render-home.mjs
├── public/assets/{images,fonts}/
├── DESIGN.md
├── PRODUCT.md
├── README.md
└── HANDOFF.md
```
