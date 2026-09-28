"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/catalog";
import { productsByCategory } from "@/lib/catalog";
import { ngn } from "@/lib/format";
import { cn } from "@/lib/utils";
import FoodImage from "./FoodImage";

type Filter = "all" | "celebration" | "cupcakes";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All cakes" },
  { value: "celebration", label: "Celebration cakes" },
  { value: "cupcakes", label: "Cupcakes" },
];

function kindOf(p: Product): Exclude<Filter, "all"> {
  return p.name.toLowerCase().includes("cupcake") ? "cupcakes" : "celebration";
}

/** Mosaic rhythm: the lead tile of each row-group goes big. */
function spanFor(i: number): string {
  if (i % 5 === 0) return "col-span-2 row-span-2";
  return "";
}

function Tile({
  product,
  span,
  onOpen,
}: {
  product: Product;
  span: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View ${product.name} larger`}
      className={cn(
        "group relative block w-full overflow-hidden rounded-3xl bg-milk text-left ring-1 ring-choco/8 shadow-[0_2px_10px_rgba(62,42,32,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(62,42,32,0.16)] focus-visible:outline-berry",
        span
      )}
    >
      <span className="block aspect-square h-full w-full">
        <FoodImage
          id={product.image.id}
          alt={product.image.alt}
          width={span ? 1000 : 700}
          sizes={span ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
          className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
        />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cocoa/70 via-cocoa/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100"
      />
      {product.badge && (
        <span className="absolute left-3 top-3 rounded-full bg-milk/92 px-3 py-1 text-label uppercase text-berry shadow backdrop-blur">
          {product.badge}
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 block p-4">
        <span className="block font-display text-subhead text-cream">
          {product.name}
        </span>
        <span className="mt-1 flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-cream/90">
            {ngn(product.price)}
            {product.serves ? ` · ${product.serves}` : ""}
          </span>
          <span className="rounded-full bg-cream/20 px-3 py-1 text-xs font-black uppercase tracking-wide text-cream backdrop-blur transition group-hover:bg-cream group-hover:text-berry">
            View
          </span>
        </span>
      </span>
    </button>
  );
}

export default function CakeGallery() {
  const all = productsByCategory("cakes");
  const [filter, setFilter] = useState<Filter>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const items = all.filter((p) => filter === "all" || kindOf(p) === filter);
  const active = lightbox === null ? null : items[lightbox] ?? null;

  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((i) => (i === null ? i : (i + dir + items.length) % items.length));
    },
    [items.length]
  );

  // Reset the lightbox when the filter changes out from under it.
  useEffect(() => {
    setLightbox(null);
  }, [filter]);

  // Keyboard nav + scroll lock while the lightbox is open.
  useEffect(() => {
    if (lightbox === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, step]);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter cakes">
        {FILTERS.map((f) => {
          const n = f.value === "all" ? all.length : all.filter((p) => kindOf(p) === f.value).length;
          const selected = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(f.value)}
              className={cn(
                "min-h-[46px] rounded-full border-2 px-5 py-2 text-sm font-bold transition-all duration-200 active:scale-95",
                selected
                  ? "border-berry bg-berry text-cream shadow-[0_6px_16px_rgba(109,33,72,0.26)]"
                  : "border-choco/10 bg-milk hover:-translate-y-0.5 hover:border-berry/40 hover:shadow-[0_6px_16px_rgba(62,42,32,0.08)]"
              )}
            >
              {f.label} · {n}
            </button>
          );
        })}
      </div>

      <div
        key={filter}
        className="mt-6 grid animate-preview-pop grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
      >
        {items.map((p, i) => (
          <Tile key={p.id} product={p} span={spanFor(i)} onOpen={() => setLightbox(i)} />
        ))}
        {/* Always-on-tile: anything not on the shelf, we build to order. */}
        <Link
          href="/build/cake"
          className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-berry to-cocoa p-5 text-left text-white ring-1 ring-choco/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(62,42,32,0.25)]"
        >
          <span aria-hidden className="pointer-events-none absolute inset-0 texture-dots-light opacity-60" />
          <span className="relative">
            <span className="text-label uppercase text-butter">
              Not on the shelf?
            </span>
            <span className="mt-1 block font-display text-heading">
              We&apos;ll bake your idea
            </span>
            <span className="mt-1 block text-sm text-white/85">
              Shape, flavour, filling & your words on top.
            </span>
            <span className="mt-4 inline-block rounded-full bg-cream px-6 py-2.5 text-sm font-black text-berry transition group-hover:bg-white">
              Build a custom cake →
            </span>
          </span>
        </Link>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.name} — cake preview`}
        >
          <button
            type="button"
            aria-label="Close preview"
            onClick={() => setLightbox(null)}
            className="absolute inset-0 cursor-zoom-out bg-cocoa/80 backdrop-blur-sm"
          />
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="relative w-full max-w-2xl animate-pop overflow-hidden rounded-[1.75rem] bg-milk shadow-2xl outline-none"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-blush">
              <FoodImage
                id={active.image.id}
                alt={active.image.alt}
                width={1400}
                sizes="(max-width: 768px) 100vw, 672px"
                className="h-full w-full object-cover"
              />
              {active.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-milk/92 px-3 py-1 text-label uppercase text-berry shadow backdrop-blur">
                  {active.badge}
                </span>
              )}
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="Close preview"
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-cocoa/80 text-xl font-black text-cream transition hover:bg-cocoa active:scale-95"
              >
                ×
              </button>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-heading sm:text-3xl">
                    {active.name}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-choco/70">{active.tagline}</p>
                </div>
                <p className="font-display text-2xl font-black text-berry">{ngn(active.price)}</p>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-choco/80">{active.description}</p>
              <p className="mt-3 text-sm font-bold text-choco/70">
                {[active.serves, `Available in ${active.sizes.length} sizes`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous cake"
                  className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border-2 border-choco/10 bg-cream px-4 text-lg font-black transition hover:border-choco/35 active:scale-95"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next cake"
                  className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border-2 border-choco/10 bg-cream px-4 text-lg font-black transition hover:border-choco/35 active:scale-95"
                >
                  →
                </button>
                <span className="mx-1 text-sm font-bold text-choco/70" aria-live="polite">
                  {(lightbox ?? 0) + 1} of {items.length}
                </span>
                <Link
                  href={`/product/${active.id}`}
                  className="shine ml-auto inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-br from-berry to-strawberry px-8 font-display text-lg font-black text-white shadow-[0_6px_16px_rgba(109,33,72,0.28)] transition hover:brightness-110 active:scale-95"
                >
                  View treat →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
