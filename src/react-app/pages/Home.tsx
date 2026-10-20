import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Check, Play } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";
import FaqSection from "@/react-app/components/FaqSection";
import LeadCapturePopup from "@/react-app/components/LeadCapturePopup";
import ServicePickerModal, { openServicePicker } from "@/react-app/components/ServicePickerModal";
import { PORTFOLIO, type PortfolioItem } from "@/react-app/data/portfolio";
import { useT } from "@/react-app/lib/siteContent";
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
      <p className="text-[13px] md:text-[14px] font-semibold tracking-tight truncate">
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
        {/* Giant X logo watermark (actual logo mark) */}
        <img
          src="/logo-mark-cutout.png"
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[135vmin] h-[135vmin] object-contain opacity-[0.06] select-none"
        />
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
        className={`relative max-w-[1200px] mx-auto px-6 pt-24 md:pt-32 pb-20 md:pb-28${
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
}: {
  item: PortfolioItem;
  active: boolean;
  onPlay: () => void;
  onStop: () => void;
}) {
  return (
    <div className="relative w-[210px] md:w-[240px] shrink-0 snap-start aspect-[9/16] rounded-xl overflow-hidden ring-1 ring-white/10 bg-[#111]">
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
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c7ff00] text-black transition-transform duration-200 group-hover:scale-110">
              <Play className="h-6 w-6 fill-current" aria-hidden="true" />
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

function WorkStrip() {
  const t = useT();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [order, setOrder] = useState<string[]>(WORK_FILM_SLUGS);
  const [shuffleTick, setShuffleTick] = useState(0);
  const [userHolding, setUserHolding] = useState(false);
  const films = useMemo(() => {
    const bySlug = new Map(PORTFOLIO.map((p) => [p.slug, p]));
    return order
      .map((slug) => bySlug.get(slug))
      .filter((p): p is PortfolioItem => Boolean(p));
  }, [order]);
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  // Real hover only: touch devices fire emulated mouseenter with no
  // mouseleave, which would freeze the shuffle forever after one tap.
  const canHover = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches,
    []
  );

  // Shuffle the deck every few seconds, like a living portfolio wall.
  // Pauses while a video plays, while the visitor is touching the strip,
  // and under reduced-motion.
  useEffect(() => {
    if (userHolding || activeSlug !== null || reducedMotion) return;
    const id = setInterval(() => {
      setOrder((prev) => {
        const next = [...prev];
        let guard = 0;
        do {
          for (let i = next.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [next[i], next[j]] = [next[j], next[i]];
          }
          guard++;
        } while (next.every((s, i) => s === prev[i]) && guard < 8);
        return next;
      });
      setShuffleTick((n) => n + 1);
    }, 6000);
    return () => clearInterval(id);
  }, [userHolding, activeSlug, reducedMotion]);

  return (
    <section aria-label={t("home.work_eyebrow")} className="bg-[#070707] text-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 pt-14 md:pt-20 pb-8 flex items-end justify-between gap-4">
        <p className="eyebrow text-white/50">{t("home.work_eyebrow")}</p>
        <Link
          to="/work#films"
          className="inline-flex items-center gap-1 text-white font-medium text-[15px] hover:text-[#c7ff00] transition-colors shrink-0"
        >
          {t("home.work_link")} <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
      <div
        className="overflow-x-auto snap-x snap-mandatory pb-14 md:pb-20"
        onMouseEnter={() => canHover && setUserHolding(true)}
        onMouseLeave={() => canHover && setUserHolding(false)}
        onTouchStart={() => setUserHolding(true)}
        onTouchEnd={() => setUserHolding(false)}
        onFocus={() => setUserHolding(true)}
        onBlur={() => setUserHolding(false)}
      >
        <div className="flex gap-4 w-max pl-6 pr-6 md:pl-[max(1.5rem,calc((100vw-75rem)/2+1.5rem))] md:pr-[max(1.5rem,calc((100vw-75rem)/2+1.5rem))]">
          {films.map((item) => (
            <div key={`${item.slug}-${shuffleTick}`} className="shuffle-deal">
              <FilmCard
                item={item}
                active={activeSlug === item.slug}
                onPlay={() => setActiveSlug(item.slug)}
                onStop={() => setActiveSlug(null)}
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

// ── Service cards ────────────────────────────────────────────────────────
// Numbered Reachwise-style cards. Prices bind to live Site Settings.

function useServiceCards(t: ReturnType<typeof useT>) {
  const { settings } = useSiteSettings();
  return useMemo(
    () => [
      {
        n: "01",
        title: t("home.card1_title"),
        copy: t("home.card1_copy"),
        includes: t("home.card1_includes")
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
        price: `$${settings.price_standard}`,
        priceNote: t("home.card1_price_note"),
        proof: t("home.card1_proof"),
        cta: t("home.card1_cta"),
        href: "/order",
        dark: false,
      },
      {
        n: "02",
        title: t("home.card2_title"),
        copy: t("home.card2_copy"),
        includes: t("home.card2_includes")
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
        price: `$${settings.price_bundle_listing_premiere}`,
        priceNote: t("home.card2_price_prefix"),
        proof: t("home.card2_proof"),
        cta: t("home.card2_cta"),
        href: "/order",
        dark: false,
      },
      {
        n: "03",
        title: t("home.card3_title"),
        copy: t("home.card3_copy"),
        includes: t("home.card3_includes")
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
        price: `$${settings.price_branding_essential}`,
        priceNote: t("home.card3_price_note"),
        proof: t("home.card3_proof"),
        cta: t("home.card3_cta"),
        href: "/order",
        dark: true,
      },
    ],
    [t, settings]
  );
}

function ServiceCards() {
  const t = useT();
  const cards = useServiceCards(t);
  return (
    <section id="services" className="bg-[#f4f4f4] py-20 md:py-28 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="eyebrow text-black/40 mb-4">{t("home.cards_eyebrow")}</p>
        <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-5">
          {t("home.cards_h2a")}
          <br />
          {t("home.cards_h2b")}
        </h2>
        <p className="text-[17px] md:text-[19px] text-black/60 leading-relaxed mb-12 max-w-2xl">
          {t("home.cards_intro")}
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c) => (
            <div
              key={c.n}
              className={`rounded-md p-8 flex flex-col ${
                c.dark ? "bg-[#0b0b0b] text-white" : "bg-white text-black"
              }`}
            >
              <p className={`eyebrow mb-6 ${c.dark ? "text-[#c7ff00]" : "text-black/40"}`}>
                {c.n}
              </p>
              <h3 className="text-[28px] font-bold tracking-tight leading-tight mb-3">
                {c.title}
              </h3>
              <p
                className={`text-[15px] leading-relaxed mb-8 ${
                  c.dark ? "text-white/60" : "text-black/60"
                }`}
              >
                {c.copy}
              </p>
              <ul className="space-y-3 mb-8">
                {c.includes.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px]">
                    <span
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        c.dark ? "bg-[#c7ff00]" : "bg-black"
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${c.dark ? "text-black" : "text-[#c7ff00]"}`}
                        strokeWidth={3}
                      />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <p className="price-num text-[44px] font-bold tracking-[-0.03em] leading-none mb-1">
                  {c.price}
                </p>
                <p className={`text-[13px] mb-3 ${c.dark ? "text-white/50" : "text-black/50"}`}>
                  {c.priceNote}
                </p>
                <p className="flex items-center gap-2 text-[13px] font-semibold mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c7ff00] shrink-0" aria-hidden="true" />
                  {c.proof}
                </p>
                <PackageButton to={c.href} dark={!c.dark}>
                  {c.cta}
                </PackageButton>
              </div>
            </div>
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

