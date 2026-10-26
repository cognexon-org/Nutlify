import { site } from "@/config/site";

export const faq = [
  {
    q: "What’s in each NUVANA mix?",
    a: "The Dry Fruit & Seed Mix has almonds, cashews, nuts, raisins and seeds. The Fruit & Berries Mix has kiwi, berries, mango and cherry. The full ingredient list is printed on every pack.",
  },
  {
    q: "Does it contain allergens?",
    a: "The Dry Fruit & Seed Mix contains nuts. For the Fruit & Berries Mix, please check the allergen information on the pack. If you have a food allergy, always read the label before eating.",
  },
  {
    q: "Which pack should I pick?",
    a: "The pouches (70 g Dry Fruit & Seed, 80 g Fruit & Berries) are easy to carry and a good way to try each mix. The 300 g box of the Dry Fruit & Seed Mix suits home and sharing. For gifts, see the Diwali gift bag and the two-jar gift box.",
  },
  {
    q: "How should I store it?",
    a: "Keep it in a cool, dry place away from direct sunlight, and close the pack tightly after opening.",
  },
  {
    q: "How do I order?",
    a: `Add what you’d like to your cart and pay securely online with UPI, cards, net banking or wallets. For bulk or gifting orders, ${
      site.whatsapp ? "message us on WhatsApp" : `email us at ${site.email}`
    } and we’ll confirm price and delivery.`,
  },
  {
    q: "Where do you deliver, and how do I pay?",
    a: [
      site.ordering.deliveryAreas
        ? `We currently deliver to ${site.ordering.deliveryAreas}.`
        : "We deliver across India; the checkout tells you if your pincode isn’t covered yet.",
      `Delivery is free in ${site.shipping.local.label}, ₹${site.shipping.state.fee} in the rest of ${site.shipping.state.label} and ₹${site.shipping.rest.fee} elsewhere in India.`,
      "You pay online at checkout through Razorpay: UPI, cards, net banking or wallets.",
    ].join(" "),
  },
  {
    q: "Can I order NUVANA as a gift?",
    a: "Yes. Choose the Diwali gift bag (both pouches and a card) or the gift box with two jars, or give the 300 g box. For bulk orders, message us with the quantity, date and delivery city.",
  },
];
