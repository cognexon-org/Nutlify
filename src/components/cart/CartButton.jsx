"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export default function CartButton() {
  const { count, setOpen, ready } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="relative rounded-full p-2 text-ink transition-colors hover:text-gold"
      aria-label={`Open cart${count ? `, ${count} item${count > 1 ? "s" : ""}` : ""}`}
    >
      <ShoppingBag size={22} />
      {ready && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[0.7rem] font-semibold text-on-brand">
          {count}
        </span>
      )}
    </button>
  );
}
