import "server-only";
import Coupon from "@/lib/models/Coupon";
import Order from "@/lib/models/Order";

export const normalizeCode = (c) => String(c ?? "").trim().toUpperCase().replace(/\s+/g, "").slice(0, 30);

const PAID = ["paid", "packed", "shipped", "delivered"];

/**
 * Checks a coupon against a cart subtotal (rupees). Returns { ok, code, discount, freeShipping, description } or { ok:false, message }.
 * `phone` is only needed for one-per-customer coupons.
 */
export async function evaluateCoupon(rawCode, subtotal, phone) {
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, message: "Please enter a coupon code." };
  const c = await Coupon.findOne({ code }).lean();
  const now = new Date();
  if (!c || !c.active) return { ok: false, message: "This coupon code isn’t valid." };
  if (c.startsAt && now < c.startsAt) return { ok: false, message: "This coupon isn’t active yet." };
  if (c.endsAt && now > c.endsAt) return { ok: false, message: "This coupon has expired." };
  if (c.usageLimit != null && c.usedCount >= c.usageLimit) return { ok: false, message: "This coupon has been fully used." };
  if (c.minSubtotal && subtotal < c.minSubtotal)
    return { ok: false, message: `Add items worth ₹${(c.minSubtotal - subtotal).toLocaleString("en-IN")} more to use this coupon (minimum order ₹${c.minSubtotal.toLocaleString("en-IN")}).` };
  if (c.onePerCustomer && phone) {
    const used = await Order.exists({ "coupon.code": code, "customer.phone": phone, status: { $in: PAID } });
    if (used) return { ok: false, message: "You’ve already used this coupon." };
  }

  if (c.type === "freeship")
    return { ok: true, code, discount: 0, freeShipping: true, description: c.description || "Free delivery" };

  let discount = c.type === "percent" ? Math.floor((subtotal * c.value) / 100) : Math.floor(c.value);
  if (c.type === "percent" && c.maxDiscount != null) discount = Math.min(discount, c.maxDiscount);
  discount = Math.max(0, Math.min(discount, subtotal - 1)); // always leave at least ₹1 to pay
  if (discount <= 0) return { ok: false, message: "This coupon doesn’t apply to your cart." };

  return { ok: true, code, discount, description: c.description || (c.type === "percent" ? `${c.value}% off` : `₹${c.value} off`) };
}
