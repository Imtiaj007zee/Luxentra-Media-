import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Check, Play } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";
import FaqSection from "@/react-app/components/FaqSection";
import ProofSection from "@/react-app/components/ProofSection";
import LeadCapturePopup from "@/react-app/components/LeadCapturePopup";
import ServicePickerModal, { openServicePicker } from "@/react-app/components/ServicePickerModal";

const SERVICES = [
  {
    n: "01",
    label: "PHOTOGRAPHY",
    title: "Make the first look count.",
    copy: "Interior and exterior photography and twilight imagery. Ready for your listing.",
    cta: "Explore photography",
    href: "/work?tab=photos",
    dark: false,
  },
  {
    n: "02",
    label: "PERSONAL BRANDING",
    title: "Be the name everyone remembers.",
    copy: "Your next client will meet your content before they meet you. We turn your expertise and personality into trust, qualified leads, and revenue.",
    cta: "Build my brand",
    href: "/branding",
    dark: true,
  },
  {
    n: "03",
    label: "FILM",
    title: "Give the space a story.",
    copy: "Walkthrough films and aerial perspectives that show how a property feels and connects.",
    cta: "Watch the film",
    href: "/work#films",
    dark: false,
  },
];

const PACKAGE_FEATURES = [
  "25–45 MLS-ready photos",
  "1 twilight photo",
  "24-hour delivery",
  "Private branded gallery",
  "Light, color & exposure revisions",
];

import { LAUNCH_BUNDLES } from "@/react-app/data/packages";

const ADD_ONS = [  { name: "Custom Listing Flyer", price: "$39", note: "$39 for one" },
  { name: "Virtual Staging", price: "From $40", note: "From $40" },
  { name: "Drone Photos & Video", price: "$99", note: "$99" },
  { name: "3D Virtual Tour", price: "$99", note: "$99" },
  { name: "Walkthrough/Cinematic Video", price: "$299", note: "$299" },
  { name: "Creative Personal Branding Reel", price: "$499", note: "$499" },
];

const STEPS = [
  {
    n: "01",
    title: "Tell us about the property.",
    copy: "Choose your media and preferred shoot date. We'll get back to you within 24 hours to confirm the details.",
  },
  {
    n: "02",
    title: "We take care of the shoot.",
    copy: "Our team captures the space and prepares the photography, films and extras you selected.",
  },
  {
    n: "03",
    title: "Your media. Ready to share.",
    copy: "Download your files through a private branded gallery, with formats ready for your listing.",
  },
];

