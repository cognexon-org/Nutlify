import "server-only";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import seed from "@/data/products.json";

const plain = (p) => ({
  id: String(p._id ?? p.slug),
  slug: p.slug,
  name: p.name,
  variant: p.variant,
  category: p.category,
  mix: p.mix,
  description: p.description,
  price: p.price,
  stock: p.stock,
  purchasable: p.purchasable,
  image: p.image,
});

/**
 * Active products for the storefront. If the database can't be reached (e.g. local
 * development before .env.local is set up), falls back to the seed list so the site still renders.
 */
export async function getStoreProducts() {
  try {
    await connectDB();
    const rows = await Product.find({ active: true }).sort({ sort: 1, createdAt: 1 }).lean();
    return { products: rows.map(plain), live: true };
  } catch (err) {
    console.warn("[store] Database unavailable, showing seed products:", err.message);
    return { products: seed.filter((p) => p.active).map(plain), live: false };
  }
}
