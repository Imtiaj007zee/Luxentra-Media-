import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Check, Play } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";
import FaqSection from "@/react-app/components/FaqSection";
import LeadCapturePopup from "@/react-app/components/LeadCapturePopup";
import ServicePickerModal, { openServicePicker } from "@/react-app/components/ServicePickerModal";
import { PORTFOLIO, type PortfolioItem } from "@/react-app/data/portfolio";
import { useAddOns, useLiveCatalog, useT } from "@/react-app/lib/siteContent";
import { useSiteSettings } from "@/react-app/lib/siteSettings";

// ── Scarcity bar ─────────────────────────────────────────────────────────
// Thin fixed bar above the nav. Copy is backstage-editable (home.scarcity_bar).

function ScarcityBar() {
  const t = useT();
  return (
    <Link
      to="/order"
      className="fixed top-0 left-0 right-0 z-[60] bg-[#c7ff00] text-black h-10 flex items-center justify-center px-4 hover:bg-[#d9ff4d] transition-colors"
    >
      <p className="text-[13px] md:text-[14px] font-semibold tracking-tight truncate bar-swing">
        {t("home.scarcity_bar")}
      </p>
    </Link>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────
// UNTOUCHED: headline, sub-copy and buttons stay exactly as they were.

function Hero() {
  const t = useT();
  // Entrance choreography: flip on after first paint, CSS does the rest.
  // Content, keys, classes and layout below are unchanged; only animation
  // wrappers/classes were added.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setMounted(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <section id="hero" className="relative bg-[#070707] text-white overflow-hidden">
      {/* Cinematic backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* The logo watermark lives in ScrollDrivenLogo now: one mark
            that starts here, huge and faint, and shrinks down to park
            behind the Selected Work ring as you scroll. */}
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

      <div
        className={`relative z-10 max-w-[1200px] mx-auto px-6 pt-24 md:pt-32 pb-20 md:pb-28${
          mounted ? " hero-in" : ""
        }`}
      >
        <p
          className="eyebrow text-white/50 mb-6 text-center hero-fade"
          style={{ transitionDelay: "300ms" }}
        >
          {t("home.eyebrow")}
        </p>
        <h1 className="text-[52px] md:text-[88px] font-bold tracking-[-0.03em] leading-[1.02] mb-6 text-center">
          <span className="hero-mask">
            <span className="hero-rise" style={{ transitionDelay: "0ms" }}>
              {t("home.hero_h1a")}
            </span>
          </span>
          <br />
          <span className="hero-mask">
            <span className="hero-rise" style={{ transitionDelay: "120ms" }}>
              {t("home.hero_h1b")}
            </span>
          </span>
        </h1>
        <p
          className="text-[18px] md:text-[21px] leading-snug text-white/70 mb-10 text-center hero-fade"
          style={{ transitionDelay: "420ms" }}
        >
          {t("home.hero_sub1")}
          <br className="hidden md:block" /> {t("home.hero_sub2")}
        </p>
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24 md:mb-32 hero-fade"
          style={{ transitionDelay: "540ms" }}
        >
          <PackageButton to="/order" dark={false}>
            {t("home.cta_book")}
          </PackageButton>
          <Link
            to="/work"
            className="inline-flex items-center gap-1 text-white font-medium text-[17px] hover:text-[#c7ff00] transition-colors"
          >
            {t("home.cta_work")} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div
          className="flex flex-col items-center text-center -mt-16 md:-mt-24 mb-20 md:mb-28 px-6 hero-fade"
          style={{ transitionDelay: "680ms" }}
        >
          <p className="eyebrow text-white/50 mb-4">{t("home.picker_eyebrow")}</p>
          <h2 className="text-[30px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] mb-4">
            {t("home.picker_h2")}
          </h2>
          <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed mb-8 max-w-xl">
            {t("home.picker_copy")}
          </p>
          <button
            type="button"
            onClick={openServicePicker}
            className="btn-lime breathe-attention gap-2"
          >
            {t("home.picker_button")} <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Typed rotator strip ──────────────────────────────────────────────────
// Shamim-style kinetic line between the hero and the proof ticker.
// Words are backstage-editable (home.typed_words, one per line).

function TypedRotator() {
  const t = useT();
  const prefix = t("home.typed_prefix");
  const suffix = t("home.typed_suffix");
  const words = useMemo(() => {
    const raw = t("home.typed_words")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return raw.length > 0 ? raw : ["listing films"];
  }, [t]);

  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<"idle" | "typing" | "deleting">("idle");

  useEffect(() => {
    if (reduced) return;
    const word = words[wordIndex % words.length];
    let delay: number;
    let next: () => void;
    if (phase === "idle") {
      delay = 900;
      next = () => setPhase("typing");
    } else if (phase === "typing") {
      if (charCount < word.length) {
        delay = 55;
        next = () => setCharCount((c) => c + 1);
      } else {
        delay = 1600;
        next = () => setPhase("deleting");
      }
    } else {
      if (charCount > 0) {
        delay = 28;
        next = () => setCharCount((c) => c - 1);
      } else {
        delay = 350;
        next = () => {
          setWordIndex((i) => (i + 1) % words.length);
          setPhase("typing");
        };
      }
    }
    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [phase, charCount, wordIndex, words, reduced]);

  const visible = reduced ? words[0] : words[wordIndex % words.length].slice(0, charCount);

  return (
    <section
      aria-label={`${prefix} ${words[0]} ${suffix}`}
      className="bg-[#070707] text-white px-6 py-10 md:py-14 overflow-hidden"
    >
      <p className="typed-line text-center text-[26px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.2]">
        {prefix} <span className="text-[#c7ff00]">{visible}</span>
        <span className="typed-cursor" aria-hidden="true" /> {suffix}
      </p>
    </section>
  );
}

// ── Selected work strip ──────────────────────────────────────────────────
// Horizontal snap-scroll row of listing-film cards right after the hero.
// Tap a card to play its video inline (only one plays at a time; videos
// never preload — only the tapped card loads its source).

const WORK_FILM_SLUGS = [
  "850-e-223-st",
  "2802-miles-ave",
  "25112-maclay-ave",
  "3277-park-side-place",
  "324-under-hill-ave",
  "3640-palmer-ave",
];

function FilmCard({
  item,
  active,
  onPlay,
  onStop,
  className,
  preview,
}: {
  item: PortfolioItem;
  active: boolean;
  onPlay: () => void;
  onStop: () => void;
  className?: string;
  preview?: boolean;
}) {
  const previewRef = useRef<HTMLVideoElement | null>(null);

  // Looping previews only run while the strip is on screen.
  useEffect(() => {
    const v = previewRef.current;
    if (!v) return;
    if (preview && !active) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [preview, active]);

  return (
    <div className={`shuffle-deal relative shrink-0 snap-start rounded-xl overflow-hidden ring-1 ring-white/10 bg-[#111] ${className ?? "w-[210px] md:w-[240px] aspect-[9/16]"}`}>
      {active ? (
        <video
          key={item.slug}
          src={item.src}
          poster={item.poster}
          autoPlay
          muted
          playsInline
          loop
          controls
          preload="none"
          aria-label={item.title}
          className="absolute inset-0 h-full w-full object-cover"
          onClick={(e) => {
            e.currentTarget.pause();
            onStop();
          }}
        />
      ) : (
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Play ${item.title}`}
          className="group absolute inset-0 h-full w-full text-left"
        >
          <img
            src={item.poster}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <video
            ref={previewRef}
            src={item.src}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="auto"
            onTimeUpdate={(e) => {
              // Loop just the first five seconds: living cards, like Shamim's.
              const v = e.currentTarget;
              if (v.currentTime >= 5) v.currentTime = 0;
            }}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c7ff00] text-black transition-transform duration-200 group-hover:scale-110">
              <Play className="h-5 w-5 fill-current" aria-hidden="true" />
            </span>
          </span>
          <span className="absolute bottom-0 left-0 right-0 p-4">
            <span className="block text-[15px] font-bold tracking-tight text-white leading-tight">
              {item.title}
            </span>
            <span className="block text-[12px] text-white/60 mt-1">{item.category}</span>
          </span>
        </button>
      )}
    </div>
  );
}

// ── Scroll-driven logo ─────────────────────────────────────────────────────
// One logo for the whole top of the page. In the hero it sits huge and
// faint behind the headline. As you scroll it shrinks, rides down with
// the page, and parks at ring size behind the Selected Work films, then
// leaves with the strip. It is a pure function of scroll position, so
// scrolling back up reverses the whole journey exactly.
function ScrollDrivenLogo() {
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const hero = document.getElementById("hero");
      const stage = document.getElementById("work-stage");
      if (!hero || !stage) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const heroRect = hero.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      // Dock progress: 0 while the strip is still almost a full screen
      // away, 1 once its top has risen to a third of the viewport.
      const raw = (vh * 0.95 - stageRect.top) / (vh * 0.95 - vh * 0.35);
      const p = Math.min(1, Math.max(0, raw));
      const ease = p * p * (3 - 2 * p);
      const heroSize = 1.35 * Math.min(vw, vh);
      const dockSize = vw >= 768 ? 392 : 300;
      const size = heroSize + (dockSize - heroSize) * ease;
      const heroCenter = heroRect.top + heroRect.height / 2;
      const stageCenter = stageRect.top + stageRect.height / 2;
      const centerY = heroCenter + (stageCenter - heroCenter) * ease;
      // True neon at low strength: faint in the hero, a calm tint behind
      // the ring, and dipped mid-journey so it never fights what it
      // passes over. The color itself is never muted, only its weight.
      let opacity = 0.06 + (0.15 - 0.06) * ease;
      opacity *= 1 - 0.5 * Math.sin(Math.PI * ease);
      // Once the strip has scrolled away above, fade out for good.
      if (stageRect.bottom < vh * 0.2) {
        opacity *= Math.max(0, stageRect.bottom / (vh * 0.2));
      }
      img.style.opacity = `${opacity}`;
      img.style.transform = `translate(-50%, ${centerY - heroSize / 2}px) scale(${size / heroSize})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src="/logo-mark-cutout.png"
      alt=""
      aria-hidden="true"
      className="pointer-events-none fixed left-1/2 top-0 z-[1] select-none object-contain will-change-transform"
      style={{
        width: "135vmin",
        height: "135vmin",
        opacity: 0,
      }}
    />
  );
}

function WorkStrip() {
  const t = useT();
  const films = useMemo(() => {
    const bySlug = new Map(PORTFOLIO.map((p) => [p.slug, p]));
    return WORK_FILM_SLUGS.map((slug) => bySlug.get(slug)).filter(
      (p): p is PortfolioItem => Boolean(p)
    );
  }, []);
  // 12 ring slots: the 6 films twice around the cylinder.
  const slots = useMemo(() => [...films, ...films], [films]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [holding, setHolding] = useState(false);
  const [stripInView, setStripInView] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const phiRef = useRef(0);
  const targetPhiRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const movedRef = useRef(0);
  const resumeAtRef = useRef(0);
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  // Real hover only: touch devices fire emulated mouseenter with no
  // mouseleave, which would freeze the rotation forever after one tap.
  const canHover = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches,
    []
  );

  // Shamim-style shuffle: the ring never stops. Cards rotate around the
  // inside of the cylinder, flowing right to left, each one taking its
  // turn at the front. Dragging spins it; playing a film swings that
  // film to the front and holds it there.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = ringRef.current;
      if (el) {
        if (activeSlot !== null && targetPhiRef.current !== null) {
          const diff =
            ((targetPhiRef.current - phiRef.current + 540) % 360) - 180;
          phiRef.current += diff * 0.075;
          if (Math.abs(diff) < 0.05) phiRef.current = targetPhiRef.current;
        } else if (
          !draggingRef.current &&
          !holding &&
          !reducedMotion &&
          Date.now() > resumeAtRef.current
        ) {
          phiRef.current += 0.045;
        }
        el.style.transform = `perspective(500px) rotateY(${phiRef.current}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeSlot, holding, reducedMotion]);

  // Looping previews play only while the strip is actually on screen.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setStripInView(entries[0]?.isIntersecting ?? false),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playSlot = (slot: number) => {
    // Swing the ring so this slot lands front and center, then play.
    const delta = ((-slot * 30 - phiRef.current + 540) % 360) - 180;
    targetPhiRef.current = phiRef.current + delta;
    setActiveSlot(slot);
  };
  const stopSlot = () => {
    setActiveSlot(null);
    targetPhiRef.current = null;
    resumeAtRef.current = Date.now() + 1500;
  };

  return (
    <section aria-label={t("home.work_eyebrow")} className="bg-[#070707] text-white overflow-hidden">
      <div className="relative z-20 max-w-[1200px] mx-auto px-6 pt-14 md:pt-20 pb-8 flex items-end justify-between gap-4">
        <p className="eyebrow text-white/50">{t("home.work_eyebrow")}</p>
        <Link
          to="/work#films"
          className="inline-flex items-center gap-1 text-white font-medium text-[15px] hover:text-[#c7ff00] transition-colors shrink-0 py-2 -my-2 px-1 -mr-1"
        >
          {t("home.work_link")} <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
      <div
        id="work-stage"
        ref={stageRef}
        className="relative h-[300px] md:h-[320px] w-full cursor-grab select-none touch-pan-y active:cursor-grabbing"
        onMouseEnter={() => canHover && setHolding(true)}
        onMouseLeave={() => canHover && setHolding(false)}
        onPointerDown={(e) => {
          draggingRef.current = true;
          lastXRef.current = e.clientX;
          movedRef.current = 0;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          const dx = e.clientX - lastXRef.current;
          lastXRef.current = e.clientX;
          movedRef.current += Math.abs(dx);
          phiRef.current -= dx * 0.22;
        }}
        onPointerUp={() => {
          draggingRef.current = false;
          resumeAtRef.current = Date.now() + 2500;
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
          resumeAtRef.current = Date.now() + 2500;
        }}
        onClickCapture={(e) => {
          // A drag is not a tap: don't let it start a video.
          if (movedRef.current > 8) {
            e.stopPropagation();
            e.preventDefault();
            movedRef.current = 0;
          }
        }}
      >
        {/* The mark behind this ring is the ScrollDrivenLogo: it starts
            huge in the hero and shrinks down to park here on scroll. */}
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 w-[1200px] h-[375px] -ml-[600px] -mt-[188px] z-10"
          style={{ transformStyle: "preserve-3d" }}
        >
          {slots.map((item, slot) => (
            <div
              key={slot}
              className="ring-face absolute left-1/2 top-1/2 w-[250px] h-[375px] -ml-[125px] -mt-[188px]"
              style={{
                transform: `rotateY(${slot * 30}deg) translateZ(-570px)`,
              }}
            >
              <FilmCard
                item={item}
                className="w-full h-full"
                active={activeSlot === slot}
                onPlay={() => playSlot(slot)}
                onStop={stopSlot}
                preview={stripInView}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Proof ticker ─────────────────────────────────────────────────────────
// Infinite scrolling strip of real proof points. Numbers bind to live settings.

function ProofTicker() {
  const t = useT();
  const { settings } = useSiteSettings();
  const items = useMemo(
    () => [
      t("home.ticker_reel1"),
      `${settings.stat_properties}+ properties covered`,
      `$${settings.stat_value_m}M+ in listing value`,
      t("home.ticker_reel2"),
      t("home.ticker_delivery"),
    ],
    [t, settings]
  );
  const renderRow = (hidden: boolean) => (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center shrink-0" aria-hidden={hidden || undefined}>
          <span className="text-[14px] md:text-[15px] font-medium text-white/85 whitespace-nowrap">
            {item}
          </span>
          <span className="mx-8 w-1.5 h-1.5 rounded-full bg-[#c7ff00] shrink-0" aria-hidden="true" />
        </span>
      ))}
    </>
  );
  return (
    <div className="ticker bg-[#0b0b0b] border-y border-white/10 overflow-hidden py-4">
      <div className="ticker-track flex w-max">
        {renderRow(false)}
        <div className="flex" aria-hidden="true">
          {renderRow(true)}
        </div>
      </div>
    </div>
  );
}

// ── Services + pricing (original structure, restored) ────────────────────
// Zee's original homepage layout: services grid (no prices), then his
// pricing sections: Listing Essentials, launch bundles, custom, add-ons.
// All prices and features read the live catalog and backstage copy keys.

function useServices(t: ReturnType<typeof useT>) {
  return useMemo(
    () => [
      {
        n: "01",
        label: t("home.svc1_label"),
        title: t("home.svc1_title"),
        copy: t("home.svc1_copy"),
        cta: t("home.svc1_cta"),
        href: "/work?tab=photos",
        dark: false,
      },
      {
        n: "02",
        label: t("home.svc2_label"),
        title: t("home.svc2_title"),
        copy: t("home.svc2_copy"),
        cta: t("home.svc2_cta"),
        href: "/branding",
        dark: true,
      },
      {
        n: "03",
        label: t("home.svc3_label"),
        title: t("home.svc3_title"),
        copy: t("home.svc3_copy"),
        cta: t("home.svc3_cta"),
        href: "/work#films",
        dark: false,
      },
    ],
    [t]
  );
}

function ServicesGrid() {
  const t = useT();
  const SERVICES = useServices(t);
  return (
    <section id="services" className="bg-[#f4f4f4] py-20 md:py-28 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-12">
          {t("home.services_h2a")}
          <br />
          {t("home.services_h2b")}
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
  );
}

function ListingEssentials() {
  const t = useT();
  const { standardPrice } = useLiveCatalog();
  const pkgFeatures = useMemo(
    () =>
      t("home.pkg_features")
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    [t]
  );
  return (
    <section id="pricing" className="bg-white py-20 md:py-28 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div>
          <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-6">
            {t("home.pkg_h2a")}
            <br />
            {t("home.pkg_h2b")}
          </h2>
          <p className="text-[17px] text-black/60 leading-relaxed mb-10 max-w-md">
            {t("home.pkg_copy")}
          </p>
          <p className="price-num text-[64px] md:text-[80px] font-bold tracking-[-0.03em] leading-none mb-1">
            ${standardPrice}
          </p>
          <p className="text-[15px] text-black/50 mb-10">{t("home.pkg_per")}</p>
          <Link to="/order" className="btn-dark">
            {t("home.pkg_cta")}
          </Link>
        </div>

        <div className="bg-[#f4f4f4] rounded-md p-8 md:p-10">
          <h3 className="text-[24px] font-bold tracking-tight mb-8">{t("home.pkg_card_title")}</h3>
          <ul className="space-y-4 mb-8">
            {pkgFeatures.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[16px]">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#c7ff00]" strokeWidth={3} />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-black/50 leading-relaxed">
            {t("home.pkg_fineprint")}
          </p>
        </div>
      </div>
    </section>
  );
}

function Bundles() {
  const t = useT();
  const { bundles } = useLiveCatalog();
  // Hovered / focused / tapped package card. Defaults to the featured
  // ("Most chosen") package; resets when the cursor leaves the section.
  const defaultPackage = bundles.find((b) => b.featured)?.id ?? bundles[0]?.id;
  const [activePackage, setActivePackage] = useState(defaultPackage);
  return (
    <section
      className="bg-black text-white py-20 md:py-28"
      onMouseLeave={() => setActivePackage(defaultPackage)}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="apple-eyebrow !text-[#c7ff00] mb-4">{t("home.bundles_eyebrow")}</p>
        <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-5">
          {t("home.bundles_h2a")}
          <br />
          {t("home.bundles_h2b")}
        </h2>
        <p className="text-[17px] md:text-[19px] text-white/60 leading-relaxed mb-14 max-w-2xl">
          {t("home.bundles_intro")}
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {bundles.map((p) => {
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
                {t("home.bundle_starting")}
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
                {t("home.bundle_cta")}
              </PackageButton>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CustomCTA() {
  const t = useT();
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <h2 className="text-[32px] md:text-[48px] font-bold tracking-[-0.03em] leading-tight mb-5">
          {t("home.custom_h2")}
        </h2>
        <p className="text-[17px] text-black/60 leading-relaxed mb-10 max-w-2xl mx-auto">
          {t("home.custom_copy")
            .split("\n")
            .map((l, i, arr) => (
              <span key={i}>
                {l}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
        </p>
        <Link to="/order?package=consultation" className="btn-dark">
          {t("home.custom_cta")}
        </Link>
      </div>
    </section>
  );
}

function AddOns() {
  const t = useT();
  const addOns = useAddOns();
  return (
    <section className="bg-[#f4f4f4] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-5">
          {t("home.addons_h2a")}
          <br />
          {t("home.addons_h2b")}
        </h2>
        <p className="text-[17px] md:text-[19px] text-black/60 leading-relaxed mb-12">
          {t("home.addons_copy")
            .split("\n")
            .map((l, i, arr) => (
              <span key={i}>
                {l}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {addOns.map((a) => (
            <Link
              key={a.id}
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
  );
}

// ── Why LuxEntra ─────────────────────────────────────────────────────────

function WhyLuxEntra() {
  const t = useT();
  return (
    <section className="bg-[#0b0b0b] text-white py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="eyebrow text-[#c7ff00] mb-6">{t("home.why_eyebrow")}</p>
        <h2 className="text-[38px] md:text-[60px] font-bold tracking-[-0.03em] leading-[1.08] mb-10 max-w-4xl">
          {t("home.why_h2")}
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          <p className="text-[17px] md:text-[19px] text-white/70 leading-relaxed">
            {t("home.why_p1")}
          </p>
          <p className="text-[17px] md:text-[19px] text-white/70 leading-relaxed">
            {t("home.why_p2")}
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Process ──────────────────────────────────────────────────────────────

function useProcessSteps(t: ReturnType<typeof useT>) {
  return useMemo(
    () => [
      { n: "01", title: t("home.pstep1_title"), copy: t("home.pstep1_copy") },
      { n: "02", title: t("home.pstep2_title"), copy: t("home.pstep2_copy") },
      { n: "03", title: t("home.pstep3_title"), copy: t("home.pstep3_copy") },
      { n: "04", title: t("home.pstep4_title"), copy: t("home.pstep4_copy") },
    ],
    [t]
  );
}

function ProcessSteps() {
  const t = useT();
  const steps = useProcessSteps(t);
  return (
    <section className="bg-[#f4f4f4] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="eyebrow text-black/40 mb-4">{t("home.process_eyebrow")}</p>
        <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-14">
          {t("home.process_h2")}
        </h2>
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div
            className="hidden lg:block absolute top-5 left-[12%] right-[12%] h-px bg-black/15"
            aria-hidden="true"
          />
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <p className="relative z-10 w-10 h-10 rounded-full bg-[#c7ff00] text-black text-[15px] font-bold flex items-center justify-center mb-5">
                {s.n}
              </p>
              <h3 className="text-[22px] font-bold tracking-tight mb-3">{s.title}</h3>
              <p className="text-[15px] text-black/60 leading-relaxed">{s.copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <Link to="/order" className="btn-dark">
            {t("nav.cta_book")}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Real Estate Impact Dashboard (stats only) ────────────────────────────
// Live values come from Site Settings (editable at /backstage).

function useImpactMetrics() {
  const { settings } = useSiteSettings();
  const t = useT();
  return useMemo(
    () => [
      {
        id: "properties-covered",
        value: settings.stat_properties || 0,
        decimals: 0,
        prefix: "",
        suffix: "+",
        ring: 100,
        label: t("home.metric1_label"),
        desc: t("home.metric1_desc"),
      },
      {
        id: "value-covered",
        value: settings.stat_value_m || 0,
        decimals: 1,
        prefix: "$",
        suffix: "M+",
        ring: 100,
        label: t("home.metric2_label"),
        desc: t("home.metric2_desc"),
      },
      {
        id: "success-rate",
        value: settings.stat_success_rate || 0,
        decimals: 0,
        prefix: "",
        suffix: "%+",
        ring: 100,
        label: t("home.metric3_label"),
        desc: t("home.metric3_desc"),
      },
    ],
    [settings, t]
  );
}

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
  metric: ReturnType<typeof useImpactMetrics>[number];
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

function ImpactStats() {
  const t = useT();
  const metrics = useImpactMetrics();
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
    <section className="relative bg-[#070707] text-white overflow-hidden border-t border-white/10">
      <div className="relative max-w-[1200px] mx-auto px-6 py-20 md:py-28">
        <div ref={dashboardRef}>
          <div
            className={`impact-fade transition-all duration-700 ease-out ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="eyebrow text-[#c7ff00] mb-6 text-center">{t("home.impact_eyebrow")}</p>
            <h2 className="text-[38px] md:text-[60px] font-bold tracking-[-0.03em] leading-[1.05] mb-6 text-center">
              {t("home.impact_h2")}
            </h2>
            <p className="text-[17px] md:text-[20px] text-white/60 leading-relaxed mb-16 max-w-2xl mx-auto text-center">
              {t("home.impact_intro")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6 mb-16 md:mb-20">
            {metrics.map((m, i) => (
              <ImpactCard key={m.id} metric={m} index={i} started={inView} />
            ))}
          </div>

          <p
            className={`impact-fade text-center text-[20px] md:text-[26px] text-white/85 font-medium max-w-3xl mx-auto leading-relaxed tracking-[-0.01em] transition-all duration-700 ease-out ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: inView ? "420ms" : "0ms" }}
          >
            &ldquo;{t("home.quote_1")}{" "}
            <span className="text-[#c7ff00]">{t("home.quote_2")}</span>
            {t("home.quote_3")}&rdquo;
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
  const t = useT();

  return (
    <div className="min-h-screen bg-white text-black pt-[104px]">
      <ScarcityBar />
      <SiteNav topOffset={40} />
      <ServicePickerModal />
      <LeadCapturePopup />

      <Hero />
      <WorkStrip />
      <ScrollDrivenLogo />
      <TypedRotator />
      <ProofTicker />
      <ServicesGrid />
      <ListingEssentials />
      <Bundles />
      <CustomCTA />
      <AddOns />
      <WhyLuxEntra />
      <ProcessSteps />
      <ImpactStats />

      {/* ── FAQ ──────────────────────────────────────────── */}
      <FaqSection />

      {/* ── CTA ──────────────────────────────────────────── */}
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