// ── Case study ───────────────────────────────────────────────────────────

function CaseStudy() {
  const t = useT();
  const stats = [
    { value: t("home.case_stat1_value"), label: t("home.case_stat1_label") },
    { value: t("home.case_stat2_value"), label: t("home.case_stat2_label") },
    { value: t("home.case_stat3_value"), label: t("home.case_stat3_label") },
  ];
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="eyebrow text-black/40 mb-4">{t("home.case_eyebrow")}</p>
        <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-4">
          {t("home.case_h2")}
        </h2>
        <p className="text-[14px] uppercase tracking-[0.12em] text-black/45 mb-8">
          {t("home.case_client")}
        </p>
        <p className="text-[17px] md:text-[19px] text-black/65 leading-relaxed max-w-2xl mb-12">
          {t("home.case_copy")}
        </p>
        <div className="grid grid-cols-3 gap-4 md:gap-5 max-w-2xl mb-12">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#f4f4f4] rounded-md p-6 md:p-8 text-center">
              <p className="price-num text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-none mb-2">
                {s.value}
              </p>
              <p className="text-[13px] md:text-[14px] text-black/50">{s.label}</p>
            </div>
          ))}
        </div>
        <Link to="/work" className="btn-dark">
          {t("home.case_cta")}
        </Link>
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
      <TypedRotator />
      <ProofTicker />
      <ServiceCards />
      <WhyLuxEntra />
      <CaseStudy />
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
