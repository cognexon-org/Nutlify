import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { faq } from "../data/faq";
import { site } from "../config/site";

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section border-t border-line/70">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <h2 className="text-4xl text-ink sm:text-5xl">Questions, answered</h2>
          <p className="mt-5 max-w-sm text-muted">
            Can’t find what you need? Write to us at{" "}
            <a href={`mailto:${site.email}`} className="text-ink underline decoration-gold/60 underline-offset-4 hover:decoration-gold">
              {site.email}
            </a>
            .
          </p>
        </div>

        <ul className="border-t border-line">
          {faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="border-b border-line">
                <h3 className="font-sans text-base font-normal">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="font-serif text-xl text-ink sm:text-2xl">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 text-gold"
                    >
                      <Plus size={22} />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-prose pb-6 pr-10 text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
