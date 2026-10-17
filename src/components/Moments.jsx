import sprig from "../assets/gold-sprig.webp";

const moments = [
  { title: "At your desk", body: "A handful between meetings or study sessions, from a pouch that zips shut again." },
  { title: "Shared at home", body: "A box on the table for the family, for guests, or next to the evening chai." },
  { title: "On the road", body: "The 70 g pouch slips into a bag or glovebox for travel days and long commutes." },
  { title: "As a gift", body: "A box that looks the part for festivals, visits and thank-yous." },
];

export default function Moments() {
  return (
    <section className="relative overflow-hidden bg-band py-24 text-cream sm:py-32" aria-labelledby="moments-title">
      <img
        src={sprig}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-[120%] w-auto opacity-[0.16] -scale-x-100"
      />
      <div className="container-x relative">
        <h2 id="moments-title" className="max-w-xl text-4xl sm:text-5xl">
          Made for the moments between meals
        </h2>
        <div className="mt-16 grid gap-x-16 gap-y-12 sm:grid-cols-2">
          {moments.map((m) => (
            <div key={m.title} className="border-t border-cream/20 pt-6">
              <h3 className="font-serif text-3xl italic text-[#DEB870]">{m.title}</h3>
              <p className="mt-3 max-w-sm text-cream/75">{m.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
