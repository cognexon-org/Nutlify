import { site } from "../config/site";

export const faq = [
  {
    q: "What exactly is in NUVANA?",
    a: "Almonds, cashews, walnuts, pistachios, pumpkin seeds, sunflower seeds, regular raisins and black raisins. That’s the full ingredient list.",
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
    q: "Can I order NUVANA as a gift?",
    a: "Yes. The 300 g box is designed to be given. For festive or bulk gifting, message us with the quantity and date you need it by.",
  },
];
