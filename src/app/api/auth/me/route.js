import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/lib/models/Customer";
import { getCustomerId } from "@/lib/customer-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The signed-in customer (for the header and checkout), or { customer: null }. */
export async function GET() {
  const id = await getCustomerId();
  if (!id) return NextResponse.json({ customer: null });
  try {
    await connectDB();
    const c = await Customer.findById(id).lean();
    if (!c) return NextResponse.json({ customer: null });
    return NextResponse.json({
      customer: { name: c.name, email: c.email, photoUrl: c.photoUrl, phone: c.phone || "", savedAddress: c.savedAddress || null },
    });
  } catch {
    return NextResponse.json({ customer: null });
  }
}
