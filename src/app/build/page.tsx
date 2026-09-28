import type { Metadata } from "next";
import Link from "next/link";
import FoodImage from "@/components/FoodImage";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Build Your Treat",
  description:
    "Interactive dessert studios: build a custom cake, a donut box or a smoothie blend with live previews.",
};

const STUDIOS = [
  {
    href: "/build/cake",
    n: "Studio 01",
    title: "Cake Builder",
    text: "Shape, size, flavour, filling, frosting, toppings and your inscription — with a live cake preview and instant pricing.",
    image: IMAGES.flowerCake,
    chip: "From ₦18,000",
  },
  {
    href: "/build/donuts",
    n: "Studio 02",
    title: "Donut Box Builder",
    text: "Choose your box size, assign a flavour to every slot, glaze it and pile on toppings. Watch the box fill up.",
    image: IMAGES.partyMixBox,
    chip: "From ₦6,800",
  },
  {
    href: "/build/smoothie",
    n: "Studio 03",
    title: "Smoothie Builder",
    text: "Pick a base, throw in up to four real fruits and finish with extras. The glass changes colour as you build.",
    image: IMAGES.glowBowl,
    chip: "From ₦3,500",
  },
];

export default function BuildHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-label uppercase text-berry">
        The studios
      </p>
      <h1 className="mt-1 font-display text-display">
        Build your treat
      </h1>
      <p className="mt-2 max-w-xl text-choco/70">
        No boring catalogue. Experiment, preview and price your creation live —
        then send it to the cart when it looks (and sounds) perfect.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {STUDIOS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex flex-col overflow-hidden rounded-[2rem] bg-milk shadow-[0_2px_16px_rgba(62,42,32,0.07)] transition-transform hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(109,33,72,0.2)]"
          >
            <div className="relative overflow-hidden">
              <FoodImage
                id={s.image.id}
                alt={s.image.alt}
                width={700}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-cocoa/85 px-3 py-1 text-label uppercase text-cream">
                {s.n}
              </span>
              <span className="absolute bottom-4 right-4 rounded-full bg-milk px-3 py-1 text-xs font-black text-berry shadow">
                {s.chip}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="font-display text-2xl font-black">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-choco/70">{s.text}</p>
              <span className="mt-4 inline-block self-start rounded-full bg-gradient-to-br from-berry to-strawberry px-6 py-2.5 text-sm font-bold text-white transition group-hover:brightness-110">
                Enter studio →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
