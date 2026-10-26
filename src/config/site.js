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
  // WhatsApp for enquiries (digits only, with country code). Leave empty to fall back to email.
  whatsapp: "917860274086",
  email: "nutlify@gmail.com",
  website: "nutlify.in",
  location: "Downtown Kanpur, Uttar Pradesh",

  // Product prices and stock now live in the database: edit them in the admin panel (/admin/products).

  // Delivery charges (rupees), decided by the delivery address at checkout:
  //   local = pincodes starting with these prefixes (Kanpur), state = rest of Uttar Pradesh, rest = rest of India.
  // offers = free delivery when the cart has at least `minQty` of a product (matched by its slug). Currently none.
  // Admins can also create "Free delivery" coupon codes in Admin > Coupons.
  shipping: {
    local: { label: "Kanpur", pincodePrefixes: ["208"], fee: 0 },
    state: { label: "Uttar Pradesh", name: "Uttar Pradesh", fee: 60 },
    rest: { label: "Rest of India", fee: 100 },
    // Product offers, e.g. [{ slug: "diwali-gift-bag", minQty: 2, label: "Free delivery on 2 or more Diwali gift bags" }]
    offers: [],
  },
  // Most of one item a customer can buy in one order.
  maxQtyPerItem: 20,
  // Optional: only accept these pincode prefixes, e.g. ["208", "226"]. Empty = deliver anywhere in India.
  pincodePrefixes: [],

  // Optional. Fill these in once confirmed; empty values are not shown.
  fssai: "",
  instagram: "",
  countryOfOrigin: "India",

  // Used for the site's link preview and the Packs intro.
  description: "Two mixes for everyday enjoyment: a dry fruit & seed mix and a fruit & berries mix.",

  // DRAFT brand story, written from the strategy doc. Rewrite it in your own words.
  // Set `signature` to e.g. "Your name, founder" to sign it; leave empty to hide.
  story: {
    heading: "Why we started Nutlify",
    paragraphs: [
      "Almonds, cashews, walnuts and raisins are already part of most Indian homes. We started Nutlify to make them easier to reach for every day: blended in the right proportions, packed well, and ready when you are.",
      "NUVANA is our first range: a Dry Fruit & Seed Mix and a Fruit & Berries Mix. We’re making them in small batches and listening closely to everyone who tries them.",
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

export const contactLabel = () => (site.whatsapp ? "Enquire on WhatsApp" : "Enquire by email");

/** "917860274086" -> "+91 78602 74086" */
export const whatsappDisplay = () => {
  const d = site.whatsapp || "";
  return d.length === 12 && d.startsWith("91") ? `+91 ${d.slice(2, 7)} ${d.slice(7)}` : d ? `+${d}` : "";
};
