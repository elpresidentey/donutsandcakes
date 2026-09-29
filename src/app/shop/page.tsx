"use client";

import { useRef, useState } from "react";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

type Filter = Category | "all";

const FILTERS: Filter[] = ["all", ...CATEGORIES.map((c) => c.slug)];

function filterName(f: Filter): string {
  return f === "all"
    ? "All"
    : (CATEGORIES.find((c) => c.slug === f)?.name ?? f);
}

function filterCount(f: Filter): number {
  return f === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === f).length;
}

export default function ShopPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const shown = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  /** Move selection and focus together, per the WAI-ARIA tabs pattern. */
  const select = (f: Filter, focus = true) => {
    setFilter(f);
    if (focus) {
      requestAnimationFrame(() =>
        tabRefs.current[FILTERS.indexOf(f)]?.focus()
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-label uppercase text-ember">The full counter</p>
      <h1 className="mt-1 font-display text-display">
        Everything we bake
      </h1>
      <p className="mt-2 max-w-xl text-choco/70">
        {PRODUCTS.length} treats, all made fresh in our Lagos kitchen. Cakes for
        the big days, boxes for the whole office, cold sips for the heat.
      </p>

      <div
        className="no-scrollbar sticky top-16 z-10 -mx-4 mt-6 flex gap-2 overflow-x-auto bg-cream/95 px-4 py-3 backdrop-blur"
        role="tablist"
        aria-label="Filter treats by category"
        onKeyDown={(e) => {
          const i = FILTERS.indexOf(filter);
          let next: number | null = null;
          if (e.key === "ArrowRight") next = (i + 1) % FILTERS.length;
          else if (e.key === "ArrowLeft")
            next = (i - 1 + FILTERS.length) % FILTERS.length;
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = FILTERS.length - 1;
          if (next === null) return;
          e.preventDefault();
          select(FILTERS[next]);
        }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            ref={(el) => {
              tabRefs.current[FILTERS.indexOf(f)] = el;
            }}
            role="tab"
            id={`filter-tab-${f}`}
            aria-selected={filter === f}
            aria-controls="filter-panel"
            // Roving tabindex keeps the whole filter row to one tab stop.
            tabIndex={filter === f ? 0 : -1}
            onClick={() => select(f, false)}
            className={cn(
              "min-h-[44px] shrink-0 rounded-full px-5 text-sm font-bold transition active:scale-95",
              filter === f
                ? "bg-choco text-cream"
                : "bg-milk text-choco shadow-sm hover:bg-sand"
            )}
          >
            {filterName(f)}{" "}
            <span className={cn("text-xs", filter === f ? "text-cream/70" : "text-choco/60")}>
              ({filterCount(f)})
            </span>
          </button>
        ))}
      </div>

      {/* The visible count is also announced, so filtering is not a silent change. */}
      <p aria-live="polite" className="mt-4 text-sm font-semibold text-choco/70">
        Showing {shown.length} {shown.length === 1 ? "treat" : "treats"}
        {filter === "all" ? " across every category" : ` in ${filterName(filter)}`}.
      </p>

      <div
        id="filter-panel"
        role="tabpanel"
        aria-labelledby={`filter-tab-${filter}`}
        tabIndex={-1}
        className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
      >
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
