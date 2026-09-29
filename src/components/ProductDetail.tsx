"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { ngn } from "@/lib/format";
import type { Product } from "@/lib/catalog";
import { productsByCategory } from "@/lib/catalog";
import FoodImage from "@/components/FoodImage";
import ProductCard from "@/components/ProductCard";

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [sizeIdx, setSizeIdx] = useState(
    // Cakes default to the standard 8"; everything else defaults to the base option
    product.category === "cakes" && product.sizes.length > 1 ? 1 : 0
  );
  const [qty, setQty] = useState(1);

  const size = product.sizes[Math.min(sizeIdx, product.sizes.length - 1)];
  const unitPrice = useMemo(
    () => product.price + (size?.delta ?? 0),
    [product.price, size]
  );

  const related = productsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href={`/${product.category}`} className="text-sm font-bold text-ember-deep hover:underline">
          ← Back to {product.category}
        </Link>

        <div className="mt-4 grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] border-4 border-milk shadow-[0_16px_48px_rgba(43,28,21,0.12)]">
            <FoodImage
              id={product.image.id}
              alt={product.image.alt}
              width={1000}
              priority
              eager
              sizes="(max-width: 768px) 100vw, 50vw"
              className="aspect-square w-full object-cover"
            />
          </div>

          <div>
            {product.badge && (
              <p className="inline-block rounded-full bg-cocoa px-4 py-1.5 text-label uppercase text-cream">
                {product.badge}
              </p>
            )}
            <h1 className="mt-2 font-display text-display">
              {product.name}
            </h1>
            <p className="mt-1 text-lg font-semibold text-choco/70">{product.tagline}</p>
            <p className="mt-4 leading-relaxed text-choco/85">{product.description}</p>
            {product.serves && (
              <p className="mt-2 text-sm font-bold text-leaf">✓ {product.serves}</p>
            )}

            <div className="mt-5">
              <p className="text-label uppercase text-choco/70">
                What&apos;s inside
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {product.ingredients.map((ing) => (
                  <li
                    key={ing}
                    className="rounded-full bg-sand px-3 py-1 text-xs font-bold text-choco/80"
                  >
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 font-display text-display text-ember-deep">
              {ngn(unitPrice)}
              {product.compareAt && (
                <span className="ml-3 align-middle font-sans text-base font-semibold text-choco/70 line-through">
                  {ngn(product.compareAt + (size?.delta ?? 0))}
                </span>
              )}
            </p>

            {product.sizes.length > 1 && (
              <fieldset className="mt-6">
                <legend className="text-label uppercase text-choco/70">
                  Choose size
                </legend>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {product.sizes.map((s, i) => {
                    const active = i === sizeIdx;
                    return (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setSizeIdx(i)}
                        aria-pressed={active}
                        className={`min-h-[52px] rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold transition active:scale-[0.98] ${
                          active
                            ? "border-ember bg-ember/10"
                            : "border-choco/15 bg-milk hover:border-choco/40"
                        }`}
                      >
                        {s.label}
                        <span className="block text-xs font-semibold text-choco/70">
                          {s.delta === 0 ? "Included" : s.delta > 0 ? `+ ${ngn(s.delta)}` : `− ${ngn(-s.delta)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-full border-2 border-choco/15" role="group" aria-label="Quantity">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-12 w-12 items-center justify-center text-2xl font-black hover:text-ember"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-lg font-black" aria-live="polite">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(24, q + 1))}
                  className="flex h-12 w-12 items-center justify-center text-2xl font-black hover:text-ember"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  addItem({
                    kind: "ready",
                    name: product.name,
                    imageId: product.image.id,
                    imageAlt: product.image.alt,
                    unitPrice,
                    qty,
                    details: size ? [size.label] : ["Standard"],
                  });
                  router.push("/cart");
                }}
                className="min-h-[52px] flex-1 rounded-full bg-ember font-display text-lg font-black text-white transition hover:bg-ember-deep active:scale-95"
              >
                Add to Cart · {ngn(unitPrice * qty)}
              </button>
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-2 text-center text-xs font-bold text-choco/70">
              <div className="rounded-2xl bg-sand p-3">🚚<dt className="sr-only">Delivery</dt><dd className="mt-1">Lagos delivery Tue–Sun</dd></div>
              <div className="rounded-2xl bg-mint/60 p-3">🌱<dt className="sr-only">Fresh</dt><dd className="mt-1">Baked & blended fresh</dd></div>
              <div className="rounded-2xl bg-butter/60 p-3">🎁<dt className="sr-only">Gifting</dt><dd className="mt-1">Gift wrap available</dd></div>
            </dl>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14" aria-labelledby="related">
            <h2 id="related" className="mb-5 font-display text-heading">
              You may also love
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
