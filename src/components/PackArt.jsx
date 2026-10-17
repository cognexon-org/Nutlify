import NutColumn from "./NutColumn";
import mixWindow from "../assets/mix-window.jpg";
import nutlifyGreen from "../assets/nutlify-logo-green.png";
import nuvanaGreen from "../assets/nuvana-logo-green.png";

/*
 * Illustrated packs built from the real wordmarks and packaging motifs.
 * Swap these for real product photography once the pilot packs are printed.
 * The pack faces always use the cream packaging palette, in either site theme.
 */

export function BoxArt() {
  return (
    <div className="relative mx-auto aspect-[21/16] w-full max-w-md">
      {/* lid edge for depth */}
      <div className="absolute inset-x-3 -top-2 h-4 rounded-t-md bg-[#E9D6B2]" />
      <div className="relative flex h-full overflow-hidden rounded-md bg-cream shadow-[0_30px_60px_-30px_rgba(58,34,20,0.55)] ring-1 ring-[#E3CFAA]">
        <NutColumn size="sm" drift={false} className="ml-4" />
        <div className="flex flex-1 flex-col items-center justify-center px-3 text-center">
          <PackNutlify className="h-6 w-auto sm:h-8" />
          <p className="mt-1 font-serif text-[0.6rem] text-[#3A2214] sm:text-xs">Nourish Naturally. Thrive Daily.</p>
          <div className="my-2 h-px w-16 bg-[#A06A24]/60" />
          <PackNuvana className="w-[78%]" />
          <p className="mt-1.5 font-sans text-[0.5rem] font-medium uppercase tracking-[0.08em] text-[#A06A24] sm:text-[0.62rem]">
            Premium Dry Fruit &amp; Seed Mix
          </p>
          <p className="mt-2 font-serif text-[0.55rem] leading-snug text-[#3A2214] sm:text-[0.7rem]">
            Almonds • Cashews • Pistachios • Walnuts
            <br />
            Pumpkin Seeds • Sunflower Seeds • Raisins
          </p>
          <p className="mt-2 font-sans text-[0.55rem] font-medium text-[#3A2214] sm:text-[0.65rem]">NET QUANTITY: 300 g</p>
        </div>
        <NutColumn size="sm" drift={false} className="mr-4" />
      </div>
    </div>
  );
}

export function PouchArt() {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[19rem]">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.4rem] rounded-b-[1rem] bg-[#FBF7EF] shadow-[0_30px_60px_-30px_rgba(58,34,20,0.55)] ring-1 ring-[#E6DCC8]">
        {/* zipper and tear strip */}
        <div className="mt-[7%] h-[3px] w-full bg-[repeating-linear-gradient(90deg,#E4DACA_0_6px,transparent_6px_9px)]" />
        <div className="mt-[3%] h-[2px] w-full bg-[#ECE3D3]" />
        {/* cream label */}
        <div className="mx-[6%] mt-[5%] flex flex-col items-center rounded-sm bg-cream px-2 py-[7%] text-center">
          <PackNutlify className="h-6 w-auto sm:h-7" />
          <p className="mt-1 font-serif text-[0.55rem] text-[#3A2214] sm:text-[0.65rem]">Nourish Naturally. Thrive Daily.</p>
          <div className="my-2 h-px w-12 bg-[#A06A24]/60" />
          <PackNuvana className="w-[80%]" />
          <p className="mt-1.5 font-sans text-[0.45rem] font-medium uppercase tracking-[0.08em] text-[#A06A24] sm:text-[0.55rem]">
            Premium Dry Fruit &amp; Seed Mix
          </p>
          <p className="mt-2 font-serif text-[0.8rem] text-[#004B39] sm:text-[0.9rem]">Goodness In Every Bite</p>
          <p className="mt-1.5 font-sans text-[0.5rem] font-medium text-[#3A2214] sm:text-[0.6rem]">NET QUANTITY: 70 g</p>
        </div>
        {/* window onto the mix */}
        <div className="relative mx-[6%] mt-[5%] flex-1 overflow-hidden rounded-t-[50%_30%]">
          <img src={mixWindow} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="h-[6%]" />
      </div>
    </div>
  );
}

/* Pack faces stay cream, so they always use the green wordmarks. */
function PackNutlify({ className }) {
  return <img src={nutlifyGreen} alt="" className={className} draggable="false" />;
}
function PackNuvana({ className }) {
  return <img src={nuvanaGreen} alt="" className={`h-auto ${className}`} draggable="false" />;
}
