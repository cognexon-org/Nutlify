"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useCart } from "./CartProvider";

export default function AddToCart({ product, className = "" }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (!product.purchasable) return null;
  if (!product.stock || product.stock <= 0)
    return (
      <span className={`btn cursor-not-allowed border border-line text-muted ${className}`} aria-disabled="true">
        Out of stock
      </span>
    );

  return (
    <button
      type="button"
      onClick={() => {
        add(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
      }}
      className={`btn-primary ${className}`}
    >
      {added ? (
        <>
          <Check size={18} /> Added
        </>
      ) : (
        "Add to cart"
      )}
    </button>
  );
}
