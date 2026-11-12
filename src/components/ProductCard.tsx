"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/store/cart";
import { ngn } from "@/lib/format";
import { CATEGORIES, type Product } from "@/lib/catalog";
import FoodImage from "./FoodImage";
import { cn } from "@/lib/utils";

const MAX_CHIPS = 3;

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Keep quick-add consistent with the product page default selection.
  const defaultIdx =
    product.category === "cakes" && product.sizes.length > 1 ? 1 : 0;
  const defaultSize = product.sizes[Math.min(defaultIdx, product.sizes.length - 1)];
  const quickPrice = product.price + (defaultSize?.delta ?? 0);
  const hasPriceRange = product.sizes.some((s) => s.delta !== 0);
  const categoryName =
    CATEGORIES.find((c) => c.slug === product.category)?.name ?? product.category;

  const ingredients = product.ingredients.slice(0, MAX_CHIPS);
  const moreCount = product.ingredients.length - ingredients.length;

  // Reset added state after animation
  useEffect(() => {
    if (added) {
      const timer = setTimeout(() => {
        setAdded(false);
        setAdding(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [added]);

  // Focus management after quick-add
  const handleQuickAdd = () => {
    setAdding(true);
    addItem({
      kind: "ready",
      name: product.name,
      imageId: product.image.id,
      imageAlt: product.image.alt,
      unitPrice: quickPrice,
      details: [defaultSize?.label ?? "Standard"],
    });
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
    }, 360);
    // Refocus button for keyboard users after animation
    setTimeout(() => {
      buttonRef.current?.focus();
    }, 2100);
  };

  // `relative` on the article anchors the title link's stretched hit area; the
  // quick-add button is lifted above it with z-10 so it stays clickable.
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[1.4rem] border border-choco/10 bg-milk transition-all duration-300",
        "hover:-translate-y-2 hover:border-ember/25 hover:shadow-[0_22px_44px_rgba(43,28,21,0.14)] focus-within:border-ember/60"
      )}
    >
      {/* The image and the title both pointed at the same URL, so every card cost
          a keyboard user two tab stops to say the same thing. The image is kept as
          a link for mouse users but removed from the tab order and hidden from
          assistive tech; the title below is the single accessible name+target. */}
      <Link
        href={`/product/${product.id}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[4/3] overflow-hidden bg-sand"
      >
        <FoodImage
          id={product.image.id}
          alt={product.image.alt}
          width={800}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-cocoa px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-cream transition-opacity duration-200 group-hover:opacity-100">
            {product.badge}
          </span>
        )}
        {/* Subtle shine overlay on hover */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-white/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>

      <div className="flex flex-1 flex-col p-3 min-[380px]:p-4 sm:p-5">
        <p className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] font-black uppercase leading-tight tracking-[0.1em] text-ember sm:text-[11px] sm:tracking-[0.14em]">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember transition-transform duration-300 group-hover:scale-150" />
          <span className="whitespace-nowrap">{categoryName}</span>
          {product.serves && (
            <span className="whitespace-nowrap text-[9px] tracking-normal text-choco/55 sm:text-[10px]">
              · {product.serves}
            </span>
          )}
        </p>

        <Link
          href={`/product/${product.id}`}
          className="mt-1.5 self-start after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-milk rounded-lg"
        >
          <h3 className="line-clamp-2 font-display text-subhead leading-snug transition-colors group-hover:text-ember">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm font-medium leading-snug text-choco/75">
          {product.tagline}
        </p>

        {/* Ingredients at a glance. The full list stays available to screen
            readers even when the chips are trimmed to keep rows even. */}
        <div
          className="mb-4 mt-3 flex flex-wrap gap-1.5"
          title={product.ingredients.join(", ")}
        >
          <span className="sr-only">
            Made with: {product.ingredients.join(", ")}
          </span>
          {ingredients.slice(0, 2).map((item) => (
            <span
              key={item}
              aria-hidden
              className="rounded-full bg-sand/65 px-2.5 py-1 text-[10px] font-bold text-choco/75"
            >
              {item}
            </span>
          ))}
          {ingredients.length > 2 && (
            <span
              aria-hidden
              className="px-1 py-1 text-[10px] font-bold text-ember-deep"
            >
              +{moreCount + ingredients.length - 2} more
            </span>
          )}
        </div>

        {/* Ink shelf: the price sits on cocoa instead of on a hairline, so the
            grid reads as rows of labelled products. It also settles the old
            overflow — at 2-up mobile widths the footer only has ~92–152px of
            usable width, which "₦42,000 + was ₦48,000 + Add" can never share
            on one line, so below 520px the price stacks above a full-width
            Add pill, and above it the row only needs ~155px, which the 4-up
            desktop grid (~163px) still covers. */}
        <div className="mt-auto bg-cocoa px-3 pb-3.5 pt-3 sm:px-4">
          <div className="flex flex-col gap-2.5 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
            <div className="min-w-0">
              {hasPriceRange && (
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-honey">
                  From
                </p>
              )}
              <p className="font-display text-lg font-black leading-tight text-cream">
                {ngn(product.price)}
              </p>
              {product.compareAt && (
                <p className="mt-0.5 font-sans text-xs font-semibold text-cream/55 line-through">
                  {ngn(product.compareAt)}
                </p>
              )}
            </div>
            <button
              ref={buttonRef}
              type="button"
              onClick={handleQuickAdd}
              disabled={adding}
              className={cn(
                "relative z-10 min-h-[44px] w-full shrink-0 rounded-full px-3.5 py-2 text-sm font-bold text-white transition duration-200 active:scale-90 min-[520px]:w-auto",
                adding
                  ? "bg-mint cursor-wait"
                  : added
                  ? "bg-mint"
                  : "bg-ember hover:bg-ember-deep hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(143,44,7,0.3)]"
              )}
              aria-label={added ? `${product.name} added to cart` : `Quick add ${product.name} to cart`}
              aria-live="polite"
            >
              {adding && <span className="inline-flex items-center gap-1.5"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Adding…</span>}
              {added && <span className="inline-flex animate-pop items-center gap-1.5"><span aria-hidden className="grid h-4 w-4 place-items-center rounded-full bg-white/20">✓</span> Added</span>}
              {!adding && !added && <span className="transition-transform hover:scale-105">+ Add</span>}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
