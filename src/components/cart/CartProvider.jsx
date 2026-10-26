"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { site } from "@/config/site";
import { totals } from "@/lib/pricing";

const CartContext = createContext(null);
const KEY = "nutlify-cart-v1";

/*
 * Cart lives in the visitor's browser. Each line keeps a snapshot (name, price, image) for display;
 * the server re-checks every price and stock level at checkout.
 */
export function CartProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved)) setLines(saved.filter((l) => l && l.slug && l.qty > 0));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const max = site.maxQtyPerItem || 20;

  const add = useCallback(
    (product, qty = 1) => {
      setLines((prev) => {
        const limit = Math.min(max, product.stock ?? max);
        const found = prev.find((l) => l.slug === product.slug);
        if (found) return prev.map((l) => (l.slug === product.slug ? { ...l, qty: Math.min(limit, l.qty + qty), price: product.price, mrp: product.mrp ?? null, pairPrice: product.pairPrice ?? null } : l));
        return [
          ...prev,
          { slug: product.slug, name: product.name, variant: product.variant, price: product.price, mrp: product.mrp ?? null, pairPrice: product.pairPrice ?? null, image: product.image, stock: product.stock, qty: Math.min(limit, qty) },
        ];
      });
      setOpen(true);
    },
    [max]
  );

  const setQty = useCallback(
    (slug, qty) =>
      setLines((prev) =>
        prev
          .map((l) => (l.slug === slug ? { ...l, qty: Math.max(0, Math.min(Math.min(max, l.stock ?? max), qty)) } : l))
          .filter((l) => l.qty > 0)
      ),
    [max]
  );

  const remove = useCallback((slug) => setLines((prev) => prev.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    return { lines, count, ...totals(lines), add, setQty, remove, clear, open, setOpen, ready };
  }, [lines, add, setQty, remove, clear, open, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
