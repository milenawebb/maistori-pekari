import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { findProduct, KG_STEP, unitPrice, type Product } from "./bakery";

export type Line = { key: string; product: Product; variant?: string; qty: number; unit: number };
type Ctx = {
  lines: Line[];
  add: (id: string, variant?: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartCtx = createContext<Ctx | null>(null);

export const lineKey = (id: string, variant?: string) => (variant ? `${id}:${variant}` : id);
export const stepOf = (p: Product) => (p.unit === "kg" ? KG_STEP : 1);

export function cartTotal(lines: { unit: number; qty: number }[]) {
  return Math.round(lines.reduce((s, l) => s + l.unit * l.qty, 0) * 100) / 100;
}

/** Turn stored {key: qty} into priced lines, dropping anything no longer orderable. */
export function toLines(items: Record<string, number>): Line[] {
  return Object.entries(items).flatMap(([key, qty]) => {
    const [id, variant] = key.split(":");
    const product = findProduct(id!);
    const price = product && unitPrice(product, variant);
    if (!product || !price || qty <= 0) return [];
    return [{ key, product, variant, qty, unit: price.eur }];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>({});
  useEffect(() => {
    try {
      const s = localStorage.getItem("mp-cart2");
      if (s) setItems(JSON.parse(s));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("mp-cart2", JSON.stringify(items));
  }, [items]);

  const lines = toLines(items);

  const value: Ctx = {
    lines,
    add: (id, variant) => {
      const p = findProduct(id);
      if (!p) return;
      const k = lineKey(id, variant);
      setItems((s) => ({ ...s, [k]: Math.round(((s[k] ?? 0) + stepOf(p)) * 10) / 10 }));
    },
    setQty: (key, qty) =>
      setItems((s) => {
        const n = { ...s };
        if (qty <= 0) delete n[key];
        else n[key] = Math.round(qty * 10) / 10;
        return n;
      }),
    clear: () => setItems({}),
    total: cartTotal(lines),
    count: lines.length,
  };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
