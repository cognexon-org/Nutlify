import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import { saveCoupon } from "../../../actions";

const input = "w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-gold";
// Date stored as an instant -> "YYYY-MM-DD" in Indian time for <input type="date">
const ymd = (d) => (d ? new Date(d).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) : "");

function F({ label, hint, children }) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export default async function EditCoupon({ params, searchParams }) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";
  let c = { code: "", description: "", type: "percent", value: 10, minSubtotal: 0, maxDiscount: null, startsAt: null, endsAt: null, usageLimit: null, usedCount: 0, onePerCustomer: false, active: true };
  if (!isNew) {
    if (!mongoose.isValidObjectId(id)) notFound();
    await connectDB();
    const found = await Coupon.findById(id).lean();
    if (!found) notFound();
    c = found;
  }

  return (
    <>
      <Link href="/admin/coupons" className="text-sm text-gold hover:underline">← All coupons</Link>
      <h1 className="mb-8 mt-3 font-serif text-4xl text-ink">{isNew ? "Create coupon" : c.code}</h1>
      {error === "duplicate" && <p role="alert" className="mb-6 rounded-lg bg-surface px-4 py-3 text-sm text-[#B4532A]">A coupon with that code already exists. Choose another code.</p>}

      <form action={saveCoupon} className="grid max-w-3xl gap-5 sm:grid-cols-2">
        <input type="hidden" name="id" value={isNew ? "new" : String(c._id)} />
        <F label="Code" hint="Letters and numbers, e.g. DIWALI10. Customers type this at checkout.">
          <input name="code" required defaultValue={c.code} className={`${input} uppercase`} placeholder="DIWALI10" />
        </F>
        <F label="Shown to the customer" hint="Optional, e.g. “10% off for Diwali”.">
          <input name="description" defaultValue={c.description} className={input} />
        </F>
        <F label="Discount type">
          <select name="type" defaultValue={c.type} className={input}>
            <option value="percent">Percentage off</option>
            <option value="flat">Fixed amount off (₹)</option>
            <option value="freeship">Free delivery</option>
          </select>
        </F>
        <F label="Value" hint="10 means 10% or ₹10, depending on the type. Not used for free delivery.">
          <input name="value" type="number" min="0" step="1" defaultValue={c.value} className={input} />
        </F>
        <F label="Minimum order (₹)" hint="Cart subtotal needed before the coupon works. 0 = no minimum.">
          <input name="minSubtotal" type="number" min="0" step="1" defaultValue={c.minSubtotal || 0} className={input} />
        </F>
        <F label="Maximum discount (₹)" hint="Only for percentage coupons. Leave empty for no cap.">
          <input name="maxDiscount" type="number" min="0" step="1" defaultValue={c.maxDiscount ?? ""} className={input} />
        </F>
        <F label="Starts on" hint="Leave empty to start now.">
          <input name="startsAt" type="date" defaultValue={ymd(c.startsAt)} className={input} />
        </F>
        <F label="Ends on" hint="Works until the end of this day. Leave empty for no end.">
          <input name="endsAt" type="date" defaultValue={ymd(c.endsAt)} className={input} />
        </F>
        <F label="Total uses allowed" hint={`Leave empty for unlimited. Used so far: ${c.usedCount || 0}.`}>
          <input name="usageLimit" type="number" min="1" step="1" defaultValue={c.usageLimit ?? ""} className={input} />
        </F>
        <div className="flex flex-col justify-end gap-3 text-sm">
          <label className="flex items-center gap-2 text-ink"><input type="checkbox" name="onePerCustomer" defaultChecked={c.onePerCustomer} /> One use per customer (by phone number)</label>
          <label className="flex items-center gap-2 text-ink"><input type="checkbox" name="active" defaultChecked={c.active} /> Coupon is on</label>
        </div>
        <div className="sm:col-span-2">
          <button className="btn-primary">Save coupon</button>
        </div>
      </form>
    </>
  );
}
