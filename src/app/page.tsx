import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import FoodImage from "@/components/FoodImage";
import { PRODUCTS, productById } from "@/lib/catalog";
import { IMAGES } from "@/lib/images";

const MARQUEE = [
  "Baked fresh every morning",
  "No sodas, ever",
  "Made in Lagos",
  "Real fruit, always",
  "Custom builders",
  "Party boxes",
];

const STEPS = [
  { n: "01", title: "Find your craving", text: "Start with something ready-made, or walk straight into a builder and start from nothing." },
  { n: "02", title: "Make it yours", text: "Shapes, sponges, glazes, fruits, toppings. Mix freely — there are no wrong answers here." },
  { n: "03", title: "Watch it happen", text: "Every tap redraws your creation live. What you see is exactly what lands on your table." },
  { n: "04", title: "Lock it in", text: "Add to cart, change your mind as often as you like, and check out in a couple of minutes." },
];

const BUILDERS = [
  {
    href: "/build/cake",
    title: "Cake Builder",
    text: "Shape, size, sponge, filling, frosting, toppings — and the exact words you want piped on top.",
    image: IMAGES.vanillaParty,
  },
  {
    href: "/build/donuts",
    title: "Donut Box Builder",
    text: "Choose the box, fill every slot with a different mood, then glaze and top the whole thing.",
    image: IMAGES.glazedBox,
  },
  {
    href: "/build/smoothie",
    title: "Smoothie Builder",
    text: "Pick your base, drop in real fruit, add extras — and watch the colour blend as you go.",
    image: IMAGES.strawberryFields,
  },
];

const QUOTES = [
  { q: "I designed my daughter's cake on a bus, half asleep, and it arrived looking exactly like the preview. I was not bracing for disappointment and I did not get any.", name: "Adaeze O. · Lekki" },
  { q: "Ordered a Pink Parade box for my son's birthday. The box was gone in eleven minutes. Eleven. I am already planning the next one.", name: "Mrs. Balogun · Ikeja" },
  { q: "Finally, mango juice that actually tastes like mango. My fridge has two bottles in it permanently now, and I regret nothing.", name: "Tunde A. · Yaba" },
];

function bestseller(id: string) {
  const p = productById(id);
  if (!p) throw new Error(`Missing product ${id}`);
  return p;
}

