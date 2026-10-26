import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { razorpayClient, verifyPaymentSignature } from "@/lib/razorpay";
import { markOrderPaid } from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(req) {
  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { orderNumber, token, razorpay_order_id, razorpay_payment_id, razorpay_signature } = b || {};
  if (!orderNumber || !token || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });

  try {
    await connectDB();
    const order = await Order.findOne({ orderNumber: String(orderNumber), publicToken: String(token) });
    if (!order || order.payment?.razorpayOrderId !== razorpay_order_id)
      return NextResponse.json({ error: "Order not found." }, { status: 404 });

    if (!verifyPaymentSignature({ orderId: razorpay_order_id, paymentId: razorpay_payment_id, signature: razorpay_signature }))
      return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });

    let method;
    try {
      const payment = await razorpayClient().payments.fetch(razorpay_payment_id);
      method = payment?.method;
    } catch {
      /* method is optional; the signature already proves the payment */
    }

    await markOrderPaid(order._id, { paymentId: razorpay_payment_id, signature: razorpay_signature, method });
    return NextResponse.json({ ok: true, orderNumber: order.orderNumber, token: order.publicToken });
  } catch (err) {
    console.error("[verify]", err);
    return NextResponse.json({ error: "Something went wrong while confirming your payment." }, { status: 500 });
  }
}
