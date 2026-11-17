// About, Contact, FAQ, Blog, Privacy and Terms, on the Parmar main-site page layouts.
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon, PageShell, primaryButton, secondaryButton } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { aboutPage as about, blogPage, contactPage as contact, faqGroups, privacyPolicy, termsPage } from "@/content/pages";
import { site } from "@/content/site";

const h1Class = "text-[40px] md:text-[56px] lg:text-[64px] font-normal tracking-[-0.04em] leading-[1.05]";
const leadClass = "text-[17px] md:text-[19px] leading-[1.6] text-black/70";
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Parmar AboutPage: hero, team, story, numbered reasons, black band and closing CTA. */
export const AboutPage = () => (
  <PageShell breadcrumbs={[{ name: "About Us" }]}>
    <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center pb-12 border-b border-black/5">
      <div>
        <h1 className="text-xs md:text-sm font-semibold tracking-[0.15em] uppercase text-black/60 mb-6">{about.label}</h1>
        <p className="text-[48px] md:text-[64px] lg:text-[80px] font-normal tracking-[-0.04em] max-w-[800px] mb-8 leading-[0.95]">
          {about.statement[0]} <span className="text-black/50">{about.statement[1]}</span>
        </p>
        <p className="text-[18px] md:text-[22px] font-medium tracking-[-0.03em] leading-[1.3] text-black/60 max-w-[560px]">{about.intro}</p>
      </div>
      <Reveal from="left">
        <img src={about.heroImage.src} srcSet={about.heroImage.srcSet} sizes="(min-width: 1024px) 45vw, 100vw" alt={about.heroAlt} fetchPriority="high" className="w-full aspect-[4/3] object-cover" />
      </Reveal>
    </section>

    <section className="py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center border-b border-black/5">
      <Reveal className="order-2 lg:order-1">
        <img src={about.story.image.src} srcSet={about.story.image.srcSet} sizes="(min-width: 1024px) 45vw, 100vw" alt={about.story.imageAlt} loading="lazy" className="w-full aspect-[4/3] object-cover" />
      </Reveal>
      <div className="order-1 lg:order-2 flex flex-col gap-6">
        <h2 className="text-[36px] md:text-[48px] tracking-[-0.03em]">{about.story.heading}</h2>
        {about.story.paragraphs.map((p) => (
          <p key={p} className="text-[17px] md:text-[19px] leading-[1.6] text-black/75">{p}</p>
        ))}
      </div>
    </section>

    <section className="py-12 md:py-16 border-b border-black/5">
      <h2 className="text-[36px] md:text-[52px] tracking-[-0.03em] text-center mb-4">{about.team.heading}</h2>
      <p className="text-base text-black/70 max-w-2xl mx-auto text-center mb-12">{about.team.intro}</p>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
        {about.team.people.map((person, i) => (
          <Reveal as="li" key={person.name} delay={i * 100} className={`flex flex-col gap-6 ${i === 1 ? "md:mt-12" : i === 2 ? "md:mt-24" : ""}`}>
            {/* No team photos yet: a monogram tile holds the portrait slot. */}
            <div aria-hidden="true" className="w-full aspect-[4/5] bg-black text-white flex items-center justify-center text-[96px] font-semibold tracking-[-0.04em]">
              {person.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h3 className="text-[26px] font-semibold tracking-[-0.03em]">{person.name}</h3>
              <p className="text-sm uppercase tracking-widest text-black/60 mt-1">{person.role}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>

    <section className="py-12 md:py-16">
      <h2 className="text-[36px] md:text-[52px] tracking-[-0.03em] text-center mb-10 md:mb-12">{about.why.heading}</h2>
      <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 xl:divide-x divide-black/10 border-y border-black/10 bg-white">
        {about.why.items.map((item, i) => (
          <li key={item.title} className="p-10 md:p-12 flex flex-col gap-4">
            <span className="text-[64px] md:text-[84px] text-black/10 leading-[1.1]" aria-hidden="true">0{i + 1}</span>
            <h3 className="text-[24px] md:text-[28px] font-semibold tracking-[-0.04em]">{item.title}</h3>
            <p className="text-base text-black/60 leading-relaxed">{item.text}</p>
          </li>
        ))}
      </ol>
    </section>

    <section className="-mx-6 md:-mx-16 bg-black text-white py-12 md:py-16 px-6 md:px-16 text-center">
      <h2 className="text-[40px] md:text-[56px] leading-[1.1] mb-6">{about.band.heading}</h2>
      <p className="text-[18px] md:text-[22px] font-medium tracking-[-0.03em] leading-[1.3] text-white/80 max-w-3xl mx-auto">{about.band.text}</p>
    </section>

    <section className="py-12 md:py-16 text-center flex flex-col items-center gap-6">
      <h2 className="text-[36px] md:text-[48px] tracking-[-0.03em]">{about.cta.heading}</h2>
      <p className="text-black/70">{about.cta.text}</p>
      <Link to={about.cta.action.href} className={primaryButton}>{about.cta.action.label} <ArrowIcon size={14} /></Link>
    </section>
  </PageShell>
);

const endpoint = import.meta.env.VITE_ULTRAA_FORM_ENDPOINT as string | undefined;

/** Parmar ContactPage details, plus Ultraa's enquiry form and a map. */
export const ContactPage = () => {
  const f = contact.form;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ text: string; tone: "info" | "ok" | "error" } | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (k: string) => String(data.get(k) ?? "").trim();
    const next: Record<string, string> = {};
    if (!value("name")) next.name = f.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) next.email = f.errors.email;
    if (!value("message")) next.message = f.errors.message;
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    if (!endpoint) {
      const body = ["name", "phone", "email", "country"].map((k) => `${f.labels[k as keyof typeof f.labels]}: ${value(k)}`).join("\n") + `\n\n${value("message")}`;
      window.location.href = `mailto:${site.emails[0]}?subject=${encodeURIComponent(f.emailSubject)}&body=${encodeURIComponent(body)}`;
      setStatus({ text: f.mailtoOpened, tone: "info" });
      return;
    }

    setBusy(true);
    setStatus({ text: f.sending, tone: "info" });
    try {
      const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus({ text: f.sent, tone: "ok" });
    } catch {
      setStatus({ text: f.failed, tone: "error" });
    } finally {
      setBusy(false);
    }
  };

  const field = (name: keyof typeof f.labels, props: { type?: string; autoComplete?: string; required?: boolean; textarea?: boolean } = {}) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={`contact-${name}`} className="text-sm font-semibold">
        {f.labels[name]}{props.required && <span className="text-black/60"> (required)</span>}
      </label>
      {props.textarea ? (
        <textarea id={`contact-${name}`} name={name} rows={5} required={props.required} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `contact-${name}-error` : undefined} className="w-full border border-black/20 bg-white px-4 py-3 text-base rounded-lg focus:outline-none focus:border-black" />
      ) : (
        <input id={`contact-${name}`} name={name} type={props.type ?? "text"} autoComplete={props.autoComplete} required={props.required} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `contact-${name}-error` : undefined} className="w-full border border-black/20 bg-white px-4 py-3 text-base rounded-lg focus:outline-none focus:border-black" />
      )}
      {errors[name] && <p id={`contact-${name}-error`} className="text-sm text-red-700">{errors[name]}</p>}
    </div>
  );

  return (
    <PageShell breadcrumbs={[{ name: "Contact" }]}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        <div className="flex flex-col gap-8">
          <h1 className={h1Class}>{contact.h1}</h1>
          <p className={`${leadClass} max-w-[560px]`}>{contact.intro}</p>
          <div className="flex flex-wrap gap-3">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className={primaryButton}>Chat on WhatsApp <ArrowIcon size={14} /></a>
            <a href={site.phones[0].href} className={secondaryButton}>Call {site.phones[0].label}</a>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-black/60 mb-2">Workshop</dt>
              <dd>
                <address className="not-italic text-[16px] leading-[1.6]">{site.address}</address>
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm underline underline-offset-2 text-black/60 hover:text-black">Get directions</a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-black/60 mb-2">Phone</dt>
              <dd className="flex flex-col gap-1 text-[16px]">
                {site.phones.map((p) => <a key={p.href} href={p.href} className="hover:underline">{p.label}</a>)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-black/60 mb-2">Email</dt>
              <dd className="flex flex-col gap-1 text-[16px]">
                {site.emails.map((e) => <a key={e} href={`mailto:${e}`} className="hover:underline break-all">{e}</a>)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-black/60 mb-2">Messenger</dt>
              <dd className="text-[16px]"><a href={site.messenger} target="_blank" rel="noopener noreferrer" className="hover:underline">Message on Messenger</a></dd>
            </div>
          </dl>
        </div>

        <form
          action={`mailto:${site.emails[0]}?subject=${encodeURIComponent(f.emailSubject)}`}
          method="post"
          encType="text/plain"
          noValidate
          onSubmit={onSubmit}
          className="bg-white p-6 md:p-10 flex flex-col gap-5 self-start"
        >
          <h2 className="text-[24px] md:text-[30px] tracking-[-0.03em]">{f.heading}</h2>
          {field("name", { autoComplete: "name", required: true })}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {field("phone", { type: "tel", autoComplete: "tel" })}
            {field("email", { type: "email", autoComplete: "email", required: true })}
          </div>
          {field("country", { autoComplete: "country-name" })}
          {field("message", { textarea: true, required: true })}
          <div className="flex flex-col gap-3">
            <button type="submit" disabled={busy} className={`${primaryButton} w-fit disabled:opacity-50`}>{f.submit} <ArrowIcon size={14} /></button>
            {!endpoint && <p className="text-sm text-black/60">{f.mailtoNote}</p>}
            <p role="status" aria-live="polite" className={`text-sm ${status?.tone === "error" ? "text-red-700" : status?.tone === "ok" ? "text-black" : "text-black/70"}`}>{status?.text}</p>
          </div>
        </form>
      </div>

      <div className="mt-16 w-full bg-white">
        <iframe title="Map showing the Ultraa Albums workshop in Dahisar East, Mumbai" src={contact.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full h-[360px] lg:h-[460px] border-0 grayscale" />
      </div>
    </PageShell>
  );
};

/** Parmar FaqPage: topic pills, grouped questions in open <details>, closing box. */
export const FaqPage = () => (
  <PageShell breadcrumbs={[{ name: "FAQ" }]}>
    <div className="max-w-[900px]">
      <h1 className={`${h1Class} mb-6`}>Frequently asked questions</h1>
      <p className={`${leadClass} mb-12`}>Answers about Ultraa's albums, design and editing, and ordering from India or abroad.</p>
      <nav aria-label="FAQ topics" className="flex flex-wrap gap-2 mb-12">
        {faqGroups.map((g) => (
          <a key={g.heading} href={`#${slugify(g.heading)}`} className="px-3 py-1.5 rounded-full text-[13px] font-medium border border-black bg-white hover:bg-black hover:text-white transition-colors">{g.heading}</a>
        ))}
      </nav>
      {faqGroups.map((group) => (
        <section key={group.heading} id={slugify(group.heading)} className="mb-14 scroll-mt-40">
          <h2 className="text-[28px] md:text-[34px] tracking-[-0.03em] mb-6">{group.heading}</h2>
          <div className="flex flex-col divide-y divide-black/10 border-y border-black/10">
            {group.faqs.map((faq) => (
              <details key={faq.question} className="group py-5" open>
                <summary className="cursor-pointer list-none flex justify-between gap-6 text-[17px] md:text-[19px] font-semibold">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <span aria-hidden="true" className="text-black/40 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-[15px] md:text-[16px] leading-[1.7] text-black/75">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
      <div className="bg-white p-8 flex flex-col gap-4">
        <h2 className="text-[24px] md:text-[28px]">Have a different question?</h2>
        <p className="text-[15px] leading-[1.7] text-black/70">Ask us directly, or browse <Link to="/our-products" className="underline underline-offset-2">our products</Link>.</p>
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className={`${primaryButton} w-fit`}>Ask on WhatsApp <ArrowIcon size={14} /></a>
      </div>
    </div>
  </PageShell>
);

export const BlogPage = () => (
  <PageShell breadcrumbs={[{ name: "Blog" }]}>
    <div className="max-w-[900px] flex flex-col gap-8">
      <h1 className={h1Class}>{blogPage.h1}</h1>
      <p className={leadClass}>{blogPage.intro}</p>
      <ul className="flex flex-wrap gap-3">
        {blogPage.links.map((l) => (
          <li key={l.href}><Link to={l.href} className={secondaryButton}>{l.label} <ArrowIcon size={14} /></Link></li>
        ))}
      </ul>
    </div>
  </PageShell>
);

/** Parmar legal page layout: large heading, readable column of headed sections. */
export const PrivacyPage = () => (
  <PageShell breadcrumbs={[{ name: "Privacy Policy" }]}>
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-[-0.02em] mb-12">{privacyPolicy.h1}</h1>
    <div className="max-w-4xl flex flex-col gap-6 text-lg text-black/70 leading-relaxed">
      {privacyPolicy.intro.map((p) => <p key={p}>{p}</p>)}
      {privacyPolicy.sections.map((s) => (
        <section key={s.heading} className="flex flex-col gap-3">
          <h2 className="text-2xl font-medium text-black mt-6">{s.heading}</h2>
          <p>{s.text}</p>
          {s.list && <ul className="list-disc pl-6 space-y-2">{s.list.map((li) => <li key={li}>{li}</li>)}</ul>}
          {s.after && <p>{s.after}</p>}
        </section>
      ))}
      <p className="mt-6">Questions about this policy: <a href={`mailto:${site.emails[0]}`} className="underline underline-offset-2 text-black">{site.emails[0]}</a>.</p>
    </div>
  </PageShell>
);

export const TermsPage = () => (
  <PageShell breadcrumbs={[{ name: "Terms and Conditions" }]}>
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-[-0.02em] mb-12">{termsPage.h1}</h1>
    <div className="max-w-4xl flex flex-col gap-6 text-lg text-black/70 leading-relaxed">
      <p>{termsPage.intro}</p>
      <Link to="/contact-us" className={`${primaryButton} w-fit`}>Contact us <ArrowIcon size={14} /></Link>
    </div>
  </PageShell>
);
