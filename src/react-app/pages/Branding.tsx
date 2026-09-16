import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Check, MoveRight } from "lucide-react";
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

/* ── Page data ─────────────────────────────────────────────── */

const SHIFTS = [
  { from: "Company-first", to: "People-first" },
  { from: "Random posts", to: "Strategic influence" },
  { from: "Views and followers", to: "Leads and sales" },
];

const HANDLED = [
  "Strategy",
  "Scripting",
  "Filming",
  "Editing",
  "Posting",
  "Platform management",
  "Lead funnels",
  "Paid advertising",
];

const PACKAGES = [
  {
    id: "essential",
    name: "Essential",
    price: "$5,999",
    tagline: "Build Your Presence",
    desc: "For professionals who need a consistent, polished, and fully managed personal brand.",
    features: [
      "15 short-form videos",
      "5 carousel posts",
      "15–20 stories",
      "Personal-brand and content strategy",
      "Monthly content planning",
      "Scripts, hooks, storytelling frameworks, and calls to action",
      "Professional filming and editing",
      "Captions, scheduling, and publishing",
      "Instagram, Facebook, and TikTok management",
      "Trend and algorithm research",
      "Monthly performance summary",
    ],
    featured: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "$7,999",
    tagline: "Turn Attention Into Leads",
    desc: "For professionals ready to expand their reach and turn content engagement into qualified opportunities.",
    features: [
      "20 short-form videos",
      "10 carousel posts",
      "30 stories",
      "Everything included in Essential",
      "In-depth competitor and audience research",
      "Offer and campaign positioning",
      "Complete lead-generation funnel",
      "Lead-capture page or inquiry form",
      "Clear booking or consultation pathway",
      "Lead tracking and follow-up framework",
      "Paid-ad strategy and campaign development",
      "Advertising creatives and copy",
      "Audience targeting",
      "Campaign setup and management",
      "Dedicated brand-management device purchased, set up, and operated by our team",
      "Detailed monthly performance reporting",
    ],
    featured: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$10,999",
    tagline: "Convert, Optimize, and Scale",
    desc: "Our most advanced system for turning content into leads, potential clients, and measurable revenue opportunities.",
    features: [
      "30 short-form videos",
      "15 carousel posts",
      "60 stories",
      "Everything included in Growth",
      "Advanced multi-stage lead-generation funnel",
      "Full-funnel advertising strategy",
      "Audience targeting and retargeting",
      "Continuous campaign testing and optimization",
      "Lead-nurturing and conversion framework",
      "Advanced algorithm and audience analysis",
      "Platform monetization preparation and optimization",
      "Advanced performance and conversion reporting",
      "Priority production and account support",
      "50% money-back guarantee if the agreed-upon performance benchmark is not achieved, subject to the campaign terms",
    ],
    featured: true,
  },
];

const BRAND_CONTENT_FEATURES = [
  "4 branding videos per month",
  "Strategy, scripting, filming, and editing",
  "1 complimentary video in your first month",
  "15% off additional services",
  "3-month minimum commitment",
];

