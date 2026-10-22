import { site } from "../config/site";

export const faq = [
  {
    q: "What exactly is in NUVANA?",
    a: "Sliced almonds, cashews, walnuts and pistachios, with seeds and raisins. The full ingredient list is printed on every pack.",
  },
  {
    q: "Why is everything sliced?",
    a: "Slicing means every handful has a little of each nut, instead of one whole almond or cashew. It also makes NUVANA easy to sprinkle over breakfast, desserts or a bowl of curd.",
  },
  {
    q: "Does it contain allergens?",
    a: "Yes. NUVANA contains tree nuts: almonds, cashews, walnuts and pistachios. Please check the pack label before eating if you have a nut allergy.",
  },
  {
    q: "Which pack should I pick?",
    a: "The 300 g box suits home, sharing and gifting. The 70 g zipper pouch is easy to carry and a good way to try the mix first.",
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
    a: "Yes. The 300 g box is designed to be given. For festive or bulk orders, see the gifting section or message us with the quantity, date and delivery city.",
  },
];
