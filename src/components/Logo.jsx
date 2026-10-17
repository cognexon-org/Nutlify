import nutlifyGreen from "../assets/nutlify-logo-green.png";
import nutlifyCream from "../assets/nutlify-logo-cream.png";
import nuvanaGreen from "../assets/nuvana-logo-green.png";
import nuvanaGold from "../assets/nuvana-logo-gold.png";

/*
 * The supplied wordmarks are used as-is (only recoloured for dark
 * backgrounds). Replace the PNGs in src/assets with SVG or larger
 * exports for sharper rendering on big screens.
 */
function Swap({ light, dark, alt, className, onDark }) {
  if (onDark) return <img src={dark} alt={alt} className={className} draggable="false" />;
  return (
    <>
      <img src={light} alt={alt} className={`${className} dark:hidden`} draggable="false" />
      <img src={dark} alt="" aria-hidden="true" className={`${className} hidden dark:block`} draggable="false" />
    </>
  );
}

export function NutlifyLogo({ className = "h-10 w-auto", onDark = false }) {
  return <Swap light={nutlifyGreen} dark={nutlifyCream} alt="Nutlify" className={className} onDark={onDark} />;
}

export function NuvanaLogo({ className = "h-10 w-auto", onDark = false }) {
  return <Swap light={nuvanaGreen} dark={nuvanaGold} alt="NUVANA" className={className} onDark={onDark} />;
}
