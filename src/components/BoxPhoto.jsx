import boxCream from "../assets/box-cream.webp";
import boxMarigold from "../assets/box-marigold.webp";

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
    <div className={`relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-[#1A120C] shadow-[0_30px_60px_-30px_rgba(58,34,20,0.6)] ${className}`}>
      <img src={first} alt={alt} className="h-full w-full object-cover dark:hidden" loading="lazy" />
      <img src={second} alt={alt} className="hidden h-full w-full object-cover dark:block" loading="lazy" />
    </div>
  );
}
