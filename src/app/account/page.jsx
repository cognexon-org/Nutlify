import { redirect } from "next/navigation";
import SimpleHeader from "@/components/SimpleHeader";
import Footer from "@/components/Footer";
import { connectDB } from "@/lib/db";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { getCustomerId } from "@/lib/customer-session";
import { inr } from "@/lib/pricing";
import SignOutButton from "./SignOutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your account", robots: { index: false } };

const STATUS = { pending: "Awaiting payment", paid: "Paid", packed: "Packed", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", failed: "Payment failed", refunded: "Refunded" };

export default async function AccountPage() {
  const id = await getCustomerId();
  if (!id) redirect("/login?next=/account");
  await connectDB();
  const c = await Customer.findById(id).lean();
  if (!c) redirect("/login?next=/account");

  // Orders placed while signed in, plus earlier guest orders with the same (Google-verified) email.
  const orders = await Order.find({
    status: { $ne: "pending" },
    $or: [{ customerId: c._id }, { "customer.email": c.email }],
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return (
    <>
      <SimpleHeader />
      <main className="container-x max-w-3xl py-12 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {c.photoUrl && <img src={c.photoUrl} alt="" referrerPolicy="no-referrer" className="h-14 w-14 rounded-full" />}
            <div>
              <h1 className="font-serif text-4xl text-ink">{c.name || "Your account"}</h1>
              <p className="text-muted">{c.email}</p>
            </div>
          </div>
          <SignOutButton />
        </div>

        <section className="mt-12">
          <h2 className="font-serif text-2xl text-ink">Your orders</h2>
          {orders.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-line p-6">
              <p className="text-muted">No orders yet.</p>
              <a href="/#packs" className="btn-primary mt-5">Shop NUVANA</a>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
              {orders.map((o) => (
                <li key={String(o._id)}>
                  <a href={`/order/${o.orderNumber}?t=${o.publicToken}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-surface/50">
                    <div>
                      <p className="font-medium text-ink">{o.orderNumber}</p>
                      <p className="text-sm text-muted">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })} ·{" "}
                        {o.items.reduce((n, i) => n + i.qty, 0)} item(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-lg text-ink">{inr(o.total)}</p>
                      <p className="text-sm text-muted">{STATUS[o.status] || o.status}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {c.savedAddress?.address1 && (
          <section className="mt-10">
            <h2 className="font-serif text-2xl text-ink">Saved delivery details</h2>
            <p className="mt-3 text-muted">
              {c.phone}
              <br />
              {c.savedAddress.address1}
              {c.savedAddress.address2 && <>, {c.savedAddress.address2}</>}
              <br />
              {c.savedAddress.city}, {c.savedAddress.state} {c.savedAddress.pincode}
            </p>
            <p className="mt-2 text-sm text-muted">These fill in automatically at checkout and update each time you order.</p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
