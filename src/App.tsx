import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { FloatingButtons } from "@/components/ui";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { DetailPage, ProductPage, ProductsPage } from "@/pages/ProductPages";
import { AboutPage, ContactPage, FaqPage, PrivacyPage, TermsPage } from "@/pages/InfoPages";
import { BlogListPage, BlogPostPage } from "@/pages/BlogPages";
import { productFor } from "@/content/products";
import { serviceFor, services, weddingGuide } from "@/content/services";
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

const infoPages: Record<string, () => JSX.Element> = {
  "/about-us": AboutPage,
  "/contact-us": ContactPage,
  "/faq": FaqPage,
  "/blog": BlogListPage,
  "/privacy-policy": PrivacyPage,
  "/terms-and-condition": TermsPage,
};

const elementFor = (page: (typeof pages)[number]) => {
  if (page.kind === "home") return <HomePage />;
  if (page.kind === "post") return <BlogPostPage slug={page.path.slice("/blog/".length)} />;
  if (page.path === "/our-products") return <ProductsPage />;
  const product = productFor(page.path);
  if (product) return <ProductPage product={product} />;
  const service = serviceFor(page.path);
  if (service) return <DetailPage item={service} others={services} othersTitle="Other services" />;
  if (page.path === weddingGuide.path) return <DetailPage item={weddingGuide} others={services} othersTitle="Design, editing and photography" />;
  const Info = infoPages[page.path];
  if (Info) return <Info />;
  throw new Error(`No page component for ${page.path}`);
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
