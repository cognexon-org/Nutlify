import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Blend from "@/components/Blend";
import Packs from "@/components/Packs";
import Moments from "@/components/Moments";
import Gifting from "@/components/Gifting";
import Process from "@/components/Process";
import Feedback from "@/components/Feedback";
import NextLines from "@/components/NextLines";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import { getStoreProducts } from "@/lib/products";

// Re-read prices and stock from the database at most once a minute.
export const revalidate = 60;

export default async function HomePage() {
  const { products } = await getStoreProducts();
  return (
    <>
      <a
        href="#inside"
        className="sr-only z-[60] rounded-full bg-brand px-4 py-2 text-on-brand focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main>
        <Hero />
        <Gifting products={products} />
        <Blend />
        <Packs products={products} />
        <Moments />
        <Story />
        <Process />
        <Feedback />
        <NextLines />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
