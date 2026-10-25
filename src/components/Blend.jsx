import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mixes } from "../data/mixes";
import Plate from "./Plate";

export default function Blend() {
  const [mixId, setMixId] = useState(mixes[0].id);
  const [active, setActive] = useState(null); // hovered or focused row
  const [selected, setSelected] = useState(null); // last tapped row

  const mix = mixes.find((m) => m.id === mixId);
  const picked = mix.ingredients.find((i) => i.name === (active ?? selected));
  // Before anything is picked, show the mix's cover (if it has one) or its first ingredient.
  const cover = !picked && mix.cover;
  const shown = picked ?? mix.ingredients[0];
  const spot = cover
    ? { img: mix.cover, id: `${mix.id}-cover`, title: mix.line, alt: mix.name }
    : { img: shown.img, id: shown.name, title: shown.name, alt: shown.name };

  useEffect(() => {
    mixes.forEach((m) =>
      [...m.ingredients.map((i) => i.img), m.cover].filter(Boolean).forEach((src) => {
        const img = new Image();
        img.src = src;
      })
    );
  }, []);

  const switchMix = (id) => {
    setMixId(id);
    setActive(null);
    setSelected(null);
  };

  return (
    <section id="inside" className="section">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div>
          <h2 className="max-w-[20ch] text-4xl text-ink sm:text-5xl">What’s inside each mix</h2>

          {/* Mix switch */}
          <div role="tablist" aria-label="Choose a mix" className="mt-8 inline-flex rounded-full border border-line p-1">
            {mixes.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mixId === m.id}
                aria-controls="mix-panel"
                onClick={() => switchMix(m.id)}
                className={`relative whitespace-nowrap rounded-full px-3 py-2 text-[0.8rem] font-medium transition-colors sm:px-5 sm:text-sm ${
                  mixId === m.id ? "text-on-brand" : "text-muted hover:text-ink"
                }`}
              >
                {mixId === m.id && (
                  <motion.span
                    layoutId="mix-pill"
                    className="absolute inset-0 rounded-full bg-brand"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{m.name}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mix.id}
              id="mix-panel"
              role="tabpanel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="descriptor mt-8 text-sm">{mix.descriptor}</p>
              <p className="mt-3 max-w-prose text-muted">{mix.description}</p>

              {/* Mobile spotlight */}
              <div className="mt-8 flex items-center gap-5 lg:hidden">
                <Plate src={spot.img} id={spot.id} alt="" className="w-32" imgClassName="w-[82%]" />
                <p className="font-serif text-2xl text-ink">{spot.title}</p>
              </div>

              <ul className="mt-6 max-w-lg border-t border-line">
                {mix.ingredients.map((i) => (
                  <li key={i.name}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i.name)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(i.name)}
                      onBlur={() => setActive(null)}
                      onClick={() => setSelected(i.name)}
                      className={`flex w-full items-center gap-3 border-b border-line/60 px-2 py-3 text-left transition-colors ${
                        picked?.name === i.name || (!cover && shown.name === i.name) ? "bg-surface" : ""
                      }`}
                    >
                      <span className="h-3 w-3 shrink-0 rounded-full ring-1 ring-ink/10" style={{ background: i.color }} />
                      <span className="text-lg text-ink">{i.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-4 max-w-lg text-sm text-muted">The full ingredient list is printed on every pack.</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop spotlight */}
        <div className="hidden justify-center lg:flex">
          <div className="flex flex-col items-center text-center" aria-live="polite">
            <Plate src={spot.img} id={spot.id} alt={spot.alt} className="w-72 xl:w-80" imgClassName="w-[82%]" />
            <p className="mt-6 font-serif text-3xl text-ink">{spot.title}</p>
            <p className="mt-1 text-sm text-muted">NUVANA {mix.name}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
