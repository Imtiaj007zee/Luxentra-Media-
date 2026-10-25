import { useState } from "react";
import { Link, useLocation } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { useT } from "@/react-app/lib/siteContent";

/**
 * LuxEntra global navigation: floating glass pill, centered at the top,
 * lime brand lockup, white pill CTA and a round hamburger that opens
 * the full-screen menu on every screen size.
 */
export default function SiteNav({ topOffset = 0 }: { topOffset?: number }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const t = useT();

  const LINKS = [
    { label: t("nav.link_branding"), to: "/branding" },
    { label: t("nav.link_work"), to: "/work" },
    { label: t("nav.link_about"), to: "/about" },
  ];

  const renderLink = (
    l: { label: string; to: string },
    className: string,
    onClick?: () => void,
    style?: React.CSSProperties
  ) =>
    l.to.startsWith("/#") && isHome ? (
      <a key={l.label} href={l.to.slice(1)} className={className} onClick={onClick} style={style}>
        {l.label}
      </a>
    ) : (
      <Link key={l.label} to={l.to} className={className} onClick={onClick} style={style}>
        {l.label}
      </Link>
    );

  return (
    <>
      <header
        className="fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-[1200px]"
        style={{ top: topOffset + 12 }}
      >
        <nav className="flex items-center justify-between h-14 md:h-16 pl-4 pr-2 md:pl-5 md:pr-2 rounded-full border border-white/15 bg-white/[0.07] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
          <Link
            to="/"
            onClick={() => {
              setOpen(false);
              // Already on home: a plain <Link> to the current route does nothing,
              // so bring the user back to the very top explicitly.
              if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label={t("nav.home_aria")}
            className="flex items-center gap-3 shrink-0"
          >
            <img src="/brand/symbol-lime.png" alt={t("nav.brand_alt")} className="h-9 w-9 object-contain" />
            <img src="/brand/wordmark-lime.png" alt="" aria-hidden className="h-6 object-contain" />
          </Link>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Link
              to="/order"
              className="inline-flex items-center gap-1 rounded-full bg-white text-black text-[13px] md:text-sm font-semibold px-4 md:px-5 py-2.5 hover:bg-white/85 transition-colors"
            >
              {t("nav.cta_book")}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            {/* Hamburger, round outline button, every screen size */}
            <button
              className="flex flex-col items-center justify-center gap-[6px] w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/20 hover:border-white/40 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label={t("nav.menu_aria")}
            >
              <span
                className="block h-[2px] w-4 bg-white transition-all duration-300"
                style={{ transform: open ? "rotate(45deg) translateY(4px)" : "none" }}
              />
              <span
                className="block h-[2px] w-4 bg-white transition-all duration-300"
                style={{ transform: open ? "rotate(-45deg) translateY(-4px)" : "none" }}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen menu, every screen size */}
      <div
        className={`fixed inset-0 z-40 bg-[#0b0b0b] transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="pt-24 px-8 flex flex-col gap-1">
          {LINKS.map((l, i) =>
            renderLink(
              l,
              `text-[32px] font-bold tracking-tight text-white py-3 border-b border-white/10 transition-all duration-300 ${
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`,
              () => setOpen(false),
              { transitionDelay: open ? `${i * 50}ms` : "0ms" }
            )
          )}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link to="/order" onClick={() => setOpen(false)} className="btn-lime self-start">
              {t("nav.cta_book")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
