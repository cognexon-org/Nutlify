"use client";

const boxCream = "/assets/box-cream-gift.webp";
const boxMarigold = "/assets/box-marigold-gift.webp";

/*
 * The 300 g box, shown with the packaging that matches the site theme.
 * `invert` shows the other design instead, so two sections never repeat one image.
 * These are design mockups: replace them with photos of the printed boxes when ready.
 */
export default function BoxPhoto({ invert = false, className = "" }) {
  const first = invert ? boxMarigold : boxCream;
  const second = invert ? boxCream : boxMarigold;
  const alt = "NUVANA Premium Dry Fruit & Seed Mix, 300 g box";
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#1A120C] dark:bg-[#05372A] shadow-[0_30px_60px_-30px_rgba(58,34,20,0.6)] ${className}`}>
      <img src={first} alt={alt} className="h-full w-full object-contain dark:hidden" loading="lazy" />
      <img src={second} alt={alt} className="hidden h-full w-full object-contain dark:block" loading="lazy" />
    </div>
  );
}
