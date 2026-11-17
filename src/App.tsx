import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { FloatingButtons } from "@/components/ui";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage, StubPage } from "@/pages/StubPage";
import { ProductPage, ProductsPage } from "@/pages/ProductPages";
import { productFor } from "@/content/products";
import { pageFor, pages } from "@/content/site";

/** Title, description and scroll position follow the route on client-side navigation. */
const RouteEffects = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = pageFor(pathname);
    document.title = page?.title ?? "Page not found | Ultraa Albums";
    document.querySelector('meta[name="description"]')?.setAttribute("content", page?.description ?? "");
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const elementFor = (page: (typeof pages)[number]) => {
  if (page.kind === "home") return <HomePage />;
  if (page.path === "/our-products") return <ProductsPage />;
  const product = productFor(page.path);
  if (product) return <ProductPage product={product} />;
  return <StubPage page={page} />;
};

/** The route tree, shared by the browser app and the build-time prerender. */
export const AppRoutes = () => (
  <>
    <RouteEffects />
    <Routes>
      {pages.map((page) => (
        <Route key={page.path} path={page.path} element={elementFor(page)} />
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    <FloatingButtons />
  </>
);
