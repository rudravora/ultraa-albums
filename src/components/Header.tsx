import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation, site, type NavLink } from "@/content/site";
import { ArrowIcon } from "@/components/ui";

const isExternal = (href: string) => href.startsWith("http");

/** Internal links use the router; external ones open normally. */
export const SmartLink = ({ href, className, children, onClick }: { href: string; className?: string; children: React.ReactNode; onClick?: () => void }) =>
  isExternal(href) ? (
    <a href={href} className={className} onClick={onClick} target="_blank" rel="noopener noreferrer">{children}</a>
  ) : (
    <Link to={href} className={className} onClick={onClick}>{children}</Link>
  );

const Chevron = ({ open }: { open: boolean }) => (
  <svg className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Underline = () => (
  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 transition-all duration-300 group-hover:w-full" />
);

const NavItem = ({ link }: { link: NavLink }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  if (!link.items) {
    return (
      <div className="group relative">
        <SmartLink href={link.href} className="block text-base font-semibold text-neutral-900 uppercase py-2">
          <span className="relative">{link.label}<Underline /></span>
        </SmartLink>
      </div>
    );
  }

  return (
    <div ref={ref} className="group relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-base font-semibold text-neutral-900 uppercase py-2"
      >
        <span className="relative">{link.label}<Underline /></span>
        <Chevron open={open} />
      </button>
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-[85%] mt-2 min-w-[240px] bg-white border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-xl py-3 transition-all duration-300 z-50 before:content-[''] before:absolute before:-top-4 before:inset-x-0 before:h-4 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto visible" : "opacity-0 translate-y-2 pointer-events-none invisible group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
        }`}
      >
        {link.items.map((item) => (
          <SmartLink
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="block px-6 py-3 text-[15px] font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
          >
            {item.label}
          </SmartLink>
        ))}
      </div>
    </div>
  );
};

const PhoneIcon = () => (
  <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <path d="M6.6 3.5H4.4a1 1 0 0 0-1 1.1 13 13 0 0 0 12 12 1 1 0 0 0 1.1-1v-2.2a1 1 0 0 0-.8-1l-2.6-.6a1 1 0 0 0-1 .3l-1 1.1a10 10 0 0 1-4.1-4.1l1.1-1a1 1 0 0 0 .3-1l-.6-2.6a1 1 0 0 0-1-.8Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

/** A slim black bar with the fact and contacts; it stays pinned with the header. */
const TopBar = () => (
  <div className="fixed top-0 inset-x-0 z-[101] bg-[#111111] text-white/85 text-[12px] md:text-[13px] tracking-wide">
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 h-9 flex items-center justify-between gap-4">
      <p>{site.fact}</p>
      <div className="flex items-center gap-6">
        <a href={site.phones[0].href} className="inline-flex items-center gap-2 hover:text-white"><PhoneIcon />{site.phones[0].label}</a>
        <a href={`mailto:${site.emails[0]}`} className="hidden md:inline hover:text-white">{site.emails[0]}</a>
        <a href={site.payOnline} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-1 hover:text-white">
          Pay online <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  </div>
);

export const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // Hero-coloured over the home hero until scrolled (Parmar keeps it transparent; a solid
  // fill lets the logo's white field blend away with mix-blend-multiply); white elsewhere.
  const solid = !isHome || !atTop || menuOpen;

  return (
    <>
      <TopBar />
      <header
        className={`fixed top-9 inset-x-0 z-[100] transition-colors duration-500 ${solid ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-[#f8f7f4]"}`}
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex justify-between items-center min-h-[64px] md:min-h-[75px] text-neutral-900">
            <Link to="/" aria-label={`${site.name} home`} className="flex items-center py-[5px] transition-opacity hover:opacity-80">
              <img src={site.logo} width={213} height={71} alt={site.name} className="h-[44px] md:h-[52px] w-auto mix-blend-multiply" />
            </Link>

            <nav aria-label="Main" className="hidden lg:flex items-center gap-x-8 xl:gap-x-12 ml-auto mr-10">
              {navigation.links.map((link) => <NavItem key={link.label} link={link} />)}
            </nav>

            <SmartLink
              href={navigation.cta.href}
              className="hidden lg:inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-black/85 transition-colors"
            >
              {navigation.cta.label} <ArrowIcon />
            </SmartLink>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden relative flex items-center justify-center w-11 h-11 -mr-2"
            >
              <span className={`absolute block h-px w-[30px] bg-neutral-900 transition-all duration-300 ${menuOpen ? "rotate-45" : "-translate-y-[5px]"}`} />
              <span className={`absolute block h-px w-[30px] bg-neutral-900 transition-all duration-300 ${menuOpen ? "-rotate-45" : "translate-y-[5px]"}`} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} close={() => setMenuOpen(false)} />
    </>
  );
};

/** Full-screen white drawer with uppercase links and expandable groups (Parmar layout). */
const MobileMenu = ({ open, close }: { open: boolean; close: () => void }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div
      id="mobile-menu"
      className={`fixed inset-0 top-9 bg-white z-[90] lg:hidden flex flex-col pt-24 px-8 pb-10 transition-opacity duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
    >
      <nav aria-label="Mobile" className="flex flex-col flex-1 gap-3 overflow-y-auto">
        {navigation.links.map((link, i) => {
          const isOpen = expanded === link.label;
          const item = `uppercase flex items-center justify-between w-full text-left text-black text-[24px] py-2 transition-all duration-300 ${open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`;
          return (
            <div key={link.label} className="border-b border-neutral-100 last:border-0 pb-3">
              {link.items ? (
                <>
                  <button type="button" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : link.label)} className={item} style={{ transitionDelay: `${open ? 100 + i * 50 : 0}ms` }}>
                    <span>{link.label}</span>
                    <Chevron open={isOpen} />
                  </button>
                  <div className={`flex flex-col gap-2 pl-4 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[480px] mt-2 opacity-100" : "max-h-0 opacity-0 invisible"}`}>
                    {link.items.map((sub) => (
                      <SmartLink key={sub.href} href={sub.href} onClick={close} className="uppercase text-black/70 text-lg hover:text-black py-1.5">
                        {sub.label}
                      </SmartLink>
                    ))}
                  </div>
                </>
              ) : (
                <SmartLink href={link.href} onClick={close} className={item}>
                  <span style={{ transitionDelay: `${open ? 100 + i * 50 : 0}ms` }}>{link.label}</span>
                </SmartLink>
              )}
            </div>
          );
        })}
      </nav>
      <SmartLink
        href={navigation.cta.href}
        onClick={close}
        className="mt-6 uppercase w-full flex items-center justify-center bg-[#0F0F0F] text-white font-medium text-[17px] py-[18px] rounded-full hover:bg-black transition-colors"
      >
        {navigation.cta.label}
      </SmartLink>
    </div>
  );
};
