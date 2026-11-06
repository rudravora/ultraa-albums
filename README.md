# Ultraa Albums homepage

A light-mode, single-page homepage for Ultraa Albums, built with semantic HTML, CSS, vanilla JavaScript, Vite and Three.js (the hero album only). Static output; no server or database.

Needs Node 22 or newer and pnpm (the version is pinned in `package.json`; `corepack enable` provides it).

## Run

```sh
pnpm install --frozen-lockfile
pnpm dev        # http://localhost:3000, live reload
```

Build and serve the production files:

```sh
pnpm build      # writes dist/
pnpm preview    # serves dist/ on http://localhost:3000
```

`pnpm dev` and `pnpm build` first run `scripts/render-home.mjs`, which writes `index.html` from `src/content.js`. `index.html` is generated, so it is git-ignored: edit `src/content.js` or the script, never the HTML. The page is complete without JavaScript; scripts add the 3D album, the controls, the scroll motion and the form handling.

## Where things live

- `src/content.js`: all copy, links, product data and image paths.
- `scripts/render-home.mjs`: the static, accessible markup.
- `src/site.css`: design tokens (`:root`), layout, states, motion and user-preference queries.
- `src/main.js`: audience switch, material and editing controls, mobile menu, contact form, scroll motion.
- `src/album-scene.js`: the Three.js album (geometry, page textures, the scroll-driven opening).
- `public/assets/images`: WebP images. `album-closed-*` and `album-open-*` are stills rendered from the same Three.js scene and shown when WebGL or JavaScript is unavailable.
- `public/assets/fonts`: self-hosted Newsreader (display) and Hanken Grotesk (text).

## Contact form

With no endpoint configured, the form opens the visitor's email app with the enquiry addressed to ultraaalbums@gmail.com, and says so beside the button. Without JavaScript the same happens through a native `mailto:` form action. The page never shows a success message it cannot confirm.

To post to a form service instead, copy `.env.example` to `.env.local` and set:

```env
VITE_ULTRAA_FORM_ENDPOINT=https://your-form-service.example/endpoint
```

The endpoint must accept `multipart/form-data` POSTs, allow CORS from the site's origin and return a 2xx status on receipt. It is public configuration, not a secret; never put a private API key here. Restart `pnpm dev` (or rebuild) after changing it. Success is shown only after a 2xx response; anything else shows an error and keeps the visitor's text.

## Replacing stand-in images

Every photograph is a generated stand-in (listed in `HANDOFF.md`). Replace files in place, keeping names and the `-480`, `-800`, `-1200` widths. For the editing slider, each example is a pair: `editing-0N-before-*.webp` and `editing-0N-after-*.webp`.

## Research

The earlier website research (Ultraa Albums and Zno) that was this repository's original README is in [docs/website-intelligence-report.md](docs/website-intelligence-report.md).
