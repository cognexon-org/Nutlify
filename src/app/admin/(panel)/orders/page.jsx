import Link from "next/link";
import { connectDB } from "@/lib/db";
import Order, { ORDER_STATUSES } from "@/lib/models/Order";
import { StatusBadge, money, date, PageTitle } from "../../ui";

const PER_PAGE = 25;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async function OrdersPage({ searchParams }) {
  const sp = await searchParams;
  const status = ORDER_STATUSES.includes(sp.status) ? sp.status : "";
  const q = String(sp.q || "").trim().slice(0, 60);
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const filter = {};
  if (status) filter.status = status;
  else filter.status = { $ne: "pending" }; // hide abandoned checkouts unless asked for
  if (q) filter.$or = [{ orderNumber: new RegExp(esc(q), "i") }, { "customer.phone": new RegExp(esc(q)) }, { "customer.name": new RegExp(esc(q), "i") }];

  await connectDB();
  const [orders, count] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * PER_PAGE).limit(PER_PAGE).lean(),
    Order.countDocuments(filter),
  ]);
  const pages = Math.max(1, Math.ceil(count / PER_PAGE));
  const link = (p) => `/admin/orders?${new URLSearchParams({ ...(status && { status }), ...(q && { q }), page: String(p) })}`;

  return (
    <>
      <PageTitle
        actions={
          <a href={`/api/admin/orders/export${status ? `?status=${status}` : ""}`} className="btn-ghost !py-2 text-sm">
            Download CSV
          </a>
        }
      >
        Orders
      </PageTitle>

      <form className="mb-6 flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Order number, phone or name" className="min-w-[16rem] flex-1 rounded-lg border border-line bg-bg px-4 py-2.5 text-ink outline-none focus:border-gold" />
        <select name="status" defaultValue={status} className="rounded-lg border border-line bg-bg px-4 py-2.5 text-ink">
          <option value="">All (except unpaid)</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s === "pending" ? "pending (unpaid)" : s}</option>
          ))}
        </select>
        <button className="btn-primary !py-2.5">Filter</button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-surface/60 text-muted">
            <tr>
              <th className="px-5 py-3 font-normal">Order</th>
              <th className="px-5 py-3 font-normal">Date</th>
              <th className="px-5 py-3 font-normal">Customer</th>
              <th className="px-5 py-3 font-normal">Items</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 text-right font-normal">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-surface/40">
                <td className="px-5 py-3"><Link href={`/admin/orders/${o._id}`} className="font-medium text-ink hover:underline">{o.orderNumber}</Link></td>
                <td className="px-5 py-3 text-muted">{date(o.createdAt)}</td>
                <td className="px-5 py-3 text-ink">{o.customer?.name}<br /><span className="text-muted">{o.customer?.phone}</span></td>
                <td className="px-5 py-3 text-muted">{o.items.reduce((n, i) => n + i.qty, 0)}</td>
                <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-3 text-right text-ink">{money(o.total)}</td>
              </tr>
            ))}
            {!orders.length && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-muted">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-6 flex items-center gap-3 text-sm">
          {page > 1 && <Link href={link(page - 1)} className="btn-ghost !py-2">Previous</Link>}
          <span className="text-muted">Page {page} of {pages}</span>
          {page < pages && <Link href={link(page + 1)} className="btn-ghost !py-2">Next</Link>}
        </div>
      )}
    </>
  );
}
