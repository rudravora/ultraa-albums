import { Link } from "react-router-dom";
import { PageShell, primaryButton, ArrowIcon } from "@/components/ui";
import { products, type pages } from "@/content/site";

type Page = (typeof pages)[number];

const parentFor = (page: Page) =>
  page.kind === "product" ? { name: "Our Products", path: "/our-products" } : undefined;

// ponytail: placeholder until each page template lands (phases 4–5).
export const StubPage = ({ page }: { page: Page }) => {
  const parent = parentFor(page);
  return (
    <PageShell breadcrumbs={[...(parent ? [parent] : []), { name: page.name }]}>
      <h1 className="text-[40px] md:text-[64px] font-semibold leading-[1.05] tracking-[-0.04em] max-w-[18ch]">{page.name}</h1>
      <p className="mt-6 max-w-[60ch] text-lg text-black/60 leading-relaxed">{page.description}</p>
      {page.path === "/our-products" && (
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 max-w-3xl">
          {products.map((p) => (
            <li key={p.href}>
              <Link to={p.href} className="flex items-center justify-between border-b border-black/10 py-4 text-xl font-medium hover:text-black/60">
                {p.label} <ArrowIcon />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link to="/contact-us" className={`${primaryButton} mt-12`}>Start your album <ArrowIcon /></Link>
    </PageShell>
  );
};

export const NotFoundPage = () => (
  <PageShell>
    <h1 className="text-[40px] md:text-[64px] font-semibold leading-[1.05] tracking-[-0.04em]">Page not found</h1>
    <p className="mt-6 text-lg text-black/60">This page does not exist or has moved.</p>
    <Link to="/" className={`${primaryButton} mt-10`}>Back to home <ArrowIcon /></Link>
  </PageShell>
);
