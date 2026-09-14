import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { Check, ChevronRight, Play } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";

const PACKAGE_FEATURES = [
  "25–45 MLS-ready photos",
  "1 twilight photo included",
  "2D black & white floor plans",
  "12-hour delivery",
  "Private branded gallery",
  "High-res + MLS-optimized files",
  "Full listing usage rights",
  "Free light, color & exposure revisions",
];

const SERVICES = [
  {
    title: "Photography",
    copy: "Make the first look count.",
    detail: "Crisp interiors and exteriors, edited to perfection.",
    dark: false,
  },
  {
    title: "Film",
    copy: "Give the space a story.",
    detail: "Cinematic walkthroughs that move buyers.",
    dark: true,
  },
  {
    title: "Personal Branding",
    copy: "Be the agent they remember.",
    detail: "Reels and portraits with a creative edge.",
    dark: false,
  },
];

const ADD_ONS = [
  { price: "$39", name: "Custom Listing Flyer", copy: "A clean, professional flyer for social and print." },
  { price: "$99", name: "Drone Photos & Video", copy: "Aerial perspectives of the property and the block." },
  { price: "$99", name: "3D Virtual Tour", copy: "An interactive walkthrough buyers can explore anywhere." },
  { price: "$179", name: "Walkthrough / Cinematic Video", copy: "A professionally edited film of the property's best features." },
  { price: "$499", name: "Creative Personal Branding Reel", copy: "Concept, scripting, filming and editing for social." },
  { price: "from $40", name: "Virtual Staging", copy: "Photorealistic digital staging, delivered in 24 hours." },
];

