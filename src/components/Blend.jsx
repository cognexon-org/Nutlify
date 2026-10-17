import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { blend } from "../data/blend";

const ease = [0.22, 1, 0.36, 1];
const packs = [
  { id: "g300", label: "300 g box" },
  { id: "g70", label: "70 g pouch" },
];

const fmt = (n) => (Number.isInteger(n) ? `${n} g` : `${n.toFixed(1)} g`);

export default function Blend() {
  const [pack, setPack] = useState("g300");
  const [active, setActive] = useState(null);

  // The column reads top to bottom in the same order as the table.
  const stack = blend;

  return (
    <section id="inside" className="section">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <h2 className="max-w-[16ch] text-4xl text-ink sm:text-5xl">Eight ingredients, mixed to one recipe</h2>
          <p className="mt-5 max-w-prose text-muted">
            Every batch of NUVANA follows the same written proportions, so the mix in your pack stays familiar
            from one handful to the next. Here is exactly how it breaks down.
          </p>

          {/* Pack switch */}
          <div
            role="radiogroup"
            aria-label="Show amounts for"
            className="mt-8 inline-flex rounded-full border border-line p-1"
          >
            {packs.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={pack === p.id}
                onClick={() => setPack(p.id)}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  pack === p.id ? "text-on-brand" : "text-muted hover:text-ink"
                }`}
              >
                {pack === p.id && (
                  <motion.span
                    layoutId="pack-pill"
                    className="absolute inset-0 rounded-full bg-brand"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{p.label}</span>
              </button>
            ))}
          </div>

          {/* Ingredient table */}
          <table className="mt-6 w-full max-w-lg text-left">
            <caption className="sr-only">NUVANA ingredients by share and weight</caption>
            <thead>
              <tr className="border-b border-line text-sm text-muted">
                <th scope="col" className="py-2 font-normal">Ingredient</th>
                <th scope="col" className="py-2 text-right font-normal">Share</th>
                <th scope="col" className="w-24 py-2 text-right font-normal">In your pack</th>
              </tr>
            </thead>
            <tbody>
              {blend.map((b) => (
                <tr
                  key={b.name}
                  tabIndex={0}
                  onMouseEnter={() => setActive(b.name)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(b.name)}
                  onBlur={() => setActive(null)}
                  className={`cursor-default border-b border-line/60 outline-none transition-colors ${
                    active === b.name ? "bg-surface" : ""
                  }`}
                >
                  <td className="py-2.5 pl-2">
                    <span className="flex items-center gap-3">
                      <span className="h-3 w-3 shrink-0 rounded-full ring-1 ring-ink/10" style={{ background: b.color }} />
                      <span className="text-ink">{b.name}</span>
                    </span>
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-muted">{b.pct}%</td>
                  <td className="py-2.5 pr-2 text-right tabular-nums text-ink">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={pack}
                        className="inline-block"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                      >
                        {fmt(b[pack])}
                      </motion.span>
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 max-w-lg text-sm text-muted">
            This is the recipe for our first batch. We may fine-tune it after tasting feedback, and the pack label is
            always the final word.
          </p>
        </div>

        {/* The column: the mix stacked by share */}
        <div className="flex justify-center lg:justify-end">
          <figure className="flex items-end gap-6">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              className="relative flex h-[30rem] w-28 flex-col overflow-hidden rounded-t-full border-[3px] border-walnut bg-surface sm:h-[34rem] sm:w-32"
              role="img"
              aria-label="Column chart of the NUVANA recipe by share"
            >
              {stack.map((b, i) => (
                <motion.div
                  key={b.name}
                  className="relative w-full origin-bottom"
                  style={{ height: `${b.pct}%`, background: b.color }}
                  variants={{
                    hidden: { scaleY: 0 },
                    show: { scaleY: 1, transition: { duration: 0.6, delay: (stack.length - 1 - i) * 0.12, ease } },
                  }}
                  onMouseEnter={() => setActive(b.name)}
                  onMouseLeave={() => setActive(null)}
                >
                  <span
                    className={`absolute inset-0 transition-opacity duration-200 ${
                      active && active !== b.name ? "bg-bg/65" : "bg-transparent"
                    }`}
                  />
                </motion.div>
              ))}
              {/* gold pinstripes */}
              <span className="pointer-events-none absolute inset-y-0 left-2 w-px bg-[#D99A2B]/70" />
              <span className="pointer-events-none absolute inset-y-0 right-2 w-px bg-[#D99A2B]/70" />
            </motion.div>
            <figcaption className="flex h-[30rem] flex-col sm:h-[34rem]" aria-hidden="true">
              {stack.map((b) => (
                <span
                  key={b.name}
                  className={`flex items-center font-serif text-[0.95rem] leading-none transition-colors ${
                    active === b.name ? "text-ink" : "text-muted"
                  }`}
                  style={{ height: `${b.pct}%` }}
                >
                  {b.pct >= 7 ? b.name : <span className="text-sm">{b.name}</span>}
                </span>
              ))}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
