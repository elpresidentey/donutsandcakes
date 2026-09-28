"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { ngn } from "@/lib/format";
import type { PricedOption } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/* ------------------------------ STEP WRAPPER ----------------------------- */

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
  return (
    <section aria-label={title} className="rounded-3xl bg-milk p-5 ring-1 ring-choco/8 shadow-[0_2px_14px_rgba(62,42,32,0.05)]">
      <div className="mb-3 flex items-baseline gap-2">
        <span className="font-display text-sm font-black text-berry">{n}</span>
        <h2 className="font-display text-subhead">{title}</h2>
      </div>
      {hint && <p className="mb-3 -mt-1 text-sm text-choco/70">{hint}</p>}
      {children}
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
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
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
              "relative flex min-h-[68px] flex-col justify-center gap-1 rounded-2xl border-2 px-3.5 py-3 text-left transition-all duration-200 active:scale-[0.98]",
              active
                ? "border-berry bg-blush shadow-[0_6px_18px_rgba(109,33,72,0.16)]"
                : "border-choco/10 bg-cream hover:-translate-y-0.5 hover:border-choco/35 hover:shadow-[0_6px_16px_rgba(62,42,32,0.08)]"
            )}
          >
            {active && (
              <span
                aria-hidden
                className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-berry"
              />
            )}
            <span className="flex items-center gap-2.5 pr-5 text-sm font-bold">
              {o.swatch && (
                <span
                  aria-hidden
                  className="h-6 w-6 shrink-0 rounded-full border-2 border-milk shadow-[0_1px_4px_rgba(62,42,32,0.25)]"
                  style={{ background: o.swatch }}
                />
              )}
              {o.label}
            </span>
            <span
              className={cn(
                "text-xs font-bold",
                active ? "text-berry" : "text-choco/70"
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
              "inline-flex min-h-[46px] items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-bold transition-all duration-200 active:scale-95",
              active
                ? "border-berry bg-berry text-cream shadow-[0_6px_16px_rgba(109,33,72,0.26)]"
                : "border-choco/10 bg-cream hover:-translate-y-0.5 hover:border-berry/40 hover:shadow-[0_6px_16px_rgba(62,42,32,0.08)]",
              disabled && "cursor-not-allowed opacity-40 hover:translate-y-0 hover:border-choco/10 hover:shadow-none"
            )}
          >
            {/* The tick/plus glyphs are decorative and would otherwise be read
                out as "check mark" or "plus" before every option label. */}
            <span aria-hidden className="text-xs">
              {active ? "✓" : "+"}
            </span>
            {o.label}
            <span className={cn("text-xs font-bold", active ? "text-cream/75" : "text-choco/70")}>
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
  preview,
  previewLabel,
  total,
  cta,
  onAdd,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  preview: ReactNode;
  previewLabel: string;
  total: number;
  cta: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-label uppercase text-berry">{eyebrow}</p>
      <h1 className="mt-1 font-display text-display">{title}</h1>
      <p className="mt-2 max-w-xl text-choco/70">{intro}</p>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Live preview */}
        <div className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-[2rem] border-4 border-milk bg-gradient-to-br from-blush via-cream to-mint shadow-[0_16px_48px_rgba(62,42,32,0.15)]">
            <div className="px-5 pt-4">
              <p className="text-label uppercase text-choco/70">
                Watching you build
              </p>
            </div>
            {preview}
            <p aria-live="polite" className="sr-only">
              {previewLabel}
            </p>
          </div>
          <div className="mt-3 hidden items-center justify-between rounded-3xl bg-choco px-6 py-4 text-cream lg:flex">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cream/60">Your total</p>
              <p className="font-display text-3xl font-black" aria-live="polite">{ngn(total)}</p>
            </div>
            <button
              type="button"
              onClick={onAdd}
              className="shine min-h-[52px] rounded-full bg-gradient-to-br from-berry to-strawberry px-8 font-display text-lg font-black text-white shadow-lg transition hover:brightness-110 active:scale-95"
            >
              {cta}
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4">{children}</div>
      </div>

      {/* Mobile sticky action bar (sits above the bottom nav) */}
      <div className="sticky bottom-[76px] z-30 mt-6 lg:hidden">
        <div className="flex items-center justify-between gap-3 rounded-full bg-choco/95 py-2 pl-6 pr-2 text-cream shadow-2xl backdrop-blur">
          <p className="font-display text-2xl font-black" aria-live="polite">{ngn(total)}</p>
          <button
            type="button"
            onClick={onAdd}
            className="shine min-h-[52px] rounded-full bg-gradient-to-br from-berry to-strawberry px-7 font-display text-base font-black text-white transition hover:brightness-110 active:scale-95"
          >
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
}
