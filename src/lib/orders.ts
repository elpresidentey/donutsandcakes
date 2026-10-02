import type { CartItem } from "@/store/cart";

/**
 * A placed order, persisted client-side in localStorage under `dc-orders-v1`.
 * Checkout writes these; the /orders page reads them back. Keeping the shape and
 * the storage key in one place stops the writer and reader drifting apart.
 */
export interface Order {
  no: string;
  /** ISO timestamp of when the order was placed. */
  at: string;
  name: string;
  phone: string;
  mode: "delivery" | "pickup";
  address: string;
  /** Preferred fulfilment date, as YYYY-MM-DD from the date input. */
  date: string;
  notes: string;
  items: CartItem[];
  subtotal: number;
}

const ORDERS_KEY = "dc-orders-v1";

/** Most-recent-last, matching the order checkout appends them. */
export function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

/**
 * Append an order. Deliberately lets a storage failure throw so the caller can
 * tell the customer their order was not saved (private mode, full storage).
 */
export function saveOrder(order: Order): void {
  const orders = loadOrders();
  orders.push(order);
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
