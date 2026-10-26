import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { getAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const cell = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** CSV of orders (optionally filtered by ?status=paid). */
export async function GET(req) {
  if (!(await getAdmin())) return new Response("Unauthorized", { status: 401 });
  await connectDB();
  const status = new URL(req.url).searchParams.get("status");
  const orders = await Order.find(status ? { status } : {}).sort({ createdAt: -1 }).limit(5000).lean();
  const head = ["Order", "Date", "Status", "Name", "Phone", "Email", "Address", "City", "State", "Pincode", "Items", "Subtotal", "Coupon", "Discount", "Shipping", "Total", "Payment ID"];
  const rows = orders.map((o) => [
    o.orderNumber,
    new Date(o.createdAt).toISOString(),
    o.status,
    o.customer?.name,
    o.customer?.phone,
    o.customer?.email,
    [o.customer?.address1, o.customer?.address2].filter(Boolean).join(", "),
    o.customer?.city,
    o.customer?.state,
    o.customer?.pincode,
    o.items.map((i) => `${i.qty} x ${i.name} (${i.variant})`).join("; "),
    o.subtotal,
    o.coupon?.code || "",
    o.discount || 0,
    o.shipping,
    o.total,
    o.payment?.razorpayPaymentId,
  ]);
  const csv = [head, ...rows].map((r) => r.map(cell).join(",")).join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="nutlify-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
