"use client";

import { motion } from "framer-motion";
import BoxPhoto from "./BoxPhoto";
import VegMark from "./VegMark";
import AddToCart from "./cart/AddToCart";
import { mixes } from "@/data/mixes";
import { site } from "@/config/site";
import { inr } from "@/lib/pricing";

const pouch = (src, alt) => (
  <img src={src} alt={alt} loading="lazy" className="h-auto w-full max-w-[14rem] drop-shadow-[0_28px_30px_rgba(40,24,12,0.35)]" />
);

// Special artwork for particular products; anything else uses the product's image.
const art = {
  "dryfruit-300g-box": () => <BoxPhoto />,
};

export default function Packs({ products = [] }) {
  const packs = products.filter((p) => p.category === "pack");
  if (!packs.length) return null;

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
          {packs.map((p) => {
            const mix = mixes.find((m) => m.id === p.mix);
            return (
              <article key={p.slug} className="flex flex-col">
                <motion.div
                  className="flex min-h-[18rem] items-end justify-center sm:min-h-[22rem]"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  {art[p.slug] ? art[p.slug]() : pouch(p.image, `NUVANA ${p.name}, ${p.variant}`)}
                </motion.div>
                <div className="mx-auto mt-4 h-px w-3/4 bg-gradient-to-r from-transparent via-line to-transparent" />

                <div className="mt-8 flex flex-1 flex-col">
                  <p className="descriptor text-xs">{p.name}</p>
                  <div className="mt-2 flex items-baseline justify-between gap-4">
                    <h3 className="text-3xl text-ink">{p.variant}</h3>
                    <p className="shrink-0 text-right">
                      <span className="block font-serif text-2xl text-gold">{inr(p.price)}</span>
                      <span className="block text-xs text-muted">MRP, incl. of all taxes</span>
                    </p>
                  </div>
                  <p className="mt-3 max-w-prose text-muted">{p.description}</p>
                  <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                    {mix?.vegetarian && (
                      <span className="inline-flex items-center gap-2">
                        <VegMark /> Vegetarian
                      </span>
                    )}
                    {mix?.allergen && <span>{mix.allergen}</span>}
                    <span>Made in {site.countryOfOrigin}</span>
                  </p>
                  <div className="mt-auto flex items-center gap-4 pt-7">
                    <AddToCart product={p} />
                    {p.stock > 0 && p.stock <= 5 && <span className="text-sm text-muted">Only {p.stock} left</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
