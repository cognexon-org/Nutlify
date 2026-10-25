import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import NutColumn from "./NutColumn";
import Ornament from "./Ornament";
import { NutlifyLogo, NuvanaLogo } from "./Logo";
import sprig from "../assets/gold-sprig1.webp";
import { site } from "../config/site";
import { mixes } from "../data/mixes";

const ease = [0.22, 1, 0.36, 1];

// One orchestrated entrance: the columns slide in, then the pack-front lockup builds top to bottom.
const lockup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.55 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

// The middle of the lockup alternates between the two mixes, worded exactly as on each pack.
const slides = mixes.map((m) => ({
  id: m.id,
  name: m.name,
  descriptor: m.descriptor,
  ingredients: m.ingredients.map((i) => i.name).join(" • "),
  line: m.line,
}));
const INTERVAL = 6000;

/* Stacks every slide in one grid cell, so the height never jumps; only the active one is visible. */
function Rotating({ index, render, className = "" }) {
  return (
    <div className={`grid ${className}`}>
      {slides.map((sl, i) => (
        <motion.div
          key={sl.id}
          className="col-start-1 row-start-1"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : 6 }}
          transition={{ duration: 0.9, ease }}
          aria-hidden={i !== index}
        >
          {render(sl)}
        </motion.div>
      ))}
    </div>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced || slides.length < 2) return;
    const t = setInterval(() => {
      if (!paused.current && !document.hidden) setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL);
    return () => clearInterval(t);
  }, [reduced]);

  const pause = () => (paused.current = true);
  const resume = () => (paused.current = false);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] overflow-hidden"
      aria-label="NUVANA by Nutlify"
    >
      {/* Left column */}
      <motion.div
        className="absolute inset-y-0 left-3 sm:left-8 lg:left-14"
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.3, ease }}
      >
        <NutColumn direction="down" />
      </motion.div>
      {/* Right column */}
      <motion.div
        className="absolute inset-y-0 right-3 sm:right-8 lg:right-14"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.3, ease }}
      >
        <NutColumn direction="up" />
      </motion.div>

      {/* Gold botanicals, as on the cream box */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-[20%] left-[5.25rem] hidden xl:block xl:left-[8.25rem]"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ duration: 1.4, delay: 0.9, ease }}
      >
        <img src={sprig} alt="" className="h-full max-h-[520px] w-auto" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-[20%] right-[5.25rem] hidden xl:block xl:right-[8.25rem]"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ duration: 1.4, delay: 0.9, ease }}
      >
        <img src={sprig} alt="" className="h-full max-h-[520px] w-auto -scale-x-100" />
      </motion.div>

      {/* The pack-front lockup */}
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center justify-center px-[3.75rem] pb-16 pt-28 text-center sm:px-24"
        variants={lockup}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <NutlifyLogo className="h-12 w-auto sm:h-14" />
        </motion.div>
        <motion.p variants={item} className="mt-3 font-serif text-lg text-ink sm:text-xl">
          {site.tagline}
        </motion.p>
        <motion.div variants={item} className="my-6">
          <Ornament className="w-40 sm:w-56" />
        </motion.div>
        <motion.h1 variants={item} className="w-full">
          <span className="sr-only">NUVANA, </span>
          <NuvanaLogo className="mx-auto h-auto w-[min(26rem,100%)]" />
        </motion.h1>
        {/* Rotating middle: pauses while hovered or focused */}
        <div
          className="flex w-full flex-col items-center"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={resume}
        >
          <motion.div variants={item} className="mt-4 w-full">
            <Rotating
              index={index}
              render={(sl) => (
                <>
                  <p className="descriptor text-sm sm:text-lg">{sl.descriptor}</p>
                  <p className="mx-auto mt-5 max-w-md font-serif text-lg leading-relaxed text-ink/90 sm:text-2xl">
                    {sl.ingredients}
                  </p>
                </>
              )}
            />
          </motion.div>
          <motion.div variants={item} className="my-7">
            <Ornament className="w-40 sm:w-56" />
          </motion.div>
          <motion.div variants={item} className="w-full">
            <Rotating
              index={index}
              render={(sl) => <p className="font-serif text-3xl text-brand sm:text-4xl">{sl.line}</p>}
            />
          </motion.div>

          {/* Dots */}
          <motion.div variants={item} className="mt-6 flex items-center gap-1" role="group" aria-label="Choose a mix">
            {slides.map((sl, i) => (
              <button
                key={sl.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                aria-label={`Show ${sl.name}`}
                className="grid h-8 w-8 place-items-center rounded-full"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-500 ${
                    i === index ? "w-6 bg-gold" : "w-2 bg-gold/35 hover:bg-gold/60"
                  }`}
                />
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div variants={item} className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
          <a href="#packs" className="btn-primary min-w-[12rem]">
            Shop NUVANA
          </a>
          <a href="#inside" className="btn-ghost min-w-[12rem]">
            See what’s inside
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
