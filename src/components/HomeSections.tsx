// Home page sections below the hero. Layouts and class values follow the Parmar
// main-site sections of the same role (named in each comment); content is Ultraa's.
import { Link } from "react-router-dom";
import { about, cta, expertise, identity, marquee, materials, process, services, why } from "@/content/home";
import { ArrowIcon } from "@/components/ui";
import { BlogSection } from "@/pages/BlogPages";
import { Reveal, ScrubText } from "@/components/motion";

const container = "w-full max-w-[1920px] mx-auto px-6 md:px-16";

/** Parmar WhyParmarSection: eyebrow column, word-fill statement, wide image. */
const WhySection = () => (
  <section aria-labelledby="why-heading" className="bg-white relative py-10 md:py-16 w-full overflow-hidden">
    <div className={`${container} 2xl:px-32 flex flex-col md:flex-row gap-6 md:gap-10 items-start mb-10 md:mb-16`}>
      <Reveal from="right" className="w-full md:w-[35%] lg:w-[40%] flex-shrink-0">
        <h2 id="why-heading" className="text-black text-lg md:text-xl font-semibold tracking-[0.02em]">{why.eyebrow}</h2>
      </Reveal>
      <ScrubText className="w-full md:w-[65%] lg:w-[60%] tracking-[-0.02em] leading-[1.15] text-2xl md:text-4xl lg:text-[42px]" segments={why.segments} />
    </div>
    <div className={`${container} 2xl:px-32 overflow-hidden`}>
      <Reveal from="left" className="relative w-full aspect-[4/5] md:aspect-[21/9] overflow-hidden">
        <img src={why.image.src} srcSet={why.image.srcSet} sizes="100vw" alt={why.image.alt} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
      </Reveal>
    </div>
  </section>
);

const chevron = "polygon(0% 0%, 53.1% 0%, 100% 50%, 53.1% 100%, 0% 100%, 46.8% 50%)";

/** Parmar IdentitySection: black band, centred heading, overlapping chevron photos. */
const IdentitySection = () => (
  <section aria-label="Who we are and what we make" className="bg-black pt-[9px] md:pt-[25px] pb-6 md:pb-10 overflow-hidden w-full">
    <div className={`${container} flex flex-col items-center text-center`}>
      <ScrubText as="h2" segments={identity.heading} className="text-5xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.05] relative top-[15px] mb-[9px] md:mb-[25px]" />
      <div className="w-full flex justify-center items-center overflow-hidden py-8 mb-6 md:mb-10">
        {identity.images.map((img, i) => (
          <Reveal
            key={img.src}
            from="left"
            delay={i * 150}
            className="shrink-0 relative"
            style={{ zIndex: 10 - i, marginLeft: i === 0 ? 0 : "clamp(-40px, -6vw, -20px)" }}
          >
            <div className="overflow-hidden bg-neutral-900" style={{ width: "clamp(90px, 26vw, 280px)", aspectRatio: "346 / 440", clipPath: chevron, WebkitClipPath: chevron }}>
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" draggable={false} className={`w-full h-full object-cover select-none ${i === 0 || i === 3 ? "scale-[1.15]" : ""}`} />
            </div>
          </Reveal>
        ))}
      </div>
      <ScrubText segments={identity.body} className="text-xl md:text-2xl leading-relaxed max-w-3xl" />
    </div>
  </section>
);

