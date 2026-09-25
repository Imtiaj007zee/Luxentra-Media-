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
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
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
