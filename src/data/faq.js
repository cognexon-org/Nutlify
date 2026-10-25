import { site } from "../config/site";

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
    a: site.whatsapp
      ? "Tap any order button and send us the prefilled WhatsApp message. We’ll confirm availability, price and delivery."
      : `Tap any order button to email us at ${site.email}. We’ll confirm availability, price and delivery.`,
  },
  {
    q: "Where do you deliver, and how do I pay?",
    a: [
      site.ordering.deliveryAreas
        ? `We currently deliver to ${site.ordering.deliveryAreas}.`
        : "We’re starting with local deliveries. Message us your city and pincode and we’ll confirm whether we can reach you.",
      site.ordering.payment ? `You can pay by ${site.ordering.payment}.` : "We’ll share payment options when we confirm your order.",
    ].join(" "),
  },
  {
    q: "Can I order NUVANA as a gift?",
    a: "Yes. Choose the Diwali gift bag (both pouches and a card) or the gift box with two jars, or give the 300 g box. For bulk orders, message us with the quantity, date and delivery city.",
  },
];
