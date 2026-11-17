import { Fragment, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/** True once the element has scrolled into view (never resets). */
const useInView = <T extends Element>() => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setInView(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
};

type RevealProps = {
  as?: ElementType;
  from?: "up" | "left" | "right" | "none";
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** Parmar's ScrollReveal: slides and fades in once. Hidden only when JS runs (html.js). */
export const Reveal = ({ as: Tag = "div", from = "up", delay = 0, className = "", style, children }: RevealProps) => {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag ref={ref} data-reveal={from} className={`${className} ${inView ? "is-in" : ""}`} style={{ ...style, transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
};

export type Segment = { text: string; color: string; base?: string };

/**
 * Parmar's ScrollScrubRevealText: each word fills from a light base colour to its
 * final colour, left to right, once. The visible word is drawn by CSS from
 * data-text, so screen readers and search engines read each word once.
 */
export const ScrubText = ({ as: Tag = "p", segments, className = "", base = "text-neutral-300" }: { as?: ElementType; segments: Segment[]; className?: string; base?: string }) => {
  const { ref, inView } = useInView<HTMLElement>();
  const words = segments.flatMap((s) => s.text.split(" ").filter(Boolean).map((word) => ({ word, color: s.color, base: s.base ?? base })));
  return (
    <Tag ref={ref} data-scrub="" className={`${className} ${inView ? "is-in" : ""}`}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="scrub-word" style={{ "--i": i } as CSSProperties}>
            <span className={w.base}>{w.word}</span>
            <span className={`scrub-fg ${w.color}`} data-text={w.word} aria-hidden="true" />
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
};
