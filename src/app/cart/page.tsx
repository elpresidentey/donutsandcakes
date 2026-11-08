"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useCart } from "@/store/cart";
import { ngn } from "@/lib/format";
import FoodImage from "@/components/FoodImage";
import { LogoMark } from "@/components/SiteHeader";
import { cn } from "@/lib/utils";
import { useStaggeredEntrance } from "@/components/animations";

const KIND_LABEL: Record<string, string> = {
  ready: "Ready-made",
  cake: "Custom cake",
  donut: "Custom donut box",
  smoothie: "Custom blend",
};

const KIND_ICON: Record<string, string> = {
  cake: "bg-sand",
  donut: "bg-butter/40",
  smoothie: "bg-mint/60",
};

export default function CartPage() {
  const { items, subtotal, setQty, removeItem, hydrated, count } = useCart();
  const visibleItems = useStaggeredEntrance(items.length, 80);

  // Removing a row deletes the button that was just pressed, so focus would fall
  // to <body> and a keyboard user would lose their place entirely. Track the
  // removal and move focus to the next row's control instead.
  const listRef = useRef<HTMLUListElement | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const pendingFocus = useRef(false);
  const [showFlyout, setShowFlyout] = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    // Removing the last item swaps the entire page for the empty-cart screen, so
    // `listRef.current` is null by the time this runs. Fall back to a document
    // query, which still resolves after that swap.
    const next =
      listRef.current?.querySelector<HTMLElement>("[data-row-control]") ??
      document.querySelector<HTMLElement>("[data-cart-cta]");
    next?.focus();
  }, [items.length]);

  const handleRemove = useCallback((key: string, name: string) => {
    pendingFocus.current = true;
    removeItem(key);
    setAnnouncement(`${name} removed from your cart.`);
  }, [removeItem]);

  // Close flyout when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setShowFlyout(false);
      }
    };
    if (showFlyout) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFlyout]);

  // The cart is persisted in localStorage, so before hydration `items` is
  // legitimately empty. Rendering the "empty cart" screen during that window
  // flashed a false "nothing here yet" message at every returning customer.
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <LogoMark className="mx-auto h-16 w-16 opacity-40" />
        <p className="mt-4 font-display text-2xl font-black text-choco/70">
          Warming up the counter…
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <LogoMark className="mx-auto h-20 w-20 opacity-60" />
        <h1 className="mt-4 font-display text-display">Your cart is waiting</h1>
        <p className="mx-auto mt-2 max-w-md text-choco/70">
          Nothing in here yet — and that is genuinely fine. The moment you find
          the thing you&apos;re craving, this is where it lands.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/build"
            data-cart-cta
            className="min-h-[52px] rounded-full bg-ember px-8 py-3 font-display text-lg font-black text-white transition hover:bg-ember-deep active:scale-95"
          >
            Build me something
          </Link>
          <Link
            href="/shop"
            className="min-h-[52px] rounded-full border-2 border-choco/20 px-8 py-3 font-display text-lg font-black transition hover:border-choco active:scale-95"
          >
            See what&apos;s cooking
          </Link>
        </div>
      </div>
    );
  }

  const itemCount = items.reduce((n, i) => n + i.qty, 0);
  // A free-delivery threshold gives the subtotal a reason to exist beyond a bare
  // number, and stating it plainly means nobody has to guess.
  const FREE_DELIVERY_AT = 50000;
  const toFreeDelivery = Math.max(0, FREE_DELIVERY_AT - subtotal);
  const deliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_AT) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/* Cart flyout trigger for mobile - shows when user adds item */}
      {count > 0 && (
        <button
          type="button"
          onClick={() => setShowFlyout(true)}
          className={cn(
            "fixed bottom-24 right-4 z-50 min-h-[52px] rounded-full bg-ember px-5 py-2.5 font-display text-sm font-black text-white shadow-xl transition transform hover:scale-105 active:scale-95 md:hidden",
            showFlyout && "opacity-0 pointer-events-none"
          )}
          aria-label={`View cart: ${count} ${count === 1 ? "item" : "items"}`}
        >
          🛒 Cart ({count}) — Tap to view
        </button>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-label uppercase text-ember">
            {itemCount} {itemCount === 1 ? "treat" : "treats"}, all yours
          </p>
          <h1 className="mt-1 font-display text-display">
            Your cart
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-choco/70 hidden sm:block">
            Subtotal: {ngn(subtotal)}
          </span>
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-4" ref={listRef}>
        {items.map((item, index) => (
          <li
            key={item.key}
            className={cn(
              "flex gap-4 rounded-3xl bg-milk p-4 shadow-[0_2px_16px_rgba(43,28,21,0.07)]",
              visibleItems.has(index) && "animate-fade-up"
            )}
          >
            {item.imageId ? (
              <FoodImage
                id={item.imageId}
                alt={item.imageAlt ?? item.name}
                width={400}
                className="h-24 w-24 shrink-0 rounded-2xl object-cover sm:h-28 sm:w-28"
              />
            ) : (
              <div
                aria-hidden
                className={cn("flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl", KIND_ICON[item.kind] ?? "bg-sand")}
              >
                <span className="font-display text-display text-choco/60">
                  {item.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="min-w-0 flex-1">
              {/* BUG FIX: this read `uppercasest`, an invalid Tailwind class, so the
                  kind label rendered unstyled in sentence case. */}
              <p className="text-label uppercase text-ember">
                {KIND_LABEL[item.kind] ?? item.kind}
              </p>
              <h2 className="font-display text-lg font-black leading-snug">{item.name}</h2>
              <ul className="mt-1 space-y-0.5">
                {item.details.map((d) => (
                  <li key={d} className="truncate text-xs font-semibold text-choco/70">
                    {d}
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="flex items-center rounded-full border-2 border-choco/15" role="group" aria-label={`Quantity for ${item.name}`}>
                  <button
                    type="button"
                    onClick={() => setQty(item.key, item.qty - 1)}
                    disabled={item.qty <= 1}
                    data-row-control
                    className="flex h-10 w-10 items-center justify-center text-xl font-black hover:text-ember disabled:cursor-not-allowed disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-milk"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-black" aria-live="polite">
                    <span className="sr-only">{item.name} quantity: </span>
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(item.key, item.qty + 1)}
                    className="flex h-10 w-10 items-center justify-center text-xl font-black hover:text-ember focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-milk"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
                {item.editPath && (
                  <Link
                    href={`${item.editPath}?edit=${item.key}`}
                    className="flex min-h-[40px] items-center rounded-full bg-sand px-4 text-xs font-bold transition hover:bg-butter/60 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-milk"
                    aria-label={`Edit ${item.name}`}
                  >
                    ✎ Tweak it
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(item.key, item.name)}
                  className="flex min-h-[40px] items-center rounded-full px-3 text-xs font-bold text-ember transition hover:bg-ember/10 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-milk"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
                <p className="ml-auto font-display text-lg font-black text-ember-deep">
                  <span className="sr-only">Line total for {item.name}: </span>
                  {ngn(item.unitPrice * item.qty)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-3xl bg-choco p-6 text-cream">
        <div className="flex items-center justify-between">
          <p className="font-bold text-cream/70">Subtotal</p>
          <p className="font-display text-3xl font-black" aria-live="polite">{ngn(subtotal)}</p>
        </div>
        {/* Progress toward free delivery — motivating, and genuinely useful. */}
        <div className="mt-4 rounded-2xl bg-cream/10 p-4">
          {toFreeDelivery === 0 ? (
            <p className="text-sm font-bold text-mint">
              🎉 Free delivery unlocked across Nigeria. That one&apos;s on us.
            </p>
          ) : (
            <>
              <p className="text-sm font-bold text-cream/90">
                Add {ngn(toFreeDelivery)} more and delivery is on us.
              </p>
              <div
                role="progressbar"
                aria-valuenow={Math.round(deliveryProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progress toward free delivery"
                className="mt-2 h-2.5 overflow-hidden rounded-full bg-cocoa/40"
              >
                <div
                  className="h-full rounded-full bg-mint transition-[width] duration-500"
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </>
          )}
        </div>

        <p className="mt-3 text-xs text-cream/60">
          Delivery is confirmed with you before we bake — no surprises, ever.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/checkout"
            data-cart-cta
            className="min-h-[52px] flex-1 rounded-full bg-ember py-3 text-center font-display text-lg font-black text-white transition hover:bg-ember-deep active:scale-95 focus:outline-none focus-visible:ring-3 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa"
          >
            Lock it in →
          </Link>
          <Link
            href="/shop"
            className="min-h-[52px] rounded-full border-2 border-cream/25 px-6 py-3 text-center font-bold transition hover:border-cream active:scale-95 focus:outline-none focus-visible:ring-3 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa"
          >
            Keep browsing
          </Link>
        </div>
      </div>

      {/* Cart flyout for mobile */}
      {showFlyout && (
        <div
          ref={flyoutRef}
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-label="Cart preview"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-cocoa/50 backdrop-blur-sm" onClick={() => setShowFlyout(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-milk rounded-t-3xl shadow-2xl overflow-y-auto animate-fade-up">
            <div className="p-4 border-b border-choco/10 flex items-center justify-between">
              <h2 className="font-display text-xl font-black">Your Cart ({itemCount})</h2>
              <button
                type="button"
                onClick={() => setShowFlyout(false)}
                className="p-2 rounded-full text-choco/70 hover:bg-choco/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                aria-label="Close cart preview"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
              {items.slice(0, 5).map((item) => (
                <div key={item.key} className="flex gap-3 rounded-2xl bg-cream p-3">
                  {item.imageId ? (
                    <FoodImage
                      id={item.imageId}
                      alt={item.imageAlt ?? item.name}
                      width={200}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-xl", KIND_ICON[item.kind] ?? "bg-sand")}
                    >
                      <span className="font-display text-xl text-choco/60">{item.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-label uppercase text-ember text-[10px]">{KIND_LABEL[item.kind] ?? item.kind}</p>
                    <h3 className="font-bold text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-choco/70">{item.details.join(" · ")}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-display text-sm font-black text-ember-deep">{ngn(item.unitPrice * item.qty)}</span>
                      <span className="text-xs text-choco/50">×{item.qty}</span>
                    </div>
                  </div>
                </div>
              ))}
              {items.length > 5 && (
                <p className="text-center text-sm text-choco/70 py-2">+ {items.length - 5} more items…</p>
              )}
            </div>
            <div className="border-t border-choco/10 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-choco/70">Subtotal</span>
                <span className="font-display font-black text-ember-deep">{ngn(subtotal)}</span>
              </div>
              {toFreeDelivery > 0 && (
                <p className="text-xs text-mint text-center">Add {ngn(toFreeDelivery)} for free delivery 🎉</p>
              )}
              <div className="flex gap-2">
                <Link
                  href="/checkout"
                  onClick={() => setShowFlyout(false)}
                  className="flex-1 min-h-[52px] rounded-full bg-ember py-3 text-center font-display text-base font-black text-white transition hover:bg-ember-deep active:scale-95"
                >
                  Lock it in →
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setShowFlyout(false)}
                  className="flex-1 min-h-[52px] rounded-full border-2 border-choco/20 px-4 py-3 text-center font-bold transition hover:border-choco active:scale-95"
                >
                  Keep shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}