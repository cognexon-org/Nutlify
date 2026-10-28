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
    a: "The pouches (70 g Dry Fruit & Seed, 80 g Fruit & Berries) are easy to carry and a good way to try each mix. For gifts, see the Diwali gift bag and the two-jar gift box.",
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
    q: "Do you deliver dry fruits in Kanpur?",
    a: `Yes. NUVANA is made in ${site.shipping.local.label}, and delivery is free to every ${site.shipping.local.label} pincode starting with ${site.shipping.local.pincodePrefixes.join(", ")}. We also deliver across ${site.shipping.state.label} and the rest of India.`,
  },
  {
    q: "Do you have Diwali gift hampers and dry fruit gift boxes?",
    a: "Yes. The Diwali gift hamper has one Dry Fruit & Seed Mix pouch, one Fruit & Berries Mix pouch and a Happy Diwali card in a carry bag. The premium gift box has one jar of each mix in a rigid box with a magnetic lid. Both can be ordered online, and you can buy two for a lower price.",
  },
  {
    q: "Can I order corporate or bulk Diwali gifts?",
    a: `Yes. For corporate gifting, wedding return gifts or other bulk orders, ${site.whatsapp ? "message us on WhatsApp" : `email us at ${site.email}`} with the quantity, date and delivery city, and we’ll confirm the price and delivery date.`,
  },
];
