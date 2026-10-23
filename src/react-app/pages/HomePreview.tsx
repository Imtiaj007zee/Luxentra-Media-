import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";
import FaqSection from "@/react-app/components/FaqSection";
import LeadCapturePopup from "@/react-app/components/LeadCapturePopup";
import ServicePickerModal from "@/react-app/components/ServicePickerModal";
import { useT } from "@/react-app/lib/siteContent";
import {
  ScarcityBar,
  Hero,
  ScrollDrivenLogo,
  WorkStrip,
  TypedRotator,
  ProofTicker,
  ServicesGrid,
  ListingEssentials,
  Bundles,
  CustomCTA,
  AddOns,
  WhyLuxEntra,
  ProcessSteps,
  ImpactStats,
} from "@/react-app/pages/Home";

// ── New first screen: brand title on top, the ring in the middle,
// and the typed line as the bottom row. Everything from the current
// homepage follows below as the "second page", untouched and in order.

function TitleBlock() {
  return (
    <section className="bg-[#070707] text-white overflow-hidden px-4 pt-2 pb-7 md:pt-3 md:pb-8">
      <h1 className="text-center font-extrabold uppercase leading-[0.92] tracking-[-0.01em]">
        <span className="block text-[12vw] md:text-[84px]">LuxEntra</span>
        <span className="block text-[12vw] md:text-[84px]">Media</span>
      </h1>
    </section>
  );
}

export default function HomePreviewPage() {
  const t = useT();

  return (
    <div className="min-h-screen bg-white text-black pt-[104px]">
      <ScarcityBar />
      <SiteNav topOffset={40} />
      <ServicePickerModal />
      <LeadCapturePopup />

      {/* ── First screen: one composed viewport, Shamim-style ── */}
      <div className="bg-[#070707] flex flex-col justify-center min-h-[calc(100dvh-104px)]">
        <TitleBlock />
        <div className="-mt-6 -mb-10 md:-mt-7 md:-mb-12">
          <WorkStrip bare />
        </div>
        <ScrollDrivenLogo />
        <TypedRotator tight />
      </div>

      {/* ── Second page: the current homepage, in its own order ── */}
      <Hero />
      <ProofTicker />
      <ServicesGrid />
      <ListingEssentials />
      <Bundles />
      <CustomCTA />
      <AddOns />
      <WhyLuxEntra />
      <ProcessSteps />
      <ImpactStats />

      <FaqSection />

      <section id="about" className="bg-[#0b0b0b] text-white py-24 md:py-32 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <img src="/brand/symbol-lime.png" alt="" aria-hidden className="h-14 w-14 object-contain mx-auto mb-10" />
          <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-10">
            {t("home.final_h2")}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/order" className="btn-lime">
              {t("home.final_cta1")}
            </Link>
            <Link to="/about" className="inline-flex items-center gap-1 text-white font-medium text-[17px] hover:text-[#c7ff00] transition-colors">
              {t("home.final_cta2")} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
