// Usage: npm run update-prices
// Sets prices in MongoDB from scripts/prices.json, matched by product slug:
//   { "diwali-gift-bag": { "price": 249, "pairPrice": 449 } }
// "mrp" = printed MRP (shown struck through), "price" = selling price for 1,
// "pairPrice" = price for 2. Use null to remove an MRP or a pair price.
// "active": false hides a product from the site (true shows it again).
// Only the fields you list are changed. You can also edit prices any time in Admin > Products.
import fs from "node:fs";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is missing. Run this from the project folder with .env.local set up.");
  process.exit(1);
}
const prices = JSON.parse(fs.readFileSync(new URL("./prices.json", import.meta.url), "utf8"));

await mongoose.connect(uri);
const products = mongoose.connection.db.collection("products");

for (const [slug, change] of Object.entries(prices)) {
  const set = {};
  if (change.price != null) set.price = Math.round(Number(change.price));
  if ("active" in change) set.active = Boolean(change.active);
  if ("mrp" in change) set.mrp = change.mrp == null ? null : Math.round(Number(change.mrp));
  if ("pairPrice" in change) set.pairPrice = change.pairPrice == null ? null : Math.round(Number(change.pairPrice));
  const res = await products.updateOne({ slug }, { $set: { ...set, updatedAt: new Date() } });
  if (!res.matchedCount) console.warn(`✗ ${slug}: no product with this slug`);
  else if (set.active === false && Object.keys(set).length === 1) console.log(`✓ ${slug}: hidden from the site`);
  else console.log(`✓ ${slug}: ${set.active === true ? "shown on the site, " : ""}${set.mrp ? `MRP ₹${set.mrp}, ` : ""}${set.price != null ? `₹${set.price} for 1` : ""}${set.pairPrice ? `, ₹${set.pairPrice} for 2` : set.pairPrice === null ? ", no pair price" : ""}`);
}
console.log("\nDone. The shop shows the new prices within a minute.");
await mongoose.disconnect();
