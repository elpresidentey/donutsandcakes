"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/cakes", label: "Cakes" },
  { href: "/donuts", label: "Donuts" },
  { href: "/smoothies", label: "Smoothies" },
  { href: "/build", label: "Build" },
];

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="26" r="16" fill="#f7c873" />
      <circle cx="24" cy="26" r="16" fill="none" stroke="#3e2a20" strokeWidth="2.5" />
      <path
        d="M12 22c2-7 8-10 12-10s10 3 12 10v6c-1.5 1.3-3.3 2-5 2-3.5 0-3.5-3-7-3s-3.5 3-7 3c-1.7 0-3.5-.7-5-2z"
        fill="#b04a76"
        stroke="#3e2a20"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="26" r="5.5" fill="#fff9f1" stroke="#3e2a20" strokeWidth="2.5" />
      <circle cx="17" cy="20" r="1.6" fill="#fff" />
      <circle cx="31" cy="18" r="1.6" fill="#ffe1a8" />
      <circle cx="33" cy="27" r="1.6" fill="#c9e7ff" />
      <circle cx="20" cy="32" r="1.6" fill="#bfebce" />
      <circle cx="27" cy="33" r="1.6" fill="#dcd2ff" />
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [toast, setToast] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // Reading progress + a "has left the top" flag, both driven from a single
  // rAF-throttled scroll listener so the bar never causes layout thrash.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${pct})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onAdd = (e: Event) => {
      const name = (e as CustomEvent<{ name: string }>).detail?.name ?? "Treat";
      setToast(name);
      clearTimeout(t);
      t = setTimeout(() => setToast(null), 2200);
    };
    window.addEventListener("dc:cart-add", onAdd);
    return () => {
      window.removeEventListener("dc:cart-add", onAdd);
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-300",
          scrolled
            ? "border-choco/10 bg-cream/90 shadow-[0_6px_20px_rgba(62,42,32,0.07)]"
            : "border-transparent bg-cream/80"
        )}
      >
        {/* Reading-progress hairline, driven by transform only */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-strawberry/70"
        >
          <div
            ref={progressRef}
            className="h-full w-full origin-left scale-x-0 bg-strawberry"
          />
        </div>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex min-h-[44px] items-center gap-2" aria-label="Donuts and Cakes — home">
            <LogoMark className="h-9 w-9 animate-wiggle" />
            <span className="font-display text-xl font-black tracking-tight">
              Donuts<span className="text-berry">&</span>Cakes
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {LINKS.map((l) => {
              // `aria-current="page"` tells a screen-reader user which section
              // they are already in — the active pill colour alone says nothing
              // to anyone who cannot see it.
              const current =
                pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "flex min-h-[44px] items-center rounded-full px-4 text-[15px] font-bold transition",
                    current ? "bg-choco text-cream" : "text-choco hover:bg-blush"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/cart"
            className="relative flex min-h-[44px] items-center gap-2 rounded-full bg-choco px-4 py-2 text-sm font-bold text-cream transition hover:bg-cocoa active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round" />
              <path d="M6 6 5 3H2" strokeLinecap="round" />
              <circle cx="9" cy="20" r="1.6" fill="currentColor" />
              <circle cx="17" cy="20" r="1.6" fill="currentColor" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {/* The visible badge is decorative; the count is exposed as text so it
                is part of the link's accessible name, and the separate live region
                below announces changes as they happen. */}
            <span className="sr-only">, {count} {count === 1 ? "item" : "items"}</span>
            {count > 0 && (
              <span
                key={count}
                aria-hidden="true"
                className="absolute -right-1 -top-1 flex h-6 min-w-6 animate-pop items-center justify-center rounded-full bg-gradient-to-br from-berry to-strawberry px-1.5 text-xs font-black text-white"
              >
                {count}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* One live region for the whole header, not two. Previously the cart count
          and the add-to-cart toast each had their own `aria-live`, so a single
          quick-add made a screen reader talk over itself. The toast is merged in
          here and rendered as an ordinary visible element. */}
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {toast
          ? `${toast} added to your cart. ${count} ${count === 1 ? "item" : "items"} total.`
          : `${count} ${count === 1 ? "item" : "items"} in your cart.`}
      </p>

      {/* Added-to-cart toast. Visual only — the announcement above is the single
          source of truth for assistive tech, so this must not be a live region
          itself or the message would be read twice. */}
      <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4">
        {toast && (
          <p className="pointer-events-auto flex animate-pop items-center gap-2 rounded-full bg-cocoa px-5 py-3 text-sm font-bold text-cream shadow-xl">
            <span aria-hidden className="text-mint">✓</span> {toast} added to cart
          </p>
        )}
      </div>
    </>
  );
}
