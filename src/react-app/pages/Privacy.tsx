import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";
import { useT } from "@/react-app/lib/siteContent";

export default function PrivacyPage() {
  const t = useT();

  const sections = useMemo(
    () =>
      t("privacy.sections")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [title, body] = line.split("===");
          return { title: (title ?? "").trim(), body: (body ?? "").trim() };
        })
        .filter((s) => s.title && s.body),
    [t]
  );

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white relative">
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
      <main className="relative mx-auto max-w-3xl px-6 pb-24 pt-32">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-lime-300 hover:text-lime-200"
        >
          <ArrowLeft size={16} /> {t("privacy.back")}
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">{t("privacy.h1")}</h1>
        <p className="mt-3 text-sm text-white/50">{t("privacy.updated")}</p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-semibold text-lime-300">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-white/70">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
