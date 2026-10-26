import Link from "next/link";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { StatusBadge, money, date, PageTitle } from "../ui";

const PAID = ["paid", "packed", "shipped", "delivered"];

function Stat({ label, value, href }) {
  const body = (
    <div className="rounded-2xl border border-line bg-surface/50 p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl text-ink">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export default async function Dashboard() {
  await connectDB();
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const offset = now.getTime() - ist.getTime();
  const startToday = new Date(new Date(ist.getFullYear(), ist.getMonth(), ist.getDate()).getTime() + offset);
  const startMonth = new Date(new Date(ist.getFullYear(), ist.getMonth(), 1).getTime() + offset);

  const [today, month, toPack, lowStock, recent] = await Promise.all([
    Order.aggregate([{ $match: { status: { $in: PAID }, "payment.paidAt": { $gte: startToday } } }, { $group: { _id: null, n: { $sum: 1 }, total: { $sum: "$total" } } }]),
    Order.aggregate([{ $match: { status: { $in: PAID }, "payment.paidAt": { $gte: startMonth } } }, { $group: { _id: null, n: { $sum: 1 }, total: { $sum: "$total" } } }]),
    Order.countDocuments({ status: "paid" }),
    Product.find({ active: true, purchasable: true, stock: { $lte: 5 } }).sort({ stock: 1 }).lean(),
    Order.find({ status: { $ne: "pending" } }).sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Paid orders today" value={today[0]?.n || 0} />
        <Stat label="Sales today" value={money(today[0]?.total || 0)} />
        <Stat label="Sales this month" value={money(month[0]?.total || 0)} />
        <Stat label="Waiting to be packed" value={toPack} href="/admin/orders?status=paid" />
      </div>

      {lowStock.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl text-ink">Low stock</h2>
          <ul className="mt-3 divide-y divide-line rounded-2xl border border-line">
            {lowStock.map((p) => (
              <li key={p._id} className="flex items-center justify-between px-5 py-3">
                <Link href={`/admin/products/${p._id}`} className="text-ink hover:underline">
                  {p.name}, {p.variant}
                </Link>
                <span className={p.stock === 0 ? "text-[#B4532A]" : "text-muted"}>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl text-ink">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-gold hover:underline">All orders</Link>
        </div>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <tbody className="divide-y divide-line">
              {recent.map((o) => (
                <tr key={o._id}>
                  <td className="px-5 py-3"><Link href={`/admin/orders/${o._id}`} className="font-medium text-ink hover:underline">{o.orderNumber}</Link></td>
                  <td className="px-5 py-3 text-muted">{date(o.createdAt)}</td>
                  <td className="px-5 py-3 text-ink">{o.customer?.name}</td>
                  <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3 text-right text-ink">{money(o.total)}</td>
                </tr>
              ))}
              {!recent.length && (
                <tr><td className="px-5 py-6 text-muted">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
