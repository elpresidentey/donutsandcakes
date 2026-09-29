"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/store/cart";
import { ngn } from "@/lib/format";
import { cn } from "@/lib/utils";

type Stage = "form" | "done";

export default function CheckoutPage() {
  const { items, subtotal, clear, hydrated } = useCart();
  const [stage, setStage] = useState<Stage>("form");
  const [orderNo, setOrderNo] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  /** Which field the current error belongs to, so it can be tied to that input. */
  const [errorField, setErrorField] = useState<
    "name" | "phone" | "address" | "date" | null
  >(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);
  const firstInvalidRef = useRef<string>("co-name");

  const fail = (field: typeof errorField, message: string) => {
    setError(message);
    setErrorField(field);
    firstInvalidRef.current = field === "name" ? "co-name" : `co-${field}`;
  };

  const hasCustomCake = items.some((it) => it.kind === "cake");
  const leadDays = hasCustomCake ? 2 : 1;

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + leadDays);
    return d.toISOString().slice(0, 10);
  }, [leadDays]);

  // Move focus to the message and then the offending input, so a screen-reader
  // user is told what went wrong and lands exactly where to fix it.
  useEffect(() => {
    if (!error) return;
    errorRef.current?.focus();
    const el = document.getElementById(firstInvalidRef.current);
    if (el) el.focus();
  }, [error]);

  const doneRef = useRef<HTMLHeadingElement | null>(null);

  // When the order is confirmed the form is replaced entirely, so focus would
  // otherwise be dropped to <body> and a screen reader would read nothing.
  useEffect(() => {
    if (stage === "done") doneRef.current?.focus();
  }, [stage]);

  // The cart lives in localStorage, so pre-hydration `items` is empty. Showing
  // "nothing to check out" for a frame would be a false negative.
  if (!hydrated && stage === "form") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <p className="font-display text-2xl font-black text-choco/70">
          Getting your order ready…
        </p>
      </div>
    );
  }

  if (items.length === 0 && stage === "form") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-display">Your cart is empty</h1>
        <p className="mx-auto mt-2 max-w-md text-choco/70">
          There&apos;s nothing to check out yet — which means the fun part is
          still ahead of you.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/build"
            className="min-h-[52px] rounded-full bg-ember px-8 py-3 font-display text-lg font-black text-white transition hover:bg-ember-deep"
          >
            Build something
          </Link>
          <Link
            href="/shop"
            className="min-h-[52px] rounded-full border-2 border-choco/20 px-8 py-3 font-display text-lg font-black transition hover:border-choco"
          >
            See what&apos;s cooking
          </Link>
        </div>
      </div>
    );
  }

  const placeOrder = () => {
    if (name.trim().length < 2)
      return fail("name", "Please tell us your name so we know who to call.");
    if (phone.replace(/\D/g, "").length < 7)
      return fail(
        "phone",
        "Please add a phone number we can reach you on — WhatsApp is perfect."
      );
    if (mode === "delivery" && address.trim().length < 5)
      return fail(
        "address",
        "Please add a delivery address — street, area and a landmark helps our rider."
      );
    if (!date) return fail("date", "Please pick the day you'd like this delivered.");
    if (date < minDate)
      return fail(
        "date",
        hasCustomCake
          ? "Custom cakes are baked to order and need 48 hours — please choose a slightly later date."
          : "We bake fresh each morning, so please choose tomorrow or later."
      );
    setError("");
    setErrorField(null);

    const no = `DC-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    try {
      const orders = JSON.parse(window.localStorage.getItem("dc-orders-v1") ?? "[]");
      orders.push({
        no,
        at: new Date().toISOString(),
        name,
        phone,
        mode,
        address,
        date,
        notes,
        items,
        subtotal,
      });
      window.localStorage.setItem("dc-orders-v1", JSON.stringify(orders));
    } catch {
      setError(
        "We couldn't save your order on this device (storage is blocked). Please try again, or message us on WhatsApp so we don't miss your order."
      );
      return;
    }
    setOrderNo(no);
    setStage("done");
    clear();
    window.scrollTo({ top: 0 });
  };

  if (stage === "done") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="mx-auto flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-mint text-4xl" aria-hidden="true">
          ✓
        </p>
        <h1 ref={doneRef} tabIndex={-1} className="mt-4 font-display text-display outline-none">
          It&apos;s ours now — thank you
        </h1>
        <p className="mt-2 font-bold text-ember-deep">Order {orderNo}</p>
        <p className="mx-auto mt-3 max-w-md text-choco/70">
          Thank you, {name.split(" ")[0] || "friend"}! We&apos;ll call{" "}
          <strong>{phone}</strong> shortly to confirm{" "}
          {mode === "delivery" ? `delivery to ${address}` : "your pickup"} for{" "}
          <strong>{date}</strong>. Nothing to pay right now — we settle it on that
          call, and we&apos;ll confirm the exact figure before it leaves our
          kitchen.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/build"
            className="min-h-[52px] rounded-full bg-ember px-8 py-3 font-display text-lg font-black text-white transition hover:bg-ember-deep active:scale-95"
          >
            Build another
          </Link>
          <Link
            href="/"
            className="min-h-[52px] rounded-full border-2 border-choco/20 px-8 py-3 font-display text-lg font-black transition hover:border-choco active:scale-95"
          >
            Back to the start
          </Link>
        </div>
      </div>
    );
  }

  const inputCls =
    "min-h-[52px] w-full rounded-2xl border-2 border-choco/15 bg-milk px-4 font-semibold placeholder:font-medium placeholder:text-choco/70 focus:border-ember-deep";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-label uppercase text-ember">The last step</p>
      <h1 className="mt-1 font-display text-display">Let&apos;s get it to you</h1>
      <p className="mt-2 max-w-lg text-choco/70">
        Tell us where it&apos;s going and when. We&apos;ll call to confirm the
        details and the final price before anything leaves the kitchen.
      </p>

      <div className="mt-6 grid items-start gap-5 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <form
          className="flex flex-col gap-4 rounded-3xl bg-milk p-5 shadow-[0_2px_16px_rgba(43,28,21,0.07)] sm:p-6"
          // noValidate: the `required` attributes below are still exposed to
          // assistive tech, but the browser's native bubble is suppressed so the
          // styled, field-linked `co-error` message is what actually gets shown.
          // Without this the browser intercepts submit and our validation — and
          // its focus management — never runs.
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            placeOrder();
          }}
        >
          <div>
            <label htmlFor="co-name" className="mb-1 block text-sm font-black">Your name</label>
            <input
              id="co-name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => { setName(e.target.value); if (errorField === "name") setError(""); }}
              placeholder="Adaeze Okafor"
              aria-invalid={errorField === "name"}
              aria-describedby={errorField === "name" ? "co-error" : undefined}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="co-phone" className="mb-1 block text-sm font-black">Phone / WhatsApp</label>
            <input
              id="co-phone"
              autoComplete="tel"
              inputMode="tel"
              required
              value={phone}
              onChange={(e) => { setPhone(e.target.value); if (errorField === "phone") setError(""); }}
              placeholder="0803 000 0000"
              aria-invalid={errorField === "phone"}
              aria-describedby={errorField === "phone" ? "co-error" : undefined}
              className={inputCls}
            />
          </div>

          <fieldset>
            <legend className="mb-1 text-sm font-black">Pickup or delivery?</legend>
            <div
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Fulfilment method"
              // Roving tabindex + arrow keys, matching the builder's radio groups.
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                e.preventDefault();
                setMode((p) => (p === "delivery" ? "pickup" : "delivery"));
              }}
            >
              {(["delivery", "pickup"] as const).map((m, i) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  tabIndex={mode === m ? 0 : -1}
                  onClick={() => setMode(m)}
                  className={cn(
                    "min-h-[52px] rounded-2xl border-2 text-sm font-bold capitalize transition active:scale-[0.98]",
                    mode === m ? "border-ember bg-ember/10" : "border-choco/15 hover:border-choco/40"
                  )}
                >
                  <span aria-hidden className="mr-1.5">{i === 0 ? "🛵" : "🏪"}</span>
                  {m === "delivery" ? "Delivery" : "Pickup"}
                </button>
              ))}
            </div>
          </fieldset>

          {mode === "delivery" && (
            <div>
              <label htmlFor="co-address" className="mb-1 block text-sm font-black">Delivery address</label>
              <textarea
                id="co-address"
                autoComplete="street-address"
                required
                value={address}
                onChange={(e) => { setAddress(e.target.value); if (errorField === "address") setError(""); }}
                placeholder="Street, area, Lagos + landmark"
                rows={2}
                aria-invalid={errorField === "address"}
                aria-describedby={errorField === "address" ? "co-error" : undefined}
                className={cn(inputCls, "py-3")}
              />
            </div>
          )}

          <div>
            <label htmlFor="co-date" className="mb-1 block text-sm font-black">
              Preferred date{" "}
              <span className="font-semibold text-choco/70">
                ({hasCustomCake ? "custom cakes are baked to order, so 48 hours" : "earliest is tomorrow"})
              </span>
            </label>
            <input
              id="co-date"
              type="date"
              min={minDate}
              required
              value={date}
              onChange={(e) => { setDate(e.target.value); if (errorField === "date") setError(""); }}
              aria-invalid={errorField === "date"}
              aria-describedby={errorField === "date" ? "co-error" : undefined}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="co-notes" className="mb-1 block text-sm font-black">Anything we should know? <span className="font-semibold text-choco/70">(optional)</span></label>
            <textarea id="co-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, a gift message, a party theme…" rows={2} className={cn(inputCls, "py-3")} />
          </div>

          {error && (
            <p
              id="co-error"
              ref={errorRef}
              tabIndex={-1}
              role="alert"
              className="rounded-2xl bg-ember/10 px-4 py-3 text-sm font-bold text-ember-deep ring-1 ring-inset ring-ember/30"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="min-h-[56px] rounded-full bg-ember font-display text-lg font-black text-white transition hover:bg-ember-deep active:scale-95"
          >
            Place order · {ngn(subtotal)}
          </button>
          <p className="text-center text-xs font-semibold text-choco/70">
            No payment now — we confirm every order by phone first.
          </p>
        </form>

        <aside className="rounded-3xl bg-choco p-5 text-cream sm:p-6" aria-label="Order summary">
          <h2 className="font-display text-xl font-black">What you&apos;re getting</h2>
          <ul className="mt-3 space-y-3">
            {items.map((it) => (
              <li key={it.key} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-bold">
                    <span className="sr-only">Quantity {it.qty}: </span>
                    <span aria-hidden>{it.qty}× </span>
                    {it.name}
                  </p>
                  <p className="text-xs text-cream/60">{it.details.join(" · ")}</p>
                </div>
                <p className="shrink-0 font-bold">{ngn(it.unitPrice * it.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-cream/15 pt-4">
            <p className="font-bold text-cream/70">Total</p>
            <p className="font-display text-2xl font-black">{ngn(subtotal)}</p>
          </div>
          <p className="mt-3 text-xs text-cream/60">
            Delivery is free over ₦50,000. Otherwise we&apos;ll quote you the exact
            fee on the confirmation call — never a surprise.
          </p>
        </aside>
      </div>
    </div>
  );
}
