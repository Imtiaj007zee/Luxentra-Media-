import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, X } from "lucide-react";

const SESSION_KEY = "luxentra_service_picker_seen";

const PRIMARY_OPTIONS = [
  {
    title: "I Want to Market a Property",
    cta: "Explore Listing Packages",
    href: "/order",
  },
  {
    title: "I Want to Build My Personal Brand",
    cta: "Explore Personal Branding Packages",
    href: "/branding",
  },
];

const SECONDARY_OPTIONS = [
  {
    title: "I Want to Explore Your Work",
    cta: "Explore Our Work",
    href: "/work",
  },
  {
    title: "I\u2019m Not Sure Yet",
    cta: "Get a Free Consultation",
    href: "/consultation",
  },
];

function OptionCard({
  title,
  cta,
  href,
  dark,
  index,
  onNavigate,
}: {
  title: string;
  cta: string;
  href: string;
  dark: boolean;
  index: number;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={href}
      onClick={onNavigate}
      style={{ animationDelay: `${140 + index * 90}ms` }}
      className={`spm-card group flex min-h-[128px] flex-col rounded-xl p-6 text-left transition-all duration-200 hover:-translate-y-0.5 sm:min-h-[148px] ${
        dark
          ? "bg-[#0b0b0b] text-white hover:shadow-[0_16px_44px_rgba(199,255,0,0.22)]"
          : "border border-black/10 bg-white text-black hover:border-black hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
      }`}
    >
      <span className="text-[19px] font-bold leading-snug tracking-tight sm:text-[21px]">
        {title}
      </span>
      <span
        className={`mt-auto inline-flex items-center gap-2 pt-4 text-[15px] font-semibold ${
          dark ? "text-[#c7ff00]" : "text-black"
        }`}
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export default function ServicePickerModal() {
  const [open, setOpen] = useState(false);

  // Show once per session, after the visitor scrolls ~80% past the hero.
  useEffect(() => {
    let triggered = false;
    const seen = () => {
      try {
        return sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        return false;
      }
    };
    const markSeen = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    };
    const onScroll = () => {
      if (triggered || seen()) return;
      const hero = document.getElementById("hero");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const heroTop = rect.top + window.scrollY;
      if (window.scrollY >= heroTop + rect.height * 0.8) {
        triggered = true;
        markSeen();
        setOpen(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while open; restore the exact position on close.
  useEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.scrollTo(0, y);
    };
  }, [open ]);

  if (!open) return null;

  const close = () => setOpen(false);

  return (
    <div
      className="spm-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label="Choose a service"
      onClick={close}
    >
      <div
        className="spm-panel relative max-h-[92dvh] w-full max-w-[1000px] overflow-y-auto rounded-2xl bg-white text-black shadow-[0_32px_80px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header keeps the close button visible while cards scroll */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-white/95 px-6 pb-4 pt-6 backdrop-blur sm:px-10 sm:pt-8">
          <div>
            <p className="eyebrow mb-2 text-black/40">Welcome to LuxEntra Media</p>
            <h2 className="text-[28px] font-bold leading-tight tracking-tight sm:text-[36px]">
              What are you looking to do?
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-black/60 sm:text-[16px]">
              Choose an option, and we&rsquo;ll take you directly to the right place.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 text-black transition-colors hover:bg-black hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 sm:px-10 sm:pb-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {PRIMARY_OPTIONS.map((o, i) => (
              <OptionCard key={o.title} {...o} dark index={i} onNavigate={close} />
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {SECONDARY_OPTIONS.map((o, i) => (
              <OptionCard
                key={o.title}
                {...o}
                dark={false}
                index={i + PRIMARY_OPTIONS.length}
                onNavigate={close}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={close}
              className="text-[15px] font-medium text-black/60 underline underline-offset-4 transition-colors hover:text-black"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
