import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order, { ORDER_STATUSES } from "@/lib/models/Order";
import { updateOrder } from "../../../actions";
import { StatusBadge, money, date } from "../../../ui";

const input = "w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-gold";

export default async function OrderDetail({ params }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  await connectDB();
  const o = await Order.findById(id).lean();
  if (!o) notFound();
  const c = o.customer || {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return (
    <>
      <Link href="/admin/orders" className="text-sm text-gold hover:underline">← All orders</Link>
      <div className="mb-8 mt-3 flex flex-wrap items-center gap-4">
        <h1 className="font-serif text-4xl text-ink">{o.orderNumber}</h1>
        <StatusBadge status={o.status} />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-line p-6">
            <h2 className="font-serif text-2xl text-ink">Items</h2>
            <table className="mt-4 w-full text-sm">
              <tbody className="divide-y divide-line">
                {o.items.map((i) => (
                  <tr key={i.slug}>
                    <td className="py-2.5 text-ink">{i.name}<span className="text-muted">, {i.variant}</span></td>
                    <td className="py-2.5 text-muted">{i.qty} × {money(i.price)}</td>
                    <td className="py-2.5 text-right text-ink">{money(i.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(o.subtotal)}</dd></div>
              {o.discount > 0 && (
                <div className="flex justify-between"><dt className="text-muted">Discount{o.coupon?.code ? ` (${o.coupon.code})` : ""}</dt><dd>−{money(o.discount)}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-muted">Delivery{o.shippingNote ? ` (${o.shippingNote})` : ""}</dt><dd>{o.shipping ? money(o.shipping) : "Free"}</dd></div>
              <div className="flex justify-between font-serif text-xl text-ink"><dt>Total</dt><dd>{money(o.total)}</dd></div>
            </dl>
          </section>

          <section className="grid gap-8 rounded-2xl border border-line p-6 sm:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl text-ink">Customer</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                {c.name}<br />
                <a href={`tel:+91${c.phone}`} className="hover:underline">{c.phone}</a><br />
                <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-ink">Ship to</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                {c.address1}{c.address2 && <>, {c.address2}</>}<br />
                {c.city}, {c.state} {c.pincode}
              </p>
            </div>
            {o.notes && <p className="text-sm text-muted sm:col-span-2">Note: {o.notes}</p>}
          </section>

          <section className="rounded-2xl border border-line p-6 text-sm">
            <h2 className="font-serif text-2xl text-ink">Payment</h2>
            <dl className="mt-3 grid grid-cols-[9rem_1fr] gap-y-1.5">
              <dt className="text-muted">Razorpay order</dt><dd className="break-all text-ink">{o.payment?.razorpayOrderId || "—"}</dd>
              <dt className="text-muted">Payment ID</dt><dd className="break-all text-ink">{o.payment?.razorpayPaymentId || "—"}</dd>
              <dt className="text-muted">Method</dt><dd className="text-ink">{o.payment?.method || "—"}</dd>
              <dt className="text-muted">Paid at</dt><dd className="text-ink">{o.payment?.paidAt ? date(o.payment.paidAt) : "—"}</dd>
              <dt className="text-muted">Customer link</dt><dd className="break-all text-ink">{`${siteUrl}/order/${o.orderNumber}?t=${o.publicToken}`}</dd>
            </dl>
            <p className="mt-3 text-xs text-muted">Refunds are issued from the Razorpay Dashboard. After refunding, set the status here to “refunded”.</p>
          </section>
        </div>

        <div className="space-y-8">
          <form key={String(o.updatedAt)} action={updateOrder} className="space-y-4 rounded-2xl border border-line bg-surface/50 p-6">
            <h2 className="font-serif text-2xl text-ink">Update order</h2>
            <input type="hidden" name="id" value={String(o._id)} />
            <label className="block text-sm">
              <span className="text-muted">Status</span>
              <select name="status" defaultValue={o.status} className={`${input} mt-1`}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm"><span className="text-muted">Courier</span><input name="carrier" defaultValue={o.tracking?.carrier || ""} className={`${input} mt-1`} /></label>
              <label className="block text-sm"><span className="text-muted">Tracking number</span><input name="trackingNumber" defaultValue={o.tracking?.number || ""} className={`${input} mt-1`} /></label>
            </div>
            <label className="block text-sm"><span className="text-muted">Tracking link</span><input name="trackingUrl" type="url" defaultValue={o.tracking?.url || ""} className={`${input} mt-1`} /></label>
            <label className="block text-sm"><span className="text-muted">Note (internal)</span><textarea name="note" rows={2} className={`${input} mt-1`} /></label>
            <button className="btn-primary w-full">Save</button>
            <p className="text-xs text-muted">The customer sees the status and tracking on their order page.</p>
          </form>

          <section className="rounded-2xl border border-line p-6">
            <h2 className="font-serif text-2xl text-ink">History</h2>
            <ol className="mt-3 space-y-3 text-sm">
              {[...(o.history || [])].reverse().map((h, i) => (
                <li key={i}>
                  <StatusBadge status={h.status} /> <span className="text-muted">{date(h.at)}</span>
                  {h.note && <p className="mt-0.5 text-ink">{h.note}</p>}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}
