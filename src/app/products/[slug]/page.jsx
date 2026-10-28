import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PriceTag from "@/components/PriceTag";
import AddToCart from "@/components/cart/AddToCart";
import GiftBoxPhoto from "@/components/GiftBoxPhoto";
import VegMark from "@/components/VegMark";
import JsonLd from "@/components/seo/JsonLd";
import { getStoreProduct, getStoreProducts } from "@/lib/products";
import { productLd, breadcrumbLd } from "@/lib/jsonld";
import { deliveryRatesText } from "@/lib/pricing";
import { mixes } from "@/data/mixes";
import { productContent } from "@/data/productContent";
import { seo } from "@/config/seo";
import { site, contactLink } from "@/config/site";
import seedProducts from "@/data/products.json";

export const revalidate = 60;

export function generateStaticParams() {
  return seedProducts.filter((p) => p.active !== false).map((p) => ({ slug: p.slug }));
}

const heading = (p) => (p.category === "pack" ? `${seo.product} ${p.name}, ${p.variant}` : `${seo.product} ${p.name}`);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getStoreProduct(slug);
  if (!p) return { title: "Product not found", robots: { index: false } };
  const c = productContent[slug] || {};
  const title = c.seoTitle || heading(p);
  const description = c.seoDescription || p.description;
  return {
    title: { absolute: `${title} | ${seo.brand}` },
    description,
    keywords: [...(c.keywords || []), ...seo.keywords.slice(0, 8)],
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      type: "website",
      url: `/products/${slug}`,
      title,
      description,
      images: p.image ? [{ url: p.image, alt: heading(p) }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: p.image ? [p.image] : undefined },
  };
}

function Art({ p }) {
  if (p.slug === "gift-box-two-jars") return <GiftBoxPhoto className="!aspect-square [&_img]:object-[80%_50%]" />;
  if (p.category === "gift")
    return (
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-[#E9D6B2]">
        <img src={p.image} alt={heading(p)} className="h-full w-full object-cover" />
      </div>
    );
  return (
    <div className="grid aspect-square w-full place-items-center rounded-2xl bg-surface/60">
      <img src={p.image} alt={`${heading(p)} pack`} className="h-[88%] w-auto drop-shadow-[0_28px_30px_rgba(40,24,12,0.35)]" />
    </div>
  );
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = await getStoreProduct(slug);
  if (!p) notFound();
  const { products } = await getStoreProducts();
  const c = productContent[slug] || {};
  const mixList = mixes.filter((m) => (p.mix === "both" ? true : m.id === p.mix));
  const section = p.category === "gift" ? { name: "Gifting", path: "/#gifting" } : { name: "Packs", path: "/#packs" };
  const crumbs = [{ name: "Home", path: "/" }, section, { name: heading(p), path: `/products/${slug}` }];
  const related = products.filter((x) => x.slug !== slug);
  const veg = mixList.length && mixList.every((m) => m.vegetarian);
  const allergens = mixList.map((m) => m.allergen).filter(Boolean);

  return (
    <>
      <JsonLd data={[productLd(p), breadcrumbLd(crumbs)]} />
      <Header />
      <main className="container-x pb-20 pt-24 sm:pt-28">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((c2, i) => (
              <li key={c2.path} className="flex items-center gap-2">
                {i < crumbs.length - 1 ? <Link href={c2.path} className="hover:text-ink">{c2.name}</Link> : <span className="text-ink" aria-current="page">{c2.name}</span>}
                {i < crumbs.length - 1 && <span aria-hidden="true">›</span>}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Art p={p} />
          <div className="flex flex-col">
            <p className="descriptor text-sm">{p.category === "gift" ? "Gift" : p.name}</p>
            <h1 className="mt-3 text-4xl text-ink sm:text-5xl">{c.h1 || heading(p)}</h1>
            <p className="mt-5 max-w-prose text-lg text-muted">{c.intro || p.description}</p>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-y border-line py-6">
              <PriceTag product={p} className="!text-left" />
              <div className="flex flex-wrap gap-3">
                <AddToCart product={p} />
                {p.category === "gift" && (
                  <a href={contactLink(`Hi Nutlify, I’d like a bulk order of the NUVANA ${p.name}.\nNumber needed: \nNeeded by (date): \nDelivery city: `)} target="_blank" rel="noreferrer" className="btn-ghost">
                    Bulk enquiry
                  </a>
                )}
              </div>
            </div>
            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-muted">Pack</dt><dd className="text-ink">{p.category === "pack" ? p.variant : p.description}</dd></div>
              <div><dt className="text-muted">Country of origin</dt><dd className="text-ink">{site.countryOfOrigin}</dd></div>
              {veg ? <div><dt className="text-muted">Diet</dt><dd className="flex items-center gap-2 text-ink"><VegMark /> Vegetarian</dd></div> : null}
              {allergens.length ? <div><dt className="text-muted">Allergens</dt><dd className="text-ink">{allergens.join("; ")}</dd></div> : null}
              <div className="sm:col-span-2"><dt className="text-muted">Delivery</dt><dd className="text-ink">{deliveryRatesText()}.</dd></div>
              <div className="sm:col-span-2"><dt className="text-muted">Storage</dt><dd className="text-ink">Store in a cool, dry place away from direct sunlight. Keep the pack tightly closed after opening.</dd></div>
            </dl>
          </div>
        </div>

        <section className="mt-20" aria-labelledby="inside-title">
          <h2 id="inside-title" className="text-3xl text-ink sm:text-4xl">What’s inside</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {mixList.map((m) => (
              <div key={m.id}>
                <h3 className="text-2xl text-ink">NUVANA {m.name}</h3>
                <p className="mt-2 text-muted">{m.description}</p>
                <ul className="mt-5 flex flex-wrap gap-4">
                  {m.ingredients.map((i) => (
                    <li key={i.name} className="flex w-24 flex-col items-center text-center">
                      <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-cream ring-1 ring-[#E3CFAA]">
                        <img src={i.img} alt={i.name} loading="lazy" className="w-[80%]" />
                      </span>
                      <span className="mt-2 text-sm text-ink">{i.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">The full ingredient list is printed on every pack.</p>
        </section>

        {c.uses?.length ? (
          <section className="mt-16" aria-labelledby="uses-title">
            <h2 id="uses-title" className="text-3xl text-ink sm:text-4xl">Good for</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {c.uses.map((u) => (
                <li key={u} className="flex items-start gap-3 text-ink">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                  {u}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {related.length > 0 && (
          <section className="mt-20" aria-labelledby="related-title">
            <h2 id="related-title" className="text-3xl text-ink sm:text-4xl">You may also like</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/products/${r.slug}`} className="group flex items-center gap-4 rounded-2xl border border-line p-4 hover:bg-surface/50">
                    <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface">
                      {r.image && <img src={r.image} alt="" loading="lazy" className="h-full w-full object-contain p-1" />}
                    </span>
                    <span>
                      <span className="block text-ink group-hover:underline">{heading(r)}</span>
                      <span className="text-sm text-muted">₹{r.price}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
