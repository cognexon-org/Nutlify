import { motion } from "framer-motion";

const steps = [
  { title: "Check the ingredients", body: "Each lot comes from a traceable supplier and is checked for freshness, colour, aroma and anything that shouldn’t be there." },
  { title: "Weigh to the recipe", body: "Every ingredient is weighed against a written batch sheet, so the proportions match the recipe each time." },
  { title: "Mix in small batches", body: "The mix is blended in a clean, dry space with food-safe tools, in batches small enough to watch closely." },
  { title: "Fill, seal and record", body: "Packs are filled, weighed and sealed, and a sealed sample from every batch is kept with its date and lot." },
];

export default function Process() {
  return (
    <section id="made" className="section">
      <div className="container-x">
        <div className="max-w-2xl">
          <h2 className="text-4xl text-ink sm:text-5xl">How each batch is made</h2>
          <p className="mt-5 max-w-prose text-muted">
            NUVANA is made in small runs, by hand, with every step written down.
          </p>
        </div>

        <ol className="relative mt-16 grid gap-12 md:grid-cols-4 md:gap-8">
          {/* connecting line, drawn once on scroll */}
          <motion.span
            aria-hidden="true"
            className="absolute left-0 right-[24%] top-6 hidden h-px origin-left bg-gold/60 md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-5 md:block">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/70 bg-bg font-serif text-xl text-gold">
                {i + 1}
              </span>
              <div className="md:mt-6">
                <h3 className="text-2xl text-ink">{s.title}</h3>
                <p className="mt-2 text-[0.98rem] text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
