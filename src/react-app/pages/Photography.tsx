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

/* ── Real estate photography landing page ─────────────────────
   Ranking page for listing photography searches in NYC and Long
   Island. Every word is a backstage copy key (photo.*), every price
   reads the live catalog and settings, same as the rest of the site. */
export default function PhotographyPage() {
  const t = useT();
  const { settings } = useSiteSettings();
  const { bundles } = useLiveCatalog();

  const features = t("photo.pkg_features")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const areas = t("photo.areas_list")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const steps = [
    { title: t("photo.step1_title"), copy: t("photo.step1_copy") },
    { title: t("photo.step2_title"), copy: t("photo.step2_copy") },
    { title: t("photo.step3_title"), copy: t("photo.step3_copy") },
  ];
  const stats = [
    { value: `${settings.stat_properties}`, label: t("photo.stat1_label") },
    { value: `$${settings.stat_value_m}M`, label: t("photo.stat2_label") },
    { value: `${settings.stat_success_rate}%`, label: t("photo.stat3_label") },
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
            <p className="eyebrow text-[#c7ff00] mb-6">{t("photo.eyebrow")}</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="text-[48px] md:text-[88px] font-bold tracking-[-0.03em] leading-[1.02] max-w-4xl">
              {t("photo.h1a")} <span className="text-[#c7ff00]">{t("photo.h1b")}</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="text-[18px] md:text-[21px] text-white/60 leading-relaxed max-w-2xl mt-8">
              {t("photo.hero_sub")}
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link to="/order" className="btn-lime">
                {t("photo.cta_book")} <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/work"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-[15px] font-bold text-white hover:border-[#c7ff00] hover:text-[#c7ff00] transition-colors"
              >
                {t("photo.cta_work")} <ArrowUpRight className="w-4 h-4 ml-1" />
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

      {/* ── Listing Essentials ───────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{t("photo.included_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {t("photo.included_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
              {t("photo.included_copy")}
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-6 md:p-10 mt-12 grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-[24px] font-bold tracking-tight">{t("photo.pkg_title")}</h3>
                <p className="mt-4">
                  <span className="text-[44px] font-bold tracking-tight">
                    ${settings.price_standard.toLocaleString()}
                  </span>{" "}
                  <span className="text-white/50 text-[15px]">{t("photo.pkg_per")}</span>
                </p>
                <Link to="/order" className="btn-lime mt-8 inline-flex">
                  {t("photo.pkg_cta")} <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <p className="text-[13px] text-white/40 mt-6">{t("photo.pkg_note")}</p>
              </div>
              <ul className="space-y-3 self-center">
                {features.map((f) => (
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

      {/* ── Launch bundles ───────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{t("photo.bundles_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {t("photo.bundles_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
              {t("photo.bundles_copy")}
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {bundles.map((b, i) => (
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
                    {t("photo.bundle_cta")} <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Personal branding (the main craft) ───────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{t("photo.branding_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {t("photo.branding_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
              {t("photo.branding_copy")}
            </p>
            <Link to="/branding" className="btn-lime mt-10 inline-flex">
              {t("photo.branding_cta")} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Areas served ─────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{t("photo.areas_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {t("photo.areas_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
              {t("photo.areas_copy")}
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
            <p className="eyebrow text-[#c7ff00] mb-6">{t("photo.process_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {t("photo.process_h2")}
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

      <FaqSection />

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl mx-auto">
              {t("photo.final_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-xl mx-auto mt-6">
              {t("photo.final_copy")}
            </p>
            <Link to="/order" className="btn-lime mt-10 inline-flex">
              {t("photo.final_cta")} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
