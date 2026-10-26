"use client";

import GiftBoxPhoto from "./GiftBoxPhoto";
import AddToCart from "./cart/AddToCart";
import PriceTag from "./PriceTag";
import { site, contactLink } from "@/config/site";
import { inr } from "@/lib/pricing";

const art = {
  "diwali-gift-bag": (p) => (
    <div className="aspect-square w-full overflow-hidden rounded-2xl bg-[#E9D6B2] shadow-[0_30px_60px_-30px_rgba(58,34,20,0.6)]">
      <img src={p.image} alt="NUVANA Diwali gift bag with both pouches and a Happy Diwali card" loading="lazy" className="h-full w-full object-cover" />
    </div>
  ),
  "gift-box-two-jars": () => <GiftBoxPhoto className="!aspect-square [&_img]:object-[80%_50%]" />,
};

const fallbackArt = (p) => (
  <div className="aspect-square w-full overflow-hidden rounded-2xl bg-surface">
    {p.image && <img src={p.image} alt={`${p.name}`} loading="lazy" className="h-full w-full object-cover" />}
  </div>
);

export default function Gifting({ products = [] }) {
  const gifts = products.filter((p) => p.category === "gift");
  const g = site.gifting;
  const details = [
    g.messageCards && "Personal message cards on request",
    g.minQuantity && `Bulk orders from ${g.minQuantity}`,
    g.leadTime && `Please allow ${g.leadTime} for gifting orders`,
    "For bulk or corporate orders, enquire and we’ll confirm price and delivery date",
  ].filter(Boolean);

  return (
    <section id="gifting" className="section" aria-labelledby="gifting-title">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 id="gifting-title" className="max-w-[18ch] text-4xl text-ink sm:text-5xl">
              For Diwali, weddings and every thank-you
            </h2>
            <p className="mt-5 max-w-prose text-muted">
              Both mixes, packed to be given. Order a few for family visits, or a larger batch for your team, clients or
              wedding guests.
            </p>
          </div>
          <ul className="space-y-2.5">
            {details.map((d) => (
              <li key={d} className="flex items-start gap-3 text-ink">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10 lg:gap-16">
          {gifts.map((p) => (
            <article key={p.slug} className="flex flex-col">
              {(art[p.slug] || fallbackArt)(p)}
              <div className="mt-7 flex items-baseline justify-between gap-4">
                <h3 className="text-3xl text-ink">{p.name}</h3>
                <PriceTag product={p} />
              </div>
              <p className="mt-3 max-w-prose text-muted">{p.description}</p>
              {/* {(site.shipping?.offers || [])
                .filter((o) => o.slug === p.slug)
                .map((o) => (
                  <p key={o.label} className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-medium text-brand">
                    <span className="h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
                    Order {o.minQty} or more: free delivery
                  </p>
                ))} */}
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
                <AddToCart product={p} />
                <a
                  href={contactLink(`Hi Nutlify, I’d like to enquire about the NUVANA ${p.name}.\nNumber needed: \nNeeded by (date): \nDelivery city: `)}
                  target="_blank"
                  rel="noreferrer"
                  className={p.purchasable ? "btn-ghost" : "btn-primary"}
                >
                  {p.purchasable ? "Bulk enquiry" : "Enquire about this gift"}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
