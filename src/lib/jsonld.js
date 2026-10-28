import { seo, abs, SITE_URL } from "@/config/seo";
import { site } from "@/config/site";
import { mixes } from "@/data/mixes";

const phone = () => (site.whatsapp ? `+${site.whatsapp}` : undefined);

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": abs("/#organization"),
    name: seo.brand,
    alternateName: `${seo.product} by ${seo.brand}`,
    url: SITE_URL,
    logo: abs("/assets/nutlify-logo-green.png"),
    image: abs(seo.ogImage),
    description: seo.description,
    email: site.email,
    telephone: phone(),
    slogan: site.tagline,
    address: {
      "@type": "PostalAddress",
      ...(seo.address.street ? { streetAddress: seo.address.street } : {}),
      addressLocality: seo.address.locality,
      addressRegion: seo.address.region,
      postalCode: seo.address.postalCode,
      addressCountry: seo.address.country,
    },
    areaServed: { "@type": "Country", name: "India" },
    contactPoint: [{ "@type": "ContactPoint", contactType: "customer service", email: site.email, telephone: phone(), areaServed: "IN", availableLanguage: ["en", "hi"] }],
    sameAs: [site.instagram].filter(Boolean),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    name: `${seo.product} by ${seo.brand}`,
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: { "@id": abs("/#organization") },
  };
}

function mixIngredients(p) {
  const ids = p.mix === "both" ? ["dryfruit", "berries"] : [p.mix];
  return mixes.filter((m) => ids.includes(m.id)).flatMap((m) => m.ingredients.map((i) => i.name));
}

export function productLd(p) {
  const url = abs(`/products/${p.slug}`);
  const nextYear = `${new Date().getFullYear() + 1}-12-31`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: `${seo.product} ${p.name}${p.category === "pack" ? `, ${p.variant}` : ""}`,
    description: p.description,
    image: p.image ? [abs(p.image)] : undefined,
    sku: p.slug,
    brand: { "@type": "Brand", name: seo.brand },
    category: p.category === "gift" ? "Food Gift Baskets" : "Dried Fruits & Nuts",
    countryOfOrigin: "IN",
    additionalProperty: [{ "@type": "PropertyValue", name: "Ingredients", value: mixIngredients(p).join(", ") }],
    url,
    ...(p.purchasable
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "INR",
            price: String(p.price),
            priceValidUntil: nextYear,
            availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": abs("/#organization") },
          },
        }
      : {}),
  };
}

export function itemListLd(products) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${seo.product} products`,
    itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/products/${p.slug}`), name: `${seo.product} ${p.name}` })),
  };
}

export function faqLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbLd(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
  };
}
