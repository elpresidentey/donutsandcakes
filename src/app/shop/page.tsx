"use client";

import { useMemo, useRef, useState } from "react";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

type Filter = Category | "all";
type Sort = "featured" | "price-asc" | "price-desc" | "name-asc";

const FILTERS: Filter[] = ["all", ...CATEGORIES.map((c) => c.slug)];

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price · low to high" },
  { value: "price-desc", label: "Price · high to low" },
  { value: "name-asc", label: "Name · A to Z" },
];

function filterName(f: Filter): string {
  return f === "all"
    ? "All"
    : (CATEGORIES.find((c) => c.slug === f)?.name ?? f);
}

function filterCount(f: Filter): number {
  return f === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === f).length;
}

/** Flatten a product to a single lowercase haystack for substring search. */
function searchable(p: (typeof PRODUCTS)[number]): string {
  const cat = CATEGORIES.find((c) => c.slug === p.category)?.name ?? p.category;
  return [p.name, p.tagline, p.description, cat, p.badge ?? "", ...p.ingredients]
    .join(" ")
    .toLowerCase();
}

export default function ShopPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list =
      filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
    if (q) list = list.filter((p) => searchable(p).includes(q));

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
    // "featured" intentionally keeps catalog order.
    return sorted;
  }, [filter, query, sort]);

  const hasQuery = query.trim().length > 0;

  /** Move selection and focus together, per the WAI-ARIA tabs pattern. */
  const select = (f: Filter, focus = true) => {
    setFilter(f);
    if (focus) {
      requestAnimationFrame(() =>
        tabRefs.current[FILTERS.indexOf(f)]?.focus()
      );
    }
  };

  const clearAll = () => {
    setQuery("");
    setFilter("all");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-label uppercase text-ember">The full counter</p>
      <h1 className="mt-1 font-display text-display">
        Everything we bake
      </h1>
      <p className="mt-2 max-w-xl text-choco/70">
        {PRODUCTS.length} treats, all made fresh in our kitchen. Cakes for
        the big days, boxes for the whole office, cold sips for the heat.
      </p>

      {/* Search + sort. Search narrows within the active category tab; sort
          reorders the result. Both feed the same aria-live count below. */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="shop-search" className="sr-only">
            Search treats
          </label>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-choco/45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" strokeLinecap="round" />
          </svg>
          <input
            id="shop-search"
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chocolate, mango, sprinkles…"
            className="min-h-[52px] w-full rounded-full border-2 border-choco/15 bg-milk pl-12 pr-12 font-semibold placeholder:font-medium placeholder:text-choco/50 focus:border-ember-deep"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-lg font-black text-choco/50 transition hover:bg-sand hover:text-choco"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="shop-sort" className="shrink-0 text-sm font-bold text-choco/70">
            Sort
          </label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="min-h-[52px] w-full rounded-full border-2 border-choco/15 bg-milk px-4 font-semibold focus:border-ember-deep sm:w-auto"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="no-scrollbar sticky top-16 z-10 -mx-4 mt-4 flex gap-2 overflow-x-auto bg-cream/95 px-4 py-3 backdrop-blur"
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
        {filter === "all" ? " across every category" : ` in ${filterName(filter)}`}
        {hasQuery ? ` matching “${query.trim()}”` : ""}.
      </p>

      <div
        id="filter-panel"
        role="tabpanel"
        aria-labelledby={`filter-tab-${filter}`}
        tabIndex={-1}
        className="mt-4"
      >
        {shown.length === 0 ? (
          <div className="rounded-3xl bg-milk p-10 text-center ring-1 ring-inset ring-choco/10">
            <p aria-hidden className="text-5xl">🧁</p>
            <p className="mt-3 font-display text-2xl font-black">
              Nothing matches that yet
            </p>
            <p className="mx-auto mt-2 max-w-sm text-choco/70">
              Try a different word, or clear the search to see the whole counter
              again.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-5 min-h-[48px] rounded-full bg-ember px-7 py-2.5 font-display font-black text-white transition hover:bg-ember-deep active:scale-95"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
