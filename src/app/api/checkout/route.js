import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { razorpayClient } from "@/lib/razorpay";
import { totals } from "@/lib/pricing";
import { priceCart, CartError } from "@/lib/cart";
import { evaluateCoupon, normalizeCode } from "@/lib/coupons";
import { newOrderNumber, newToken } from "@/lib/orders";
import { site } from "@/config/site";
import { getCustomerId } from "@/lib/customer-session";
import Customer from "@/lib/models/Customer";

export const runtime = "nodejs";

const clean = (v, max = 200) => String(v ?? "").trim().slice(0, max);

function validateCustomer(c = {}) {
  const customer = {
    name: clean(c.name, 80),
    phone: clean(c.phone, 20).replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""),
    email: clean(c.email, 120).toLowerCase(),
    address1: clean(c.address1),
    address2: clean(c.address2),
    city: clean(c.city, 60),
    state: clean(c.state, 60),
    pincode: clean(c.pincode, 6),
  };
  const errors = {};
  if (customer.name.length < 2) errors.name = "Please enter your full name.";
  if (!/^[6-9]\d{9}$/.test(customer.phone)) errors.phone = "Please enter a valid 10-digit mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) errors.email = "Please enter a valid email address.";
  if (customer.address1.length < 5) errors.address1 = "Please enter your address.";
  if (customer.city.length < 2) errors.city = "Please enter your city.";
  if (customer.state.length < 2) errors.state = "Please enter your state.";
  if (!/^\d{6}$/.test(customer.pincode)) errors.pincode = "Please enter a valid 6-digit pincode.";
  else if (site.pincodePrefixes?.length && !site.pincodePrefixes.some((p) => customer.pincode.startsWith(p)))
    errors.pincode = "Sorry, we don’t deliver to this pincode yet.";
  // Delivery charges depend on the address, so make sure the pincode and state agree.
  const up = site.shipping?.state?.name || "Uttar Pradesh";
  const isUP = customer.state.toLowerCase() === up.toLowerCase();
  if (!errors.pincode && isUP && !customer.pincode.startsWith("2"))
    errors.pincode = `This pincode isn’t in ${up}. Please check the pincode or the state.`;
  if (!errors.pincode && !isUP && site.shipping?.local?.pincodePrefixes?.some((p) => customer.pincode.startsWith(p)))
    errors.state = `This pincode is in ${site.shipping.local.label}, ${up}. Please choose ${up}.`;
  return { customer, errors };
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { customer, errors } = validateCustomer(body.customer);
  if (Object.keys(errors).length) return NextResponse.json({ error: "Please check your details.", fields: errors }, { status: 400 });

  try {
    await connectDB();
    // Prices and stock always come from the database, never from the browser.
    const { items, subtotal } = await priceCart(body.items);

    let coupon = null;
    if (normalizeCode(body.couponCode)) {
      const res = await evaluateCoupon(body.couponCode, subtotal, customer.phone);
      if (!res.ok) return NextResponse.json({ error: res.message, couponError: true }, { status: 400 });
      coupon = res;
    }

    const t = totals(items, coupon?.discount || 0, { address: customer, freeShipping: !!coupon?.freeShipping });
    // Link the order to the signed-in customer (if any) and remember their details for next time.
    const customerId = await getCustomerId();
    if (customerId) {
      const { name, phone, address1, address2, city, state, pincode } = customer;
      await Customer.updateOne(
        { _id: customerId },
        { $set: { phone, savedAddress: { address1, address2, city, state, pincode }, ...(name ? { name } : {}) } }
      ).catch(() => {});
    }

    const orderNumber = newOrderNumber();
    const publicToken = newToken();

    const rzpOrder = await razorpayClient().orders.create({
      amount: Math.round(t.total * 100), // paise
      currency: "INR",
      receipt: orderNumber,
      notes: { orderNumber, ...(coupon ? { coupon: coupon.code } : {}) },
    });

    await Order.create({
      orderNumber,
      publicToken,
      ...(customerId ? { customerId } : {}),
      items,
      subtotal: t.subtotal,
      discount: t.discount,
      shipping: t.shipping,
      shippingZone: t.zone,
      shippingNote: t.shippingNote,
      total: t.total,
      coupon: coupon ? { code: coupon.code, description: coupon.description } : undefined,
      customer,
      notes: clean(body.notes, 500),
      status: "pending",
      payment: { razorpayOrderId: rzpOrder.id },
      history: [{ status: "pending", note: "Order created, awaiting payment" }],
    });

    return NextResponse.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      orderNumber,
      token: publicToken,
      prefill: { name: customer.name, email: customer.email, contact: `+91${customer.phone}` },
    });
  } catch (err) {
    if (err instanceof CartError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error("[checkout]", err);
    return NextResponse.json({ error: "We couldn’t start the payment. Please try again in a moment." }, { status: 500 });
  }
}
