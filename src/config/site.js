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
  location: "Kanpur, Uttar Pradesh",

  // Set a number (e.g. 699) once MRP is validated. null shows "Price on request".
  prices: {
    box300: null,
    pouch70: null,
  },

  // Optional. Fill these in once confirmed; empty values are not shown.
  fssai: "",
  instagram: "",
};

/** Builds an order/enquiry link: WhatsApp if a number is set, otherwise email. */
export function contactLink(message) {
  const text = encodeURIComponent(message);
  if (site.whatsapp) return `https://wa.me/${site.whatsapp}?text=${text}`;
  return `mailto:${site.email}?subject=${encodeURIComponent("NUVANA enquiry")}&body=${text}`;
}

export const contactLabel = () => (site.whatsapp ? "Order on WhatsApp" : "Order by email");
