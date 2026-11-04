import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useLiveCatalog, useT } from "@/react-app/lib/siteContent";
import { useSiteSettings } from "@/react-app/lib/siteSettings";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";
import FaqSection from "@/react-app/components/FaqSection";

/* ── Scroll reveal wrapper (same pattern as the other pages) ── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${className} transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
}

/* ── Real estate film landing page ────────────────────────────
   Ranking page for real estate film searches in NYC and Long
   Island. Supporting page in the program: personal branding is
   the flagship, and this page hands readers over to it. Every
   word is a backstage copy key (film.*), prices read the live
   catalog, same as the rest of the site. */
export default function FilmPage() {
  const t = useT();
  const { settings } = useSiteSettings();
  const { bundles } = useLiveCatalog();

  const premiere = bundles.find((b) => b.id === "listing-premiere") ?? bundles[0];
  const filmBundles = bundles.filter(
    (b) => b.id === "listing-premiere" || b.id === "agent-authority"
  );
  const areas = t("film.areas_list")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const steps = [
    { title: t("film.step1_title"), copy: t("film.step1_copy") },
    { title: t("film.step2_title"), copy: t("film.step2_copy") },
    { title: t("film.step3_title"), copy: t("film.step3_copy") },
  ];
  const stats = [
    { value: `${settings.stat_properties}`, label: t("film.stat1_label") },
    { value: `$${settings.stat_value_m}M`, label: t("film.stat2_label") },
    { value: `${settings.stat_success_rate}%`, label: t("film.stat3_label") },
  ];

  return (
    <div className="bg-[#0b0b0b] text-white min-h-screen relative">
      <SiteNav />

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

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 30%, rgba(199,255,0,0.10), transparent 70%)",
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{t("film.eyebrow")}</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="text-[48px] md:text-[88px] font-bold tracking-[-0.03em] leading-[1.02] max-w-4xl">
              {t("film.h1a")} <span className="text-[#c7ff00]">{t("film.h1b")}</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="text-[18px] md:text-[21px] text-white/60 leading-relaxed max-w-2xl mt-8">
              {t("film.hero_sub")}
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link to="/order" className="btn-lime">
                {t("film.cta_book")} <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/work#films"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-[15px] font-bold text-white hover:border-[#c7ff00] hover:text-[#c7ff00] transition-colors"
              >
                {t("film.cta_work")} <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={480}>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mt-16">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-[32px] md:text-[44px] font-bold tracking-tight text-white">
                    {s.value}
                  </p>
                  <p className="text-[13px] md:text-[14px] text-white/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The film package (Listing Premiere, live catalog) ── */}
      {premiere && (
        <section className="py-20 md:py-28">
          <div className="max-w-[1200px] mx-auto px-6">
            <Reveal>
              <p className="eyebrow text-[#c7ff00] mb-6">{t("film.included_eyebrow")}</p>
              <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
                {t("film.included_h2")}
              </h2>
              <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
                {t("film.included_copy")}
              </p>
            </Reveal>
            <Reveal delay={140}>
              <div className="rounded-md border border-white/10 bg-white/[0.03] p-6 md:p-10 mt-12 grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-[24px] font-bold tracking-tight">{premiere.name}</h3>
                  <p className="mt-4">
                    <span className="text-[44px] font-bold tracking-tight">
                      ${premiere.price.toLocaleString()}
                    </span>{" "}
                    <span className="text-white/50 text-[15px]">{t("film.pkg_per")}</span>
                  </p>
                  <Link to={`/order?package=${premiere.id}`} className="btn-lime mt-8 inline-flex">
                    {t("film.pkg_cta")} <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <p className="text-[13px] text-white/40 mt-6">{t("film.pkg_note")}</p>
                </div>
                <ul className="space-y-3 self-center">
                  {premiere.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[16px] text-white/80">
                      <Check className="w-5 h-5 text-[#c7ff00] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Film bundles ─────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{t("film.bundles_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {t("film.bundles_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
              {t("film.bundles_copy")}
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-4xl">
            {filmBundles.map((b, i) => (
              <Reveal key={b.id} delay={i * 140}>
                <div
                  className={`rounded-md border bg-white/[0.03] p-6 h-full flex flex-col ${
                    b.featured ? "border-[#c7ff00]/70" : "border-white/10"
                  }`}
                >
                  {b.badge && (
                    <p className="text-[12px] font-bold uppercase tracking-wide text-[#c7ff00] mb-3">
                      {b.badge}
                    </p>
                  )}
                  <h3 className="text-[22px] font-bold tracking-tight">{b.name}</h3>
                  <p className="text-[15px] text-white/55 mt-2">{b.blurb}</p>
                  <p className="text-[36px] font-bold tracking-tight mt-6">
                    ${b.price.toLocaleString()}
                  </p>
                  <ul className="space-y-2.5 mt-6 mb-8">
                    {b.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[14px] text-white/75">
                        <Check className="w-4 h-4 text-[#c7ff00] shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/order?package=${b.id}`}
                    className="btn-lime mt-auto inline-flex justify-center"
                  >
                    {t("film.bundle_cta")} <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="text-[15px] text-white/50 mt-10">
              {t("film.bundles_note")}{" "}
              <Link to="/real-estate-photography" className="text-[#c7ff00] hover:underline">
                {t("film.bundles_note_link")}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Areas served ─────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{t("film.areas_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {t("film.areas_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
              {t("film.areas_copy")}
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-wrap gap-3 mt-10">
              {areas.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-[15px] font-medium text-white/85"
                >
                  {a}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{t("film.process_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {t("film.process_h2")}
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 140}>
                <p className="text-[15px] font-bold text-[#c7ff00] mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-[20px] font-bold tracking-tight">{s.title}</h3>
                <p className="text-[16px] text-white/60 leading-relaxed mt-3">{s.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Personal branding, the main craft ────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(199,255,0,0.10), transparent 70%)",
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6 text-center">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{t("film.brand_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl mx-auto">
              {t("film.brand_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-xl mx-auto mt-6">
              {t("film.brand_copy")}
            </p>
            <Link to="/branding" className="btn-lime mt-10 inline-flex">
              {t("film.brand_cta")} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <FaqSection />

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl mx-auto">
              {t("film.final_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-xl mx-auto mt-6">
              {t("film.final_copy")}
            </p>
            <Link to="/order" className="btn-lime mt-10 inline-flex">
              {t("film.final_cta")} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
