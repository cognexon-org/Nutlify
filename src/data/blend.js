import almonds from "../assets/illustrations/almonds.webp";
import cashews from "../assets/illustrations/cashews.webp";
import walnuts from "../assets/illustrations/walnuts.webp";
import pistachios from "../assets/illustrations/pistachios.webp";
import seeds from "../assets/illustrations/seeds.webp";
import raisins from "../assets/illustrations/raisins-mix.webp";

// Latest working formula (strategy doc, section 5.1), shown in six groups:
// "Seeds" = pumpkin + sunflower (10% + 10%); "Raisins" = regular + black (14% + 6%).
// The full breakdown stays on the printed pack label.
// Colours are chosen to read as the ingredient itself.
export const blend = [
  { name: "Almonds",         pct: 25, g300: 75, g70: 17.5, color: "#A8622E", img: almonds },
  { name: "Cashews",         pct: 20, g300: 60, g70: 14,   color: "#E9CFA0", img: cashews },
  { name: "Walnuts",         pct: 8,  g300: 24, g70: 5.6,  color: "#C08A4A", img: walnuts },
  { name: "Pistachios",      pct: 7,  g300: 21, g70: 4.9,  color: "#8E9A4C", img: pistachios },
  { name: "Seeds",           pct: 20, g300: 60, g70: 14,   color: "#6E7A45", img: seeds },
  { name: "Raisins",         pct: 20, g300: 60, g70: 14,   color: "#B5762E", img: raisins },
];
