// /our-products and the product pages, on the Parmar ServicesPage and
// ServiceDetailPage layouts.
import { Link } from "react-router-dom";
import { ArrowIcon, PageShell, primaryButton, secondaryButton } from "@/components/ui";
import { coverPads, products, productsHub, type Product } from "@/content/products";
import { site } from "@/content/site";

const WhatsAppButton = ({ label = "Message us on WhatsApp" }: { label?: string }) => (
  <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
    {label}
  </a>
);

export const ProductsPage = () => (
  <PageShell breadcrumbs={[{ name: "Our Products" }]}>
    <div className="max-w-[900px] mb-14">
      <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-normal tracking-[-0.04em] leading-[1.05] mb-6">{productsHub.h1}</h1>
      <p className="text-[17px] md:text-[19px] leading-[1.6] text-black/70">{productsHub.summary}</p>
    </div>

    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {products.map((p) => (
        <li key={p.path}>
          <Link to={p.path} className="group bg-white flex flex-col overflow-hidden h-full">
            <div className="overflow-hidden">
              <img
                src={p.image.src}
                srcSet={p.image.srcSet}
                sizes="(min-width: 768px) 50vw, 100vw"
                alt={p.alt}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-8 flex flex-col gap-3">
              <h2 className="text-[24px] md:text-[28px] tracking-[-0.03em]">{p.name}</h2>
              <p className="text-[15px] leading-[1.7] text-black/70">{p.card}</p>
              <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
                See {p.name.toLowerCase()} <ArrowIcon size={14} />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>

    <div className="mt-16 bg-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <h2 className="text-[24px] md:text-[30px] tracking-[-0.03em]">{productsHub.cta.title}</h2>
        <p className="text-[15px] leading-[1.7] text-black/70 mt-2">{productsHub.cta.body}</p>
      </div>
      <Link to="/contact-us" className={`${primaryButton} w-fit`}>Start your album <ArrowIcon size={14} /></Link>
    </div>
  </PageShell>
);

export const ProductPage = ({ product }: { product: Product }) => {
  const others = products.filter((p) => p.path !== product.path);
  return (
    <PageShell breadcrumbs={[{ name: "Our Products", path: "/our-products" }, { name: product.name }]}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20 items-start mb-16">
        <div className="flex flex-col gap-6">
          <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-normal tracking-[-0.04em] leading-[1.05]">{product.name}</h1>
          <p className="text-[17px] md:text-[19px] leading-[1.6] text-black/75">{product.summary}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact-us" className={primaryButton}>Start your album <ArrowIcon size={14} /></Link>
            <WhatsAppButton />
          </div>
        </div>
        <img
          src={product.image.src}
          srcSet={product.image.srcSet}
          sizes="(min-width: 1024px) 45vw, 100vw"
          alt={product.alt}
          fetchPriority="high"
          className="w-full aspect-[4/3] object-cover"
        />
      </div>

      <div className="max-w-[900px] flex flex-col gap-12">
        {product.sections.map((section) => (
          <section key={section.question} className="flex flex-col gap-4 pb-10 border-b border-black/10">
            <h2 className="text-[26px] md:text-[32px] tracking-[-0.03em]">{section.question}</h2>
            {section.answer.map((para) => (
              <p key={para} className="text-[15px] md:text-[17px] leading-[1.7] text-black/80">{para}</p>
            ))}
            {section.bullets && (
              <ul className="list-disc pl-5 flex flex-col gap-2 text-[15px] md:text-[17px] leading-[1.6] text-black/80">
                {section.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            )}
          </section>
        ))}

        {product.covers && (
          <section className="flex flex-col gap-6 pb-10 border-b border-black/10">
            <div className="flex flex-col gap-4">
              <h2 className="text-[26px] md:text-[32px] tracking-[-0.03em]">{coverPads.question}</h2>
              <p className="text-[15px] md:text-[17px] leading-[1.7] text-black/80">{coverPads.intro}</p>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/10 border border-black/10">
              {coverPads.items.map((pad) => (
                <div key={pad.name} className="bg-[#f3f1ed] p-6 flex flex-col gap-2">
                  <dt className="text-[17px] md:text-[19px] font-semibold">{pad.name}</dt>
                  <dd className="text-[15px] leading-[1.7] text-black/70">{pad.text}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="text-[22px] md:text-[26px] tracking-[-0.03em]">Other products</h2>
          <ul className="flex flex-wrap gap-3">
            {others.map((p) => (
              <li key={p.path}>
                <Link to={p.path} className={secondaryButton}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
};
