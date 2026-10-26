import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { priceCart, CartError } from "@/lib/cart";
import { evaluateCoupon } from "@/lib/coupons";

export const runtime = "nodejs";

// Light limit against guessing codes: 20 checks per IP per 10 minutes.
const hits = globalThis._couponHits || (globalThis._couponHits = new Map());

/** Previews a coupon for the current cart. The checkout re-checks it before payment. */
export async function POST(req) {
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const now = Date.now();
  const rec = hits.get(ip);
  const r = rec && now - rec.first < 600000 ? rec : { first: now, n: 0 };
  r.n += 1;
  hits.set(ip, r);
  if (r.n > 20) return NextResponse.json({ error: "Too many tries. Please wait a few minutes." }, { status: 429 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  try {
    await connectDB();
    const { subtotal } = await priceCart(body.items);
    const phone = String(body.phone || "").replace(/\D/g, "").slice(-10);
    const res = await evaluateCoupon(body.code, subtotal, /^[6-9]\d{9}$/.test(phone) ? phone : undefined);
    if (!res.ok) return NextResponse.json({ error: res.message }, { status: 400 });
    return NextResponse.json({ code: res.code, discount: res.discount, freeShipping: !!res.freeShipping, description: res.description });
  } catch (err) {
    if (err instanceof CartError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error("[coupon]", err);
    return NextResponse.json({ error: "Couldn’t check the coupon right now." }, { status: 500 });
  }
}
