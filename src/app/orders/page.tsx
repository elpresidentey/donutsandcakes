"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { loadOrders, type Order } from "@/lib/orders";
import { ngn } from "@/lib/format";
import FoodImage from "@/components/FoodImage";
import { LogoMark } from "@/components/SiteHeader";

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

/** "2026-09-30T12:34:56.000Z" -> "30 Sep 2026" */
function fmtPlaced(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "2026-10-05" -> "Mon, 5 Oct" — parsed locally so it never shifts a day. */
function fmtPreferred(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return ymd;
  return new Date(y, m - 1, d).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function OrdersPage() {
  const { addItem } = useCart();
  const router = useRouter();
  // null = still reading localStorage; avoids a false "no orders" flash.
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    setOrders(loadOrders().slice().reverse());
  }, []);

  const reorder = (order: Order) => {
    order.items.forEach((it) =>
      addItem({
        kind: it.kind,
        name: it.name,
        imageId: it.imageId,
        imageAlt: it.imageAlt,
        unitPrice: it.unitPrice,
        qty: it.qty,
        details: it.details,
        editPath: it.editPath,
        config: it.config,
      })
    );
    router.push("/cart");
  };

  if (orders === null) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <LogoMark className="mx-auto h-16 w-16 opacity-40" />
        <p className="mt-4 font-display text-2xl font-black text-choco/70">
          Fetching your orders…
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <LogoMark className="mx-auto h-20 w-20 opacity-60" />
        <h1 className="mt-4 font-display text-display">No orders yet</h1>
        <p className="mx-auto mt-2 max-w-md text-choco/70">
          Once you place an order it lands here, so you can track it and re-order
          your favourites in a single tap.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="min-h-[52px] rounded-full bg-ember px-8 py-3 font-display text-lg font-black text-white transition hover:bg-ember-deep active:scale-95"
          >
            Browse the menu
          </Link>
          <Link
            href="/build"
            className="min-h-[52px] rounded-full border-2 border-choco/20 px-8 py-3 font-display text-lg font-black transition hover:border-choco active:scale-95"
          >
            Build something
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-label uppercase text-ember">
        {orders.length} {orders.length === 1 ? "order" : "orders"} on this device
      </p>
      <h1 className="mt-1 font-display text-display">Your orders</h1>
      <p className="mt-2 max-w-lg text-choco/70">
        Saved on this device so you can re-order in a tap. We still confirm every
        order by phone before it leaves the kitchen.
      </p>

      <ul className="mt-6 flex flex-col gap-5">
        {orders.map((order) => {
          const itemCount = order.items.reduce((n, i) => n + i.qty, 0);
          return (
            <li
              key={order.no}
              className="overflow-hidden rounded-3xl bg-milk shadow-[0_2px_16px_rgba(43,28,21,0.07)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-choco/10 bg-sand/50 px-5 py-4">
                <div>
                  <p className="font-display text-lg font-black">{order.no}</p>
                  <p className="text-xs font-semibold text-choco/70">
                    Placed {fmtPlaced(order.at)} · {itemCount}{" "}
                    {itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
                <span className="rounded-full bg-mint px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-leaf">
                  Awaiting confirmation
                </span>
              </div>

              <div className="px-5 py-4">
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex gap-2">
                    <dt className="font-black text-choco/70">
                      {order.mode === "delivery" ? "Deliver to" : "Pickup"}
                    </dt>
                    <dd className="min-w-0 flex-1 font-semibold">
                      {order.mode === "delivery"
                        ? order.address || "—"
                        : "At our kitchen"}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-black text-choco/70">Preferred</dt>
                    <dd className="font-semibold">{fmtPreferred(order.date)}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-black text-choco/70">Contact</dt>
                    <dd className="font-semibold">{order.phone}</dd>
                  </div>
                  {order.notes && (
                    <div className="flex gap-2 sm:col-span-2">
                      <dt className="font-black text-choco/70">Notes</dt>
                      <dd className="min-w-0 flex-1 font-semibold">
                        {order.notes}
                      </dd>
                    </div>
                  )}
                </dl>

                <ul className="mt-4 flex flex-col gap-3">
                  {order.items.map((item) => (
                    <li key={item.key} className="flex items-center gap-3">
                      {item.imageId ? (
                        <FoodImage
                          id={item.imageId}
                          alt={item.imageAlt ?? item.name}
                          width={200}
                          className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div
                          aria-hidden
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${KIND_ICON[item.kind] ?? "bg-sand"}`}
                        >
                          <span className="font-display text-xl font-black text-choco/60">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">
                          <span aria-hidden>{item.qty}× </span>
                          {item.name}
                        </p>
                        <p className="truncate text-xs font-semibold text-choco/60">
                          {KIND_LABEL[item.kind] ?? item.kind}
                          {item.details.length > 0 && ` · ${item.details.join(" · ")}`}
                        </p>
                      </div>
                      <p className="shrink-0 font-bold text-ember-deep">
                        {ngn(item.unitPrice * item.qty)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-choco/10 pt-4">
                  <p className="font-display text-xl font-black">
                    <span className="sr-only">Order total: </span>
                    {ngn(order.subtotal)}
                  </p>
                  <button
                    type="button"
                    onClick={() => reorder(order)}
                    className="min-h-[48px] rounded-full bg-ember px-7 py-2.5 font-display font-black text-white transition hover:bg-ember-deep active:scale-95"
                    aria-label={`Re-order ${order.no}`}
                  >
                    Re-order ↺
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
