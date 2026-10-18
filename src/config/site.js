/**
 * Everything you are likely to edit lives here.
 * Nothing on the site states a price, nutrition value or shelf life
 * until you fill it in below (see the strategy doc's guardrails).
 */
export const site = {
  brand: "Nutlify",
  product: "NUVANA",
  tagline: "Nourish Naturally. Thrive Daily.",
  productLine: "Goodness In Every Bite",
  descriptor: "Premium Dry Fruit & Seed Mix",

  // WhatsApp number in international format, digits only, e.g. "919812345678".
  // Leave empty to hide WhatsApp buttons (orders then fall back to email).
  whatsapp: "",
  email: "nutlify@gmail.com",
  website: "nutlify.in",
  location: "Downtown Kanpur, Uttar Pradesh",

  // MRP in rupees, inclusive of all taxes (from the final packaging).
  // Set to null to show "Price on request" instead.
  prices: {
    box300: 699,
    pouch70: 89,
  },

  // Optional. Fill these in once confirmed; empty values are not shown.
  fssai: "",
  instagram: "",
  countryOfOrigin: "India",

  // Approved copy from the back panel.
  description: "A thoughtfully prepared blend of nuts, seeds and two varieties of raisins for everyday enjoyment.",

  // DRAFT brand story, written from the strategy doc. Rewrite it in your own words.
  // Set `signature` to e.g. "Your name, founder" to sign it; leave empty to hide.
  story: {
    heading: "Why we started Nutlify",
    paragraphs: [
      "Almonds, cashews, walnuts and raisins are already part of most Indian homes. We started Nutlify to make them easier to reach for every day: blended in the right proportions, packed well, and ready when you are.",
      "NUVANA is our first mix. We’re making it in small batches and listening closely to everyone who tries it.",
    ],
    signature: "",
  },

  // Ordering details. Empty values fall back to "message us and we’ll confirm".
  ordering: {
    deliveryAreas: "", // e.g. "Kanpur and Lucknow"
    payment: "", // e.g. "UPI or cash on delivery"
  },

  // Gifting details. Empty values are not shown.
  gifting: {
    minQuantity: "", // e.g. "10 boxes"
    leadTime: "", // e.g. "5 working days"
    messageCards: true, // set false if you don't offer personal message cards
  },
};

/** Builds an order/enquiry link: WhatsApp if a number is set, otherwise email. */
export function contactLink(message) {
  const text = encodeURIComponent(message);
  if (site.whatsapp) return `https://wa.me/${site.whatsapp}?text=${text}`;
  return `mailto:${site.email}?subject=${encodeURIComponent("NUVANA enquiry")}&body=${text}`;
}

export const contactLabel = () => (site.whatsapp ? "Order on WhatsApp" : "Order by email");
