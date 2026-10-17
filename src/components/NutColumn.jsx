import nutColumn from "../assets/nut-column.webp";

/**
 * The framed column of mixed nuts from the NUVANA box dieline:
 * walnut-brown bands, a gold pinstripe, and the mix running through the middle.
 */
export default function NutColumn({ className = "", direction = "down", drift = true, size = "lg" }) {
  const anim = drift ? (direction === "down" ? "drift-down" : "drift-up") : "";
  return (
    <div className={`flex h-full ${className}`} aria-hidden="true">
      <div className="w-[3px] bg-walnut" />
      <div className="w-[2px] bg-[#D99A2B]" />
      <div className="w-[4px] bg-walnut" />
      <div
        className={`nut-column size-${size} ${anim}`}
        style={{ backgroundImage: `url(${nutColumn})` }}
      />
      <div className="w-[4px] bg-walnut" />
      <div className="w-[2px] bg-[#D99A2B]" />
      <div className="w-[3px] bg-walnut" />
    </div>
  );
}
