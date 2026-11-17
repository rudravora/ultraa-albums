import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";

export const ArrowIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);

export const primaryButton =
  "inline-flex items-center gap-2 bg-black text-white text-sm md:text-base font-medium px-6 py-3.5 rounded-full hover:bg-black/85 transition-colors";
export const secondaryButton =
  "inline-flex items-center gap-2 border border-black/20 text-black text-sm md:text-base font-medium px-6 py-3.5 rounded-full hover:bg-black hover:text-white transition-colors";

type Crumb = { name: string; path?: string };

/** Content-page layout from the Parmar main-site: header, breadcrumbs, main, footer. */
export const PageShell = ({ breadcrumbs, children }: { breadcrumbs?: Crumb[]; children: ReactNode }) => (
  <>
    <SkipLink />
    <Header />
    <div className="min-h-screen bg-[#f3f1ed] text-black overflow-x-clip selection:bg-black selection:text-white flex flex-col">
      <main id="main-content" className="flex-1 pt-[130px] md:pt-[170px] pb-16 md:pb-24 px-6 md:px-16 w-full max-w-[1920px] mx-auto">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-8 text-[12px] font-medium uppercase tracking-widest text-black/60">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link to="/" className="hover:text-black">Home</Link></li>
              {breadcrumbs.map((c) => (
                <li key={c.name} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  {c.path ? <Link to={c.path} className="hover:text-black">{c.name}</Link> : <span className="text-black/60" aria-current="page">{c.name}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {children}
      </main>
    </div>
    <Footer />
  </>
);

export const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-12 focus-visible:left-4 focus-visible:z-[9999] focus-visible:bg-white focus-visible:text-black focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-full focus-visible:shadow-md font-medium"
  >
    Skip to main content
  </a>
);

/** Shows after the home hero, or straight away on other pages (Parmar behaviour). */
const useShownAfterHero = () => {
  const { pathname } = useLocation();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const check = () => {
      const hero = document.getElementById("hero-section");
      setShown(pathname !== "/" || (window.scrollY > 0 && window.scrollY >= (hero ? hero.offsetHeight - window.innerHeight : window.innerHeight)));
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [pathname]);
  return shown;
};

export const FloatingButtons = () => {
  const shown = useShownAfterHero();
  const state = shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none invisible";
  return (
    <>
      <aside aria-label="Quick actions">
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message Ultraa Albums on WhatsApp"
        className={`fixed bottom-[76px] right-6 md:bottom-[88px] md:right-8 z-[80] flex items-center justify-center w-11 h-11 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20b858] transition-all duration-500 ${state}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[80] flex items-center justify-center w-11 h-11 rounded-full bg-black text-white shadow-xl transition-all duration-500 hover:bg-neutral-800 ${state}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
      </aside>
    </>
  );
};