/** Parmar AboutSection: eyebrow and stats on the left, giant ABOUT and text on the right. */
const AboutSection = () => (
  <section aria-labelledby="about-heading" className="bg-white relative py-16 md:py-24 w-full overflow-hidden">
    <div className="max-w-[1920px] mx-auto px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col lg:flex-row gap-16 md:gap-24 relative z-10">
      <div className="w-full lg:w-[45%] flex flex-col gap-12 pt-4">
        <Reveal>
          <p className="text-[#333] text-xl md:text-2xl font-medium tracking-wide leading-relaxed max-w-sm">{about.eyebrow}</p>
        </Reveal>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 w-full mt-4">
          {about.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={(i + 1) * 100} className="border-b border-[#eee] pb-4 flex flex-col-reverse">
              <dt className="text-[#666] text-xs md:text-sm font-medium">{stat.label}</dt>
              <dd className="text-[40px] md:text-[56px] font-light text-black leading-none mb-3 tabular-nums">{stat.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
      <div className="w-full lg:w-[55%] flex flex-col pt-8 lg:pt-0 pb-12 lg:pb-0">
        <Reveal delay={100}>
          <h2 id="about-heading" className="text-[100px] md:text-[140px] lg:text-[180px] font-black text-[#222] leading-[0.8] tracking-tighter mb-10">{about.heading}</h2>
        </Reveal>
        <ScrubText segments={about.body} base="text-neutral-200" className="text-base md:text-[17px] leading-[1.6] max-w-[500px] mb-10" />
        <Reveal delay={300}>
          <Link to={about.action.href} className="mt-8 inline-flex items-center gap-3 bg-black text-white text-sm md:text-base font-medium leading-[1.1] px-6 py-3.5 rounded-full hover:bg-black/85 transition-colors">
            {about.action.label} <ArrowIcon size={20} />
          </Link>
        </Reveal>
      </div>
    </div>
    {/* Parmar overlaps the text with this photo; here it sits below the text on small
        screens and low on the right on large ones, so the copy stays readable. */}
    <div aria-hidden="true" className="relative mt-4 ml-6 lg:ml-0 lg:mt-0 lg:absolute lg:top-[72%] lg:right-0 lg:w-[620px] xl:w-[760px] pointer-events-none z-0 lg:translate-x-24 opacity-80">
      <Reveal from="left" delay={500}>
        <img
          src={about.image.src}
          width={800}
          height={534}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover rounded-tl-[3rem] shadow-2xl"
          style={{ WebkitMaskImage: "linear-gradient(to top, transparent 5%, black 100%)", maskImage: "linear-gradient(to top, transparent 5%, black 100%)" }}
        />
      </Reveal>
    </div>
  </section>
);

/** Parmar ProcessSection: black, two-tone heading and a white pill, numbered steps. */
const ProcessSection = () => (
  <section aria-labelledby="process-heading" className="bg-black text-white py-5 md:py-11 w-full overflow-hidden">
    <div className={`${container} flex flex-col md:flex-row md:justify-between items-start gap-8 lg:gap-16 xl:gap-20`}>
      <div className="flex-1 flex-shrink-0 w-full md:w-[360px] mb-12 md:mb-0 pt-8 md:pt-10">
        <h2 id="process-heading" className="text-5xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.05] mb-10">
          <ScrubText as="span" className="block" base="text-neutral-700" segments={[{ text: process.heading[0], color: "text-white" }]} />
          <ScrubText as="span" className="block" base="text-neutral-700" segments={[{ text: process.heading[1], color: "text-neutral-400" }]} />
        </h2>
        <Reveal delay={200}>
          <Link to={process.action.href} className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium text-sm transition-transform hover:scale-105">
            {process.action.label} <ArrowIcon />
          </Link>
        </Reveal>
      </div>
      <div className="flex-1 min-w-0 w-full lg:-ml-[250px] pt-8 md:pt-10">
        <Reveal className="text-white font-medium text-xl md:text-2xl mb-8">{process.subheading}</Reveal>
        <ol>
          {process.steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.number}
              delay={i * 120}
              className={`flex flex-col md:flex-row items-start md:items-baseline py-8 md:py-10 border-white/20 ${i === 0 ? "border-t" : ""} ${i < process.steps.length - 1 ? "border-b" : ""}`}
            >
              <span className="text-white/60 text-sm tracking-widest mb-4 md:mb-0 md:mr-8 md:w-8 shrink-0">{step.number}</span>
              <span className="text-2xl md:text-[32px] md:leading-[1.1] font-medium tracking-tight">
                <span className="text-white">{step.title}</span> <span className="text-white/40">{step.description}</span>
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

/** Parmar MarqueeSection: outlined Bebas Neue words scrolling on black. */
const MarqueeSection = () => {
  const line = marquee.join("    ") + "    ";
  return (
    <div aria-hidden="true" className="w-full overflow-hidden whitespace-nowrap py-[30px] md:py-[46px] bg-black text-white flex items-center">
      <div className="animate-marquee inline-block flex-shrink-0">
        {[0, 1].map((k) => (
          <span key={k} className="sm:mx-6 md:mx-8 text-4xl md:text-6xl lg:text-7xl font-normal tracking-wide font-bebas uppercase text-outline">{line}</span>
        ))}
      </div>
    </div>
  );
};

const BigArrow = ({ className = "" }: { className?: string }) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={className}>
    <path d="M4 12h14" strokeLinecap="square" />
    <path d="M12 4l8 8-8 8" />
  </svg>
);

/** Parmar ServicesSection: full-width rows with a number ring, text and a giant label and arrow. */
const ServicesSection = () => (
  <section aria-labelledby="services-heading" className="bg-black pt-0 pb-10 md:pb-16 w-full overflow-hidden">
    <h2 id="services-heading" className="sr-only">What Ultraa does</h2>
    <ul className="w-full flex flex-col border-b border-white/20">
      {services.items.map((item, i) => (
        <Reveal as="li" key={item.label} delay={i * 150} className="w-full">
          <Link
            to={item.href}
            className="group relative w-full border-t border-white/20 bg-black overflow-hidden flex flex-col md:flex-row items-start md:items-center pt-10 pb-5 md:pt-24 md:pb-[76px] px-6 md:px-16"
          >
            <div className="absolute inset-0 opacity-40 md:opacity-0 md:group-hover:opacity-40 transition-opacity duration-700 pointer-events-none overflow-hidden">
              <img src={item.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 md:translate-y-12 md:group-hover:translate-y-0" />
            </div>
            <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 md:gap-16 items-start md:items-center">
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full">
                <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center shrink-0 text-white text-sm font-semibold">{item.number}</span>
                <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-sm">{item.description}</p>
              </div>
              <div className="w-full flex items-center justify-start gap-4 md:gap-6 text-white text-5xl md:text-[56px] lg:text-[64px] xl:text-[88px] 2xl:text-[100px]">
                <span className="relative font-medium tracking-tight leading-[1.1] transition-transform duration-500 md:group-hover:scale-105 after:absolute after:bottom-[-8px] md:after:bottom-3 after:left-0 after:w-full after:h-[3px] md:after:h-[6px] after:bg-white after:scale-x-0 after:origin-right md:group-hover:after:scale-x-100 md:group-hover:after:origin-left after:transition-transform after:duration-500">
                  {item.label}
                </span>
                <BigArrow className="shrink-0 transition-transform duration-500 md:group-hover:translate-x-6" />
              </div>
            </div>
          </Link>
        </Reveal>
      ))}
    </ul>
    <Reveal className={`${container} flex flex-col items-start mt-16 md:mt-24`}>
      <p className="text-white text-2xl md:text-3xl lg:text-[40px] font-medium leading-normal tracking-tight max-w-3xl mb-12">
        {services.closing.lead} <span className="text-white/50">{services.closing.muted}</span>
      </p>
      <Link to={services.action.href} className="inline-flex items-center justify-center gap-3 border border-white/30 text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-medium text-sm transition-colors duration-300">
        {services.action.label} <ArrowIcon />
      </Link>
    </Reveal>
  </section>
);

/** Parmar PartnersSection layout, holding Ultraa's cover materials instead of logos. */
const MaterialsSection = () => (
  <section aria-labelledby="materials-heading" className="bg-white py-16 md:py-24 w-full overflow-hidden">
    <div className={`${container} grid gap-10 md:grid-cols-[1fr_minmax(0,420px)] items-end`}>
      <Reveal>
        <h2 id="materials-heading" className="leading-[0.95]">
          <span className="block text-3xl md:text-5xl font-medium tracking-tight text-black">{materials.heading[0]}</span>
          <span className="block text-[64px] md:text-[120px] lg:text-[150px] font-bold tracking-[-0.04em] text-black/50">{materials.heading[1]}</span>
        </h2>
      </Reveal>
      <Reveal delay={150}>
        <p className="text-base md:text-lg text-black/70 leading-relaxed">{materials.body}</p>
      </Reveal>
    </div>
    <div className={`${container} mt-12 md:mt-20`}>
    <ul className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-black/10">
      {materials.items.map((name, i) => (
        <Reveal as="li" key={name} delay={i * 60} className="border-r border-b border-black/10 aspect-[3/2] flex items-center justify-center p-4 text-center text-lg md:text-2xl font-medium tracking-tight text-black/70">
          {name}
        </Reveal>
      ))}
    </ul>
    </div>
    <div className={`${container} mt-10`}>
      <Link to={materials.action.href} className="inline-flex items-center gap-3 border border-black/20 text-black px-6 py-3.5 rounded-full font-medium text-sm md:text-base hover:bg-black hover:text-white transition-colors">
        {materials.action.label} <ArrowIcon />
      </Link>
    </div>
  </section>
);

/** Parmar SupportSection: dark band with photo cards that widen on hover. */
const ExpertiseSection = () => (
  <section id="expertise" aria-labelledby="expertise-heading" className="bg-neutral-900 text-white py-8 md:py-[50px] w-full overflow-hidden">
    <div className={container}>
      <div className="flex flex-col md:grid gap-10 md:gap-x-7 md:grid-cols-[auto_minmax(0,650px)] items-start md:justify-between">
        <h2 id="expertise-heading" className="text-[44px] leading-[1.05] md:text-5xl tracking-[-0.04em] font-medium text-balance">
          <ScrubText as="span" className="block" base="text-white/30" segments={[{ text: expertise.heading[0], color: "text-white" }]} />
          <ScrubText as="span" className="block" base="text-white/30" segments={[{ text: expertise.heading[1], color: "text-neutral-400" }]} />
        </h2>
        <Reveal delay={150}>
          <p className="text-[22px] leading-[1.3] md:text-[21px] font-medium tracking-[-0.03em]">
            {expertise.lead} <span className="text-white/50">{expertise.muted}</span>
          </p>
        </Reveal>
      </div>
      <ul className="flex flex-col md:flex-row gap-2 md:gap-8 mt-12 md:mt-16 w-full">
        {expertise.cards.map((card, i) => (
          <li key={card.title} className="group relative flex-1 flex flex-col transition-[flex] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] md:hover:flex-[1.8] lg:hover:flex-[2.5] min-h-[320px] md:min-h-[380px] lg:min-h-[420px] rounded-xl overflow-hidden">
            <Reveal delay={i * 100} className="w-full flex-1 flex flex-col justify-between p-6 md:p-8">
              <div className="absolute inset-0 z-0">
                <img src={card.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
              </div>
              <div className="relative z-10 flex flex-col gap-4 max-w-[280px]">
                <h3 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight">{card.title}</h3>
                <p className="text-base md:text-lg text-white/80 leading-relaxed md:opacity-0 md:transition-all md:duration-500 md:group-hover:opacity-100 md:group-focus-within:opacity-100">{card.description}</p>
              </div>
              <div className="relative z-10 mt-auto pt-6">
                <Link to={card.href} className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/50 text-sm md:text-base font-medium transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white">
                  {card.action} <ArrowIcon />
                </Link>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/** Parmar CtaSection: photo band under a dark overlay with a centred headline and pill. */
const CtaSection = () => (
  <section aria-labelledby="cta-heading" className="relative flex items-center justify-center text-white h-[400px] md:h-[600px] overflow-hidden">
    <div className="absolute inset-0 bg-neutral-900">
      <img src={cta.image.src} srcSet={cta.image.srcSet} sizes="100vw" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-45 grayscale" />
    </div>
    <div className={`relative z-10 ${container} text-center`}>
      <Reveal>
        <h2 id="cta-heading" className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.01em] leading-tight">{cta.headline}</h2>
      </Reveal>
      <Reveal delay={300} className="mt-8 md:mt-[30px] flex justify-center">
        <Link to={cta.action.href} className="inline-flex items-center gap-3 bg-white text-neutral-900 text-base md:text-sm font-medium px-6 py-3.5 md:px-5 md:py-3 rounded-full transition-transform hover:scale-105">
          {cta.action.label} <ArrowIcon />
        </Link>
      </Reveal>
    </div>
  </section>
);

export const HomeSections = () => (
  <>
    <WhySection />
    <IdentitySection />
    <AboutSection />
    <ProcessSection />
    <MarqueeSection />
    <ServicesSection />
    <MaterialsSection />
    <ExpertiseSection />
    <BlogSection />
    <CtaSection />
  </>
);
