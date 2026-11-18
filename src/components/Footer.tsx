import { useEffect, useRef } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { footer, site } from "@/content/site";

/** Black footer with the giant wordmark and a gentle parallax (Parmar layout). */
export const Footer = () => {
  const ref = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      if (inner.current) inner.current.style.transform = `translateY(${((1 - progress) * 40).toFixed(1)}px)`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    // Listen to scroll only while the footer is on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { update(); window.addEventListener("scroll", onScroll, { passive: true }); }
      else window.removeEventListener("scroll", onScroll);
    });
    io.observe(el);
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="relative w-full overflow-hidden bg-[#111111]">
      <div ref={inner} className="text-white w-full">
        <div className="w-full max-w-[1920px] mx-auto px-6 md:px-16 pt-16 pb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-20">
            <div className="flex flex-col w-full">
              <Link to="/" className="flex flex-col items-start transition-opacity hover:opacity-80 mb-6">
                <span className="text-[72px] md:text-[120px] font-bold tracking-tight leading-[1.1]">ULTRAA</span>
                <span className="text-[24px] md:text-[36px] font-medium tracking-[0.3em] text-white/70 leading-[1.1] mt-1">ALBUMS</span>
              </Link>
              <p className="text-white font-semibold text-[18px] md:text-[22px] mb-2 tracking-wide">{site.tagline}</p>
              <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-sm">{site.blurb}</p>
            </div>

            <nav aria-label="Footer" className="lg:min-w-[400px]">
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-[15px] font-medium text-white/80 lg:whitespace-nowrap">
                {footer.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-6 min-w-[240px]">
              <address className="not-italic flex flex-col gap-4 text-[15px] text-white/80 max-w-[300px]">
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-start gap-2">
                  <MapPin size={16} className="mt-1 shrink-0" aria-hidden="true" />
                  <span>{site.address}</span>
                </a>
                {site.emails.map((email) => (
                  <a key={email} href={`mailto:${email}`} className="hover:text-white transition-colors flex items-center gap-2">
                    <Mail size={16} aria-hidden="true" /> {email}
                  </a>
                ))}
                {site.phones.map((phone) => (
                  <a key={phone.href} href={phone.href} className="hover:text-white transition-colors font-medium flex items-center gap-2">
                    <Phone size={16} aria-hidden="true" /> {phone.label}
                  </a>
                ))}
                <a href={site.messenger} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <MessageCircle size={16} aria-hidden="true" /> Message on Messenger
                </a>
              </address>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] font-medium text-white/50 tracking-wide">
            <div>© {year} {site.legalName}. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-2">
              {footer.legal.map((link) => (
                <span key={link.href} className="flex gap-2">
                  <Link to={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                  <span aria-hidden="true">|</span>
                </span>
              ))}
              <a href={site.catalog} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Catalog (PDF)</a>
            </div>
            <a href={site.payOnline} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Pay online ↗</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
