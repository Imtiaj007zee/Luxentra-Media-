import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";
import { useT } from "@/react-app/lib/siteContent";

export default function NotFoundPage() {
  const t = useT();
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col relative">
      <SiteNav />

      {/* Ambient canvas, same as the home page: soft lime glows bleeding
          across the whole scroll behind every section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 55% 22% at 50% 16%, rgba(199,255,0,0.05), transparent 70%)",
            "radial-gradient(ellipse 50% 20% at 50% 36%, rgba(199,255,0,0.028), transparent 70%)",
            "radial-gradient(ellipse 55% 20% at 50% 56%, rgba(199,255,0,0.035), transparent 70%)",
            "radial-gradient(ellipse 50% 20% at 50% 76%, rgba(199,255,0,0.028), transparent 70%)",
            "radial-gradient(ellipse 60% 22% at 50% 94%, rgba(199,255,0,0.05), transparent 70%)",
          ].join(","),
        }}
      />
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[15px] tracking-[0.2em] uppercase text-white/40 mb-4">
          {t("notfound.eyebrow")}
        </p>
        <h1 className="text-[72px] md:text-[110px] font-bold tracking-[-0.03em] leading-none">
          {t("notfound.h1")}
        </h1>
        <p className="mt-4 text-lg text-white/70 max-w-md">{t("notfound.copy")}</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c7ff00] px-6 py-3 text-[15px] font-semibold text-black hover:brightness-110 transition"
        >
          <ArrowLeft size={16} /> {t("notfound.cta")}
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
