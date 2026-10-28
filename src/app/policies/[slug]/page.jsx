import { notFound } from "next/navigation";
import SimpleHeader from "@/components/SimpleHeader";
import Footer from "@/components/Footer";
import { policies } from "@/data/policies";

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = policies[slug];
  if (!p) return { title: "Policy" };
  const first = p.body[0]?.[1] || "";
  return {
    title: p.title,
    description: `${p.title} for NUVANA by Nutlify. ${first}`.slice(0, 160),
    alternates: { canonical: `/policies/${slug}` },
  };
}

export default async function PolicyPage({ params }) {
  const { slug } = await params;
  const p = policies[slug];
  if (!p) notFound();
  return (
    <>
      <SimpleHeader />
      <main className="container-x max-w-3xl py-12 sm:py-16">
        <h1 className="text-4xl text-ink sm:text-5xl">{p.title}</h1>
        <div className="mt-10 space-y-8">
          {p.body.map(([h, text]) => (
            <section key={h}>
              <h2 className="font-serif text-2xl text-ink">{h}</h2>
              <p className="mt-2 text-muted">{text}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
