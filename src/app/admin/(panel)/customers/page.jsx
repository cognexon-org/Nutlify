import { connectDB } from "@/lib/db";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { money, date, PageTitle } from "../../ui";

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PAID = ["paid", "packed", "shipped", "delivered"];

export default async function CustomersPage({ searchParams }) {
  const { q = "" } = await searchParams;
  const query = String(q).trim().slice(0, 60);
  await connectDB();
  const filter = query ? { $or: [{ name: new RegExp(esc(query), "i") }, { email: new RegExp(esc(query), "i") }, { phone: new RegExp(esc(query)) }] } : {};
  const [customers, total] = await Promise.all([Customer.find(filter).sort({ createdAt: -1 }).limit(200).lean(), Customer.countDocuments()]);
  const stats = await Order.aggregate([
    { $match: { customerId: { $in: customers.map((c) => c._id) }, status: { $in: PAID } } },
    { $group: { _id: "$customerId", n: { $sum: 1 }, spent: { $sum: "$total" } } },
  ]);
  const byId = new Map(stats.map((s) => [String(s._id), s]));

  return (
    <>
      <PageTitle>Customers <span className="text-xl text-muted">({total})</span></PageTitle>
      <form className="mb-6 flex gap-3">
        <input name="q" defaultValue={query} placeholder="Name, email or phone" className="min-w-[16rem] flex-1 rounded-lg border border-line bg-bg px-4 py-2.5 text-ink outline-none focus:border-gold" />
        <button className="btn-primary !py-2.5">Search</button>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-surface/60 text-muted">
            <tr>
              <th className="px-5 py-3 font-normal">Customer</th>
              <th className="px-5 py-3 font-normal">Phone / city</th>
              <th className="px-5 py-3 font-normal">Joined</th>
              <th className="px-5 py-3 font-normal">Last sign-in</th>
              <th className="px-5 py-3 text-right font-normal">Paid orders</th>
              <th className="px-5 py-3 text-right font-normal">Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {customers.map((c) => {
              const s = byId.get(String(c._id));
              return (
                <tr key={String(c._id)}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {c.photoUrl ? <img src={c.photoUrl} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full" /> : <span className="h-8 w-8 rounded-full bg-surface" />}
                      <div>
                        <p className="text-ink">{c.name || "—"}</p>
                        <p className="text-muted">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted">{c.phone || "—"}<br />{c.savedAddress?.city || ""}</td>
                  <td className="px-5 py-3 text-muted">{date(c.createdAt)}</td>
                  <td className="px-5 py-3 text-muted">{c.lastLoginAt ? date(c.lastLoginAt) : "—"}</td>
                  <td className="px-5 py-3 text-right text-ink">{s?.n || 0}</td>
                  <td className="px-5 py-3 text-right text-ink">{money(s?.spent || 0)}</td>
                </tr>
              );
            })}
            {!customers.length && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-muted">No customers yet. They appear here after signing in with Google.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">Shows customers who signed in with Google. Guest orders are in Orders.</p>
    </>
  );
}
