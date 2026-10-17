import pouchCream from "../assets/pouch-cream.webp";
import pouchFloral from "../assets/pouch-floral.webp";

/*
 * The 70 g zipper pouch: the gold-botanical design in the Cream theme,
 * the orange-flower design in the Forest theme.
 * Mockup images with the net quantity corrected to 70 g. Replace with real photos when printed.
 */
export default function PouchPhoto({ className = "" }) {
  const alt = "NUVANA Premium Dry Fruit & Seed Mix, 70 g zipper pouch";
  return (
    <div className={`relative w-full max-w-[16rem] drop-shadow-[0_28px_30px_rgba(40,24,12,0.35)] ${className}`}>
      <img src={pouchCream} alt={alt} className="h-auto w-full dark:hidden" loading="lazy" />
      <img src={pouchFloral} alt={alt} className="hidden h-auto w-full dark:block" loading="lazy" />
    </div>
  );
}
