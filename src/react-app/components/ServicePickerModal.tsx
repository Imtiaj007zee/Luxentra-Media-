import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, X } from "lucide-react";
import { useT } from "@/react-app/lib/siteContent";

const SESSION_KEY = "luxentra_service_picker_seen_v2";
const OPEN_EVENT = "luxentra:open-service-picker";

/** Opens the service picker from anywhere (e.g. the hero trigger button). */
export function openServicePicker() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

function hasSeen(): boolean {
  try {
    // localStorage (not sessionStorage): the auto-popup shows at most once
    // per visitor, not once per tab session.
    return localStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

function OptionCard({
  title,
  cta,
  href,
  action,
  dark,
  index,
  onNavigate,
}: {
  title: string;
  cta: string;
  href?: string;
  action?: () => void;
  dark: boolean;
  index: number;
  onNavigate: () => void;
}) {
  const handleClick = () => {
    onNavigate();
    action?.();
  };
  const className = `spm-card group flex min-h-[128px] w-full flex-col rounded-xl p-6 text-left transition-all duration-200 hover:-translate-y-0.5 sm:min-h-[148px] ${
    dark
      ? "bg-[#0b0b0b] text-white hover:shadow-[0_16px_44px_rgba(199,255,0,0.22)]"
      : "border border-black/10 bg-white text-black hover:border-black hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
  }`;
  const inner = (
    <>
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
    </>
  );
  if (action) {
    return (
      <button
        type="button"
        onClick={handleClick}
        style={{ animationDelay: `${140 + index * 90}ms` }}
        className={className}
      >
        {inner}
      </button>
    );
  }
  return (
    <Link
      to={href!}
      onClick={handleClick}
      style={{ animationDelay: `${140 + index * 90}ms` }}
      className={className}
    >
      {inner}
    </Link>
  );
}

export default function ServicePickerModal() {
  const [open, setOpen] = useState(false);
  const t = useT();

  const PRIMARY_OPTIONS = [
    {
      title: t("picker.card1_title"),
      cta: t("picker.card1_cta"),
      // Stays on the homepage: scrolls to the listing packages section.
      action: () => {
        window.setTimeout(() => {
          document
            .getElementById("pricing")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      },
    },
    {
      title: t("picker.card2_title"),
      cta: t("picker.card2_cta"),
      href: "/branding",
    },
  ];

  const SECONDARY_OPTIONS = [
    {
      title: t("picker.card3_title"),
      cta: t("picker.card3_cta"),
      href: "/work",
    },
    {
      title: t("picker.card4_title"),
      cta: t("picker.card4_cta"),
      href: "/order?package=consultation",
    },
  ];

  // Auto-popup: once per visitor, after the visitor scrolls ~50% past the hero.
  // The hero button (openServicePicker) opens on demand and never counts
  // against the auto-popup budget.
  useEffect(() => {
    let triggered = false;
    const onScroll = () => {
      if (triggered || hasSeen()) return;
      const hero = document.getElementById("hero");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const heroTop = rect.top + window.scrollY;
      if (window.scrollY >= heroTop + rect.height * 0.5) {
        triggered = true;
        markSeen();
        setOpen(true);
      }
    };
    // Manual opens (hero button) never consume the auto-popup's
    // once-per-visitor budget — the scroll trigger stays alive.
    const onManualOpen = () => {
      setOpen(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(OPEN_EVENT, onManualOpen);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(OPEN_EVENT, onManualOpen);
    };
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
            <p className="eyebrow mb-2 text-black/40">{t("picker.eyebrow")}</p>
            <h2 className="text-[28px] font-bold leading-tight tracking-tight sm:text-[36px]">
              {t("picker.title")}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-black/60 sm:text-[16px]">
              {t("picker.sub")}
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
              {t("picker.dismiss")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
