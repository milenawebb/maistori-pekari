import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./bakery";

type Line = { product: Product; qty: number };
type Ctx = {
  lines: Line[];
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartCtx = createContext<Ctx | null>(null);

export function cartTotal(lines: Line[]) {
  return Math.round(lines.reduce((s, l) => s + l.product.price * l.qty, 0) * 100) / 100;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>({});
  useEffect(() => {
    try {
      const s = localStorage.getItem("mp-cart");
      if (s) setItems(JSON.parse(s));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("mp-cart", JSON.stringify(items));
  }, [items]);

  const lines = Object.entries(items)
    .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id)!, qty }))
    .filter((l) => l.product && l.qty > 0);

  const value: Ctx = {
    lines,
    add: (id) => setItems((s) => ({ ...s, [id]: (s[id] ?? 0) + 1 })),
    setQty: (id, qty) =>
      setItems((s) => {
        const n = { ...s };
        if (qty <= 0) delete n[id];
        else n[id] = qty;
        return n;
      }),
    clear: () => setItems({}),
    total: cartTotal(lines),
    count: lines.reduce((s, l) => s + l.qty, 0),
  };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
