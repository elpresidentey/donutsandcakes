"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { ngn } from "@/lib/format";
import { CATEGORIES, type Product } from "@/lib/catalog";
import FoodImage from "./FoodImage";

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

  // `relative` on the article anchors the title link's stretched hit area; the
  // quick-add button is lifted above it with z-10 so it stays clickable.
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-milk p-2 ring-1 ring-choco/8 shadow-[0_2px_10px_rgba(62,42,32,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(62,42,32,0.16)]">
      {/* The image and the title both pointed at the same URL, so every card cost
          a keyboard user two tab stops to say the same thing. The image is kept as
          a link for mouse users but removed from the tab order and hidden from
          assistive tech; the title below is the single accessible name+target. */}
      <Link
        href={`/product/${product.id}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-milk"
      >
        <FoodImage
          id={product.image.id}
          alt={product.image.alt}
          width={800}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
        />
        {/* Fades the photo into the card so the edge never looks like a sticker */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cocoa/40 via-cocoa/0 to-transparent"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-milk/92 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-berry shadow-[0_2px_8px_rgba(62,42,32,0.14)] backdrop-blur">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-2.5">
        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-choco/70">
          {categoryName}
          {product.serves && <span className="text-choco/65"> · {product.serves}</span>}
        </p>

        <Link
          href={`/product/${product.id}`}
          className="mt-1 self-start after:absolute after:inset-0 after:content-['']"
        >
          <h3 className="line-clamp-2 font-display text-subhead transition-colors group-hover:text-berry">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-choco/70">
          {product.description}
        </p>

        <p
          className="mb-2.5 mt-1.5 line-clamp-1 text-[11px] font-semibold text-choco/70"
          title={product.ingredients.join(", ")}
        >
          <span className="mr-1 font-black uppercase tracking-widest text-strawberry">
            Inside
          </span>
          {product.ingredients.join(" · ")}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-choco/8 pt-2.5">
          <div>
            {hasPriceRange && (
              <p className="text-[10px] font-black uppercase tracking-widest text-choco/65">
                From
              </p>
            )}
            <p className="font-display text-xl font-black leading-none text-berry">
              {ngn(product.price)}
              {product.compareAt && (
                <span className="ml-2 align-middle font-sans text-xs font-semibold text-choco/70 line-through">
                  {ngn(product.compareAt)}
                </span>
              )}
            </p>
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
            className="shine relative z-10 min-h-[44px] shrink-0 rounded-full bg-gradient-to-br from-berry to-strawberry px-4 py-2 text-sm font-bold text-white shadow-[0_6px_16px_rgba(109,33,72,0.28)] transition hover:brightness-110 active:scale-95"
            aria-label={`Quick add ${product.name} to cart`}
          >
            + Add
          </button>
        </div>
      </div>
    </article>
  );
}
