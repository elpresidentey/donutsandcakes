"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartKind = "ready" | "cake" | "donut" | "smoothie";

export interface CartItem {
  key: string;
  kind: CartKind;
  name: string;
  /** Pexels photo id for the thumbnail (ready-made items) */
  imageId?: number;
  imageAlt?: string;
  unitPrice: number;
  qty: number;
  details: string[];
  /** Builder route used to edit this item, e.g. "/build/cake?edit=<key>" */
  editPath?: string;
  /** Raw builder configuration (used when editing) */
  config?: unknown;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  /** True once the persisted cart has been loaded from storage. */
  hydrated: boolean;
  addItem: (item: Omit<CartItem, "key" | "qty"> & { qty?: number }) => string;
  updateItem: (key: string, patch: Partial<CartItem>) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  getItem: (key: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dc-cart-v1";

function load(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full / private mode — cart still works in memory */
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "key" | "qty"> & { qty?: number }) => {
      const key =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `item-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
      const entry: CartItem = { ...item, key, qty: item.qty ?? 1 };
      setItems((prev) => [...prev, entry]);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("dc:cart-add", { detail: { name: entry.name } })
        );
      }
      return key;
    },
    []
  );

  const updateItem = useCallback((key: string, patch: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((it) => (it.key === key ? { ...it, ...patch } : it))
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((it) => it.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((it) => it.key !== key)
        : prev.map((it) => (it.key === key ? { ...it, qty } : it))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const getItem = useCallback(
    (key: string) => items.find((it) => it.key === key),
    [items]
  );

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, it) => n + it.qty, 0);
    const subtotal = items.reduce((n, it) => n + it.qty * it.unitPrice, 0);
    return {
      items,
      count,
      subtotal,
      hydrated,
      addItem,
      updateItem,
      removeItem,
      setQty,
      clear,
      getItem,
    };
  }, [items, hydrated, addItem, updateItem, removeItem, setQty, clear, getItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
