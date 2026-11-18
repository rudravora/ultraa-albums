#!/usr/bin/env node
// Renders every page to static HTML after `vite build` and the SSR build, so each
// URL has its own content and <head> without waiting for JavaScript.
// Output (served by Vercel with cleanUrls): / → index.html, /about-us → about-us.html,
// unknown URLs → 404.html. Also writes sitemap.xml and robots.txt.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const { render, pages, site, getPosts } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!template.includes('<div id="app"></div>')) throw new Error("dist/index.html has no empty #app container");

const escape = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const url = (p) => site.url + (p === "/" ? "/" : p);

function page(route, { title, description }) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(description)}" />`)
    .replace("</head>", route ? `    <link rel="canonical" href="${url(route)}" />\n  </head>` : `    <meta name="robots" content="noindex" />\n  </head>`)
    .replace('<div id="app"></div>', `<div id="app">${render(route ?? "/404")}</div>`);
}

// Every local image a blog post points at must exist (posts are edited outside the code).
const missing = getPosts().filter((p) => p.image_url.startsWith("/") && !fs.existsSync(path.join(dist, p.image_url)));
if (missing.length) throw new Error(`Blog images not found: ${missing.map((p) => `${p.slug} → ${p.image_url}`).join(", ")}`);

for (const p of pages) {
  const file = p.path === "/" ? "index.html" : `${p.path.slice(1)}.html`;
  fs.mkdirSync(path.dirname(path.join(dist, file)), { recursive: true });
  fs.writeFileSync(path.join(dist, file), page(p.path, p));
  console.log(`[prerender] ${p.path} → ${file}`);
}
fs.writeFileSync(path.join(dist, "404.html"), page(null, { title: "Page not found | Ultraa Albums", description: "" }));

fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${escape(url(p.path))}</loc></url>`).join("\n")}
</urlset>
`,
);
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${url("/sitemap.xml")}\n`);
console.log(`[prerender] ${pages.length} pages, 404.html, sitemap.xml, robots.txt`);
