import "server-only";
import Product from "@/lib/models/Product";
import { site } from "@/config/site";

export class CartError extends Error {
  constructor(message, status = 409) {
    super(message);
    this.status = status;
  }
}

const clean = (v, max = 80) => String(v ?? "").trim().slice(0, max);

/**
 * Turns [{slug, qty}] from the browser into priced lines using database prices and stock.
 * Throws CartError with a customer-friendly message if anything is wrong.
 */
export async function priceCart(rawItems) {
  const wanted = new Map();
  for (const line of Array.isArray(rawItems) ? rawItems.slice(0, 30) : []) {
    const slug = clean(line?.slug);
    const qty = Math.floor(Number(line?.qty));
    if (!slug || !Number.isFinite(qty) || qty < 1) continue;
    wanted.set(slug, Math.min((wanted.get(slug) || 0) + qty, site.maxQtyPerItem || 20));
  }
  if (!wanted.size) throw new CartError("Your cart is empty.", 400);

  const products = await Product.find({ slug: { $in: [...wanted.keys()] }, active: true, purchasable: true }).lean();
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const items = [];
  for (const [slug, qty] of wanted) {
    const p = bySlug.get(slug);
    if (!p) throw new CartError("Some items in your cart are no longer available. Please review your cart.");
    if (p.stock < qty)
      throw new CartError(p.stock > 0 ? `Only ${p.stock} left of ${p.name} (${p.variant}).` : `${p.name} (${p.variant}) is out of stock.`);
    items.push({ product: p._id, slug, name: p.name, variant: p.variant, price: p.price, qty, lineTotal: p.price * qty, image: p.image });
  }
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  return { items, subtotal };
}
