# Ultraa Albums website

The Ultraa Albums site: React 18, Vite, Tailwind CSS and React Router, with a Three.js album in the home hero. Every page is prerendered to static HTML at build time, so content shows without waiting for JavaScript. Layout and design tokens follow the Parmar Properties main-site (black and white, Instrument Sans).

Needs Node 22 or newer and pnpm (the version is pinned in `package.json`; `corepack enable` provides it).

## Run

```sh
pnpm install --frozen-lockfile
pnpm dev        # http://localhost:3000, live reload
```

Build the production files:

```sh
pnpm build      # type-checks, builds dist/, then prerenders every page into it
npx serve dist  # serves dist/ with clean URLs (/about-us → about-us.html), as Vercel does
```

`pnpm preview` (Vite's own server) does not map clean URLs, so use `serve` to check pages other than the home page.

## Where things live

- `src/content/site.ts`: brand, contacts, navigation and the page list (paths match the live ultraaalbums.com URLs).
- `src/App.tsx`: the routes, shared by the browser app and the prerender.
- `src/components/`: header (top bar, navigation, mobile menu), footer, page shell, buttons and floating WhatsApp/back-to-top buttons.
- `src/pages/`: page components.
- `src/styles.css` and `tailwind.config.js`: design tokens (copied from the Parmar main-site) and base styles.
- `src/entry-server.tsx` and `scripts/prerender.mjs`: build-time rendering of every page, plus `404.html`, `sitemap.xml` and `robots.txt`.
- `src/album-scene.js`: the Three.js album (geometry, page textures, the scroll-driven opening).
- `public/assets/images`: WebP images. `album-closed-*` and `album-open-*` are stills rendered from the Three.js scene.
- Instrument Sans is self-hosted through `@fontsource-variable/instrument-sans`; no font CDN.

## Contact form

With no endpoint configured, the form opens the visitor's email app with the enquiry addressed to ultraaalbums@gmail.com, and says so beside the button. Without JavaScript the same happens through a native `mailto:` form action. The page never shows a success message it cannot confirm.

To post to a form service instead, copy `.env.example` to `.env.local` and set:

```env
VITE_ULTRAA_FORM_ENDPOINT=https://your-form-service.example/endpoint
```

The endpoint must accept `multipart/form-data` POSTs, allow CORS from the site's origin and return a 2xx status on receipt. It is public configuration, not a secret; never put a private API key here. Restart `pnpm dev` (or rebuild) after changing it. Success is shown only after a 2xx response; anything else shows an error and keeps the visitor's text.

## Replacing stand-in images

Every photograph is a generated stand-in, not Ultraa's work. Replace files in place, keeping names and the `-480`, `-800`, `-1200` widths. For the editing slider, each example is a pair: `editing-0N-before-*.webp` and `editing-0N-after-*.webp`.

| Files (`public/assets/images/`) | What it is | Where it shows |
| --- | --- | --- |
| `luxury-cover-*`, `flush-mount-*`, `layflat-spread-*`, `photo-book-*` | Generated product photos | Album formats grid |
| `material-leather-*`, `-linen-*`, `-acrylic-*`, `-canvas-*` | Generated cover close-ups | Cover materials |
| `design-proofs-*` | Generated worktable photo | How it works |
| `editing-01/02/03-after-*` | Generated fictional wedding photos | Before/after slider; the 3D album's pages |
| `editing-01/02/03-before-*` | Each "after" with lower contrast and saturation, cooler and darker; not a real unedited frame | Before/after slider |
| `album-closed-*`, `album-open-*` | Stills rendered from the Three.js album | Hero fallback without WebGL or JavaScript |
| `../ultraa-logo.png` | Official logo, only 213×71 px, soft on high-DPI screens | Header, footer, favicon |

Most useful to get from Ultraa: real album photographs (closed, open spread, edge, cover close-ups), three real before/after edit pairs, and a vector or 2× logo.

### Stock photographs

The home sections use photos from [Unsplash](https://unsplash.com) under the [Unsplash License](https://unsplash.com/license) (free for commercial use, no permission needed). They are placeholders until Ultraa supplies its own. Files are in `public/assets/images/stock/`.

| File | Photographer |
| --- | --- |
| `album-browse-*` | Harry Borrett |
| `album-open-*` | Mockaroon |
| `photo-book-*`, `design-layout-*` | Kristyna Squared.one |
| `bride-*` | Alok Verma |
| `couple-bw-*` | Hisu lee |
| `editing-*` | Zulfugar Karimov |
| `photographer-*` | Micah & Sammie Chaffin |
| `camera-*` | Ailbhe Flynn |
| `couple-path-*` | iKshana Productions |

## Research

The earlier website research (Ultraa Albums and Zno) that was this repository's original README is in [docs/website-intelligence-report.md](docs/website-intelligence-report.md).
