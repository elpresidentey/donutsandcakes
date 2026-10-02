import Link from "next/link";
import { LogoMark } from "./SiteHeader";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t-4 border-ember bg-cocoa text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <LogoMark className="h-10 w-10" />
            <p className="font-display text-2xl font-black">
              Donuts<span className="text-honey">&</span>Cakes
            </p>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/75">
            A Nigerian dessert studio built on one belief: you should never have
            to choose between what looks good and what tastes good. Design every
            cake, box and blend yourself — we&apos;ll make it exactly as you
            pictured it, fresh in Lagos.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2 text-xs font-bold text-cream/90 transition hover:bg-cream/20"
          >
            <span aria-hidden>🛵</span> Delivering across Lagos · Tue–Sun, 9am–8pm
            <span aria-hidden>→</span>
          </Link>
        </div>

        <nav aria-label="Shop links">
          <h2 className="text-label uppercase text-honey">Shop</h2>
          <ul className="mt-3 space-y-1 text-sm font-semibold">
            <li><Link className="inline-flex min-h-[32px] items-center hover:text-honey" href="/cakes">Cakes</Link></li>
            <li><Link className="inline-flex min-h-[32px] items-center hover:text-honey" href="/donuts">Donuts</Link></li>
            <li><Link className="inline-flex min-h-[32px] items-center hover:text-honey" href="/smoothies">Smoothies &amp; Juices</Link></li>
            <li><Link className="inline-flex min-h-[32px] items-center hover:text-honey" href="/shop">Everything</Link></li>
            <li><Link className="inline-flex min-h-[32px] items-center hover:text-honey" href="/orders">Your orders</Link></li>
            <li><Link className="inline-flex min-h-[32px] items-center hover:text-honey" href="/contact">Contact us</Link></li>
          </ul>
        </nav>

        <nav aria-label="Build links">
          <h2 className="text-label uppercase text-honey">Build</h2>
          <ul className="mt-3 space-y-1 text-sm font-semibold">
            <li><Link className="inline-flex min-h-[32px] items-center hover:text-honey" href="/build/cake">Cake builder</Link></li>
            <li><Link className="inline-flex min-h-[32px] items-center hover:text-honey" href="/build/donuts">Donut box builder</Link></li>
            <li><Link className="inline-flex min-h-[32px] items-center hover:text-honey" href="/build/smoothie">Smoothie builder</Link></li>
            <li><Link className="inline-flex min-h-[32px] items-center hover:text-honey" href="/cart">Your cart</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-cream/60 sm:flex-row sm:px-6">
          <p>© 2026 Donuts & Cakes · Lagos, Nigeria</p>
          <p>No sodas. Ever. 🍩</p>
        </div>
      </div>
    </footer>
  );
}
