import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useT } from "@/react-app/lib/siteContent";
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

/* ── Location landing page ────────────────────────────────────
   One component, two pages: personal branding for realtors in
   Queens (/personal-branding-queens, copy keys queens.*) and on
   Long Island (/personal-branding-long-island, keys island.*).
   Personal branding leads on both; film and photography are the
   supporting services, same hierarchy as the rest of the site. */
function LocationPage({
  prefix,
  otherLocationPath,
}: {
  prefix: "queens" | "island";
  otherLocationPath: string;
}) {
  const t = useT();
  const { settings } = useSiteSettings();
  const k = (name: string) => t(`${prefix}.${name}`);

  const areas = k("areas_list")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const services = [
    { title: k("svc1_title"), copy: k("svc1_copy"), cta: k("svc1_cta"), to: "/branding" },
    { title: k("svc2_title"), copy: k("svc2_copy"), cta: k("svc2_cta"), to: "/real-estate-film" },
    {
      title: k("svc3_title"),
      copy: k("svc3_copy"),
      cta: k("svc3_cta"),
      to: "/real-estate-photography",
    },
  ];
  const steps = [
    { title: k("step1_title"), copy: k("step1_copy") },
    { title: k("step2_title"), copy: k("step2_copy") },
    { title: k("step3_title"), copy: k("step3_copy") },
  ];
  const stats = [
    { value: `${settings.stat_properties}`, label: k("stat1_label") },
    { value: `$${settings.stat_value_m}M`, label: k("stat2_label") },
    { value: `${settings.stat_success_rate}%`, label: k("stat3_label") },
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
            <p className="eyebrow text-[#c7ff00] mb-6">{k("eyebrow")}</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="text-[48px] md:text-[88px] font-bold tracking-[-0.03em] leading-[1.02] max-w-4xl">
              {k("h1a")} <span className="text-[#c7ff00]">{k("h1b")}</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="text-[18px] md:text-[21px] text-white/60 leading-relaxed max-w-2xl mt-8">
              {k("hero_sub")}
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link to="/order" className="btn-lime">
                {k("cta_book")} <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/branding"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-[15px] font-bold text-white hover:border-[#c7ff00] hover:text-[#c7ff00] transition-colors"
              >
                {k("cta_branding")} <ArrowUpRight className="w-4 h-4 ml-1" />
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

      {/* ── Services, branding first ─────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{k("services_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {k("services_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
              {k("services_copy")}
            </p>
          </Reveal>
          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <div className="py-8 grid md:grid-cols-[1fr_1.4fr_auto] gap-4 md:gap-10 items-start">
                  <h3 className="text-[22px] font-bold tracking-tight flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#c7ff00] shrink-0 mt-1" />
                    {s.title}
                  </h3>
                  <p className="text-[16px] text-white/60 leading-relaxed">{s.copy}</p>
                  <Link
                    to={s.to}
                    className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[#c7ff00] hover:underline whitespace-nowrap"
                  >
                    {s.cta} <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Areas served ─────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{k("areas_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {k("areas_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
              {k("areas_copy")}
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
          <Reveal delay={220}>
            <p className="text-[15px] text-white/50 mt-10">
              {k("cross_note")}{" "}
              <Link to={otherLocationPath} className="text-[#c7ff00] hover:underline">
                {k("cross_link1")}
              </Link>
              {" · "}
              <Link to="/real-estate-film" className="text-[#c7ff00] hover:underline">
                {k("cross_link2")}
              </Link>
              {" · "}
              <Link to="/real-estate-photography" className="text-[#c7ff00] hover:underline">
                {k("cross_link3")}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">{k("process_eyebrow")}</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              {k("process_h2")}
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
              {k("final_h2")}
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-xl mx-auto mt-6">
              {k("final_copy")}
            </p>
            <Link to="/order" className="btn-lime mt-10 inline-flex">
              {k("final_cta")} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export function QueensPage() {
  return <LocationPage prefix="queens" otherLocationPath="/personal-branding-long-island" />;
}

export function LongIslandPage() {
  return <LocationPage prefix="island" otherLocationPath="/personal-branding-queens" />;
}
