const almonds = "/assets/illustrations/almonds.webp";
const cashews = "/assets/illustrations/cashews.webp";
const nuts = "/assets/illustrations/walnuts.webp";
const raisins = "/assets/illustrations/raisins-mix.webp";
const seeds = "/assets/illustrations/seeds.webp";
const kiwi = "/assets/illustrations/kiwi.webp";
const berriesImg = "/assets/illustrations/berries.webp";
const mango = "/assets/illustrations/mango.webp";
const cherry = "/assets/illustrations/cherry.webp";
const berriesBowl = "/assets/illustrations/berries-bowl-mix.webp";

/*
 * The two NUVANA mixes, worded as on the final pouches.
 * `allergen` and `vegetarian` are only shown when filled in.
 * `cover` (optional) is shown in the spotlight before an ingredient is picked.
 */
export const mixes = [
  {
    id: "dryfruit",
    name: "Dry Fruit & Seed Mix",
    descriptor: "Premium Dry Fruit & Seed Mix",
    line: "Goodness In Every Bite",
    description:
      "A thoughtfully crafted blend of dry fruits, nuts and seeds, bringing together delightful flavours and textures for everyday enjoyment.",
    ingredients: [
      { name: "Almonds", color: "#A8622E", img: almonds },
      { name: "Cashews", color: "#E9CFA0", img: cashews },
      { name: "Nuts", color: "#C08A4A", img: nuts },
      { name: "Raisins", color: "#B5762E", img: raisins },
      { name: "Seeds", color: "#6E7A45", img: seeds },
    ],
    allergen: "Contains nuts",
    vegetarian: true,
  },
  {
    id: "berries",
    name: "Fruit & Berries Mix",
    descriptor: "Fruit & Berries Mix",
    line: "A Burst of Fruity Goodness",
    description:
      "A delightful blend of kiwi, berries, mango and cherry, bringing together vibrant colours, fruity flavours and enjoyable textures for everyday enjoyment.",
    ingredients: [
      { name: "Kiwi", color: "#8DB043", img: kiwi },
      { name: "Berries", color: "#5B2A4A", img: berriesImg },
      { name: "Mango", color: "#F2A93B", img: mango },
      { name: "Cherry", color: "#C0303A", img: cherry },
    ],
    cover: berriesBowl,
    allergen: "", // confirm with your supplier, then fill in
    vegetarian: null, // set true once confirmed
  },
];
