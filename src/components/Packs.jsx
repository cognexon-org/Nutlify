import { motion } from "framer-motion";
import BoxPhoto from "./BoxPhoto";
import VegMark from "./VegMark";
import { mixes } from "../data/mixes";
import { site, contactLink, contactLabel } from "../config/site";
import pouchDryFruit from "../assets/pouch-dryfruit.webp";
import pouchBerries from "../assets/pouch-berries.webp";

const price = (v) => (v ? `₹${v}` : "Price on request");
const dryFruit = mixes.find((m) => m.id === "dryfruit");
const berries = mixes.find((m) => m.id === "berries");

const pouch = (src, alt) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className="h-auto w-full max-w-[14rem] drop-shadow-[0_28px_30px_rgba(40,24,12,0.35)]"
  />
);

const packs = [
  {
    id: "dryfruit70",
    mix: dryFruit,
    name: "70 g pouch",
    art: pouch(pouchDryFruit, "NUVANA Premium Dry Fruit & Seed Mix, 70 g pouch"),
    mrp: site.prices.dryFruit70,
    body: "Almonds, cashews, nuts, raisins and seeds in a resealable pouch for your bag or desk drawer.",
    message: "Hi Nutlify, I’d like to order NUVANA Dry Fruit & Seed Mix, 70 g pouch. Quantity: ",
  },
  {
    id: "berries80",
    mix: berries,
    name: "80 g pouch",
    art: pouch(pouchBerries, "NUVANA Fruit & Berries Mix, 80 g pouch"),
    mrp: site.prices.berries80,
    body: "Kiwi, berries, mango and cherry in a resealable pouch. A sweeter, fruitier companion to the dry fruit mix.",
    message: "Hi Nutlify, I’d like to order NUVANA Fruit & Berries Mix, 80 g pouch. Quantity: ",
  },
  {
    id: "box300",
    mix: dryFruit,
    name: "300 g box",
    art: <BoxPhoto />,
    mrp: site.prices.box300,
    body: "The Dry Fruit & Seed Mix in a presentable printed box for the pantry, for sharing at home, or for giving.",
    message: "Hi Nutlify, I’d like to order NUVANA Dry Fruit & Seed Mix, 300 g box. Quantity: ",
  },
];

export default function Packs() {
  return (
    <section id="packs" className="section border-t border-line/70 bg-surface/50">
      <div className="container-x">
        <div className="max-w-2xl">
          <h2 className="text-4xl text-ink sm:text-5xl">Two mixes, three ways to buy</h2>
          <p className="mt-5 max-w-prose text-muted">
            Pick a pouch to try each mix, or the 300 g box of the Dry Fruit & Seed Mix for the house.
          </p>
        </div>

        <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
          {packs.map((p) => (
            <article key={p.id} className="flex flex-col">
              <motion.div
                className="flex min-h-[18rem] items-end justify-center sm:min-h-[22rem]"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                {p.art}
              </motion.div>
              <div className="mx-auto mt-4 h-px w-3/4 bg-gradient-to-r from-transparent via-line to-transparent" />

              <div className="mt-8 flex flex-1 flex-col">
                <p className="descriptor text-xs">{p.mix.name}</p>
                <div className="mt-2 flex items-baseline justify-between gap-4">
                  <h3 className="text-3xl text-ink">{p.name}</h3>
                  <p className="shrink-0 text-right">
                    <span className="block font-serif text-2xl text-gold">{price(p.mrp)}</span>
                    {p.mrp && <span className="block text-xs text-muted">MRP, incl. of all taxes</span>}
                  </p>
                </div>
                <p className="mt-3 max-w-prose text-muted">{p.body}</p>
                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                  {p.mix.vegetarian && (
                    <span className="inline-flex items-center gap-2">
                      <VegMark /> Vegetarian
                    </span>
                  )}
                  {p.mix.allergen && <span>{p.mix.allergen}</span>}
                  <span>Made in {site.countryOfOrigin}</span>
                </p>
                <div className="mt-auto pt-7">
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
