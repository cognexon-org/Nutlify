import "server-only";
import crypto from "crypto";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Coupon from "@/lib/models/Coupon";

export function newOrderNumber() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
  return `NUT-${ymd}-${rand}`;
}

export const newToken = () => crypto.randomBytes(16).toString("hex");

/**
 * Marks an order paid exactly once (safe to call from both the checkout callback and the webhook),
 * then reduces stock exactly once.
 */
export async function markOrderPaid(orderId, { paymentId, signature, method, note }) {
  const updated = await Order.findOneAndUpdate(
    { _id: orderId, status: { $in: ["pending", "failed"] } },
    {
      $set: {
        status: "paid",
        "payment.razorpayPaymentId": paymentId,
        ...(signature ? { "payment.razorpaySignature": signature } : {}),
        ...(method ? { "payment.method": method } : {}),
        "payment.paidAt": new Date(),
      },
      $push: { history: { status: "paid", note: note || "Payment received" } },
    },
    { new: true }
  );

  // Reduce stock (and count the coupon use) once per order, whichever path got here first.
  const claim = await Order.findOneAndUpdate({ _id: orderId, stockApplied: false, status: { $ne: "pending" } }, { $set: { stockApplied: true } }, { new: true });
  if (claim) {
    if (claim.coupon?.code) await Coupon.updateOne({ code: claim.coupon.code }, { $inc: { usedCount: 1 } });
    for (const item of claim.items) {
      await Product.updateOne({ _id: item.product }, [
        { $set: { stock: { $max: [0, { $subtract: ["$stock", item.qty] }] } } },
      ]);
    }
  }
  return updated;
}

export async function markOrderFailed(orderId, note) {
  return Order.findOneAndUpdate(
    { _id: orderId, status: "pending" },
    { $set: { status: "failed" }, $push: { history: { status: "failed", note: note || "Payment failed" } } },
    { new: true }
  );
}
