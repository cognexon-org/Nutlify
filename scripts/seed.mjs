// Usage: npm run seed
// Adds the starting products to MongoDB. Existing products (matched by slug) are left untouched,
// so running it again never overwrites prices or stock you've changed in the admin panel.
import fs from "node:fs";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is missing. Add it to .env.local first.");
  process.exit(1);
}
const products = JSON.parse(fs.readFileSync(new URL("../src/data/products.json", import.meta.url), "utf8"));

const Product =
  mongoose.models.Product ||
  mongoose.model(
    "Product",
    new mongoose.Schema(
      {
        slug: { type: String, unique: true },
        name: String,
        variant: String,
        category: String,
        mix: String,
        description: String,
        price: Number,
        mrp: Number,
        pairPrice: Number,
        stock: Number,
        active: Boolean,
        purchasable: Boolean,
        image: String,
        sort: Number,
      },
      { timestamps: true }
    )
  );

await mongoose.connect(uri);
let added = 0;
for (const p of products) {
  const res = await Product.updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true });
  if (res.upsertedCount) added++;
}
console.log(`Done. ${added} new product(s) added, ${products.length - added} already existed.`);
await mongoose.disconnect();
