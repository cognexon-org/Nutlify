"use client";

import Ornament from "./Ornament";
import { site } from "@/config/site";

export default function Story() {
  const { heading, paragraphs, signature } = site.story;
  if (!paragraphs?.length) return null;
  return (
    <section id="story" className="py-12 border-t border-b border-line/70" aria-labelledby="story-title">
      <div className="container-x flex flex-col items-center text-center">
        <h2 id="story-title" className="text-4xl text-ink sm:text-5xl">{heading}</h2>
        <Ornament className="mt-6 w-40" />
        <div className="mt-8 max-w-2xl space-y-5 font-serif text-xl leading-relaxed text-ink/90 sm:text-[1.4rem]">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        {signature && <p className="mt-8 font-serif text-lg italic text-gold">{signature}</p>}
      </div>
    </section>
  );
}
