import { site } from "@/config/site";

const cfg = () => site.shipping || {};

/** Which delivery zone an address is in: "local" (Kanpur), "state" (rest of UP), "rest", or null if the pincode isn't complete. */
export function deliveryZone({ pincode, state } = {}) {
  const pin = String(pincode || "").trim();
  if (!/^\d{6}$/.test(pin)) return null;
  const { local, state: st } = cfg();
  if (local?.pincodePrefixes?.some((p) => pin.startsWith(p))) return "local";
  if (st?.name && String(state || "").trim().toLowerCase() === st.name.toLowerCase()) return "state";
  return "rest";
}

/** The first product offer the cart qualifies for (e.g. 2+ Diwali gift bags), or null. */
export function qualifyingOffer(lines = []) {
  for (const o of cfg().offers || []) {
    const qty = lines.filter((l) => l.slug === o.slug).reduce((n, l) => n + l.qty, 0);
    if (qty >= o.minQty) return o;
  }
  return null;
}

/**
 * Delivery for a cart. Returns { fee, zone, known, note }.
 * `fee` is null when the address isn't known yet (cart drawer, empty pincode).
 */
export function delivery(lines, { address, freeShipping = false } = {}) {
  const c = cfg();
  const zone = deliveryZone(address);
  const offer = qualifyingOffer(lines);
  if (freeShipping) return { fee: 0, zone, known: true, note: "Free delivery code" };
  if (offer) return { fee: 0, zone, known: true, note: offer.label };
  if (!zone) return { fee: null, zone: null, known: false, note: "" };
  const z = c[zone] || {};
  return { fee: z.fee || 0, zone, known: true, note: z.fee ? z.label : `Free in ${z.label}` };
}

/**
 * lines: [{ slug, price, qty }] in rupees; discount in rupees.
 * opts: { address: { pincode, state }, freeShipping }.
 * `total` leaves delivery out while it isn't known yet.
 */
export function totals(lines, discount = 0, opts = {}) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const d = Math.max(0, Math.min(discount, subtotal));
  const del = delivery(lines, opts);
  const shipping = del.fee ?? 0;
  return { subtotal, discount: d, shipping, shippingKnown: del.known, shippingNote: del.note, zone: del.zone, total: subtotal - d + shipping };
}

/** Short text for the cart, e.g. "Free in Kanpur · ₹60 in Uttar Pradesh · ₹100 elsewhere". */
export function deliveryRatesText() {
  const { local, state, rest } = cfg();
  const part = (z, where) => (z ? (z.fee ? `₹${z.fee} ${where}` : `Free ${where}`) : "");
  return [part(local, `in ${local?.label}`), part(state, `in rest of ${state?.label}`), part(rest, "elsewhere in India")].filter(Boolean).join(" · ");
}

export const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