export default function BrandingPage() {
  return (
    <div className="bg-[#0b0b0b] text-white min-h-screen">
      <SiteNav />

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
            <p className="eyebrow text-[#c7ff00] mb-6">Personal Branding · Fully Managed</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="text-[48px] md:text-[88px] font-bold tracking-[-0.03em] leading-[1.02] max-w-4xl">
              Be the name <span className="text-[#c7ff00]">everyone</span> remembers.
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="text-[18px] md:text-[21px] text-white/60 leading-relaxed max-w-2xl mt-8">
              Your next client will meet your content before they meet you. We turn your
              expertise and personality into trust, qualified leads, and revenue.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <a href="#packages" className="btn-lime">
                Choose your package <ArrowRight className="w-4 h-4 ml-1" />
              </a>
              <a
                href="#shift"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-[15px] font-bold text-white hover:border-[#c7ff00] hover:text-[#c7ff00] transition-colors"
              >
                See the shift
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The market is becoming people-first ───────────── */}
      <section className="py-20 md:py-28 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">Why personal brand wins</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              The market is becoming people-first.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              "Customers don't only compare services anymore — they compare the people behind them.",
              "In the next two to three years, your personal brand will increasingly determine who gets discovered, trusted, and hired.",
            ].map((copy, i) => (
              <Reveal key={i} delay={i * 140}>
                <p className="text-[17px] text-white/60 leading-relaxed border-l-2 border-[#c7ff00]/40 pl-6">
                  {copy}
                </p>
              </Reveal>
            ))}
            <Reveal delay={280}>
              <p className="text-[24px] md:text-[28px] font-bold tracking-tight leading-tight text-white border-l-2 border-[#c7ff00] pl-6">
                If they don't see you, they'll see your competitor.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── The Shift ────────────────────────────────────── */}
      <section id="shift" className="py-20 md:py-28 border-t border-white/10 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">The shift</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] mb-12">
              Attention has new rules.
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
                    becomes
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
      <section className="py-20 md:py-28 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05]">
              We handle <span className="text-[#c7ff00]">everything.</span>
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
              Strategy, scripting, filming, editing, posting, platform management, lead
              funnels, and paid advertising — all connected to one goal:
            </p>
            <p className="text-[24px] md:text-[32px] font-bold tracking-tight mt-4">
              Turning attention into clients.
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
      <section id="packages" className="py-20 md:py-28 border-t border-white/10 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <p className="eyebrow text-[#c7ff00] mb-6">Personal branding packages</p>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] max-w-3xl">
              Choose how far you want to take your brand.
            </h2>
            <p className="text-[17px] text-white/60 leading-relaxed max-w-2xl mt-6">
              Each package is designed for a different stage of growth — from building a
              consistent presence to generating leads and scaling revenue.
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
                        Money-back guarantee
                      </span>
                      <p className="text-[13px] text-white/50 mt-2 leading-snug">
                        50% money-back if the agreed-upon performance benchmark is not
                        achieved, subject to the campaign terms.
                      </p>
                    </div>
                  )}

                  <p className="eyebrow text-white/40 mb-3">{p.name}</p>
                  <h3 className="text-[26px] font-bold tracking-tight">{p.tagline}</h3>
                  <p className="text-[15px] text-white/55 leading-relaxed mt-3 mb-6">
                    {p.desc}
                  </p>

                  <p className="mb-8">
                    <span className="text-[44px] font-bold tracking-[-0.03em] text-white">
                      {p.price}
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
                      to="/order"
                      className={
                        p.featured
                          ? "btn-lime w-full"
                          : "inline-flex w-full items-center justify-center rounded-full border border-white/25 px-7 py-3 text-[15px] font-bold text-white hover:border-[#c7ff00] hover:text-[#c7ff00] transition-colors"
                      }
                    >
                      Choose {p.name} <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>
                    <p className="text-[12.5px] text-white/40 leading-snug text-center mt-4">
                      3-month minimum commitment. Active clients get 15% off
                      additional services during their agreement.
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="text-[14px] text-white/40 leading-relaxed max-w-3xl mt-10">
              Paid-ad management is included with Growth and Premium. The monthly platform
              advertising budget will be clearly defined in the client's service agreement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Brand Content ────────────────────────────────── */}
      <section className="py-20 md:py-28 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <Reveal>
            <div className="rounded-md bg-white/[0.03] border border-white/10 p-8 md:p-12 grid lg:grid-cols-2 gap-10 items-center hover:border-[#c7ff00]/40 transition-colors">
              <div>
                <p className="eyebrow text-[#c7ff00] mb-4">Brand content</p>
                <p className="mb-2">
                  <span className="text-[44px] md:text-[56px] font-bold tracking-[-0.03em]">
                    $1,800
                  </span>
                  <span className="text-white/45 text-[16px]"> /month</span>
                </p>
                <p className="text-[16px] text-white/60 leading-relaxed max-w-md">
                  Already have your brand but need professional content? We'll handle the
                  production and deliver videos ready to post.
                </p>
                <Link to="/order" className="btn-lime mt-8">
                  Choose Brand Content <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div>
                <ul className="space-y-3.5">
                  {BRAND_CONTENT_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px] text-white/75 leading-snug">
                      <Check className="w-5 h-5 shrink-0 text-[#c7ff00]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[13.5px] text-white/40 mt-6">
                  Content production only. Social media management is not included.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-t border-white/10 relative overflow-hidden">
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
              Your competitors are posting.
              <br />
              <span className="text-[#c7ff00]">Are you being remembered?</span>
            </h2>
            <div className="mt-10">
              <Link to="/order" className="btn-lime text-[17px] px-10 py-4">
                Build my brand <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
