"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useCart } from "@/store/cart";
import { saveOrder } from "@/lib/orders";
import { whatsappLink, CONTACT } from "@/lib/contact";
import { ngn } from "@/lib/format";
import { cn } from "@/lib/utils";
import { WithCheckoutSkeleton } from "@/components/LoadingWrapper";

type Stage = "form" | "done";

interface ValidationError {
  field: "name" | "phone" | "address" | "date" | null;
  message: string;
}

interface FormField {
  value: string;
  error: string;
  touched: boolean;
  dirty: boolean;
}

export default function CheckoutPage() {
  const { items, subtotal, clear, hydrated } = useCart();
  const [stage, setStage] = useState<Stage>("form");
  const [orderNo, setOrderNo] = useState("");
  const [waHref, setWaHref] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form state with validation
  const [fields, setFields] = useState<Record<string, FormField>>({
    name: { value: "", error: "", touched: false, dirty: false },
    phone: { value: "", error: "", touched: false, dirty: false },
    address: { value: "", error: "", touched: false, dirty: false },
    date: { value: "", error: "", touched: false, dirty: false },
    notes: { value: "", error: "", touched: false, dirty: false },
  });

  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [submitError, setSubmitError] = useState("");
  const errorRef = useRef<HTMLParagraphElement | null>(null);
  const firstInvalidRef = useRef<string>("co-name");

  const hasCustomCake = items.some((it) => it.kind === "cake");
  const leadDays = hasCustomCake ? 2 : 1;

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + leadDays);
    return d.toISOString().slice(0, 10);
  }, [leadDays]);

  // Validate individual field
  const validateField = useCallback((name: string, value: string): string => {
    switch (name) {
      case "name":
        if (value.trim().length < 2) return "Please tell us your name so we know who to call.";
        break;
      case "phone":
        if (value.replace(/\D/g, "").length < 7)
          return "Please add a phone number we can reach you on — WhatsApp is perfect.";
        break;
      case "address":
        if (mode === "delivery" && value.trim().length < 5)
          return "Please add a delivery address — street, area and a landmark helps our rider.";
        break;
      case "date":
        if (!value) return "Please pick the day you'd like this delivered.";
        if (value < minDate)
          return hasCustomCake
            ? "Custom cakes are baked to order and need 48 hours — please choose a slightly later date."
            : "We bake fresh each morning, so please choose tomorrow or later.";
        break;
    }
    return "";
  }, [mode, minDate, hasCustomCake]);

  // Handle field change with real-time validation
  const handleChange = useCallback((name: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        dirty: true,
        error: prev[name].touched ? validateField(name, value) : prev[name].error,
      },
    }));
  }, [validateField]);

  // Handle field blur - mark as touched and validate
  const handleBlur = useCallback((name: string) => {
    setFields((prev) => {
      const error = validateField(name, prev[name].value);
      return {
        ...prev,
        [name]: { ...prev[name], touched: true, error },
      };
    });
  }, [validateField]);

  // Validate all fields on submit
  const validateAll = useCallback((): ValidationError => {
    const fieldNames = ["name", "phone", "address", "date"] as const;
    for (const fieldName of fieldNames) {
      const error = validateField(fieldName, fields[fieldName].value);
      if (error) {
        // Mark all fields as touched
        setFields((prev) => {
          const updated = { ...prev };
          fieldNames.forEach((fn) => {
            updated[fn] = { ...updated[fn], touched: true, error: validateField(fn, updated[fn].value) };
          });
          return updated;
        });
        return { field: fieldName, message: error };
      }
    }
    return { field: null, message: "" };
  }, [fields, validateField]);

  // Move focus to the message and then the offending input
  useEffect(() => {
    if (!submitError) return;
    errorRef.current?.focus();
    const el = document.getElementById(firstInvalidRef.current);
    if (el) el.focus();
  }, [submitError]);

  const doneRef = useRef<HTMLHeadingElement | null>(null);

  // When the order is confirmed the form is replaced entirely
  useEffect(() => {
    if (stage === "done") doneRef.current?.focus();
  }, [stage]);

  // The cart lives in localStorage, so pre-hydration `items` is empty
  if (!hydrated && stage === "form") {
    return (
      <WithCheckoutSkeleton>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <p className="font-display text-2xl font-black text-choco/70">
            Getting your order ready…
          </p>
        </div>
      </WithCheckoutSkeleton>
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
    const validation = validateAll();
    if (validation.field) {
      setSubmitError(validation.message);
      firstInvalidRef.current = validation.field === "name" ? "co-name" : `co-${validation.field}`;
      return;
    }

    setSubmitError("");
    setSubmitting(true);

    const no = `DC-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const itemLines = items
      .map((it) => `• ${it.qty}× ${it.name} — ${ngn(it.qty * it.unitPrice)}`)
      .join("\n");
    setWaHref(
      whatsappLink(
        `Hi ${CONTACT.businessName}! I just placed order ${no}.\n\n` +
          `Name: ${fields.name.value}\nPhone: ${fields.phone.value}\n` +
          `${mode === "delivery" ? `Delivery to: ${fields.address.value}` : "Pickup"}\nDate: ${fields.date.value}\n` +
          (fields.notes.value.trim() ? `Notes: ${fields.notes.value}\n` : "") +
          `\n${itemLines}\nSubtotal: ${ngn(subtotal)}`
      )
    );
    try {
      saveOrder({
        no,
        at: new Date().toISOString(),
        name: fields.name.value,
        phone: fields.phone.value,
        mode,
        address: fields.address.value,
        date: fields.date.value,
        notes: fields.notes.value,
        items,
        subtotal,
      });
    } catch {
      setSubmitError(
        "We couldn't save your order on this device (storage is blocked). Please try again, or message us on WhatsApp so we don't miss your order."
      );
      setSubmitting(false);
      return;
    }
    setOrderNo(no);
    setStage("done");
    clear();
    // Celebrate the new order.
    window.dispatchEvent(new CustomEvent("dc:order-done"));
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
          Thank you, {fields.name.value.split(" ")[0] || "friend"}! We&apos;ll call{" "}
          <strong>{fields.phone.value}</strong> shortly to confirm{" "}
          {mode === "delivery" ? `delivery to ${fields.address.value}` : "your pickup"} for{" "}
          <strong>{fields.date.value}</strong>. Nothing to pay right now — we settle it on that
          call, and we&apos;ll confirm the exact figure before it leaves our
          kitchen.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[52px] rounded-full bg-[#25D366] px-8 py-3 font-display text-lg font-black text-white transition hover:brightness-95 active:scale-95"
            >
              Send order on WhatsApp
            </a>
          )}
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

  const inputCls = (fieldName: string) =>
    cn(
      "min-h-[52px] w-full rounded-2xl border-2 bg-milk px-4 font-semibold placeholder:font-medium placeholder:text-choco/70 focus:border-ember-deep transition-colors",
      fields[fieldName]?.error && fields[fieldName]?.touched
        ? "border-ember focus:border-ember focus:ring-2 focus:ring-ember/20"
        : "border-choco/15"
    );

  return (
    <WithCheckoutSkeleton>
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
                value={fields.name.value}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="Adaeze Okafor"
                aria-invalid={!!fields.name.error}
                aria-describedby={fields.name.error ? "co-error-name" : undefined}
                className={inputCls("name")}
              />
              {fields.name.error && fields.name.touched && (
                <p id="co-error-name" className="mt-1.5 text-sm font-bold text-ember" role="alert">
                  {fields.name.error}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="co-phone" className="mb-1 block text-sm font-black">Phone / WhatsApp</label>
              <input
                id="co-phone"
                autoComplete="tel"
                inputMode="tel"
                required
                value={fields.phone.value}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="0803 000 0000"
                aria-invalid={!!fields.phone.error}
                aria-describedby={fields.phone.error ? "co-error-phone" : undefined}
                className={inputCls("phone")}
              />
              {fields.phone.error && fields.phone.touched && (
                <p id="co-error-phone" className="mt-1.5 text-sm font-bold text-ember" role="alert">
                  {fields.phone.error}
                </p>
              )}
            </div>

            <fieldset>
              <legend className="mb-1 text-sm font-black">Pickup or delivery?</legend>
              <div
                className="grid grid-cols-2 gap-2"
                role="radiogroup"
                aria-label="Fulfilment method"
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
                      "min-h-[52px] rounded-2xl border-2 text-sm font-bold capitalize transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2",
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
                  value={fields.address.value}
                  onChange={(e) => handleChange("address", e.target.value)}
                  onBlur={() => handleBlur("address")}
                  placeholder="Street, area, Nigeria + landmark"
                  rows={2}
                  aria-invalid={!!fields.address.error}
                  aria-describedby={fields.address.error ? "co-error-address" : undefined}
                  className={cn(inputCls("address"), "py-3")}
                />
                {fields.address.error && fields.address.touched && (
                  <p id="co-error-address" className="mt-1.5 text-sm font-bold text-ember" role="alert">
                    {fields.address.error}
                  </p>
                )}
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
                value={fields.date.value}
                onChange={(e) => handleChange("date", e.target.value)}
                onBlur={() => handleBlur("date")}
                aria-invalid={!!fields.date.error}
                aria-describedby={fields.date.error ? "co-error-date" : undefined}
                className={inputCls("date")}
              />
              {fields.date.error && fields.date.touched && (
                <p id="co-error-date" className="mt-1.5 text-sm font-bold text-ember" role="alert">
                  {fields.date.error}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="co-notes" className="mb-1 block text-sm font-black">Anything we should know? <span className="font-semibold text-choco/70">(optional)</span></label>
              <textarea
                id="co-notes"
                value={fields.notes.value}
                onChange={(e) => handleChange("notes", e.target.value)}
                onBlur={() => handleBlur("notes")}
                placeholder="Allergies, a gift message, a party theme…"
                rows={2}
                className={cn(inputCls("notes"), "py-3")}
              />
            </div>

            {submitError && (
              <p
                id="co-error"
                ref={errorRef}
                tabIndex={-1}
                role="alert"
                className="rounded-2xl bg-ember/10 px-4 py-3 text-sm font-bold text-ember-deep ring-1 ring-inset ring-ember/30 animate-fade-up"
              >
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "min-h-[56px] rounded-full font-display text-lg font-black text-white transition active:scale-95",
                submitting
                  ? "bg-mint cursor-wait"
                  : "bg-ember hover:bg-ember-deep"
              )}
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Placing order…
                </span>
              ) : (
                <>
                  Place order · {ngn(subtotal)}
                </>
              )}
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
    </WithCheckoutSkeleton>
  );
}