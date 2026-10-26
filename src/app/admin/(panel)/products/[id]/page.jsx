import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { saveProduct } from "../../../actions";

const input = "w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-gold";

function F({ label, hint, children }) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export default async function EditProduct({ params }) {
  const { id } = await params;
  const isNew = id === "new";
  let p = { name: "", variant: "", slug: "", category: "pack", mix: "dryfruit", description: "", price: 0, stock: 0, image: "", sort: 10, active: true, purchasable: true };
  if (!isNew) {
    if (!mongoose.isValidObjectId(id)) notFound();
    await connectDB();
    const found = await Product.findById(id).lean();
    if (!found) notFound();
    p = found;
  }

  return (
    <>
      <Link href="/admin/products" className="text-sm text-gold hover:underline">← All products</Link>
      <h1 className="mb-8 mt-3 font-serif text-4xl text-ink">{isNew ? "Add product" : `${p.name}, ${p.variant}`}</h1>

      <form action={saveProduct} className="grid max-w-3xl gap-5 sm:grid-cols-2">
        <input type="hidden" name="id" value={isNew ? "new" : String(p._id)} />
        <F label="Name"><input name="name" required defaultValue={p.name} className={input} placeholder="Dry Fruit & Seed Mix" /></F>
        <F label="Variant"><input name="variant" required defaultValue={p.variant} className={input} placeholder="70 g pouch" /></F>
        <F label="Price (₹, MRP incl. taxes)"><input name="price" type="number" min="0" step="1" required defaultValue={p.price} className={input} /></F>
        <F label="Stock" hint="Goes down automatically when an order is paid."><input name="stock" type="number" min="0" step="1" required defaultValue={p.stock} className={input} /></F>
        <F label="Section">
          <select name="category" defaultValue={p.category} className={input}>
            <option value="pack">Packs</option>
            <option value="gift">Gifting</option>
          </select>
        </F>
        <F label="Mix" hint="Used for the vegetarian and allergen details.">
          <select name="mix" defaultValue={p.mix} className={input}>
            <option value="dryfruit">Dry Fruit & Seed Mix</option>
            <option value="berries">Fruit & Berries Mix</option>
            <option value="both">Both</option>
          </select>
        </F>
        <div className="sm:col-span-2">
          <F label="Description"><textarea name="description" rows={3} defaultValue={p.description} className={input} /></F>
        </div>
        <F label="Image path" hint="A file in public/assets, e.g. /assets/pouch-cream.webp"><input name="image" defaultValue={p.image} className={input} /></F>
        <F label="Slug" hint="Unique short name, letters, numbers and dashes. Don’t change it once orders exist."><input name="slug" required defaultValue={p.slug} className={input} /></F>
        <F label="Order on page" hint="Lower numbers show first."><input name="sort" type="number" step="1" defaultValue={p.sort} className={input} /></F>
        <div className="flex flex-col justify-end gap-3 text-sm">
          <label className="flex items-center gap-2 text-ink"><input type="checkbox" name="active" defaultChecked={p.active} /> Show on the site</label>
          <label className="flex items-center gap-2 text-ink"><input type="checkbox" name="purchasable" defaultChecked={p.purchasable} /> Can be bought online (untick for enquiry only)</label>
        </div>
        <div className="sm:col-span-2">
          <button className="btn-primary">Save product</button>
        </div>
      </form>
    </>
  );
}
