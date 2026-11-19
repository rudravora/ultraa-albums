import "@fontsource-variable/instrument-sans/wght.css";
import "@fontsource/bebas-neue/400.css";
import "@fontsource/dm-serif-display/latin-400.css";
import "@/styles.css";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/App";

const container = document.getElementById("app")!;
const app = (
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages already hold their HTML: hydrate it. The dev server serves an empty shell.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
