import GiftBoxPhoto from "./GiftBoxPhoto";
import giftBag from "../assets/giftbag-diwali.webp";
import { site, contactLink } from "../config/site";

const price = (v) => (v ? `₹${v}` : "Price on request");

const options = [
  {
    id: "bag",
    name: "Diwali gift bag",
    contents: "One Dry Fruit & Seed Mix pouch (70 g), one Fruit & Berries Mix pouch (80 g) and a Happy Diwali card, in a frosted carry bag.",
    mrp: site.prices.giftBag,
    art: (
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-[#E9D6B2] shadow-[0_30px_60px_-30px_rgba(58,34,20,0.6)]">
        <img src={giftBag} alt="NUVANA Diwali gift bag with both pouches and a Happy Diwali card" loading="lazy" className="h-full w-full object-cover" />
      </div>
    ),
    message: "Hi Nutlify, I’d like to order the NUVANA Diwali gift bag.\nNumber of bags: \nNeeded by (date): \nDelivery city: ",
  },
  {
    id: "box",
    name: "Gift box with two jars",
    contents: "One jar of the Dry Fruit & Seed Mix and one jar of the Fruit & Berries Mix, in a rigid box with a magnetic lid.",
    mrp: site.prices.giftBox,
    art: <GiftBoxPhoto className="!aspect-square [&_img]:object-[80%_50%]" />,
    message: "Hi Nutlify, I’d like to order the NUVANA gift box with two jars.\nNumber of boxes: \nNeeded by (date): \nDelivery city: \nMessage cards needed? ",
  },
];

export default function Gifting() {
  const g = site.gifting;
  const details = [
    g.messageCards && "Personal message cards on request",
    g.minQuantity && `Bulk orders from ${g.minQuantity}`,
    g.leadTime && `Please allow ${g.leadTime} for gifting orders`,
    "Price and delivery date confirmed with you before you order",
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
          {options.map((o) => (
            <article key={o.id} className="flex flex-col">
              {o.art}
              <div className="mt-7 flex items-baseline justify-between gap-4">
                <h3 className="text-3xl text-ink">{o.name}</h3>
                <p className="shrink-0 text-right">
                  <span className="block font-serif text-2xl text-gold">{price(o.mrp)}</span>
                  {o.mrp && <span className="block text-xs text-muted">MRP, incl. of all taxes</span>}
                </p>
              </div>
              <p className="mt-3 max-w-prose text-muted">{o.contents}</p>
              <div className="mt-auto pt-7">
                <a href={contactLink(o.message)} target="_blank" rel="noreferrer" className="btn-primary">
                  Enquire about this gift
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
