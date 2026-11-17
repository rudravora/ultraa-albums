import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HomeSections } from "@/components/HomeSections";
import { SkipLink } from "@/components/ui";

export const HomePage = () => (
  <>
    <SkipLink />
    <Header />
    <main id="main-content" className="bg-white text-black">
      <Hero />
      <HomeSections />
    </main>
    <Footer />
  </>
);
