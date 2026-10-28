import { abs } from "@/config/seo";
import { getStoreProducts } from "@/lib/products";
import { policies } from "@/data/policies";

export const revalidate = 3600;

export default async function sitemap() {
  const { products } = await getStoreProducts();
  const now = new Date();
  return [
    { url: abs("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...products.map((p) => ({ url: abs(`/products/${p.slug}`), lastModified: now, changeFrequency: "weekly", priority: 0.9 })),
    ...Object.keys(policies).map((slug) => ({ url: abs(`/policies/${slug}`), lastModified: now, changeFrequency: "yearly", priority: 0.3 })),
  ];
}
