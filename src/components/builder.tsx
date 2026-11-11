"use client";

import { createContext, useContext, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ngn } from "@/lib/format";
import type { PricedOption } from "@/lib/catalog";
import type { Img } from "@/lib/images";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "./animations";
import FoodImage from "./FoodImage";

/* ------------------------------ STEP WRAPPER ----------------------------- */

interface BuilderFlow {
  activeStep: number;
  stepCount: number;
  setActiveStep: (step: number) => void;
}

const BuilderFlowContext = createContext<BuilderFlow | null>(null);

export function Step({
  n,
  title,
  hint,
  children,
}: {
  n: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const flow = useContext(BuilderFlowContext);
  const step = Number(n);
  const expanded = !flow || flow.activeStep === step;
  return (
    <section aria-label={title} className={cn("border-b border-choco/12 py-5 first:pt-1 last:border-0", expanded && !reduced && "animate-[fade-up_0.35s_cubic-bezier(0.22,1,0.36,1)_both]")}>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => flow?.setActiveStep(step)}
        className="group flex w-full items-start gap-3 rounded-xl text-left focus-visible:outline-none"
      >
        <span className={cn("mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full font-sans text-xs font-extrabold tabular-nums transition", expanded ? "bg-ember text-white" : "bg-sand text-ember-deep group-hover:bg-butter")}>
          {expanded ? n : step < (flow?.activeStep ?? 1) ? "✓" : n}
        </span>
        <span className="min-w-0 flex-1 py-0.5">
          <span className="flex items-center justify-between gap-3">
            <span className="font-display text-subhead">{title}</span>
            {!expanded && <span className="text-xs font-bold text-choco/45">Edit</span>}
          </span>
          {!expanded && hint && <span className="mt-1 block truncate text-sm text-choco/55">{hint}</span>}
          {expanded && hint && <span className="mt-1 block text-sm leading-relaxed text-choco/65">{hint}</span>}
        </span>
        <span aria-hidden className={cn("mt-2 text-sm text-choco/45 transition-transform", expanded && "rotate-180")}>⌄</span>
      </button>
      {expanded && (
        <div className="mt-5 pl-0 sm:pl-12">
          {children}
          {flow && step < flow.stepCount && (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => flow.setActiveStep(step + 1)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-choco px-5 text-sm font-bold text-cream transition hover:bg-ember active:scale-[0.98]"
              >
                Continue <span aria-hidden>→</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ------------------------------- PICKERS -------------------------------- */

function deltaLabel(delta: number): string {
  if (delta === 0) return "Included";
  return delta > 0 ? `+${ngn(delta)}` : `−${ngn(-delta)}`;
}

/**
 * A single-choice control built as a real WAI-ARIA radio group.
 *
 * `role="radio"` only works if the group also honours the radio-group keyboard
 * contract: exactly one tab stop, and arrow keys to move/select between radios.
 * The previous version was Tab-reachable on every option and arrow-key dead,
 * so a keyboard user had to tab through 8 stops to change a flavour.
 * Roving tabindex + arrow/Home/End fixes that; click and touch are unchanged.
 */
export function SinglePicker({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: PricedOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  // The selected option owns the tab stop. Guard against a value that is not in
  // the list (e.g. a stale saved cart config) so tabIndex never lands on -1.
  const selected = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );

  const focusAt = (i: number) => {
    const next = (i + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        focusAt(i + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        focusAt(i - 1);
        break;
      case "Home":
        e.preventDefault();
        focusAt(0);
        break;
      case "End":
        e.preventDefault();
        focusAt(options.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid grid-cols-2 gap-2 sm:grid-cols-3"
    >
      {options.map((o, i) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={i === selected ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative flex min-h-[76px] flex-col justify-center gap-1.5 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200 active:scale-[0.98]",
              active
                ? "border-ember bg-ember/8 ring-1 ring-ember/25"
                : "border-choco/12 bg-cream/60 hover:border-choco/35 hover:bg-white"
            )}
          >
            {active && (
              <span
                aria-hidden
                className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-ember text-[10px] font-black text-white animate-pop"
              >✓</span>
            )}
            <span className="flex items-center gap-2.5 pr-5 text-sm font-bold">
              {o.swatch && (
                <span
                  aria-hidden
                  className="h-5 w-5 shrink-0 rounded-full border border-choco/15 transition-transform hover:scale-110"
                  style={{ background: o.swatch }}
                />
              )}
              {o.label}
            </span>
            <span
              className={cn(
                "text-xs font-semibold transition-colors",
                active ? "text-ember-deep" : "text-choco/60"
              )}
            >
              {o.note ?? deltaLabel(o.delta)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function MultiPicker({
  label,
  options,
  values,
  onToggle,
  max,
}: {
  label: string;
  options: PricedOption[];
  values: string[];
  onToggle: (v: string) => void;
  max?: number;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = values.includes(o.value);
        const disabled = !active && max !== undefined && values.length >= max;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            disabled={disabled}
            title={`${o.label} · ${deltaLabel(o.delta)}`}
            onClick={() => onToggle(o.value)}
            className={cn(
              "inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-bold transition-all duration-200 active:scale-[0.98]",
              active
                ? "border-ember bg-ember text-white"
                : "border-choco/12 bg-cream/60 hover:border-ember/50 hover:bg-white",
              disabled && "cursor-not-allowed opacity-40 hover:border-choco/12 hover:bg-cream/60"
            )}
          >
            {/* The tick/plus glyphs are decorative and would otherwise be read
                out as "check mark" or "plus" before every option label. */}
            <span aria-hidden className={cn("text-xs", active ? "text-white/80" : "text-choco/40")}>
              {active ? "✓" : "+"}
            </span>
            {o.swatch && (
              <span
                aria-hidden
                className={cn("h-4 w-4 shrink-0 rounded-full border border-choco/15", active && "border-white/45")}
                style={{ background: o.swatch }}
              />
            )}
            {o.label}
            <span className={cn("text-xs font-semibold", active ? "text-white/80" : "text-choco/55")}>
              {o.delta > 0 ? `+${ngn(o.delta)}` : o.delta < 0 ? `−${ngn(-o.delta)}` : "free"}
            </span>
            {active && <span className="sr-only">(selected)</span>}
            {disabled && (
              <span className="sr-only">
                (unavailable — remove one to choose this)
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------- BUILDER LAYOUT ---------------------------- */

export function BuilderLayout({
  eyebrow,
  title,
  intro,
  cover,
  stepCount,
  preview,
  previewLabel,
  total,
  cta,
  onAdd,
  canAdd = true,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  cover: Img;
  stepCount: number;
  preview: ReactNode;
  previewLabel: string;
  total: number;
  cta: string;
  onAdd: () => void;
  canAdd?: boolean;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const [activeStep, setActiveStep] = useState(1);
  const flow = { activeStep, stepCount, setActiveStep };
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-[calc(10rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:px-10 lg:py-8 lg:pb-8">
      <header className={cn("relative isolate mb-7 flex min-h-[250px] items-end overflow-hidden rounded-[1.75rem] bg-cocoa sm:min-h-[300px] lg:mb-10 lg:min-h-[340px]", !reduced && "animate-[fade-up_0.55s_cubic-bezier(0.22,1,0.36,1)_both]")}>
        <FoodImage
          id={cover.id}
          alt={cover.alt}
          width={1600}
          priority
          sizes="(max-width: 1440px) 100vw, 1440px"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-cocoa/90 via-cocoa/55 to-cocoa/5" />
        <div className="max-w-3xl px-6 pb-7 pt-8 text-cream sm:px-9 sm:pb-9 lg:px-12 lg:pb-12">
          <p className="text-label uppercase text-butter">{eyebrow}</p>
          <h1 className="mt-3 font-display text-display text-white">{title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">{intro}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-cocoa/45 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm sm:text-xs">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-40" /><span className="relative inline-flex h-2 w-2 rounded-full bg-mint" /></span>
            Live preview · Instant pricing
          </div>
        </div>
        <span aria-hidden className="absolute bottom-6 right-7 hidden font-display text-7xl font-black text-white/15 lg:block">01</span>
      </header>

      <div className="mb-6 flex items-center gap-4 sm:mb-8">
        <p className="shrink-0 text-[10px] font-extrabold uppercase tracking-[0.16em] text-choco/55 sm:text-xs">
          Step {String(activeStep).padStart(2, "0")} <span className="text-choco/30">/ {String(stepCount).padStart(2, "0")}</span>
        </p>
        <div className="flex flex-1 gap-1.5" role="group" aria-label="Builder progress">
          {Array.from({ length: stepCount }, (_, index) => {
            const number = index + 1;
            return (
              <button
                key={number}
                type="button"
                aria-label={`Go to step ${number}`}
                aria-current={activeStep === number ? "step" : undefined}
                onClick={() => setActiveStep(number)}
                className={cn("h-1.5 flex-1 rounded-full transition-colors", number <= activeStep ? "bg-ember" : "bg-choco/12 hover:bg-choco/25")}
              />
            );
          })}
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
        {/* Live preview */}
        <div className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-[1.75rem] bg-sand ring-1 ring-choco/10">
            <div className="flex items-center justify-between border-b border-choco/10 px-5 py-4 sm:px-7">
              <p className="text-label uppercase text-choco/65">Your creation</p>
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-choco/45">Live / 01</span>
            </div>
            <div className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_50%_44%,rgba(255,253,250,0.95),rgba(239,228,211,0.8)_70%)] px-5 py-4 sm:px-8 sm:py-5">
              <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.22]" style={{ backgroundImage: "radial-gradient(#2b1c15 0.55px, transparent 0.55px)", backgroundSize: "12px 12px" }} />
              {preview}
            </div>
            <div className="border-t border-choco/10 bg-milk/65 px-5 py-4 sm:px-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-choco/50">Your selection</p>
              <p className="mt-1.5 text-sm font-semibold leading-relaxed text-choco">{previewLabel}</p>
            </div>
            <p aria-live="polite" className="sr-only">
              {previewLabel}
            </p>
          </div>
          <div className="mt-4 hidden items-center justify-between gap-4 rounded-2xl bg-choco px-6 py-5 text-cream lg:flex">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream/60">Your total</p>
              <p className="mt-1 font-display text-3xl font-black tabular-nums" aria-live="polite">{ngn(total)}</p>
            </div>
            <button
              type="button"
              onClick={onAdd}
              disabled={!canAdd}
              className="min-h-[52px] rounded-full bg-ember px-7 font-display text-base font-bold text-white transition hover:bg-ember-deep active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {cta}
            </button>
          </div>
        </div>

        {/* Steps */}
        <BuilderFlowContext.Provider value={flow}>
          <div className="rounded-[1.75rem] bg-milk px-5 py-5 shadow-[0_8px_32px_rgba(43,28,21,0.035)] ring-1 ring-choco/8 sm:px-8 sm:py-7">{children}</div>
        </BuilderFlowContext.Provider>
      </div>

      {/* Mobile sticky action bar (sits above the bottom nav) */}
      <div className="fixed inset-x-4 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-lg lg:hidden">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-choco/95 py-2 pl-5 pr-2 text-cream shadow-2xl backdrop-blur">
          <div><p className="text-[10px] font-bold uppercase tracking-widest text-cream/60">Total</p><p className="font-display text-xl font-black tabular-nums" aria-live="polite">{ngn(total)}</p></div>
          <button
            type="button"
            onClick={onAdd}
            disabled={!canAdd}
            className="min-h-[52px] rounded-full bg-ember px-7 font-display text-base font-black text-white transition hover:bg-ember-deep active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
}
