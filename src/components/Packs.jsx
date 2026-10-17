import { motion } from "framer-motion";
import { BoxArt, PouchArt } from "./PackArt";
import { site, contactLink, contactLabel } from "../config/site";

const price = (v) => (v ? `₹${v}` : "Price on request");

const packs = [
  {
    id: "box",
    name: "300 g box",
    art: <BoxArt />,
    price: price(site.prices.box300),
    body: "A presentable printed box for the pantry, for sharing at home, or for giving.",
    good: ["Home and family", "Gifting", "Guests and festivals"],
    message: "Hi Nutlify, I’d like to order the NUVANA 300 g box. Quantity: ",
  },
  {
    id: "pouch",
    name: "70 g zipper pouch",
    art: <PouchArt />,
    price: price(site.prices.pouch70),
    body: "A resealable pouch that fits in a bag or desk drawer. The easiest way to try NUVANA.",
    good: ["Trying it first", "Work and study", "Travel days"],
    message: "Hi Nutlify, I’d like to order the NUVANA 70 g pouch. Quantity: ",
  },
];

export default function Packs() {
  return (
    <section id="packs" className="section border-t border-line/70 bg-surface/50">
      <div className="container-x">
        <div className="max-w-2xl">
          <h2 className="text-4xl text-ink sm:text-5xl">Two ways to take it home</h2>
          <p className="mt-5 max-w-prose text-muted">
            Same mix, same recipe, two sizes. Pick the box for the house and the pouch for your day.
          </p>
        </div>

        <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-10 lg:gap-20">
          {packs.map((p) => (
            <article key={p.id} className="flex flex-col">
              <motion.div
                className="flex min-h-[22rem] items-end justify-center px-6 sm:min-h-[26rem]"
                whileHover={{ y: -6, rotate: p.id === "box" ? -1 : 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                {p.art}
              </motion.div>
              {/* shadow line under the pack */}
              <div className="mx-auto mt-4 h-px w-3/4 bg-gradient-to-r from-transparent via-line to-transparent" />

              <div className="mt-8 flex flex-1 flex-col">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-3xl text-ink">{p.name}</h3>
                  <p className="shrink-0 font-serif text-xl text-gold">{p.price}</p>
                </div>
                <p className="mt-3 max-w-prose text-muted">{p.body}</p>
                <p className="mt-4 text-sm text-muted">
                  Good for: <span className="text-ink">{p.good.join(", ").toLowerCase()}</span>
                </p>
                <div className="mt-7">
                  <a href={contactLink(p.message)} target="_blank" rel="noreferrer" className="btn-primary">
                    {contactLabel()}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
