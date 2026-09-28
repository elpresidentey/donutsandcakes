import type { Metadata } from "next";
import Link from "next/link";
import { productsByCategory } from "@/lib/catalog";
import { IMAGES } from "@/lib/images";
import ProductCard from "@/components/ProductCard";
import FoodImage from "@/components/FoodImage";

export const metadata: Metadata = {
  title: "Smoothies & Juices",
  description:
    "Thick-blended smoothies and fresh-pressed natural juices. Real fruit, no sodas, no syrups.",
};

export default function SmoothiesPage() {
  const smoothies = productsByCategory("smoothies");
  const juices = productsByCategory("juices");

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <FoodImage
            id={IMAGES.berryMedley.id}
            alt=""
            width={1600}
            priority
            eager
            sizes="100vw"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/40 to-cocoa/10" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-20 sm:px-6 sm:pt-28">
          <p className="text-label uppercase text-butter">
            {smoothies.length + juices.length} sips
          </p>
          <h1 className="mt-1 font-display text-display text-cream">
            Smoothies & Juices
          </h1>
          <p className="mt-2 max-w-lg font-medium text-cream/85">
            Real fruit, blended thick or pressed fresh. No concentrates, no
            added sugar — and no sodas on this menu, ever.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          href="/build/smoothie"
          className="group mb-10 flex flex-col items-start gap-4 overflow-hidden rounded-3xl bg-gradient-to-r from-leaf to-ocean p-6 text-white sm:flex-row sm:items-center sm:p-8"
        >
          <div className="flex-1">
            <p className="text-label uppercase text-mint">Or blend your own</p>
            <h2 className="mt-1 font-display text-heading">Build your blend</h2>
            <p className="mt-1 text-sm text-white/90">
              Base, fruits & extras — watch the colour change as you build.
            </p>
          </div>
          <span className="min-h-[48px] rounded-full bg-cream px-7 py-3 font-display font-black text-leaf transition group-hover:bg-white">
            Start building →
          </span>
        </Link>

        <section aria-labelledby="sm" className="mb-12">
          <h2 id="sm" className="mb-5 font-display text-heading">
            Smoothies
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {smoothies.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section aria-labelledby="ju" className="rounded-[2rem] bg-mint/40 p-5 sm:p-8">
          <h2 id="ju" className="mb-1 font-display text-heading">
            Natural juices
          </h2>
          <p className="mb-5 text-sm font-semibold text-choco/70">
            Pressed to order. Nothing else in the cup.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {juices.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
