# Ultraa Albums homepage

A light-mode, responsive, single-page redesign using semantic HTML, CSS, JavaScript, Vite and Three.js. It needs Node 22+ and pnpm 11.25.0. No application server or database is part of this static deliverable.

## Run and build

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev` renders the complete HTML from `src/content.js` before starting Vite on port 3000. The HTML includes the default fallback state, so the visible page does not rely on JavaScript for its content. To make a clean static build, run `pnpm build`; output is in `dist/`. To serve the built files locally, run `pnpm preview`.

Page copy, product data, destinations and image mappings are centralized in `src/content.js`; `scripts/render-home.mjs` emits root `index.html`. The single route is `/`, declared in `public/manus-routes.json`. The editable design tokens and all layout/motion rules are in `src/site.css`. The Three.js album is in `src/album-scene.js`, and the progressive enhancements are in `src/main.js`.

## Connect the contact form

No form destination was provided, so the shipped page honestly says the form is not connected, keeps the submit button disabled and says nothing will be sent. Phone, Messenger and email links remain available.

To connect it, obtain an endpoint from the site’s chosen form provider that accepts a browser-submitted `multipart/form-data` POST and returns an HTTP 2xx status for acceptance. The JavaScript enhancement uses `fetch`, so the endpoint must allow CORS from the final site origin. Credentials are omitted. Do not place a private API key in this public frontend.

Create a `.env.local` file in the project root and set:

```env
VITE_ULTRAA_FORM_ENDPOINT=<the real HTTPS POST endpoint issued to the site owner>
```

Replace the angle-bracket instruction with the real endpoint. This URL is public configuration, not a secret. Restart `pnpm dev` to render the no-script form action and button state from the same setting. When building for deployment, provide the same variable to the build environment before `pnpm build`. If the URL is missing or malformed, the form stays disabled with an honest error; it never shows success. A successful in-page confirmation appears only after the endpoint returns an OK response. If the request cannot be confirmed because of network, CORS or a non-2xx response, the entered values stay in place and the page gives a phone/Messenger recovery path.

Without JavaScript but with a configured endpoint, the HTML form still performs a standard native POST. With the endpoint unset, its submit button is disabled and the message says nothing is sent.

## Assets and source notes

The official logo and linked catalog are sourced from Ultraa Albums’ own public site. Local responsive WebP files include generated album, format, material and workflow stand-ins. The Three.js inner page photographs use the image-generation-managed paths reserved for the three new, generated hero-only scenes. These scenes are not local client assets and should be replaced by Ultraa-owned images before this design is used on the live marketing site. None of the generated images is genuine client work or a claim about a delivered order.

Verified product facts, live link targets, phone, Messenger, email, no-article Journal decision and exclusions are recorded in `PRODUCT.md`. The form has no live destination in the delivered project. The four actual product formats are used in the comparison because no public Essential/Premium/Ultimate tiers were found. The homepage intentionally omits a Journal content section because no official title could be verified.
