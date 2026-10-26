"use client";

const giftCream = "/assets/giftbox-cream.webp";
const giftMarigold = "/assets/giftbox-marigold.webp";

/* The two-jar gift box, matched to the site theme. */
export default function GiftBoxPhoto({ className = "" }) {
  const alt = "NUVANA gift box with two jars of the mix";
  return (
    <div className={`relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-[#1A120C] shadow-[0_30px_60px_-30px_rgba(58,34,20,0.6)] ${className}`}>
      <img src={giftCream} alt={alt} className="h-full w-full object-cover dark:hidden" loading="lazy" />
      <img src={giftMarigold} alt={alt} className="hidden h-full w-full object-cover dark:block" loading="lazy" />
    </div>
  );
}
