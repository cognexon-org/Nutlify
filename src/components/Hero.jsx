import { motion } from "framer-motion";
import NutColumn from "./NutColumn";
import Ornament from "./Ornament";
import { NutlifyLogo, NuvanaLogo } from "./Logo";
import sprig from "../assets/gold-sprig1.webp";
import { site, contactLink } from "../config/site";

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

export default function Hero() {
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
        <motion.p variants={item} className="descriptor mt-4 text-sm sm:text-lg">
          {site.descriptor}
        </motion.p>
        <motion.p variants={item} className="mt-5 max-w-md font-serif text-lg leading-relaxed text-ink/90 sm:text-2xl">
          Sliced almonds, cashews, pistachios and walnuts, with seeds and raisins.
        </motion.p>
        <motion.div variants={item} className="my-7">
          <Ornament className="w-40 sm:w-56" />
        </motion.div>
        <motion.p variants={item} className="font-serif text-3xl text-brand sm:text-4xl">
          {site.productLine}
        </motion.p>
        <motion.div variants={item} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={contactLink("Hi Nutlify, I’d like to order NUVANA.")}
            target="_blank"
            rel="noreferrer"
            className="btn-primary min-w-[12rem]"
          >
            Order NUVANA
          </a>
          <a href="#inside" className="btn-ghost min-w-[12rem]">
            See what’s inside
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
