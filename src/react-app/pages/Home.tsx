import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Check, Pause, Play } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";

const SERVICES = [
  {
    n: "01",
    label: "PHOTOGRAPHY",
    title: "Make the first look count.",
    copy: "Interior and exterior photography, twilight imagery and floor plans. Ready for your listing.",
    cta: "Explore photography",
    dark: false,
  },
  {
    n: "02",
    label: "FILM",
    title: "Give the space a story.",
    copy: "Walkthrough films and aerial perspectives that show how a property feels and connects.",
    cta: "Watch the film",
    dark: true,
  },
  {
    n: "03",
    label: "PERSONAL BRANDING",
    title: "Be the agent they remember.",
    copy: "Short-form content shaped around you, from the first idea and script to filming and editing.",
    cta: "Explore branding",
    dark: false,
  },
];

const PACKAGE_FEATURES = [
  "25–45 MLS-ready photos",
  "1 twilight photo",
  "2D black & white floor plans",
  "12-hour delivery",
  "Private branded gallery",
  "Light, color & exposure revisions",
];

const ADD_ONS = [
  { name: "Custom Listing Flyer", price: "$39", note: "$39 for one" },
  { name: "Drone Photos & Video", price: "$99", note: "$99" },
  { name: "3D Virtual Tour", price: "$99", note: "$99" },
  { name: "Walkthrough/Cinematic Video", price: "$179", note: "$179" },
  { name: "Creative Personal Branding Reel", price: "$499", note: "$499" },
  { name: "Virtual Staging", price: "From $40", note: "From $40" },
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

function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  return (
    <div className="relative rounded-md overflow-hidden bg-[#1a1a1a]">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full aspect-[16/8] object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-4 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-white text-[15px] font-medium">Spaces. Seen differently.</p>
        <button
          onClick={toggle}
          aria-label={paused ? "Play film" : "Pause film"}
          className="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        >
          {paused ? <Play className="w-5 h-5 fill-white" /> : <Pause className="w-5 h-5 fill-white" />}
        </button>
      </div>
    </div>
  );
}

function FeaturedFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
    setPlaying(true);
  };

  return (
    <button
      onClick={play}
      className="relative block w-full rounded-md overflow-hidden bg-[#1a1a1a] text-left group"
      aria-label="Play featured property film"
    >
      <video
        ref={videoRef}
        playsInline
        controls={playing}
        preload="metadata"
        poster="/stills/still-1.jpg"
        className="w-full aspect-video object-cover"
        onPause={() => setPlaying(false)}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      {!playing && (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/30 group-hover:bg-black/40 transition-colors">
          <span className="w-16 h-16 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white group-hover:bg-[#c7ff00] group-hover:text-black transition-colors">
            <Play className="w-7 h-7 fill-current ml-1" />
          </span>
          <span className="text-white text-[15px] font-medium">Featured property film</span>
        </span>
      )}
    </button>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black pt-16">
      <SiteNav />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-[#0b0b0b] text-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-20 md:pt-28 pb-10 text-center">
          <p className="eyebrow text-white/50 mb-6">LuxEntra Media · New York</p>
          <h1 className="text-[52px] md:text-[88px] font-bold tracking-[-0.03em] leading-[1.02] mb-6">
            Every listing.
            <br />
            A lasting impression.
          </h1>
          <p className="text-[18px] md:text-[21px] leading-snug text-white/70 mb-10">
            Photography, films and personal branding.
            <br className="hidden md:block" /> Thoughtfully made for real estate.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-14">
            <Link to="/order" className="btn-lime">
              Book a Shoot
            </Link>
            <a href="#work" className="inline-flex items-center gap-1 text-white font-medium text-[17px] hover:text-[#c7ff00] transition-colors">
              Explore the work <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <HeroFilm />
        </div>
        <div className="h-16 md:h-24" />
      </section>

      {/* ── The Work ─────────────────────────────────────── */}
      <section id="work" className="bg-white py-20 md:py-28 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-5">
            Step inside.
          </h2>
          <p className="text-[17px] md:text-[19px] text-black/60 leading-relaxed mb-12 max-w-2xl">
            A closer look at our featured property film.
            <br />
            From the first approach to the smallest detail.
          </p>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <FeaturedFilm />
            </div>
            <div className="grid grid-rows-2 gap-5">
              <figure className="relative rounded-md overflow-hidden bg-[#f4f4f4] min-h-[180px]">
                <img src="/stills/still-1.jpg" alt="Room to explore" className="absolute inset-0 w-full h-full object-cover" />
                <figcaption className="absolute bottom-4 left-4 text-white text-[15px] font-medium drop-shadow">
                  Room to explore.
                </figcaption>
              </figure>
              <figure className="relative rounded-md overflow-hidden bg-[#f4f4f4] min-h-[180px]">
                <img src="/stills/still-2.jpg" alt="Details worth seeing" className="absolute inset-0 w-full h-full object-cover" />
                <figcaption className="absolute bottom-4 left-4 text-white text-[15px] font-medium drop-shadow">
                  Details worth seeing.
                </figcaption>
              </figure>
            </div>
          </div>
          <p className="text-[13px] text-black/40 mt-5">Stills from the featured film.</p>
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
                      to="/#work"
                      className="inline-flex items-center gap-2 rounded-full bg-[#c7ff00] text-black text-[14px] font-bold px-5 py-2.5 hover:bg-[#d9ff4d] transition-colors"
                    >
                      {s.cta} <Play className="w-3.5 h-3.5 fill-black" />
                    </Link>
                  ) : (
                    <Link
                      to={s.n === "03" ? "/order" : "/#work"}
                      className="link-dark text-[15px]"
                    >
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
              The Standard Listing Media Package brings your photography and floor plans together
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
                  <span className="text-[26px] font-bold tracking-tight">{a.price}</span>
                  <ArrowUpRight className="w-5 h-5 text-black/30 group-hover:text-[#a8cc00] transition-colors" />
                </span>
                <span className="text-[17px] font-bold tracking-tight">{a.name}</span>
                <span className="text-[14px] text-black/50 mt-1">{a.note}</span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── From shoot to listing ────────────────────────── */}
      <section className="bg-white py-20 md:py-28">
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
