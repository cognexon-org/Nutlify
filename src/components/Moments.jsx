"use client";

const sprig = "/assets/gold-sprig1.webp";
import MomentsVideo from "./MomentsVideo";

const moments = [
  { title: "At your desk", body: "A handful between meetings or study sessions, from a pouch that zips shut again." },
  { title: "With evening chai", body: "A small plate next to your cup, when you want something more than biscuits." },
  { title: "Shared at home", body: "A bowl on the table for the family, for guests, or for whoever walks past." },
  { title: "As a gift", body: "A box that looks the part for festivals, visits and thank-yous." },
];

export default function Moments() {
  return (
    <section className="relative overflow-hidden bg-band py-24 text-cream sm:py-32" aria-labelledby="moments-title">
      <img
        src={sprig}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 h-[80%] w-auto opacity-[0.12] -scale-x-100"
      />
      <div className="container-x relative">
        <h2 id="moments-title" className="max-w-xl text-4xl sm:text-5xl">
          Made for the moments between meals
        </h2>

        <div className="mt-12">
          <MomentsVideo />
        </div>

        {/* Same order as the video */}
        <ol className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {moments.map((m) => (
            <li key={m.title} className="border-t border-cream/20 pt-5">
              <h3 className="font-serif text-2xl italic text-[#DEB870]">{m.title}</h3>
              <p className="mt-2 text-[0.98rem] text-cream/75">{m.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
