/*
 * Search engine settings. The site address comes from NEXT_PUBLIC_SITE_URL (e.g. https://nutlify.in).
 * Keywords are what people search for; they're used in page titles, descriptions and copy.
 * Keep them honest: only words that describe what you actually sell.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://nutlify.in").replace(/\/$/, "");

export const seo = {
  brand: "Nutlify",
  product: "NUVANA",
  defaultTitle: "NUVANA by Nutlify | Buy Dry Fruit & Seed Mix and Fruit & Berries Mix Online",
  titleTemplate: "%s | Nutlify",
  description:
    "Buy NUVANA by Nutlify online: a premium dry fruit & seed mix (almonds, cashews, nuts, raisins, seeds) and a fruit & berries mix (kiwi, berries, mango, cherry). Diwali gift hampers and gift boxes. Free delivery in Kanpur, delivery across India.",
  keywords: [
    // brand
    "Nutlify", "NUVANA", "NUVANA dry fruit mix", "Nutlify Kanpur",
    // product
    "dry fruit mix", "mixed dry fruits", "dry fruit and seed mix", "nuts and seeds mix", "trail mix India",
    "almonds cashews raisins mix", "premium dry fruits", "fruit and berries mix", "dried fruit mix",
    "dried kiwi mango cherry berries", "dry fruit snack pouch",
    // buying
    "buy dry fruits online", "dry fruits online India", "dry fruits online Kanpur", "dry fruits in Kanpur",
    "dry fruits home delivery Kanpur",
    // gifting
    "Diwali gift hamper", "Diwali dry fruit gift", "dry fruit gift box", "dry fruit gift hamper",
    "Diwali gifts Kanpur", "corporate Diwali gifts", "festive gift hamper", "wedding return gifts dry fruits",
  ],
  locale: "en_IN",
  ogImage: "/og-image.jpg",
  // Shown in Google's business info. Fill in the street address when you're ready.
  address: { street: "", locality: "Kanpur", region: "Uttar Pradesh", postalCode: "208001", country: "IN" },
  areaServed: "IN",
};

export const abs = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
