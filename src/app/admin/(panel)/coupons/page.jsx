import Link from "next/link";
import { connectDB } from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import { money, PageTitle } from "../../ui";

const day = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : "");

function state(c) {
  const now = new Date();
  if (!c.active) return ["Off", "text-muted"];
  if (c.startsAt && now < c.startsAt) return ["Scheduled", "text-gold"];
  if (c.endsAt && now > c.endsAt) return ["Expired", "text-muted"];
  if (c.usageLimit != null && c.usedCount >= c.usageLimit) return ["Used up", "text-muted"];
  return ["Live", "text-brand"];
}

export default async function CouponsPage({ searchParams }) {
  const { saved } = await searchParams;
  await connectDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();

  return (
    <>
      <PageTitle actions={<Link href="/admin/coupons/new" className="btn-primary !py-2.5">Create coupon</Link>}>Coupons</PageTitle>
      {saved && <p role="status" className="mb-6 rounded-lg bg-surface px-4 py-3 text-sm text-ink">Coupon saved.</p>}
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-surface/60 text-muted">
            <tr>
              <th className="px-5 py-3 font-normal">Code</th>
              <th className="px-5 py-3 font-normal">Discount</th>
              <th className="px-5 py-3 font-normal">Conditions</th>
              <th className="px-5 py-3 text-right font-normal">Used</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {coupons.map((c) => {
              const [label, cls] = state(c);
              const cond = [
                c.minSubtotal ? `Min order ${money(c.minSubtotal)}` : "",
                c.type === "percent" && c.maxDiscount != null ? `Max ${money(c.maxDiscount)}` : "",
                c.onePerCustomer ? "One per customer" : "",
                c.startsAt || c.endsAt ? `${day(c.startsAt) || "Now"} – ${day(c.endsAt) || "no end"}` : "",
              ].filter(Boolean);
              return (
                <tr key={c._id}>
                  <td className="px-5 py-3">
                    <p className="font-medium tracking-wide text-ink">{c.code}</p>
                    {c.description && <p className="text-muted">{c.description}</p>}
                  </td>
                  <td className="px-5 py-3 text-ink">{c.type === "freeship" ? "Free delivery" : c.type === "percent" ? `${c.value}%` : money(c.value)}</td>
                  <td className="px-5 py-3 text-muted">{cond.join(" · ") || "None"}</td>
                  <td className="px-5 py-3 text-right text-ink">
                    {c.usedCount}
                    {c.usageLimit != null && <span className="text-muted"> / {c.usageLimit}</span>}
                  </td>
                  <td className={`px-5 py-3 font-medium ${cls}`}>{label}</td>
                  <td className="px-5 py-3 text-right"><Link href={`/admin/coupons/${c._id}`} className="text-gold hover:underline">Edit</Link></td>
                </tr>
              );
            })}
            {!coupons.length && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-muted">No coupons yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">“Used” counts paid orders only. Unpaid checkouts don’t use up a coupon.</p>
    </>
  );
}
