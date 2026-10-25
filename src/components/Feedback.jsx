import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NutColumn from "./NutColumn";
import { site, contactLink } from "../config/site";

const packOptions = ["Dry Fruit & Seed Mix", "Fruit & Berries Mix", "Both", "A gift pack", "Haven’t tried it yet"];

export default function Feedback() {
  const [name, setName] = useState("");
  const [pack, setPack] = useState(packOptions[0]);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const channel = site.whatsapp ? "WhatsApp" : "your email app";

  const submit = (e) => {
    e.preventDefault();
    if (!note.trim()) {
      setError("Add a few words about the taste, the pack or the price so we know what to improve.");
      return;
    }
    setError("");
    const msg = `NUVANA feedback\nName: ${name || "Not given"}\nPack: ${pack}\n\n${note.trim()}`;
    window.open(contactLink(msg), "_blank", "noopener");
    setSent(true);
  };

  return (
    <section id="feedback" className="section border-y border-line/70 bg-surface/50">
      <div className="container-x grid gap-14 lg:grid-cols-[auto_1fr_1.1fr] lg:gap-16">
        <div className="hidden h-full min-h-[26rem] lg:block">
          <NutColumn direction="down" />
        </div>

        <div>
          <h2 className="max-w-[14ch] text-4xl text-ink sm:text-5xl">Our first batch is small, on purpose</h2>
          <p className="mt-5 max-w-prose text-muted">
            We’re making NUVANA in a limited first run to get the taste, the packs and the price right before we make
            more. If you’ve tried it, tell us honestly what you think: sweetness, crunch, the mix of nuts, seeds and fruit,
            the pack, and what you’d pay.
          </p>
        </div>

        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-muted">Your name (optional)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="rounded-lg border border-line bg-bg px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-gold"
              placeholder="Priya"
            />
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm text-muted">Which did you try?</legend>
            <div className="flex flex-wrap gap-2">
              {packOptions.map((o) => (
                <label
                  key={o}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
                    pack === o ? "border-brand bg-brand text-on-brand" : "border-line text-ink hover:border-gold"
                  }`}
                >
                  <input type="radio" name="pack" value={o} checked={pack === o} onChange={() => setPack(o)} className="sr-only" />
                  {o}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-muted">Your feedback</span>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (error) setError("");
              }}
              rows={5}
              aria-invalid={!!error}
              aria-describedby={error ? "feedback-error" : undefined}
              className="resize-y rounded-lg border border-line bg-bg px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-gold"
              placeholder="Loved the berries mix, and the 70 g pouch is a perfect size…"
            />
          </label>
          {error && (
            <p id="feedback-error" className="-mt-2 text-sm text-[#B4532A] dark:text-[#E8A27C]">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="btn-primary">
              Send feedback
            </button>
            <AnimatePresence>
              {sent && (
                <motion.p
                  role="status"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted"
                >
                  Your feedback is ready to send in {channel}. Thank you.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </section>
  );
}
