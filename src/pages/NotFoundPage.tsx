import { Link } from "react-router-dom";
import { ArrowIcon, PageShell, primaryButton } from "@/components/ui";

export const NotFoundPage = () => (
  <PageShell>
    <h1 className="text-[40px] md:text-[64px] font-semibold leading-[1.05] tracking-[-0.04em]">Page not found</h1>
    <p className="mt-6 text-lg text-black/60">This page does not exist or has moved.</p>
    <Link to="/" className={`${primaryButton} mt-10`}>Back to home <ArrowIcon /></Link>
  </PageShell>
);
