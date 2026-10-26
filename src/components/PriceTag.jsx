"use client";

import { inr } from "@/lib/pricing";

/** Selling price, struck-through MRP (when higher) and the "2 for" price. */
export default function PriceTag({ product: p, className = "" }) {
  if (!p.purchasable) return <p className={`shrink-0 text-right font-serif text-2xl text-gold ${className}`}>Price on request</p>;
  const discounted = p.mrp && p.mrp > p.price;
  return (
    <p className={`shrink-0 text-right ${className}`}>
      {discounted && (
        <span className="block text-sm text-muted">
          MRP <s>{inr(p.mrp)}</s> <span className="font-medium text-brand">Save {inr(p.mrp - p.price)}</span>
        </span>
      )}
      <span className="block font-serif text-2xl text-gold">{inr(p.price)}</span>
      {p.pairPrice && <span className="block text-sm font-medium text-brand">2 for {inr(p.pairPrice)}</span>}
      <span className="block text-xs text-muted">{discounted ? "Incl. of all taxes" : "MRP, incl. of all taxes"}</span>
    </p>
  );
}
