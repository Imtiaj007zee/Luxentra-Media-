import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Check, MoveRight } from "lucide-react";
import { useLiveCatalog, useT } from "@/react-app/lib/siteContent";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";

/* ── Scroll reveal wrapper ─────────────────────────────────── */
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

/* ── Branding packages (editable at /backstage) ─────────────── */
export default function BrandingPage() {
  const t = useT();
  const { brandingPlans, getBrandingPlanById } = useLiveCatalog();
  const PACKAGES = brandingPlans.filter((p) => p.id !== "brand-content");
  const BRAND_CONTENT = getBrandingPlanById("brand-content")!;

  const SHIFTS = useMemo(
    () =>
      t("branding.shifts")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [from, to] = l.split("|").map((s) => s.trim());
          return { from: from ?? "", to: to ?? "" };
        }),
    [t]
  );
  const HANDLED = useMemo(
    () =>
      t("branding.handled")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    [t]
  );

  return (
    <div className="bg-[#0b0b0b] text-white min-h-screen relative">
      <SiteNav />

      {/* ── Continuous-flow ambient canvas: soft glows bleed across
          section boundaries so the page reads as one scroll, not boxes ── */}
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
            <p className="eyebrow text-[#c7ff00] mb-6">{t("branding.hero_eyebrow")}</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="text-[48px] md:text-[88px] font-bold tracking-[-0.03em] leading-[1.02] max-w-4xl">
              {t("branding.h1a")}{" "}
              <span className="text-[#c7ff00]">{t("branding.h1b")}</span>{" "}
              {t("branding.h1c")}
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="text-[18px] md:text-[21px] text-white/60 leading-relaxed max-w-2xl mt-8">
              {t("branding.hero_sub")}
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link to="/work#films-personal-branding" className="btn-lime">
                {t("branding.hero_films")} <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
              <a
                href="#shift"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-[15px] font-bold text-white hover:border-[#c7ff00] hover:text-[#c7ff00] transition-colors"
              >
                {t("branding.hero_shift")}
              </a>
              <a href="#packages" className="btn-lime">
                {t("branding.hero_packages")} <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The market is becoming people-first ───────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{t("branding.why_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {t("branding.why_h2")}
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[t("branding.why_p1"), t("branding.why_p2")].map((copy, i) => (
              <Reveal key={i} delay={i * 140}>
                <p className="text-[17px] text-white/60 leading-relaxed border-l-2 border-[#c7ff00]/40 pl-6">
                  {copy}
                </p>
              </Reveal>
            ))}
            <Reveal delay={280}>
              <p className="text-[24px] md:text-[28px] font-bold tracking-tight leading-tight text-white border-l-2 border-[#c7ff00] pl-6">
                {t("branding.why_pull")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── The Shift ────────────────────────────────────── */}
      <section id="shift" className="py-20 md:py-28 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{t("branding.shift_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] mb-12">
              {t("branding.shift_h2")}
            </h2>
          </Reveal>
          <div className="space-y-4">
            {SHIFTS.map((s, i) => (
              <Reveal key={s.from} delay={i * 140}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 rounded-md bg-white/[0.03] border border-white/10 px-6 md:px-10 py-6 md:py-8 hover:border-[#c7ff00]/40 transition-colors">
                  <span className="text-[20px] md:text-[26px] font-medium text-white/35 line-through decoration-white/25 flex-1">
                    {s.from}
                  </span>
                  <span className="hidden sm:flex w-12 h-12 shrink-0 rounded-full bg-[#c7ff00] items-center justify-center">
                    <MoveRight className="w-5 h-5 text-black" />
                  </span>
                  <span className="sm:hidden text-[#c7ff00] text-[14px] font-bold uppercase tracking-[0.2em]">
                    {t("branding.becomes")}
                  </span>
                  <span className="text-[24px] md:text-[34px] font-bold tracking-tight text-[#c7ff00] flex-1 sm:text-right">
                    {s.to}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── We handle everything ─────────────────────────── */}
      <section className="pt-20 md:pt-28 pb-10 md:pb-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05]">
              {t("branding.handle_h2a")} <span className="text-[#c7ff00]">{t("branding.handle_h2b")}</span>
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
              {t("branding.handle_copy")}
            </p>
            <p className="text-[24px] md:text-[32px] font-bold tracking-tight mt-4">
              {t("branding.handle_goal")}
            </p>
          </Reveal>
          <div className="flex flex-wrap gap-3 mt-10">
            {HANDLED.map((h, i) => (
              <Reveal key={h} delay={i * 70} className="inline-block">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[15px] font-medium text-white/80 hover:border-[#c7ff00]/60 hover:text-white transition-colors">
                  <Check className="w-4 h-4 text-[#c7ff00]" />
                  {h}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ─────────────────────────────────────── */}
      <section id="packages" className="pt-10 md:pt-14 pb-20 md:pb-28 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{t("branding.pkg_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {t("branding.pkg_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
              {t("branding.pkg_copy")}
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-5 mt-14 items-stretch">
            {PACKAGES.map((p, i) => (
              <Reveal key={p.id} delay={i * 140} className="h-full">
                <div
                  className={`relative rounded-md p-8 flex flex-col h-full transition-transform duration-300 hover:-translate-y-1.5 ${
                    p.featured
                      ? "bg-[#101010] border-2 border-[#c7ff00] shadow-[0_0_60px_-12px_rgba(199,255,0,0.45)]"
                      : "bg-white/[0.03] border border-white/10 hover:border-white/25"
                  }`}
                >
                  {p.featured && (
                    <div className="mb-6 -mt-2">
                      <span className="blink-attention inline-block rounded-full bg-[#c7ff00] text-black text-[13px] font-extrabold uppercase tracking-[0.08em] px-4 py-2 shadow-[0_0_24px_rgba(199,255,0,0.7)]">
                        {p.badge}
                      </span>
                      <p className="text-[13px] text-white/50 mt-2 leading-snug">
                        {t("branding.moneyback_note")}
                      </p>
                    </div>
                  )}

                  <p className="eyebrow text-white/40 mb-3">{p.name}</p>
                  <h3 className="text-[26px] font-bold tracking-tight">{p.tagline}</h3>
                  <p className="text-[15px] text-white/55 leading-relaxed mt-3 mb-6">
                    {p.desc}
                  </p>

                  <p className="mb-8">
                    <span className="price-num text-[44px] font-bold tracking-[-0.03em] text-white">
                      ${p.price.toLocaleString()}
                    </span>
                    <span className="text-white/45 text-[15px]"> /month</span>
                  </p>

                  <ul className="space-y-3 mb-10">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[14.5px] text-white/70 leading-snug">
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#c7ff00]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Link
                      to={`/order?package=${p.id}`}
                      className={
                        p.featured
                          ? "btn-lime w-full"
                          : "inline-flex w-full items-center justify-center rounded-full border border-white/25 px-7 py-3 text-[15px] font-bold text-white hover:border-[#c7ff00] hover:text-[#c7ff00] transition-colors"
                      }
                    >
                      {t("branding.choose")} {p.name} <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>
                    <p className="text-[12.5px] text-white/40 leading-snug text-center mt-4">
                      {t("branding.pkg_note")}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="text-[14px] text-white/40 leading-relaxed max-w-3xl mt-10">
              {t("branding.ads_note")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Brand Content ────────────────────────────────── */}
      {BRAND_CONTENT && (
        <section className="py-20 md:py-28">
          <div className="max-w-[1200px] mx-auto px-6">
            <Reveal>
              <div className="rounded-md bg-white/[0.03] border border-white/10 p-8 md:p-12 grid lg:grid-cols-2 gap-10 items-center hover:border-[#c7ff00]/40 transition-colors">
                <div>
                  <p className="eyebrow text-[#c7ff00] mb-4">{t("branding.bc_eyebrow")}</p>
                  <p className="mb-2">
                    <span className="price-num text-[44px] md:text-[56px] font-bold tracking-[-0.03em]">
                      ${BRAND_CONTENT.price.toLocaleString()}
                    </span>
                    <span className="text-white/45 text-[16px]"> /month</span>
                  </p>
                  <p className="text-[16px] text-white/60 leading-relaxed max-w-md">
                    {t("branding.bc_copy")}
                  </p>
                  <Link to={`/order?package=${BRAND_CONTENT.id}`} className="btn-lime mt-8">
                    {t("branding.choose")} {BRAND_CONTENT.name}{" "}
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div>
                  <ul className="space-y-3.5">
                    {BRAND_CONTENT.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[15px] text-white/75 leading-snug">
                        <Check className="w-5 h-5 shrink-0 text-[#c7ff00]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[13.5px] text-white/40 mt-6">{t("branding.bc_note")}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Not sure where to start ──────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[900px] mx-auto px-6">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-md border border-[#c7ff00]/25 p-8 md:p-14 text-center"
              style={{
                background:
                  "radial-gradient(ellipse 80% 90% at 50% 0%, rgba(199,255,0,0.08), transparent 70%), rgba(255,255,255,0.03)",
              }}
            >
              <p className="eyebrow text-[#c7ff00] mb-6">{t("branding.start_eyebrow")}</p>
              <h2 className="text-[32px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.08]">
                {t("branding.start_h2a")}{" "}
                <span className="text-[#c7ff00]">{t("branding.start_h2b")}</span>
              </h2>
              <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed max-w-2xl mx-auto mt-6">
                {t("branding.start_p1")}
              </p>
              <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed max-w-2xl mx-auto mt-4">
                {t("branding.start_p2")}
              </p>
              <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed max-w-2xl mx-auto mt-4">
                {t("branding.start_p3")}
              </p>
              <div className="mt-10">
                <Link to="/order?package=consultation" className="btn-lime text-[16px] px-9 py-4">
                  {t("branding.start_cta")} <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(199,255,0,0.12), transparent 70%)",
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-[40px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05]">
              {t("branding.final_h2a")}
              <br />
              <span className="text-[#c7ff00]">{t("branding.final_h2b")}</span>
            </h2>
            <div className="mt-10">
              <Link to="/order" className="btn-lime text-[17px] px-10 py-4">
                {t("branding.final_cta")} <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
