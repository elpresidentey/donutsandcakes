"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { ngn } from "@/lib/format";
import { CATEGORIES, type Product } from "@/lib/catalog";
import FoodImage from "./FoodImage";

const MAX_CHIPS = 3;

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
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

  // `relative` on the article anchors the title link's stretched hit area; the
  // quick-add button is lifted above it with z-10 so it stays clickable.
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-choco/12 bg-milk transition-all duration-300 hover:-translate-y-1 hover:border-choco/25 hover:shadow-[0_16px_34px_rgba(43,28,21,0.12)]">
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
          <span className="absolute left-3 top-3 rounded-full bg-cocoa px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-cream">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-ember">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
          {categoryName}
          {product.serves && (
            <span className="text-choco/55">· {product.serves}</span>
          )}
        </p>

        <Link
          href={`/product/${product.id}`}
          className="mt-1.5 self-start after:absolute after:inset-0 after:content-['']"
        >
          <h3 className="line-clamp-2 font-display text-subhead transition-colors group-hover:text-ember">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-choco/70">
          {product.description}
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
          {ingredients.map((item) => (
            <span
              key={item}
              aria-hidden
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-choco/75 ring-1 ring-inset ring-choco/15"
            >
              {item}
            </span>
          ))}
          {moreCount > 0 && (
            <span
              aria-hidden
              className="px-1 py-0.5 text-[11px] font-bold text-ember-deep"
            >
              +{moreCount} more
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
        <div className="mt-auto bg-cocoa px-4 pb-3.5 pt-3">
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
              type="button"
              onClick={() =>
                addItem({
                  kind: "ready",
                  name: product.name,
                  imageId: product.image.id,
                  imageAlt: product.image.alt,
                  unitPrice: quickPrice,
                  details: [defaultSize?.label ?? "Standard"],
                })
              }
              className="relative z-10 min-h-[44px] w-full shrink-0 rounded-full bg-ember px-3.5 py-2 text-sm font-bold text-white transition hover:bg-ember-deep active:scale-95 min-[520px]:w-auto"
              aria-label={`Quick add ${product.name} to cart`}
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