export default function HomePage() {
  const bestsellers = [
    bestseller("midnight-choco-fudge"),
    bestseller("pink-parade-6"),
    bestseller("strawberry-bliss"),
    bestseller("red-velvet-cups"),
  ];
  const juices = PRODUCTS.filter((p) => p.category === "juices");

  return (
    <>
      <HeroSection />

      {/* Marquee */}
      <div className="overflow-hidden border-y-2 border-choco bg-choco py-3" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-8 font-display text-sm font-bold uppercase tracking-[0.2em] text-cream">
              {m} <span className="text-honey">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Shop by craving */}
      <Reveal as="section" className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="cravings-heading">
        <SectionHeading
          id="cravings-heading"
          eyebrow="Follow your craving"
          title="What are you in the mood for?"
          blurb="Three doors, one oven. Pick whichever one is calling your name — you can always change your mind afterwards."
          linkHref="/shop"
          linkLabel="See everything we make"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { href: "/cakes", name: "Cakes", text: "Ready-made or built by you", image: IMAGES.chocoFudge, bg: "bg-sand" },
            { href: "/donuts", name: "Donuts", text: "Singles, and boxes for crowds", image: IMAGES.pinkParade, bg: "bg-butter/40" },
            { href: "/smoothies", name: "Cold sips", text: "Smoothies and fresh juice", image: IMAGES.berryMedley, bg: "bg-mint/60" },
          ].map((c, i) => (
            <Reveal key={c.href} delay={i * 90}>
              <Link
                href={c.href}
                className={`group relative block overflow-hidden rounded-3xl ${c.bg} p-2 ring-1 ring-inset ring-choco/10 transition-transform hover:-translate-y-1`}
              >
                <div className="overflow-hidden rounded-[1.3rem]">
                  <FoodImage
                    id={c.image.id}
                    alt={c.image.alt}
                    width={700}
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-3">
                  <div>
                    <h3 className="font-display text-2xl font-black">
                      {c.name}
                    </h3>
                    <p className="text-sm font-semibold text-choco/70">{c.text}</p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-choco text-xl text-cream transition group-hover:bg-ember" aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* Bestsellers */}
      <Reveal as="section" className="bg-milk py-12" aria-labelledby="best">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div id="best">
            <SectionHeading
              eyebrow="Loved in Lagos"
              title="The ones that keep selling out"
              linkHref="/shop"
              linkLabel="See the full menu"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* Builders promo */}
      <Reveal as="section" className="mx-auto max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="build-promo">
        <div className="relative overflow-hidden rounded-[2rem] bg-cocoa p-6 text-cream ring-1 ring-inset ring-cream/10 sm:p-10">
          <div className="relative">
          <p className="text-label uppercase text-honey">The signature experience</p>
          <h2 id="build-promo" className="mt-2 max-w-xl font-display text-heading sm:text-display">
            Don&apos;t just pick a dessert. <span className="text-ember">Design one.</span>
          </h2>
          <p className="mt-3 max-w-xl text-cream/75">
            Three studios, no rigid menus, no wrong answers. Try a flavour, watch
            it change the preview, keep going until it looks like something only
            you would order — then we&apos;ll bake exactly that.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {BUILDERS.map((b) => (
              <Link
                key={b.href}
                href={b.href}
                className="group overflow-hidden rounded-3xl bg-cream text-choco transition-transform hover:-translate-y-1"
              >
                <div className="overflow-hidden">
                  <FoodImage
                    id={b.image.id}
                    alt={b.image.alt}
                    width={600}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-black">{b.title}</h3>
                  <p className="mt-1 text-sm text-choco/70">{b.text}</p>
                  <span className="mt-3 inline-block rounded-full bg-ember px-5 py-2 text-sm font-bold text-white transition group-hover:bg-ember-deep">
                    Start creating →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          </div>
        </div>
      </Reveal>

      {/* Juices */}
      <Reveal as="section" className="bg-mint/40 py-12" aria-labelledby="juices">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Pressed, never fizzy"
            title="Natural juices"
            blurb="Squeezed to order from real fruit, right in front of you. No concentrates, no added sugar, and not a single soda on this menu."
            linkHref="/smoothies"
            linkLabel="See every sip"
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {juices.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* How it works */}
      <Reveal as="section" className="mx-auto max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="how">
        <SectionHeading eyebrow="Simple by design" title="Four steps, then it&apos;s yours" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 80}>
              <div className="h-full rounded-3xl border-2 border-choco/10 bg-milk p-5">
                <p className="font-display text-display text-ember">{s.n}</p>
                <h3 className="mt-2 font-display text-xl font-black">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-choco/70">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <h2 id="how" className="sr-only">How it works</h2>
      </Reveal>

      {/* Testimonials */}
      <Reveal as="section" className="bg-sand/60 py-12" aria-labelledby="love">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="Sweet words" title="What Lagos is saying about us" />
          <h2 id="love" className="sr-only">Customer reviews</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {QUOTES.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <figure className="h-full rounded-3xl bg-milk p-6 shadow-[0_2px_16px_rgba(43,28,21,0.07)]">
                  <div className="text-ember" aria-label="5 out of 5 stars">★★★★★</div>
                  <blockquote className="mt-2 text-[15px] font-medium leading-relaxed">“{t.q}”</blockquote>
                  <figcaption className="mt-3 text-sm font-bold text-choco/70">{t.name}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Final CTA */}
      <Reveal as="section" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-cocoa p-8 text-center text-white ring-1 ring-inset ring-cream/10 sm:p-14">
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-heading sm:text-display">
              The sweetest thing you&apos;ll do this week
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/90">
              Shape it, flavour it, write the words you mean on top of it. Two
              minutes of building, and a table full of people who absolutely
              noticed.
            </p>
            <Link
              href="/build/cake"
              className="mt-6 inline-block min-h-[52px] rounded-full bg-ember px-10 py-3.5 font-display text-lg font-black text-white transition hover:bg-ember-deep active:scale-95"
            >
              Start Your Cake
            </Link>
          </div>
        </div>
      </Reveal>
    </>
  );
}