const STEPS = [
  { n: "01", title: "Tell us about the property", copy: "Share the listing details and pick a time that works." },
  { n: "02", title: "We take care of the shoot", copy: "Our crew handles everything on site, start to finish." },
  { n: "03", title: "Your media. Ready to share.", copy: "Delivered in 12 hours to your private branded gallery." },
];

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const tryPlay = () => {
      video.muted = true;
      video.play().catch(() => {});
    };
    tryPlay();
    const interval = setInterval(() => {
      if (video.paused) tryPlay();
      else clearInterval(interval);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f]">
      <SiteNav />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-black text-white overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/og-image.jpg"
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-[1024px] mx-auto px-6 pt-40 pb-32 md:pt-52 md:pb-44 text-center">
          <p className="apple-eyebrow !text-[#c7ff00]/90 mb-5">LuxEntra Media · New York</p>
          <h1 className="text-[48px] md:text-[80px] font-semibold tracking-[-0.02em] leading-[1.05] mb-6">
            Every listing.
            <br />
            A lasting impression.
          </h1>
          <p className="text-[21px] md:text-[24px] leading-snug text-white/80 max-w-2xl mx-auto mb-10">
            Photography, film, and personal branding — thoughtfully made for real estate.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/order" className="btn-apple-lg">
              Book a shoot
            </Link>
            <a href="#work" className="apple-link-dark !text-[19px]">
              See the work <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Services tiles (apple.com promo grid) ────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12 px-6">
            <p className="apple-eyebrow mb-4">What we create</p>
            <h2 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight">
              One creative team.
              <br />
              Every angle covered.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className={`rounded-[18px] px-8 pt-14 pb-12 text-center ${
                  s.dark ? "bg-black text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"
                }`}
              >
                <h3 className="text-[32px] font-semibold tracking-tight mb-2">{s.title}</h3>
                <p className={`text-[19px] mb-2 ${s.dark ? "text-white/85" : "text-[#1d1d1f]/85"}`}>
                  {s.copy}
                </p>
                <p className={`text-[15px] mb-6 ${s.dark ? "text-white/60" : "text-[#6e6e73]"}`}>
                  {s.detail}
                </p>
                <Link to="/order" className={s.dark ? "apple-link-dark !text-[15px]" : "apple-link !text-[15px]"}>
                  Get started <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Work showcase ────────────────────────────────── */}
      <section id="work" className="bg-black text-white py-24 md:py-32 scroll-mt-12">
        <div className="max-w-[1024px] mx-auto px-6 text-center">
          <p className="apple-eyebrow !text-white/50 mb-4">The work</p>
          <h2 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-5">
            Step inside.
          </h2>
          <p className="text-[19px] md:text-[21px] text-white/70 max-w-2xl mx-auto mb-12">
            A closer look at our featured property film — from the first approach to the smallest detail.
          </p>
          <div className="rounded-[18px] overflow-hidden bg-[#1d1d1f] max-w-4xl mx-auto">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/og-image.jpg"
              className="w-full aspect-video"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
          <p className="text-[14px] text-white/40 mt-6 flex items-center justify-center gap-2">
            <Play className="w-4 h-4" /> Featured property film
          </p>
        </div>
      </section>

      {/* ── Package ──────────────────────────────────────── */}
      <section id="package" className="bg-white py-24 md:py-32 scroll-mt-12">
        <div className="max-w-[820px] mx-auto px-6 text-center">
          <p className="apple-eyebrow mb-4">Our core offering</p>
          <h2 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-6">
            Standard Listing
            <br />
            Media Package
          </h2>
          <p className="text-[64px] md:text-[80px] font-semibold tracking-tight mb-4">$175</p>
          <p className="text-[19px] text-[#6e6e73] mb-12">
            Everything you need to make your listing stand out.
          </p>

          <ul className="text-left grid sm:grid-cols-2 gap-x-10 gap-y-4 max-w-2xl mx-auto mb-12">
            {PACKAGE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[17px]">
                <span className="mt-1 w-5 h-5 rounded-full bg-[#65a30d]/10 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#65a30d]" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link to="/order" className="btn-apple-lg">
            Select package
          </Link>
        </div>
      </section>

      {/* ── Add-ons ──────────────────────────────────────── */}
      <section id="addons" className="bg-[#f5f5f7] py-24 md:py-32 scroll-mt-12">
        <div className="max-w-[1024px] mx-auto px-6">
          <div className="text-center mb-14">
            <p className="apple-eyebrow mb-4">Modular upgrades</p>
            <h2 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-4">
              Optional add-ons.
            </h2>
            <p className="text-[19px] text-[#6e6e73] max-w-xl mx-auto">
              Enhance your package with premium upgrades tailored to your listing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {ADD_ONS.map((a) => (
              <div key={a.name} className="bg-white rounded-[18px] p-8">
                <p className="text-[28px] font-semibold tracking-tight mb-1">{a.price}</p>
                <h3 className="text-[19px] font-semibold mb-2">{a.name}</h3>
                <p className="text-[15px] text-[#6e6e73] leading-relaxed">{a.copy}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/order" className="apple-link">
              Customize your package <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1024px] mx-auto px-6">
          <div className="text-center mb-14">
            <p className="apple-eyebrow mb-4">From shoot to listing</p>
            <h2 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight">
              Easy from the start.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center md:text-left">
                <p className="text-[15px] font-semibold text-[#65a30d] mb-3">{s.n}</p>
                <h3 className="text-[21px] font-semibold tracking-tight mb-2">{s.title}</h3>
                <p className="text-[15px] text-[#6e6e73] leading-relaxed">{s.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="max-w-[820px] mx-auto px-6 text-center">
          <h2 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-5">
            Let&apos;s make your next listing stand out.
          </h2>
          <p className="text-[19px] text-white/70 mb-10">
            Stunning media that makes your properties impossible to ignore.
          </p>
          <Link to="/order" className="btn-apple-lg mb-10">
            Start your order
          </Link>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[15px] text-white/60">
            <a href="mailto:luxentra.media@gmail.com" className="hover:text-white transition-colors">
              luxentra.media@gmail.com
            </a>
            <a href="tel:+13478371257" className="hover:text-white transition-colors">
              +1 (347) 837-1257
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
