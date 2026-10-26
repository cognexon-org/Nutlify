"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Tag, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useCustomer } from "@/components/auth/CustomerProvider";
import GoogleButton from "@/components/auth/GoogleButton";
import { inr, totals } from "@/lib/pricing";

const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const empty = { name: "", phone: "", email: "", address1: "", address2: "", city: "", state: "Uttar Pradesh", pincode: "" };

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function Field({ label, name, error, className = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm text-muted">{label}</span>
      <input
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        className={`rounded-lg border bg-bg px-4 py-3 text-ink outline-none transition-colors focus:border-gold ${error ? "border-[#B4532A]" : "border-line"}`}
        {...props}
      />
      {error && <span id={`${name}-err` } className="text-sm text-[#B4532A] dark:text-[#E8A27C]">{error}</span>}
    </label>
  );
}

export default function CheckoutForm() {
  const router = useRouter();
  const { lines, ready, clear } = useCart();
  const { customer, loading: customerLoading } = useCustomer();
  const [coupon, setCoupon] = useState(null); // { code, discount, description }
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [applying, setApplying] = useState(false);

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setApplying(true);
    setCouponMsg("");
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, phone: form.phone, items: lines.map((l) => ({ slug: l.slug, qty: l.qty })) }),
      });
      const d = await res.json();
      if (res.ok) {
        setCoupon(d);
        setCouponInput("");
      } else setCouponMsg(d.error || "This coupon can’t be used.");
    } catch {
      setCouponMsg("Couldn’t check the coupon. Please try again.");
    }
    setApplying(false);
  }
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const { subtotal, discount, shipping, shippingKnown, shippingNote, total } = totals(lines, coupon?.discount || 0, {
    address: { pincode: form.pincode, state: form.state },
    freeShipping: !!coupon?.freeShipping,
  });

  // Remember details on this device for next time.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("nutlify-customer") || "null");
      if (saved) setForm((f) => ({ ...f, ...saved }));
    } catch {}
  }, []);

  // Signed-in customers: fill any empty fields from their account.
  useEffect(() => {
    if (!customer) return;
    const a = customer.savedAddress || {};
    setForm((f) => {
      const next = { ...f };
      for (const k of ["name", "email", "phone"]) if (!f[k] && customer[k]) next[k] = customer[k];
      // Use the saved address only if the address fields are still empty (state included).
      if (!f.address1 && a.address1) for (const k of ["address1", "address2", "city", "state", "pincode"]) next[k] = a[k] || "";
      return next;
    });
  }, [customer]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  async function pay(e) {
    e.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, couponCode: coupon?.code || "", items: lines.map((l) => ({ slug: l.slug, qty: l.qty })) }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.couponError) {
          setCoupon(null);
          setCouponMsg(data.error);
        }
        setErrors(data.fields || {});
        setMessage(data.error || "Something went wrong.");
        setBusy(false);
        return;
      }
      try {
        localStorage.setItem("nutlify-customer", JSON.stringify(form));
      } catch {}

      if (!(await loadRazorpay())) {
        setMessage("Couldn’t load the payment window. Check your connection and try again.");
        setBusy(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        order_id: data.razorpayOrderId,
        amount: data.amount,
        currency: data.currency,
        name: "Nutlify",
        description: `Order ${data.orderNumber}`,
        prefill: data.prefill,
        notes: { orderNumber: data.orderNumber },
        theme: { color: "#004B39" },
        handler: async (resp) => {
          setMessage("Confirming your payment…");
          const v = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNumber: data.orderNumber, token: data.token, ...resp }),
          });
          // Even if this check fails, the Razorpay webhook will still confirm a real payment.
          clear();
          router.push(`/order/${data.orderNumber}?t=${data.token}${v.ok ? "" : "&check=1"}`);
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
            setMessage("Payment was cancelled. Your cart is saved, so you can try again.");
          },
        },
      });
      rzp.on("payment.failed", (r) => {
        setMessage(r?.error?.description ? `Payment failed: ${r.error.description}` : "Payment failed. Please try again.");
      });
      rzp.open();
    } catch {
      setMessage("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  if (!ready) return <p className="mt-8 text-muted">Loading your cart…</p>;

  if (!lines.length)
    return (
      <div className="mt-10 max-w-md">
        <p className="text-muted">Your cart is empty.</p>
        <Link href="/#packs" className="btn-primary mt-6">
          Shop NUVANA
        </Link>
      </div>
    );

  return (
    <form onSubmit={pay} noValidate className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-10">
        {!customerLoading &&
          (customer ? (
            <p className="rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-muted">
              Signed in as <strong className="text-ink">{customer.email}</strong>. This order will appear in{" "}
              <a href="/account" className="underline">your account</a>.
            </p>
          ) : (
            <div className="rounded-xl border border-line bg-surface/50 p-4">
              <p className="text-sm text-muted">Sign in to fill in your details and see this order in your account later, or just continue as a guest.</p>
              <GoogleButton className="mt-3 max-w-xs" />
            </div>
          ))}
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-4 font-serif text-2xl text-ink">Contact</legend>
          <Field label="Full name" name="name" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} className="sm:col-span-2" />
          <Field label="Mobile number" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit mobile" value={form.phone} onChange={set("phone")} error={errors.phone} />
          <Field label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
        </fieldset>

        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-4 font-serif text-2xl text-ink">Delivery address</legend>
          <Field label="House / flat, street" name="address1" autoComplete="address-line1" value={form.address1} onChange={set("address1")} error={errors.address1} className="sm:col-span-2" />
          <Field label="Area, landmark (optional)" name="address2" autoComplete="address-line2" value={form.address2} onChange={set("address2")} className="sm:col-span-2" />
          <Field label="City" name="city" autoComplete="address-level2" value={form.city} onChange={set("city")} error={errors.city} />
          <Field label="Pincode" name="pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={form.pincode} onChange={set("pincode")} error={errors.pincode} />
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-sm text-muted">State</span>
            <select
              name="state"
              autoComplete="address-level1"
              value={form.state}
              onChange={set("state")}
              className="rounded-lg border border-line bg-bg px-4 py-3 text-ink outline-none focus:border-gold"
            >
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </fieldset>
      </div>

      <aside className="h-fit rounded-2xl border border-line bg-surface/60 p-6 lg:sticky lg:top-8">
        <h2 className="font-serif text-2xl text-ink">Your order</h2>
        <ul className="mt-5 divide-y divide-line">
          {lines.map((l) => (
            <li key={l.slug} className="flex items-center gap-4 py-3">
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-bg">
                {l.image && <img src={l.image} alt="" className="h-full w-full object-contain p-1" />}
              </div>
              <div className="flex-1 text-sm">
                <p className="text-ink">{l.name}</p>
                <p className="text-muted">
                  {l.variant} × {l.qty}
                </p>
              </div>
              <p className="font-serif text-lg text-ink">{inr(l.price * l.qty)}</p>
            </li>
          ))}
        </ul>
        {/* Coupon */}
        <div className="mt-4 border-t border-line pt-4">
          {coupon ? (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-bg px-3 py-2.5 text-sm">
              <span className="flex items-center gap-2 text-ink">
                <Tag size={16} className="text-gold" />
                <span>
                  <strong>{coupon.code}</strong> · {coupon.description}
                </span>
              </span>
              <button type="button" onClick={() => setCoupon(null)} className="p-1 text-muted hover:text-ink" aria-label="Remove coupon">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value.toUpperCase());
                  setCouponMsg("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyCoupon();
                  }
                }}
                placeholder="Coupon code"
                aria-label="Coupon code"
                autoCapitalize="characters"
                className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2.5 text-sm uppercase text-ink outline-none placeholder:normal-case focus:border-gold"
              />
              <button type="button" onClick={applyCoupon} disabled={applying || !couponInput.trim()} className="btn-ghost !px-4 !py-2 text-sm disabled:opacity-50">
                {applying ? "…" : "Apply"}
              </button>
            </div>
          )}
          {couponMsg && <p className="mt-2 text-sm text-[#B4532A] dark:text-[#E8A27C]">{couponMsg}</p>}
        </div>

        <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{inr(subtotal)}</dd></div>
          {discount > 0 && (
            <div className="flex justify-between text-brand"><dt>Discount ({coupon.code})</dt><dd>−{inr(discount)}</dd></div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Delivery{shippingKnown && shippingNote ? ` (${shippingNote})` : ""}</dt>
            <dd className="text-right">{!shippingKnown ? "Enter your pincode" : shipping ? inr(shipping) : <span className="text-brand">Free</span>}</dd>
          </div>
          <div className="flex justify-between pt-2 font-serif text-2xl text-ink"><dt>Total</dt><dd>{inr(total)}</dd></div>
        </dl>
        <p className="mt-1 text-xs text-muted">MRP, inclusive of all taxes. The final amount is confirmed when you pay.</p>

        {message && (
          <p role="status" className="mt-5 rounded-lg bg-bg px-4 py-3 text-sm text-ink">
            {message}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn-primary mt-6 w-full disabled:opacity-60">
          <Lock size={16} /> {busy ? "Please wait…" : shippingKnown ? `Pay ${inr(total)}` : "Continue to payment"}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Secure payment by Razorpay: UPI, cards, net banking and wallets. By paying you agree to our{" "}
          <a href="/policies/terms" className="underline">terms</a> and{" "}
          <a href="/policies/refunds" className="underline">refund policy</a>.
        </p>
      </aside>
    </form>
  );
}
