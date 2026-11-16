// Build-time renderer used only by scripts/prerender.mjs (built with `vite build --ssr`).
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppRoutes } from "@/App";

export { pages, site } from "@/content/site";

export const render = (path: string) =>
  renderToString(
    <StaticRouter location={path}>
      <AppRoutes />
    </StaticRouter>,
  );