function FeaturedTwilight() {
  return (
    <Link
      to="/work?tab=photos&filter=twilight"
      className="relative block w-full rounded-md overflow-hidden bg-[#1a1a1a] text-left group"
      aria-label="View twilight photography"
    >
      <img
        src="/work/photos/new-twilight-4.jpg"
        alt="Twilight exterior of a featured property"
        loading="lazy"
        className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-500"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="eyebrow text-[#c7ff00] block mb-1">Twilight</span>
        <span className="text-white text-[17px] font-bold tracking-tight block">
          View twilight photos
        </span>
      </span>
    </Link>
  );
}

// ── Real Estate Impact Dashboard ─────────────────────────────

const IMPACT_METRICS = [
  {
    id: "properties-covered",
    value: 27,
    decimals: 0,
    prefix: "",
    suffix: "+",
    ring: 100,
    label: "Properties Covered",
    desc: "Homes we've shot and marketed so far.",
  },
  {
    id: "value-covered",
    value: 18.3,
    decimals: 1,
    prefix: "$",
    suffix: "M+",
    ring: 100,
    label: "Property Value Covered",
    desc: "Combined value of the homes we've covered.",
  },
  {
    id: "success-rate",
    value: 92,
    decimals: 0,
    prefix: "",
    suffix: "%+",
    ring: 100,
    label: "Marketing Success Rate",
    desc: "Clients who got the result they wanted.",
  },
];

function useCountUp(target: number, decimals: number, start: boolean, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) {
      setVal(0);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return val.toFixed(decimals);
}

function ImpactGauge({
  id,
  percent,
  started,
  children,
}: {
  id: string;
  percent: number;
  started: boolean;
  children: React.ReactNode;
}) {
  const R = 88;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative w-[216px] h-[216px] md:w-[236px] md:h-[236px] shrink-0">
      <svg viewBox="0 0 220 220" className="w-full h-full -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={`gauge-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e6ff70" />
            <stop offset="100%" stopColor="#9dbf00" />
          </linearGradient>
        </defs>
        {Array.from({ length: 48 }).map((_, i) => {
          const a = (i / 48) * Math.PI * 2;
          const major = i % 4 === 0;
          const r1 = 104;
          const r2 = major ? 96 : 100;
          return (
            <line
              key={i}
              x1={110 + r1 * Math.cos(a)}
              y1={110 + r1 * Math.sin(a)}
              x2={110 + r2 * Math.cos(a)}
              y2={110 + r2 * Math.sin(a)}
              stroke={major ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.1)"}
              strokeWidth={major ? 2 : 1}
            />
          );
        })}
        <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="110"
          cy="110"
          r={R}
          fill="none"
          stroke={`url(#gauge-grad-${id})`}
          strokeWidth="10"
          strokeLinecap="butt"
          strokeDasharray={C}
          strokeDashoffset={started ? C * (1 - percent / 100) : C}
          className="gauge-arc"
          style={{
            transition: "stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1)",
            filter: "drop-shadow(0 0 10px rgba(199,255,0,0.45))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

function ImpactCard({
  metric,
  index,
  started,
}: {
  metric: (typeof IMPACT_METRICS)[number];
  index: number;
  started: boolean;
}) {
  const display = useCountUp(metric.value, metric.decimals, started);
  return (
    <div
      className={`impact-card relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-8 py-10 flex flex-col items-center text-center overflow-hidden transition-all duration-700 ease-out ${
        started ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: started ? `${index * 130}ms` : "0ms" }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#c7ff00]/70 to-transparent" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 bg-[#c7ff00]/[0.06] blur-[60px] rounded-full pointer-events-none" />
      <ImpactGauge id={metric.id} percent={metric.ring} started={started}>
        <p className="text-[36px] md:text-[42px] font-bold tracking-[-0.03em] leading-none text-white tabular-nums whitespace-nowrap">
          {metric.prefix}
          {display}
          {metric.suffix}
        </p>
      </ImpactGauge>
      <h3 className="text-[19px] font-bold tracking-tight mt-8 mb-3">{metric.label}</h3>
      <p className="text-[14px] text-white/55 leading-relaxed max-w-[26ch]">{metric.desc}</p>
    </div>
  );
}

function ImpactDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = dashboardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        // Re-trigger every time the section scrolls into / out of view.
        setInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="hero" className="relative bg-[#070707] text-white overflow-hidden">
      {/* Cinematic backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full bg-[#c7ff00]/[0.07] blur-[130px]" />
        <div className="absolute bottom-0 -left-32 w-[520px] h-[420px] rounded-full bg-white/[0.03] blur-[110px]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 85% 65% at 50% 38%, black 25%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 65% at 50% 38%, black 25%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6 pt-24 md:pt-32 pb-20 md:pb-28">
        <p className="eyebrow text-white/50 mb-6 text-center">LuxEntra Media · New York</p>
        <h1 className="text-[52px] md:text-[88px] font-bold tracking-[-0.03em] leading-[1.02] mb-6 text-center">
          Every listing.
          <br />
          A lasting impression.
        </h1>
        <p className="text-[18px] md:text-[21px] leading-snug text-white/70 mb-10 text-center">
          Photography, films and personal branding.
          <br className="hidden md:block" /> Made for real estate.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24 md:mb-32">
          <PackageButton to="/order" dark={false}>
            Book a Shoot
          </PackageButton>
          <Link
            to="/work"
            className="inline-flex items-center gap-1 text-white font-medium text-[17px] hover:text-[#c7ff00] transition-colors"
          >
            Explore the work <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex flex-col items-center text-center -mt-16 md:-mt-24 mb-20 md:mb-28 px-6">
          <p className="eyebrow text-white/50 mb-4">Start here</p>
          <h2 className="text-[30px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] mb-4">
            Not sure what you need?
          </h2>
          <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed mb-8 max-w-xl">
            Tell us what brings you here and we will point you to the right service.
          </p>
          <button
            type="button"
            onClick={openServicePicker}
            className="btn-lime breathe-attention gap-2"
          >
            Find my service <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div ref={dashboardRef}>
          <div
            className={`impact-fade transition-all duration-700 ease-out ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="eyebrow text-[#c7ff00] mb-6 text-center">Performance</p>
            <h2 className="text-[38px] md:text-[60px] font-bold tracking-[-0.03em] leading-[1.05] mb-6 text-center">
              Our Real Estate Impact
            </h2>
            <p className="text-[17px] md:text-[20px] text-white/60 leading-relaxed mb-16 max-w-2xl mx-auto text-center">
              We shoot homes so they get seen, get remembered, and get sold.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6 mb-16 md:mb-20">
            {IMPACT_METRICS.map((m, i) => (
              <ImpactCard key={m.id} metric={m} index={i} started={inView} />
            ))}
          </div>

          <p
            className={`impact-fade text-center text-[20px] md:text-[26px] text-white/85 font-medium max-w-3xl mx-auto leading-relaxed tracking-[-0.01em] transition-all duration-700 ease-out ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: inView ? "420ms" : "0ms" }}
          >
            &ldquo;We make listings people actually{" "}
            <span className="text-[#c7ff00]">stop and look at</span>.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

// Soft premium click sound, played only on real clicks (never hover).
// Low volume; if audio is blocked the button still works normally.
let clickAudioCtx: AudioContext | null = null;
function playClickSound() {
  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    if (!clickAudioCtx) clickAudioCtx = new Ctor();
    const ctx = clickAudioCtx;
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1350, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch {
    // Audio unavailable or blocked — button keeps working.
  }
}

function PackageButton({ to, dark, children }: { to: string; dark?: boolean; children: React.ReactNode }) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    playClickSound();
    const el = btnRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.1;
      const ripple = document.createElement("span");
      ripple.className = "btn-ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      el.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 600);
    }
  };

  return (
    <Link
      ref={btnRef}
      to={to}
      onClick={handleClick}
      className={`${dark ? "btn-dark" : "btn-lime"} btn-interactive`}
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  // Hovered / focused / tapped package card. Defaults to the featured
  // ("Most chosen") package; resets when the cursor leaves the section.
  const defaultPackage = LAUNCH_BUNDLES.find((b) => b.featured)?.id ?? LAUNCH_BUNDLES[0].id;
  const [activePackage, setActivePackage] = useState(defaultPackage);

  return (
    <div className="min-h-screen bg-white text-black pt-16">
      <SiteNav />
      <ServicePickerModal />
      <LeadCapturePopup />

      <ImpactDashboard />

      {/* ── The Work ─────────────────────────────────────── */}
      <section id="work" className="bg-white py-20 md:py-28 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-5">
            Step inside.
          </h2>
          <p className="text-[17px] md:text-[19px] text-black/60 leading-relaxed mb-12 max-w-2xl">
            A closer look at our featured property.
            <br />
            From the first approach to the smallest detail.
          </p>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <FeaturedTwilight />
            </div>
            <div className="grid grid-rows-2 gap-5">
              <Link
                to="/work?tab=photos&filter=interior"
                className="group relative rounded-md overflow-hidden bg-[#f4f4f4] min-h-[180px] block"
                aria-label="View interior photography"
              >
                <img src="/stills/still-1.jpg" alt="Room to explore" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                <figcaption className="absolute bottom-4 left-4 text-white text-[15px] font-medium drop-shadow">
                  Room to explore.
                </figcaption>
              </Link>
              <Link
                to="/work?tab=photos&filter=interior"
                className="group relative rounded-md overflow-hidden bg-[#f4f4f4] min-h-[180px] block"
                aria-label="View interior photography"
              >
                <img src="/stills/still-2.jpg" alt="Details worth seeing" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                <figcaption className="absolute bottom-4 left-4 text-white text-[15px] font-medium drop-shadow">
                  Details worth seeing.
                </figcaption>
              </Link>
            </div>
          </div>
          <p className="text-[13px] text-black/40 mt-5">Stills from the featured property.</p>
          <Link to="/work" className="link-dark text-[16px] mt-6 inline-flex">
            View all work <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── What we create ───────────────────────────────── */}
      <section id="services" className="bg-[#f4f4f4] py-20 md:py-28 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-12">
            One creative team.
            <br />
            Every angle covered.
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div
                key={s.n}
                className={`rounded-md p-8 flex flex-col ${
                  s.dark ? "bg-[#0b0b0b] text-white" : "bg-white text-black"
                }`}
              >
                <p className={`eyebrow mb-8 ${s.dark ? "text-[#c7ff00]" : "text-black/40"}`}>
                  {s.n} / {s.label}
                </p>
                <h3 className="text-[28px] font-bold tracking-tight leading-tight mb-3">{s.title}</h3>
                <p className={`text-[15px] leading-relaxed mb-8 ${s.dark ? "text-white/60" : "text-black/60"}`}>
                  {s.copy}
                </p>
                <div className="mt-auto">
                  {s.dark ? (
                    <Link
                      to={s.href}
                      className="blink-attention inline-flex items-center gap-2 rounded-full bg-[#c7ff00] text-black text-[14px] font-bold px-5 py-2.5 hover:bg-[#d9ff4d] transition-colors shadow-[0_0_24px_rgba(199,255,0,0.65)]"
                    >
                      {s.cta}{" "}
                      {s.href === "/order" ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-black" />
                      )}
                    </Link>
                  ) : (
                    <Link to={s.href} className="link-dark text-[15px]">
                      {s.cta} <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Listing Essentials ───────────────────────── */}
      <section id="pricing" className="bg-white py-20 md:py-28 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-6">
              Your next listing.
              <br />
              Ready to launch.
            </h2>
            <p className="text-[17px] text-black/60 leading-relaxed mb-10 max-w-md">
              The Standard Listing Media Package brings your listing media together
              in one straightforward booking.
            </p>
            <p className="text-[64px] md:text-[80px] font-bold tracking-[-0.03em] leading-none mb-1">
              $175
            </p>
            <p className="text-[15px] text-black/50 mb-10">per package</p>
            <Link to="/order" className="btn-dark">
              Build your package
            </Link>
          </div>

          <div className="bg-[#f4f4f4] rounded-md p-8 md:p-10">
            <h3 className="text-[24px] font-bold tracking-tight mb-8">All the essentials. Included.</h3>
            <ul className="space-y-4 mb-8">
              {PACKAGE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[16px]">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#c7ff00]" strokeWidth={3} />
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="text-[13px] text-black/50 leading-relaxed">
              High-resolution and MLS-optimized files. Full usage rights for listing purposes.
            </p>
          </div>
        </div>
      </section>

      {/* ── Don't just list it. Launch it. ─────────────────── */}
      <section
        className="bg-black text-white py-20 md:py-28"
        onMouseLeave={() => setActivePackage(defaultPackage)}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="apple-eyebrow !text-[#c7ff00] mb-4">Launch packages</p>
          <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-5">
            Don&apos;t just list it.
            <br />
            Launch it.
          </h2>
          <p className="text-[17px] md:text-[19px] text-white/60 leading-relaxed mb-14 max-w-2xl">
            Three packages. Pick the level of coverage your listing needs.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {LAUNCH_BUNDLES.map((p) => {
              const isActive = activePackage === p.id;
              return (
              <div
                key={p.id}
                tabIndex={0}
                onMouseEnter={() => setActivePackage(p.id)}
                onFocus={() => setActivePackage(p.id)}
                onTouchStart={() => setActivePackage(p.id)}
                className={`pkg-card relative rounded-md p-8 md:p-10 flex flex-col outline-none transition-all duration-300 ease-out ${
                  isActive
                    ? "bg-[#c7ff00] text-black scale-[1.06] -translate-y-4 z-10 shadow-[0_25px_70px_-15px_rgba(199,255,0,0.5),0_12px_32px_-10px_rgba(0,0,0,0.6)]"
                    : "bg-white/5 border border-white/10 text-white scale-[0.98] z-0"
                }`}
              >
                {p.badge && (
                  <span
                    className={`absolute -top-3.5 left-8 text-[11px] font-bold uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full ${
                      isActive ? "bg-black text-[#c7ff00]" : "bg-[#c7ff00] text-black"
                    }`}
                  >
                    {p.badge}
                  </span>
                )}
                <h3 className="text-[24px] font-bold tracking-tight mb-3">
                  {p.name}
                </h3>
                <p className={`text-[13px] uppercase tracking-[0.12em] mb-1 ${isActive ? "text-black/60" : "text-white/50"}`}>
                  Starting at
                </p>
                <p className="price-num text-[52px] font-bold tracking-[-0.03em] leading-none mb-4">
                  ${p.price}
                </p>
                <p className={`text-[15px] leading-relaxed mb-8 ${isActive ? "text-black/70" : "text-white/60"}`}>
                  {p.blurb}
                </p>
                <ul className="space-y-3.5 mb-10 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px]">
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isActive ? "bg-black" : "bg-[#c7ff00]"
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${isActive ? "text-[#c7ff00]" : "text-black"}`}
                          strokeWidth={3}
                        />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <PackageButton to={`/order?package=${p.id}`} dark={isActive}>
                  Choose This Package
                </PackageButton>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Need something more custom? ─────────────────────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-[32px] md:text-[48px] font-bold tracking-[-0.03em] leading-tight mb-5">
            Need something more custom?
          </h2>
          <p className="text-[17px] text-black/60 leading-relaxed mb-10 max-w-2xl mx-auto">
            Enhance any package with a 3D tour, floor plan, twilight imagery,
            additional social edits, or expedited delivery.
            <br />
            Tell us about your property, and we&apos;ll create the right level of
            coverage for your listing.
          </p>
          <Link to="/order?package=consultation" className="btn-dark">
            Request a Consultation
          </Link>
        </div>
      </section>

      {/* ── Make it yours ────────────────────────────────── */}
      <section className="bg-[#f4f4f4] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-5">
            A little more.
            <br />
            A different perspective.
          </h2>
          <p className="text-[17px] md:text-[19px] text-black/60 leading-relaxed mb-12">
            Choose the extras your listing needs.
            <br />
            See your total before sending a request.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {ADD_ONS.map((a) => (
              <Link
                key={a.name}
                to="/order"
                className="group bg-white rounded-md p-7 flex flex-col hover:shadow-lg transition-shadow"
              >
                <span className="flex items-start justify-between mb-6">
                  <span className="price-num text-[26px] font-bold tracking-tight">{a.price}</span>
                  <ArrowUpRight className="w-5 h-5 text-black/30 group-hover:text-[#a8cc00] transition-colors" />
                </span>
                <span className="text-[17px] font-bold tracking-tight">{a.name}</span>
                <span className="text-[14px] text-black/50 mt-1">{a.note}</span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── From shoot to listing ────────────────────────── */}      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-14">
            Easy from the start.
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="eyebrow text-black/40 mb-4">{s.n}</p>
                <h3 className="text-[22px] font-bold tracking-tight mb-3">{s.title}</h3>
                <p className="text-[15px] text-black/60 leading-relaxed">{s.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof ──────────────────────────────────────── */}
      <ProofSection />

      {/* ── FAQ ──────────────────────────────────────────── */}
      <FaqSection />

      {/* ── CTA ──────────────────────────────────────────── */}
      <section id="about" className="bg-[#0b0b0b] text-white py-24 md:py-32 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <img src="/brand/symbol-lime.png" alt="" aria-hidden className="h-14 w-14 object-contain mx-auto mb-10" />
          <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-10">
            Let&apos;s make your next listing stand out.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/order" className="btn-lime">
              Book a Shoot
            </Link>
            <Link to="/about" className="inline-flex items-center gap-1 text-white font-medium text-[17px] hover:text-[#c7ff00] transition-colors">
              Meet the team <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
