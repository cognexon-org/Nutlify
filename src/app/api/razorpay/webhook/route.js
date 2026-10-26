import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { markOrderPaid, markOrderFailed } from "@/lib/orders";

export const runtime = "nodejs";

/*
 * Razorpay webhook: a backup in case the customer closes the page right after paying.
 * In the Razorpay Dashboard add https://YOUR-DOMAIN/api/razorpay/webhook with the events
 * payment.captured, order.paid and payment.failed, and the same secret as RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(req) {
  const raw = await req.text();
  if (!verifyWebhookSignature(raw, req.headers.get("x-razorpay-signature")))
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    await connectDB();
    const payment = event?.payload?.payment?.entity;
    const rzpOrderId = payment?.order_id || event?.payload?.order?.entity?.id;
    if (!rzpOrderId) return NextResponse.json({ ok: true });

    const order = await Order.findOne({ "payment.razorpayOrderId": rzpOrderId });
    if (!order) return NextResponse.json({ ok: true });

    if (event.event === "payment.captured" || event.event === "order.paid") {
      await markOrderPaid(order._id, { paymentId: payment?.id, method: payment?.method, note: `Webhook: ${event.event}` });
    } else if (event.event === "payment.failed") {
      await markOrderFailed(order._id, payment?.error_description || "Payment failed");
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
