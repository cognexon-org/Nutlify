import sprig from "../assets/gold-sprig.webp";
import handful from "../assets/illustrations/handful.webp";
import bowl from "../assets/illustrations/bowl-of-mix.webp";
import teaTime from "../assets/illustrations/tea-time.webp";
import gifting from "../assets/illustrations/gifting.webp";
import Plate from "./Plate";

const moments = [
  { title: "At your desk", body: "A handful between meetings or study sessions, from a pouch that zips shut again.", img: handful },
  { title: "Shared at home", body: "A bowl on the table for the family, for guests, or for whoever walks past.", img: bowl },
  { title: "With evening chai", body: "A small plate next to your cup, when you want something more than biscuits.", img: teaTime },
  { title: "As a gift", body: "A box that looks the part for festivals, visits and thank-yous.", img: gifting },
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
        <div className="mt-16 grid gap-x-16 gap-y-14 md:grid-cols-2">
          {moments.map((m) => (
            <div key={m.title} className="flex items-center gap-6 border-t border-cream/20 pt-8 sm:gap-8">
              <Plate src={m.img} alt="" className="w-28 sm:w-36 lg:w-44" imgClassName="w-[86%]" />
              <div>
                <h3 className="font-serif text-3xl italic text-[#DEB870]">{m.title}</h3>
                <p className="mt-3 max-w-sm text-cream/75">{m.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
