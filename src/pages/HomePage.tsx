import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { SkipLink } from "@/components/ui";

export const HomePage = () => (
  <>
    <SkipLink />
    <Header />
    <main id="main-content" className="bg-white text-black">
      <Hero />
      {/* ponytail: phase 3 adds the Parmar-layout sections below the hero. */}
      <section aria-label="More sections coming" className="min-h-[60vh] bg-white" />
    </main>
    <Footer />
  </>
);
