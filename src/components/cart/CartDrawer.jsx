"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { inr, deliveryRatesText } from "@/lib/pricing";

export default function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, subtotal, shippingKnown, shippingNote, count } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-bg text-ink shadow-2xl"
            style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-serif text-2xl">Your cart {count > 0 && <span className="text-muted">({count})</span>}</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-surface" aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="font-serif text-2xl">Your cart is empty</p>
                <p className="text-muted">Add a pouch, the box or a gift pack to get started.</p>
                <Link href="/#packs" onClick={() => setOpen(false)} className="btn-primary mt-2">
                  Shop NUVANA
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  {lines.map((l) => (
                    <li key={l.slug} className="flex gap-4 py-5">
                      <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface">
                        {l.image && <img src={l.image} alt="" className="h-full w-full object-contain p-1" />}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-medium leading-tight">{l.name}</p>
                            <p className="text-sm text-muted">{l.variant}</p>
                          </div>
                          <p className="font-serif text-lg">{inr(l.price * l.qty)}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="inline-flex items-center rounded-full border border-line">
                            <button type="button" className="p-2 hover:text-gold" onClick={() => setQty(l.slug, l.qty - 1)} aria-label={`One less ${l.name}`}>
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">{l.qty}</span>
                            <button
                              type="button"
                              className="p-2 hover:text-gold disabled:opacity-40"
                              onClick={() => setQty(l.slug, l.qty + 1)}
                              disabled={l.stock != null && l.qty >= l.stock}
                              aria-label={`One more ${l.name}`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button type="button" onClick={() => remove(l.slug)} className="p-2 text-muted hover:text-ink" aria-label={`Remove ${l.name}`}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line px-6 py-5">
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{inr(subtotal)}</dd></div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Delivery</dt>
                      <dd className="text-right">{shippingKnown ? <span className="text-brand">Free</span> : "Calculated at checkout"}</dd>
                    </div>
                    {shippingKnown && shippingNote && <p className="text-xs text-brand">{shippingNote}</p>}
                    <div className="flex justify-between pt-2 font-serif text-xl"><dt>{shippingKnown ? "Total" : "Total before delivery"}</dt><dd>{inr(subtotal)}</dd></div>
                  </dl>
                  <p className="mt-1 text-xs text-muted">
                    Prices are MRP, inclusive of all taxes. {!shippingKnown && <>Delivery: {deliveryRatesText()}. </>}Have a coupon? Apply it at checkout.
                  </p>
                  <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary mt-5 w-full">
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
