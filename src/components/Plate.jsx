"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * A cream plate that holds an illustration. The plate stays cream in both
 * themes, so the illustrations always sit on the colour they were drawn for.
 * Pass a changing `id` to crossfade between images.
 */
export default function Plate({ src, id, alt = "", className = "w-56", imgClassName = "w-[82%]" }) {
  return (
    <div
      className={`relative grid aspect-square shrink-0 place-items-center rounded-full bg-cream ring-1 ring-[#E3CFAA] shadow-[inset_0_-12px_30px_-18px_rgba(160,106,36,0.35)] ${className}`}
    >
      <span className="pointer-events-none absolute inset-[6%] rounded-full border border-[#D9B577]/40" aria-hidden="true" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={id ?? src}
          src={src}
          alt={alt}
          loading="lazy"
          draggable="false"
          className={`relative h-auto ${imgClassName}`}
          initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
    </div>
  );
}
