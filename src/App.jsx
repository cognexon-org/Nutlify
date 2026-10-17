import Header from "./components/Header";
import Hero from "./components/Hero";
import Blend from "./components/Blend";
import Packs from "./components/Packs";
import Moments from "./components/Moments";
import Process from "./components/Process";
import Feedback from "./components/Feedback";
import NextLines from "./components/NextLines";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

export default function App() {
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
        <Blend />
        <Packs />
        <Moments />
        <Process />
        <Feedback />
        <NextLines />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
