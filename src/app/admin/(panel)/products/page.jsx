import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { money, PageTitle } from "../../ui";

export default async function ProductsPage({ searchParams }) {
  const { saved } = await searchParams;
  await connectDB();
  const products = await Product.find().sort({ sort: 1, createdAt: 1 }).lean();

  return (
    <>
      <PageTitle actions={<Link href="/admin/products/new" className="btn-primary !py-2.5">Add product</Link>}>Products</PageTitle>
      {saved && <p role="status" className="mb-6 rounded-lg bg-surface px-4 py-3 text-sm text-ink">Saved. The shop updates within a minute.</p>}
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface/60 text-muted">
            <tr>
              <th className="px-5 py-3 font-normal">Product</th>
              <th className="px-5 py-3 font-normal">Section</th>
              <th className="px-5 py-3 text-right font-normal">Price</th>
              <th className="px-5 py-3 text-right font-normal">Stock</th>
              <th className="px-5 py-3 font-normal">On site</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p._id}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-lg bg-surface">
                      {p.image && <img src={p.image} alt="" className="h-full w-full object-contain p-0.5" />}
                    </div>
                    <div>
                      <p className="text-ink">{p.name}</p>
                      <p className="text-muted">{p.variant}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 capitalize text-muted">{p.category === "gift" ? "Gifting" : "Packs"}</td>
                <td className="px-5 py-3 text-right text-ink">{p.mrp && p.mrp > p.price ? <span className="block text-xs text-muted line-through">{money(p.mrp)}</span> : null}{money(p.price)}{p.pairPrice ? <span className="block text-xs text-muted">2 for {money(p.pairPrice)}</span> : null}</td>
                <td className={`px-5 py-3 text-right ${p.stock === 0 ? "text-[#B4532A]" : "text-ink"}`}>{p.stock}</td>
                <td className="px-5 py-3 text-muted">{p.active ? (p.purchasable ? "Yes" : "Enquiry only") : "Hidden"}</td>
                <td className="px-5 py-3 text-right"><Link href={`/admin/products/${p._id}`} className="text-gold hover:underline">Edit</Link></td>
              </tr>
            ))}
            {!products.length && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-muted">No products yet. Run <code>npm run seed</code> to add the starting products.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
