import GiftBoxPhoto from "./GiftBoxPhoto";
import { site, contactLink } from "../config/site";

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
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <GiftBoxPhoto />

        <div>
          <h2 id="gifting-title" className="max-w-[16ch] text-4xl text-ink sm:text-5xl">
            For Diwali, weddings and every thank-you
          </h2>
          <p className="mt-5 max-w-prose text-muted">
            NUVANA comes in a gift box made for the occasion. Order a few for family visits, or a larger batch for your team,
            clients or wedding guests.
          </p>
          <ul className="mt-6 space-y-2.5">
            {details.map((d) => (
              <li key={d} className="flex items-start gap-3 text-ink">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
          <a
            href={contactLink(
              "Hi Nutlify, I’d like to enquire about gifting.\nNumber of boxes: \nNeeded by (date): \nDelivery city: \nMessage cards needed? "
            )}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-8"
          >
            Enquire about gifting
          </a>
        </div>
      </div>
    </section>
  );
}
