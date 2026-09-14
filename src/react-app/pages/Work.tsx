import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";
import { PORTFOLIO, type PortfolioItem } from "@/react-app/data/portfolio";

function Lightbox({
  item,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  item: PortfolioItem;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [item.slug]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/95 flex flex-col"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="eyebrow text-[#c7ff00] mb-1">{item.category}</p>
          <h3 className="text-white text-[20px] font-bold tracking-tight">{item.title}</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-[14px] tabular-nums">
            {index + 1} / {PORTFOLIO.length}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#c7ff00] hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video */}
      <div
        className="flex-1 flex items-center justify-center px-4 md:px-20 pb-6 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPrev}
          aria-label="Previous video"
          className="hidden md:flex w-12 h-12 rounded-full bg-white/10 items-center justify-center text-white hover:bg-[#c7ff00] hover:text-black transition-colors shrink-0 mr-6"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <video
          ref={videoRef}
          key={item.slug}
          src={item.src}
          poster={item.poster}
          controls
          playsInline
          preload="auto"
          className={`max-h-full max-w-full rounded-md bg-[#1a1a1a] ${
            item.ratio === "portrait" ? "aspect-[9/16] h-full" : "aspect-video w-full"
          }`}
        />
        <button
          onClick={onNext}
          aria-label="Next video"
          className="hidden md:flex w-12 h-12 rounded-full bg-white/10 items-center justify-center text-white hover:bg-[#c7ff00] hover:text-black transition-colors shrink-0 ml-6"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile prev/next */}
      <div
        className="flex md:hidden items-center justify-center gap-4 pb-8 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPrev}
          aria-label="Previous video"
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onNext}
          aria-label="Next video"
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default function WorkPage() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + PORTFOLIO.length) % PORTFOLIO.length)),
    []
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % PORTFOLIO.length)),
    []
  );

  return (
    <div className="min-h-screen bg-white text-black pt-16">
      <SiteNav />

      {/* Hero */}
      <section className="bg-[#0b0b0b] text-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-20 md:pt-28 pb-16 md:pb-20">
          <p className="eyebrow text-white/50 mb-6">Selected work</p>
          <h1 className="text-[52px] md:text-[88px] font-bold tracking-[-0.03em] leading-[1.02] mb-6">
            Proof in
            <br />
            every frame.
          </h1>
          <p className="text-[18px] md:text-[21px] leading-snug text-white/70 max-w-2xl">
            Property films and brand stories from recent LuxEntra shoots —
            including the pieces behind our best-performing content.
          </p>
        </div>
      </section>

      {/* Portfolio grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5">
            {PORTFOLIO.map((item, i) => (
              <button
                key={item.slug}
                onClick={() => setActive(i)}
                className="group relative block w-full break-inside-avoid rounded-md overflow-hidden bg-[#111] text-left"
                aria-label={`Play ${item.title}`}
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  loading="lazy"
                  className={`w-full object-cover ${
                    item.ratio === "portrait" ? "aspect-[3/4]" : "aspect-video"
                  }`}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-14 h-14 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white group-hover:bg-[#c7ff00] group-hover:text-black group-hover:scale-110 transition-all">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </span>
                </span>
                <span className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="eyebrow text-[#c7ff00] block mb-1.5">{item.category}</span>
                  <span className="text-white text-[19px] font-bold tracking-tight block">
                    {item.title}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b0b0b] text-white py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <img
            src="/brand/symbol-lime.png"
            alt=""
            aria-hidden
            className="h-14 w-14 object-contain mx-auto mb-10"
          />
          <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-10">
            Let&apos;s make your next listing stand out.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/order" className="btn-lime">
              Book a Shoot
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-1 text-white font-medium text-[17px] hover:text-[#c7ff00] transition-colors"
            >
              Meet the team <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      {active !== null && (
        <Lightbox
          item={PORTFOLIO[active]}
          index={active}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  );
}
