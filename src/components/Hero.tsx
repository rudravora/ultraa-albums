import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { hero, type Audience } from "@/content/home";
import { ArrowIcon, primaryButton, secondaryButton } from "@/components/ui";

type Controller = {
  lastSpread: number;
  readonly opened: number;
  readonly spread: number;
  readonly pagePosition: number;
  setOpen(value: number, options?: { immediate?: boolean }): void;
  setSpread(value: number, options?: { immediate?: boolean; velocity?: number }): void;
  dispose(): void;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

// Over the pinned scroll (progress 0 to 1): text step 0 until 0.3, step 1 while the
// cover opens (0.15 to 0.65), step 2 from 0.65 with the book open.
const stepFor = (p: number) => (p >= 0.65 ? 2 : p >= 0.3 ? 1 : 0);
const coverFor = (p: number) => clamp((p - 0.15) / 0.5, 0, 1);

const whenIdle = (run: () => void) => {
  const go = () => ("requestIdleCallback" in window ? requestIdleCallback(run, { timeout: 1500 }) : setTimeout(run, 200));
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
};

type Mode = "still" | "live" | "failed";

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctrl = useRef<Controller | null>(null);

  const [audience, setAudienceState] = useState<Audience>(hero.audiences[0]);
  const [mode, setMode] = useState<Mode>("still");
  const [scrub, setScrub] = useState(false);
  const [step, setStep] = useState(0);
  const [book, setBook] = useState({ open: false, spread: 0 });

  // Scroll only opens and closes the cover; pages turn only by hand. Turning a page
  // while the book is closed opens it; scrolling back up closes it again.
  const byHand = useRef(false);
  const lastCover = useRef(0);
  const scrubRef = useRef(false);

  const sync = () => {
    const c = ctrl.current;
    if (c) setBook({ open: c.opened > 0.5, spread: Math.round(c.spread) });
  };

  const progress = () => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!scrubRef.current || !section || !inner) return 1;
    const rect = section.getBoundingClientRect();
    // The inner block pins under the header from the first pixel of scroll, and stays
    // pinned for the section's height minus its top padding and its own height.
    const travel = rect.height - inner.offsetHeight - (parseFloat(getComputedStyle(section).paddingTop) || 0);
    return travel > 0 ? clamp(-rect.top / travel, 0, 1) : 1;
  };

  const followScroll = (immediate = false) => {
    const c = ctrl.current;
    if (!c) return;
    const p = progress();
    const cover = scrubRef.current ? coverFor(p) : 1;
    if (cover < lastCover.current) byHand.current = false;
    lastCover.current = cover;
    c.setOpen(byHand.current ? 1 : cover, immediate ? { immediate } : undefined);
    if (scrubRef.current) setStep(stepFor(p));
    sync();
  };

  const openByHand = () => {
    const c = ctrl.current;
    if (!c || c.opened >= 1) return;
    byHand.current = true;
    c.setOpen(1);
  };

  const goToSpread = (index: number, options?: { immediate?: boolean; velocity?: number }) => {
    const c = ctrl.current;
    if (!c) return;
    openByHand();
    c.setSpread(index, options);
    sync();
  };

  const turn = (direction: number) => {
    const c = ctrl.current;
    if (!c) return;
    if (c.opened < 1) { openByHand(); sync(); return; }
    goToSpread(clamp(Math.round(c.spread) + direction, 0, c.lastSpread));
  };

  const chooseAudience = (next: Audience) => {
    if (next.id === audience.id) return;
    setAudienceState(next);
    goToSpread(next.spread);
  };

  // Stretch the canvas from the stage over the whole pinned hero, so the rings and
  // light pool reach the screen edges; the scene still fits the book to the stage.
  const stretch = () => {
    const stage = stageRef.current?.getBoundingClientRect();
    const section = sectionRef.current?.getBoundingClientRect();
    const inner = innerRef.current?.getBoundingClientRect();
    const canvas = canvasRef.current;
    if (!stage || !section || !inner || !canvas) return;
    Object.assign(canvas.style, {
      left: `${section.left - stage.left}px`,
      top: `${inner.top - stage.top}px`,
      width: `${section.width}px`,
      height: `${inner.height}px`,
    });
    canvas.style.setProperty("--stage-x", `${stage.left - section.left}px`);
    canvas.style.setProperty("--stage-y", `${stage.top - inner.top}px`);
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    const onScroll = () => followScroll();
    const onResize = () => { stretch(); followScroll(); };

    whenIdle(async () => {
      if (disposed || !canvasRef.current) return;
      scrubRef.current = !reduced;
      setScrub(!reduced);
      await new Promise(requestAnimationFrame); // let the pinned layout apply before measuring
      stretch();
      try {
        const { openAlbumScene } = await import("@/album-scene.js");
        const controller = (await openAlbumScene(canvasRef.current, hero.spreads, { reducedMotion: reduced })) as Controller;
        if (disposed) { controller.dispose(); return; }
        ctrl.current = controller;
        setMode("live");
        followScroll(true);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize, { passive: true });
      } catch {
        scrubRef.current = false;
        setScrub(false);
        setStep(0);
        setMode("failed");
      }
    });

    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ctrl.current?.dispose();
      ctrl.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pointer: a click on the right half turns forward, the left half back. A horizontal
  // drag moves the pages 1:1, then settles on the nearest spread with its velocity.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (mode !== "live" || !canvas) return;
    let drag: { id: number; x: number; y: number; start: number; moved: boolean; lastX: number; lastTime: number; velocity: number } | null = null;
    const pageWidth = () => Math.max((stageRef.current?.clientWidth ?? 1) * 0.4, 1);

    const down = (e: PointerEvent) => {
      if (e.button !== 0 || !ctrl.current) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, start: ctrl.current.pagePosition, moved: false, lastX: e.clientX, lastTime: e.timeStamp, velocity: 0 };
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id || !ctrl.current || ctrl.current.opened < 1) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < 6) return;
        if (Math.abs(e.clientY - drag.y) > Math.abs(dx)) { drag = null; return; }
        drag.moved = true;
        canvas.setPointerCapture(e.pointerId);
        canvas.classList.add("cursor-grabbing");
      }
      const elapsed = (e.timeStamp - drag.lastTime) / 1000;
      if (elapsed > 0) drag.velocity = -(e.clientX - drag.lastX) / pageWidth() / elapsed;
      drag.lastX = e.clientX;
      drag.lastTime = e.timeStamp;
      goToSpread(drag.start - dx / pageWidth(), { immediate: true });
    };
    const end = (e: PointerEvent, cancelled: boolean) => {
      if (!drag || e.pointerId !== drag.id || !ctrl.current) return;
      const { moved, velocity } = drag;
      drag = null;
      canvas.classList.remove("cursor-grabbing");
      if (moved) {
        const fling = clamp(velocity, -8, 8);
        goToSpread(clamp(Math.round(ctrl.current.pagePosition + fling * 0.15), 0, ctrl.current.lastSpread), { velocity: fling });
      } else if (!cancelled) {
        const rect = stageRef.current!.getBoundingClientRect();
        turn(e.clientX > rect.left + rect.width / 2 ? 1 : -1);
      }
    };
    const up = (e: PointerEvent) => end(e, false);
    const cancel = (e: PointerEvent) => end(e, true);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", cancel);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", cancel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const live = mode === "live";
  const still = mode === "failed" ? hero.open : hero.closed;
  const canvasLabel = book.open ? hero.spreads[book.spread].alt : hero.closed.alt;
  const shown = (i: number) => (step === i ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-6 invisible");
  const lastSpread = hero.spreads.length - 1;

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className={`relative bg-[#f8f7f4] pt-[var(--chrome)] ${scrub ? "h-[260svh]" : "min-h-[100svh]"}`}
    >
      <div
        ref={innerRef}
        className={`${scrub ? "sticky top-[var(--chrome)] h-[calc(100svh-var(--chrome))]" : "min-h-[calc(100svh-var(--chrome))]"} w-full max-w-[1920px] mx-auto px-6 md:px-16 py-6 md:py-10 flex flex-col lg:grid lg:grid-cols-[4.5fr_7.5fr] gap-6 lg:gap-16`}
      >
        {/* Left: text that moves through three steps as the hero scrolls. */}
        <div className="relative z-10 grid lg:items-center">
          <div className={`[grid-area:1/1] self-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${shown(0)}`}>
            <div role="group" aria-label={hero.audienceControl} className="inline-flex gap-1 p-1 mb-6 md:mb-8 rounded-full border border-black/10 bg-white">
              {hero.audiences.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={a.id === audience.id}
                  onClick={() => chooseAudience(a)}
                  className={`min-h-[40px] px-4 md:px-5 rounded-full text-sm font-semibold transition-colors ${a.id === audience.id ? "bg-black text-white" : "text-black/60 hover:text-black"}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <h1 id="hero-title" className="text-[40px] sm:text-[48px] lg:text-[clamp(44px,3.9vw,72px)] font-bold leading-[1.05] tracking-[-0.04em] max-w-[14ch]">
              {audience.title} <span className="text-black/40">{audience.accent}</span>
            </h1>
            <p className="mt-5 md:mt-6 max-w-[40ch] text-base md:text-lg text-black/70 leading-relaxed">{audience.sentence}</p>
            <div className="mt-7 md:mt-9 flex flex-wrap gap-3">
              <Link to="/contact-us" className={primaryButton}>Start your album <ArrowIcon /></Link>
              <Link to="/contact-us" className={secondaryButton}>Get a quote</Link>
            </div>
          </div>

          {hero.steps.map((s, i) => (
            <div key={s.title} aria-hidden={step !== i + 1} className={`[grid-area:1/1] self-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${shown(i + 1)}`}>
              <p className="text-[13px] font-semibold tracking-widest text-black/40 mb-5">0{i + 2}</p>
              <h2 className="text-[36px] sm:text-[44px] lg:text-[clamp(40px,3.4vw,64px)] font-bold leading-[1.05] tracking-[-0.04em] max-w-[14ch]">
                {s.title} <span className="text-black/40">{s.accent}</span>
              </h2>
              <p className="mt-5 md:mt-6 max-w-[40ch] text-base md:text-lg text-black/70 leading-relaxed">{s.body}</p>
              <Link to={s.action.href} tabIndex={step === i + 1 ? undefined : -1} className={`${secondaryButton} mt-7 md:mt-9`}>
                {s.action.label} <ArrowIcon />
              </Link>
            </div>
          ))}

          {scrub && (
            <ol aria-hidden="true" className="hidden lg:flex absolute bottom-0 left-0 gap-2">
              {[0, 1, 2].map((i) => (
                <li key={i} className={`block h-0.5 w-10 transition-colors ${step === i ? "bg-black" : "bg-black/15"}`} />
              ))}
            </ol>
          )}
        </div>

        {/* Right: the album. The canvas stretches over the whole hero behind the text. */}
        <figure ref={stageRef} className="relative flex-1 min-h-[300px] lg:min-h-0 pb-14 m-0">
          <img
            src={still.src}
            srcSet={still.srcset}
            sizes="(min-width: 1024px) 60vw, 100vw"
            width={1400}
            height={1159}
            alt={live ? "" : still.alt}
            aria-hidden={live}
            fetchPriority="high"
            className={`absolute inset-x-0 top-0 bottom-14 h-[calc(100%-3.5rem)] w-full object-contain transition-opacity duration-500 ${live ? "opacity-0" : "opacity-100"}`}
          />
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={canvasLabel}
            aria-hidden={!live}
            className={`hero-canvas absolute cursor-grab touch-pan-y transition-opacity duration-300 ${live ? "opacity-100" : "opacity-0"}`}
          />
          {live && (
            <div className="absolute bottom-0 inset-x-0 z-10 flex flex-wrap items-center justify-center lg:justify-between gap-2 gap-x-4">
              <p className="hidden sm:flex items-center gap-2 text-sm text-black/50">
                <span className="w-1.5 h-1.5 rounded-full bg-black" aria-hidden="true" />{hero.pager.hint}
              </p>
              <div className="flex items-center gap-1">
                <PagerButton label={hero.pager.previous} disabled={!book.open || book.spread <= 0} onClick={() => turn(-1)} flip />
                {hero.spreads.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${hero.pager.spread} 0${i + 1}`}
                    aria-current={book.open && book.spread === i ? "true" : undefined}
                    onClick={() => goToSpread(i)}
                    className="group inline-grid place-items-center min-w-[44px] min-h-[44px] text-[13px] font-semibold tracking-wider text-black/40 aria-[current=true]:text-black"
                  >
                    <span className="block h-0.5 w-7 mb-1 rounded bg-black/15 group-aria-[current=true]:bg-black transition-colors" />0{i + 1}
                  </button>
                ))}
                <PagerButton label={hero.pager.next} disabled={book.open && book.spread >= lastSpread} onClick={() => turn(1)} />
              </div>
            </div>
          )}
        </figure>
      </div>
    </section>
  );
};

const PagerButton = ({ label, disabled, onClick, flip }: { label: string; disabled: boolean; onClick: () => void; flip?: boolean }) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className="inline-grid place-items-center w-11 h-11 rounded-full border border-black/15 bg-white text-black transition-colors hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
  >
    <span className={flip ? "rotate-180" : ""}><ArrowIcon /></span>
  </button>
);
