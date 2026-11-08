"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const TABS = [
  {
    href: "/",
    label: "Home",
    icon: (
      <path d="M3 11.5 12 4l9 7.5M5.5 10.5V20h13v-9.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    href: "/shop",
    label: "Shop",
    icon: (
      <path d="M4 9.5 5.5 20h13L20 9.5M4 9.5h16M4 9.5 6 4h12l2 5.5M9.5 12.5h5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    href: "/build",
    label: "Build",
    icon: (
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" strokeLinecap="round" />
    ),
  },
  {
    href: "/cart",
    label: "Cart",
    icon: (
      <path d="M6 6h15l-1.5 9h-12zM6 6 5 3H2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Handle swipe to dismiss (swipe down on nav)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const deltaY = e.touches[0].clientY - touchStart;
    // If swiping down more than 50px, could dismiss - but nav is fixed bottom
    // This is more for future enhancement
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-choco/10 bg-milk/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ul className="grid grid-cols-4" role="tablist">
        {TABS.map((t) => {
          const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <li key={t.href} role="presentation">
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                role="tab"
                aria-selected={active}
                className={cn(
                  "relative flex min-h-[64px] flex-col items-center justify-center gap-1 text-[11px] font-bold",
                  active ? "text-ember" : "text-choco/70",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-milk"
                )}
                onTouchStart={() => {}} // Prevents 300ms click delay on some mobile browsers
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  {t.icon}
                </svg>
                {t.label}
                {/* Badge is decorative; the count is exposed as text so it becomes
                    part of the link's accessible name rather than a stray number. */}
                {t.href === "/cart" && count > 0 && (
                  <span className="sr-only">, {count} {count === 1 ? "item" : "items"}</span>
                )}
                {t.href === "/cart" && count > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-1/2 top-1 flex h-5 min-w-5 translate-x-5 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-black text-white animate-pop"
                  >
                    {count}
                  </span>
                )}
                {active && <span aria-hidden className="absolute bottom-1 h-1 w-8 rounded-full bg-ember" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
