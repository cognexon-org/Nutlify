import { notFound } from "next/navigation";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { inr } from "@/lib/pricing";
import { site } from "@/config/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your order", robots: { index: false } };

const STATUS_TEXT = {
  pending: "We’re waiting for the payment confirmation. This usually takes a few seconds; refresh this page in a moment.",
  paid: "Payment received. We’ll pack your order soon.",
  packed: "Your order is packed and will be shipped soon.",
  shipped: "Your order is on its way.",
  delivered: "Your order has been delivered. Enjoy!",
  cancelled: "This order was cancelled.",
  failed: "The payment didn’t go through, so you haven’t been charged. Please place the order again.",
  refunded: "This order has been refunded.",
};

export default async function OrderPage({ params, searchParams }) {
  const { orderNumber } = await params;
  const { t } = await searchParams;
  if (!t) notFound();
  await connectDB();
  const order = await Order.findOne({ orderNumber, publicToken: String(t) }).lean();
  if (!order) notFound();

  const good = ["paid", "packed", "shipped", "delivered"].includes(order.status);
  const bad = ["failed", "cancelled", "refunded"].includes(order.status);
  const Icon = good ? CheckCircle2 : bad ? XCircle : Clock;

  return (
    <>
      <SimpleHeader />
      <main className="container-x max-w-3xl py-12 sm:py-16">
        <div className="flex items-start gap-4">
          <Icon size={40} className={good ? "text-brand" : bad ? "text-[#B4532A]" : "text-gold"} />
          <div>
            <h1 className="text-4xl text-ink sm:text-5xl">{good ? "Thank you for your order" : bad ? "Order not completed" : "Confirming your payment"}</h1>
            <p className="mt-3 text-muted">
              Order <strong className="text-ink">{order.orderNumber}</strong> · {STATUS_TEXT[order.status]}
            </p>
            <p className="mt-1 text-sm text-muted">Bookmark this page to check your order status later.</p>
          </div>
        </div>

        {order.tracking?.number && (
          <div className="mt-8 rounded-2xl border border-line bg-surface/60 p-5">
            <p className="font-medium text-ink">Tracking</p>
            <p className="mt-1 text-muted">
              {order.tracking.carrier} {order.tracking.number}
              {order.tracking.url && (
                <>
                  {" "}·{" "}
                  <a href={order.tracking.url} target="_blank" rel="noreferrer" className="underline">
                    Track shipment
                  </a>
                </>
              )}
            </p>
          </div>
        )}

        <section className="mt-10 rounded-2xl border border-line p-6">
          <h2 className="font-serif text-2xl text-ink">Items</h2>
          <ul className="mt-4 divide-y divide-line">
            {order.items.map((i) => (
              <li key={i.slug} className="flex items-center gap-4 py-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-surface">
                  {i.image && <img src={i.image} alt="" className="h-full w-full object-contain p-1" />}
                </div>
                <div className="flex-1">
                  <p className="text-ink">{i.name}</p>
                  <p className="text-sm text-muted">
                    {i.variant} × {i.qty}
                  </p>
                </div>
                <p className="font-serif text-lg text-ink">{inr(i.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-brand"><dt>Discount{order.coupon?.code ? ` (${order.coupon.code})` : ""}</dt><dd>−{inr(order.discount)}</dd></div>
            )}
            <div className="flex justify-between"><dt className="text-muted">Delivery{order.shippingNote ? ` (${order.shippingNote})` : ""}</dt><dd>{order.shipping ? inr(order.shipping) : "Free"}</dd></div>
            <div className="flex justify-between pt-2 font-serif text-2xl text-ink"><dt>Total</dt><dd>{inr(order.total)}</dd></div>
          </dl>
        </section>

        <section className="mt-6 rounded-2xl border border-line p-6">
          <h2 className="font-serif text-2xl text-ink">Delivering to</h2>
          <p className="mt-3 text-muted">
            {order.customer.name}
            <br />
            {order.customer.address1}
            {order.customer.address2 && <>, {order.customer.address2}</>}
            <br />
            {order.customer.city}, {order.customer.state} {order.customer.pincode}
            <br />
            {order.customer.phone}
          </p>
        </section>

        <p className="mt-8 text-sm text-muted">
          Questions about your order?{" "}
          {site.whatsapp && (
            <>
              Message us on{" "}
              <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi Nutlify, about my order ${order.orderNumber}: `)}`} target="_blank" rel="noreferrer" className="underline">
                WhatsApp
              </a>{" "}
              or write to{" "}
            </>
          )}
          {!site.whatsapp && "Write to "}
          <a href={`mailto:${site.email}`} className="underline">{site.email}</a> and mention {order.orderNumber}.
        </p>
        <a href="/" className="btn-ghost mt-8">
          Back to the shop
        </a>
      </main>
    </>
  );
}
