import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true }, // e.g. "Dry Fruit & Seed Mix"
    variant: { type: String, required: true, trim: true }, // e.g. "70 g pouch"
    category: { type: String, enum: ["pack", "gift"], default: "pack" },
    mix: { type: String, enum: ["dryfruit", "berries", "both"], default: "dryfruit" },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 }, // selling price for 1 (rupees, incl. of all taxes)
    mrp: { type: Number, default: null, min: 0 }, // printed MRP; shown struck through when higher than price
    pairPrice: { type: Number, default: null, min: 0 }, // rupees for 2 (e.g. 449); null = no pair price
    stock: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true }, // shown on the site
    purchasable: { type: Boolean, default: true }, // can be added to cart (false = enquiry only)
    image: { type: String, default: "" }, // path under /public, used in cart and admin
    sort: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
