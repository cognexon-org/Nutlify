import almonds from "../assets/illustrations/almonds.webp";
import cashews from "../assets/illustrations/cashews.webp";
import walnuts from "../assets/illustrations/walnuts.webp";
import pistachios from "../assets/illustrations/pistachios.webp";
import pumpkinSeeds from "../assets/illustrations/pumpkin-seeds.webp";
import sunflowerSeeds from "../assets/illustrations/sunflower-seeds.webp";
import raisins from "../assets/illustrations/raisins.webp";
import blackRaisins from "../assets/illustrations/black-raisins.webp";

// Latest working formula (strategy doc, section 5.1).
// Colours are chosen to read as the ingredient itself.
export const blend = [
  { name: "Almonds",         pct: 25, g300: 75, g70: 17.5, color: "#A8622E", img: almonds },
  { name: "Cashews",         pct: 20, g300: 60, g70: 14,   color: "#E9CFA0", img: cashews },
  { name: "Walnuts",         pct: 8,  g300: 24, g70: 5.6,  color: "#C08A4A", img: walnuts },
  { name: "Pistachios",      pct: 7,  g300: 21, g70: 4.9,  color: "#8E9A4C", img: pistachios },
  { name: "Pumpkin seeds",   pct: 10, g300: 30, g70: 7,    color: "#4F6B3A", img: pumpkinSeeds },
  { name: "Sunflower seeds", pct: 10, g300: 30, g70: 7,    color: "#B9AE8E", img: sunflowerSeeds },
  { name: "Raisins",         pct: 14, g300: 42, g70: 9.8,  color: "#C9852B", img: raisins },
  { name: "Black raisins",   pct: 6,  g300: 18, g70: 4.2,  color: "#3B1F1A", img: blackRaisins },
];
