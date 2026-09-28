import Link from "next/link";
import type { Category } from "@/lib/catalog";
import { productsByCategory } from "@/lib/catalog";
import { IMAGES } from "@/lib/images";
import ProductCard from "./ProductCard";
import FoodImage from "./FoodImage";

interface CategoryViewProps {
  category: Category;
  title: string;
  blurb: string;
  builderHref: string;
  builderLabel: string;
  builderText: string;
  galleryHref?: string;
  galleryLabel?: string;
}

const BANNERS = {
  cakes: IMAGES.chocoFudge,
  donuts: IMAGES.pinkParade,
  smoothies: IMAGES.berryMedley,
  juices: IMAGES.orangePress,
} as const;

export default function CategoryView({
  category,
  title,
  blurb,
  builderHref,
  builderLabel,
  builderText,
  galleryHref,
  galleryLabel,
}: CategoryViewProps) {
  const products = productsByCategory(category);
  const banner = BANNERS[category];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <FoodImage
            id={banner.id}
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
            {products.length} treats
          </p>
          <h1 className="mt-1 font-display text-display text-cream">
            {title}
          </h1>
          <p className="mt-2 max-w-lg font-medium text-cream/85">{blurb}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          href={builderHref}
          className="group relative mb-8 flex flex-col items-start gap-4 overflow-hidden rounded-3xl bg-gradient-to-r from-berry to-cocoa p-6 text-white sm:flex-row sm:items-center sm:p-8"
        >
          {/* Same 35% cocoa scrim as the homepage CTA — see page.tsx */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-cocoa/20" />
          <div className="relative flex-1">
            <p className="text-label uppercase text-butter">
              Or start from nothing
            </p>
            <h2 className="mt-1 font-display text-heading">
              {builderLabel}
            </h2>
            <p className="mt-1 text-sm text-white/90">{builderText}</p>
          </div>
          <span className="relative min-h-[48px] rounded-full bg-cream px-7 py-3 font-display font-black text-berry transition group-hover:bg-white">
            Start creating →
          </span>
        </Link>

        {galleryHref && galleryLabel && (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Link
              href={galleryHref}
              className="inline-flex min-h-[48px] items-center rounded-full border-2 border-choco/10 bg-milk px-6 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 hover:border-berry/40 hover:shadow-[0_6px_16px_rgba(62,42,32,0.08)] active:scale-95"
            >
              {galleryLabel} →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </>
  );
}
