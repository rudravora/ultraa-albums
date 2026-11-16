import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink, primaryButton, ArrowIcon } from "@/components/ui";
import { Link } from "react-router-dom";

// ponytail: phase-1 placeholder; phase 2 brings back the scroll-driven 3D album here.
export const HomePage = () => (
  <>
    <SkipLink />
    <Header />
    <main id="main-content" className="bg-white text-black">
      <section id="hero-section" className="min-h-[100svh] bg-[#f8f7f4] flex items-center">
        <div className="w-full max-w-[1920px] mx-auto px-6 md:px-16 pt-32">
          <h1 className="max-w-[16ch] text-[46px] md:text-[72px] font-bold leading-[1.05] tracking-[-0.04em]">
            Your wedding story, <span className="text-black/40">beautifully printed to revisit for years</span>
          </h1>
          <p className="mt-6 max-w-[40ch] text-lg text-black/70">Keep wedding photographs together in a printed album.</p>
          <Link to="/contact-us" className={`${primaryButton} mt-10`}>Start your album <ArrowIcon /></Link>
        </div>
      </section>
    </main>
    <Footer />
  </>
);
