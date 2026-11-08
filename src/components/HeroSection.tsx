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
  // The whole landscape drifts slower than the page; the copy drifts the other
  // way. Both are transform-only, so they stay on the compositor and never
  // trigger layout.
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

  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");

  const go = useCallback((i: number) => {
    const nextIndex = ((i % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;
    setSlideDirection(nextIndex > index ? "next" : "prev");
    setIndex(nextIndex);
  }, [index]);

  // Pause autoplay when user interacts with controls via keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", " "].includes(e.key)) {
      setPaused(true);
    }
  }, []);

  const slide = HERO_SLIDES[index];
  const photoShift = reduced ? 0 : offset * -70; // px, slower than the page
  const copyShift = reduced ? 0 : offset * -26; // px, subtle counter-drift

  return (
    // Header is h-16 (4rem) and sticky in-flow, so the hero fills whatever is
    // left of the first screen: header + hero = exactly one viewport.
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      role="region"
      className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-cocoa text-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onKeyDown={handleKeyDown}
    >
      {/* ------------------------- slide-change announcement ----------------------
          A carousel that swaps content silently gives a screen-reader user no
          idea the hero changed. This polite live region is the single source of
          truth for "what am I looking at now", so the tablist itself does not
          need to duplicate the copy. */}
      <p aria-live="polite" className="sr-only" aria-atomic="true">
        Slide {index + 1} of {SLIDE_COUNT}: {slide.eyebrow} — {slide.titleA} {slide.titleB}
      </p>

      {/* Landscape photo stack, full-bleed behind everything. Every shot is a
          moody 3:2 frame composed with its dark third on the left, so the
          left-aligned copy always lands on shadow. */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-x-0 -top-[70px] -bottom-[70px] will-change-transform"
          style={{
            transform: `translate3d(0, ${photoShift}px, 0)`,
            transition: reduced ? "none" : "transform 120ms linear",
          }}
        >
          {HERO_SLIDES.map((s, i) => (
            <div
              key={s.image.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none",
                i === index ? "opacity-100" : "opacity-0"
              )}
              // Flat tint shows for the instant before the photo paints.
              style={{ backgroundColor: s.bg }}
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
        {/* Subtle animated gradient overlay for depth */}
        {!reduced && (
          <div className="absolute inset-0 bg-gradient-to-r from-cocoa/80 via-cocoa/60 to-cocoa/80 animate-[shimmer_8s_ease-in-out_infinite]" />
        )}
        {/* Flat ink wash — one solid colour, never a gradient. The landscape
            stays visible underneath while the copy keeps its contrast. */}
        <div className="absolute inset-0 bg-cocoa/70" />
      </div>

      {/* Copy and controls ride on top of the landscape. Horizontal padding
          matches the header (px-4 sm:px-6) so the headline lines up with the
          logo. Bottom padding clears the fixed MobileNav (64px + safe area)
          below md, and the copy block's own `my-auto` centres it in whatever
          space the pinned controls row leaves over. */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-[calc(5rem_+_env(safe-area-inset-bottom))] pt-6 sm:px-6 md:pb-12 lg:pb-14 lg:pt-10">
        {/* ------------------------------- content ------------------------------- */}
        <div
          id="hero-slide-panel"
          role="tabpanel"
          aria-label={`${slide.eyebrow}: ${slide.titleA} ${slide.titleB}`}
          tabIndex={0}
          className="my-auto max-w-2xl"
          style={{
            transform: `translate3d(0, ${copyShift}px, 0)`,
            transition: reduced ? "none" : "transform 120ms linear",
          }}
        >
          <div
            key={`${index}-${slideDirection}`}
            className={cn(
              "animate-fade-up motion-reduce:animate-none",
              slideDirection === "next" ? "animate-[slide-up_0.6s_cubic-bezier(0.22,1,0.36,1)]" : "animate-[slide-up_0.6s_cubic-bezier(0.22,1,0.36,1)]"
            )}
          >
            {/* Eyebrow + oversized slide index: editorial flourish, still quiet */}
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.22em] text-cream/85">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse motion-reduce:animate-none" />
                {slide.eyebrow}
              </span>
              <span
                aria-hidden
                className="text-outline-light font-display text-4xl font-black leading-none sm:text-5xl animate-[fade-in_0.5s_ease-out]"
              >
                0{index + 1}
              </span>
            </div>

            {/* Level 1 — exactly two lines, scaled to always fit the viewport.
                Honey, not ember: over photography the ember accent drops below
                3:1 even at this size, and honey is the system's on-dark accent. */}
            <h1 className="mt-4 font-display text-[clamp(2.3rem,6.5vw,5.25rem)] font-black leading-[0.95] tracking-[-0.02em] text-cream animate-[slide-up_0.6s_cubic-bezier(0.22,1,0.36,1)]">
              <span className="block whitespace-nowrap">{slide.titleA}</span>
              <span className="block whitespace-nowrap text-honey">{slide.titleB}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-cream/90 sm:text-xl animate-[fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)_0.1s_both]">
              {slide.text}
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Link
                href={slide.href}
                className="relative min-h-[60px] rounded-full bg-ember px-10 py-4 font-display text-xl font-black text-white transition hover:-translate-y-0.5 hover:bg-ember-deep active:scale-95 focus:outline-none focus-visible:ring-3 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa overflow-hidden"
              >
                <span className="relative z-10">{slide.cta}</span>
                {!reduced && (
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_ease-in-out_infinite]"
                    aria-hidden="true"
                  />
                )}
              </Link>
              <span className="text-sm font-bold text-butter animate-[pop_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.3s_both]">{slide.chip}</span>
            </div>

            <Link
              href="/shop"
              className="mt-6 inline-flex min-h-[44px] items-center text-sm font-bold text-cream/90 underline-offset-4 transition hover:text-cream hover:underline focus:outline-none focus-visible:ring-3 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa rounded-full px-2"
            >
              Not ready to build? Browse what&apos;s already on the counter
              <span aria-hidden> →</span>
            </Link>
          </div>
        </div>

        {/* ------------------------------ controls ----------------------------- */}
        <div className="mt-8 flex items-center justify-between gap-6 sm:mt-10 lg:mt-16">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Show previous slide"
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl text-cream/70 transition hover:bg-cream/10 hover:text-cream active:scale-95 focus:outline-none focus-visible:ring-3 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa"
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
                  className="group relative flex h-12 flex-1 items-center px-1 sm:flex-none sm:px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa rounded-full"
                >
                  <span
                    className={cn(
                      "block h-2 w-full overflow-hidden rounded-full bg-cream/30 transition-colors sm:w-14",
                      i === index && "bg-cream/40"
                    )}
                  >
                    {/* Progress fill: CSS-driven, so pausing is just play-state */}
                    {i === index && (
                      <span
                        key={`${index}-${paused}`}
                        className="block h-full w-full origin-left animate-hero-progress bg-ember motion-reduce:hidden"
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
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl text-cream/70 transition hover:bg-cream/10 hover:text-cream active:scale-95 focus:outline-none focus-visible:ring-3 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa"
            >
              <span aria-hidden>&#8594;</span>
            </button>
          </div>

          <div className="hidden flex-col items-center gap-2 lg:flex">
            <span className="text-label uppercase text-cream/80">
              Scroll to explore
            </span>
            <div className="flex h-9 w-5 items-start justify-center rounded-full border border-cream/25">
              <div className="mt-2 h-1.5 w-1 animate-pulse rounded-full bg-ember motion-reduce:animate-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Hairline frame keeps the landscape feeling like a placed print. */}
      <div
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cream/10"
        aria-hidden="true"
      />
    </section>
  );
}
