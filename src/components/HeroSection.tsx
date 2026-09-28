"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { HERO_SLIDES } from "@/lib/catalog";
import { px } from "@/lib/images";
import { cn } from "@/lib/utils";

const ROTATE_MS = 6000;
const SLIDE_COUNT = HERO_SLIDES.length;

function useReducedMotion() {
  const [reduced, setReduced] = useState(true); // assume reduced until proven otherwise
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduced;
}

export default function HeroSection() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Tab elements, for roving-tabindex focus moves. */
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  /* ------------------------------- autoplay ------------------------------ */
  useEffect(() => {
    if (paused || reduced) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDE_COUNT);
    }, ROTATE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, reduced]);

  /* --------------------------- scroll parallax --------------------------- */
  // Photo drifts slower than the page; copy drifts the other way. Both are
  // transform-only, so they stay on the compositor and never trigger layout.
  const sectionRef = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // -1 (section below fold) .. 1 (section fully above)
        const progress = -rect.top / Math.max(rect.height, 1);
        setOffset(Math.max(-1, Math.min(1, progress)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  const go = useCallback((i: number) => {
    setIndex(((i % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  const slide = HERO_SLIDES[index];
  const photoShift = reduced ? 0 : offset * -70; // px, slower than the page
  const copyShift = reduced ? 0 : offset * -26; // px, subtle counter-drift

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative isolate flex h-screen items-center overflow-hidden bg-cocoa"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      {/* ------------------------- slide-change announcement ----------------------
          A carousel that swaps content silently gives a screen-reader user no
          idea the hero changed. This polite live region is the single source of
          truth for "what am I looking at now", so the tablist itself does not
          need to duplicate the copy. */}
      <p aria-live="polite" className="sr-only">
        Slide {index + 1} of {SLIDE_COUNT}. {slide.eyebrow}. {slide.titleA}{" "}
        {slide.titleB}.
      </p>

      {/* ------------------------------ photography ---------------------------- */}
      <div
        className="absolute inset-x-0 -top-[80px] -bottom-[80px] -z-10 will-change-transform"
        style={{
          transform: `translate3d(0, ${photoShift}px, 0)`,
          transition: reduced ? "none" : "transform 120ms linear",
        }}
        aria-hidden="true"
      >
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.image.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none",
              i === index ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={px(s.image.id, 1920)}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={cn(
                "object-cover",
                !reduced && i === index && "animate-ken-burns motion-reduce:animate-none"
              )}
            />
          </div>
        ))}
      </div>

      {/* -------------------------------- scrim --------------------------------
          Lighter than a flat wash: the photo stays vivid on the right, and
          contrast is concentrated only where the copy actually sits. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-cocoa via-cocoa/70 to-cocoa/25 lg:via-cocoa/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-transparent to-cocoa/35 sm:from-cocoa/60" />
      </div>

      {/* ------------------------------- content ------------------------------- */}
      <div
        id="hero-slide-panel"
        role="tabpanel"
        aria-label={slide.eyebrow}
        tabIndex={0}
        className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-28 lg:py-32"
        style={{
          transform: `translate3d(0, ${copyShift}px, 0)`,
          transition: reduced ? "none" : "transform 120ms linear",
        }}
      >
        <div
          key={index}
          className="flex max-w-4xl flex-col items-start animate-fade-up motion-reduce:animate-none"
        >
          {/* Eyebrow + oversized slide index: editorial flourish, still quiet */}
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.22em] text-cream/85">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-strawberry" />
              {slide.eyebrow}
            </span>
            <span
              aria-hidden
              className="font-display text-5xl font-black leading-none text-cream/20"
            >
              0{index + 1}
            </span>
          </div>

          {/* Level 1 — exactly two lines, scaled to always fit the viewport */}
          <h1 className="mt-4 font-display text-[clamp(2rem,7.5vw,4.75rem)] font-black leading-[0.95] tracking-[-0.02em] text-white">
            <span className="block whitespace-nowrap">{slide.titleA}</span>
            <span className="block whitespace-nowrap text-strawberry">{slide.titleB}</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg font-medium leading-relaxed text-cream/80 sm:text-xl">
            {slide.text}
          </p>

          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
            <Link
              href={slide.href}
              className="shine min-h-[60px] rounded-full bg-gradient-to-br from-berry to-strawberry px-11 py-4 font-display text-xl font-black text-white shadow-[0_10px_30px_rgba(249,79,126,0.5)] transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_40px_rgba(249,79,126,0.6)] active:scale-95"
            >
              {slide.cta}
            </Link>
            <span className="text-sm font-bold text-cream/90">{slide.chip}</span>
          </div>

          <Link
            href="/shop"
            className="mt-7 inline-flex min-h-[44px] items-center text-sm font-bold text-cream/85 underline-offset-4 transition hover:text-cream hover:underline"
          >
            Not ready to build? Browse what&apos;s already on the counter
            <span aria-hidden> →</span>
          </Link>
        </div>

        {/* ------------------------------ controls ----------------------------- */}
        <div className="mt-14 flex flex-col gap-6 sm:mt-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Show previous slide"
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl text-cream/60 transition hover:bg-cream/10 hover:text-cream active:scale-95"
            >
              <span aria-hidden>&#8592;</span>
            </button>

            <div
              className="flex items-center px-1"
              role="tablist"
              aria-label="Choose slide"
              // Roving tabindex: the tablist is a single tab stop, and arrow
              // keys move between slides (WAI-ARIA tab pattern). Without this the
              // dots are N tab stops and arrow keys do nothing.
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  go(index + 1);
                  requestAnimationFrame(() =>
                    tabRefs.current[(index + 1) % SLIDE_COUNT]?.focus()
                  );
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  go(index - 1);
                  requestAnimationFrame(() =>
                    tabRefs.current[
                      (index - 1 + SLIDE_COUNT) % SLIDE_COUNT
                    ]?.focus()
                  );
                } else if (e.key === "Home") {
                  e.preventDefault();
                  go(0);
                  requestAnimationFrame(() => tabRefs.current[0]?.focus());
                } else if (e.key === "End") {
                  e.preventDefault();
                  go(SLIDE_COUNT - 1);
                  requestAnimationFrame(() =>
                    tabRefs.current[SLIDE_COUNT - 1]?.focus()
                  );
                }
              }}
            >
              {HERO_SLIDES.map((s, i) => (
                <button
                  key={s.image.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-controls="hero-slide-panel"
                  tabIndex={i === index ? 0 : -1}
                  aria-label={`Show ${s.eyebrow}`}
                  onClick={() => go(i)}
                  className="group relative flex h-12 flex-1 items-center px-1 sm:flex-none sm:px-2"
                >
                  <span
                    className={cn(
                      "block h-2 w-full overflow-hidden rounded-full bg-cream/25 transition-colors sm:w-14",
                      i === index && "bg-cream/30"
                    )}
                  >
                    {/* Progress fill: CSS-driven, so pausing is just play-state */}
                    {i === index && (
                      <span
                        key={`${index}-${paused}`}
                        className="block h-full w-full origin-left animate-hero-progress bg-strawberry motion-reduce:hidden"
                        style={
                          {
                            animationDuration: `${ROTATE_MS}ms`,
                            animationPlayState: paused || reduced ? "paused" : "running",
                          } as CSSProperties
                        }
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Show next slide"
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl text-cream/60 transition hover:bg-cream/10 hover:text-cream active:scale-95"
            >
              <span aria-hidden>&#8594;</span>
            </button>
          </div>

          <div className="hidden flex-col items-center gap-2 lg:flex">
            <span className="text-label uppercase text-cream/80">
              Scroll to explore
            </span>
            <div className="flex h-9 w-5 items-start justify-center rounded-full border border-cream/25">
              <div className="mt-2 h-1.5 w-1 animate-pulse rounded-full bg-strawberry motion-reduce:animate-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
