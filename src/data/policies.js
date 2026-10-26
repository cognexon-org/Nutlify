import { site, whatsappDisplay } from "@/config/site";
import { deliveryRatesText } from "@/lib/pricing";

/*
 * DRAFT policy pages. Razorpay asks for these before activating live payments.
 * Read every page, change anything that doesn't match how you actually work, and fill in
 * the [BRACKETED] details. This is not legal advice; have them reviewed if you're unsure.
 */
const updated = "October 2026";
const biz = "Nutlify";

export const policies = {
  shipping: {
    title: "Shipping & delivery",
    body: [
      ["Where we deliver", `We deliver across India. ${site.pincodePrefixes?.length ? "At the moment we only accept orders for selected pincodes; the checkout will tell you if yours isn’t covered yet." : ""}`],
      ["When your order ships", "Orders are packed and handed to our courier within [2–3] working days of payment. During festive periods this can take a little longer; we’ll tell you if there’s a delay."],
      ["Delivery time", "Most orders arrive within [3–7] working days after dispatch, depending on your location."],
      ["Delivery charges", `${deliveryRatesText()}. ${(site.shipping?.offers || []).map((o) => o.label).join(". ")}${site.shipping?.offers?.length ? ". " : ""}Free delivery codes, when we run them, are applied at checkout. The exact charge for your address is shown before you pay.`],
      ["Tracking", "Once your order ships, its tracking details appear on your order page (the link you see after paying)."],
      ["Contact", `For delivery questions write to ${site.email} with your order number.`],
    ],
  },
  refunds: {
    title: "Cancellations & refunds",
    body: [
      ["Cancelling an order", `You can cancel an order before it is shipped by writing to ${site.email} with your order number. We’ll refund the full amount.`],
      ["Damaged or wrong items", `Because these are food products, we can’t accept returns of opened packs. If your order arrives damaged, tampered with or incorrect, email ${site.email} within [48 hours] of delivery with photos, and we’ll send a replacement or a refund.`],
      ["Refund timing", "Approved refunds are made to your original payment method through Razorpay within [5–7] working days. Your bank may take a few more days to show it."],
      ["Failed payments", "If money left your account but the order wasn’t confirmed, it is usually returned automatically by your bank or Razorpay within 5–7 working days. Contact us if it isn’t."],
    ],
  },
  terms: {
    title: "Terms & conditions",
    body: [
      ["About us", `This website is run by ${biz} ([REGISTERED BUSINESS NAME], [FULL ADDRESS]). By using it or placing an order you agree to these terms.`],
      ["Products and prices", "Prices are in Indian Rupees and are MRP inclusive of all taxes. We may change prices or availability at any time; the price you pay is the one shown at checkout."],
      ["Orders", "An order is confirmed once payment is received. We may cancel and fully refund an order if an item is unavailable or if we can’t deliver to your address."],
      ["Allergens", "Our products contain or may contain nuts and other allergens. Always read the label on the pack before eating."],
      ["Payments", "Payments are processed securely by Razorpay. We never see or store your card or bank details."],
      ["Governing law", "These terms are governed by the laws of India. Courts in [CITY] have jurisdiction."],
      ["Last updated", updated],
    ],
  },
  privacy: {
    title: "Privacy policy",
    body: [
      ["What we collect", "When you order, we collect your name, phone number, email address and delivery address. Payment details are handled by Razorpay and never reach us."],
      ["How we use it", "Only to process and deliver your order, contact you about it, and answer your questions. We don’t sell your information."],
      ["Who we share it with", "Our courier partner (to deliver your order) and Razorpay (to process your payment)."],
      ["On this device", "The site stores your cart, theme choice and checkout details in your browser so they’re there next time. You can clear them from your browser settings."],
      ["Your choices", `To see, correct or delete the information we hold about you, email ${site.email}.`],
      ["Last updated", updated],
    ],
  },
  contact: {
    title: "Contact us",
    body: [
      ["Email", site.email],
      ["Phone / WhatsApp", whatsappDisplay() || "[ADD PHONE NUMBER]"],
      ["Address", `[FULL REGISTERED ADDRESS], ${site.location}`],
      ["Business name", "[REGISTERED BUSINESS NAME]"],
    ],
  },
};
