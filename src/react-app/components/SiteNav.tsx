import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useT } from "@/react-app/lib/siteContent";

/**
 * LuxEntra global navigation: the usual bar (logo, Branding / Work /
 * About, Free Consultation, Let's work together) rendered as a floating
 * glass pill that stays fixed at the top while scrolling, on every
 * screen size. The pill shrinks with the screen: on iPhone and narrow
 * widths it shows just the logo and a plain three-line menu button,
 * on iPad and wider the links and buttons appear and no menu button
 * is needed. The menu button sits at the right corner of the pill
 * and opens the full-screen menu.
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
        <nav className="flex items-center justify-between h-12 md:h-14 pl-4 pr-2 md:pl-5 md:pr-2 rounded-full border border-white/15 bg-white/[0.07] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
          <Link
            to="/"
            onClick={() => {
              setOpen(false);
              // Already on home: a plain <Link> to the current route does nothing,
              // so bring the user back to the very top explicitly.
              if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label={t("nav.home_aria")}
            className="flex items-center gap-2 md:gap-3 shrink-0"
          >
            <img src="/brand/symbol-lime.png" alt={t("nav.brand_alt")} className="h-8 w-8 md:h-9 md:w-9 object-contain" />
            <img src="/brand/wordmark-lime.png" alt="" aria-hidden className="h-5 md:h-6 object-contain" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {LINKS.map((l) =>
              renderLink(
                l,
                "text-[14px] font-medium text-white/80 hover:text-white transition-colors"
              )
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Link
              to="/consultation"
              className="hidden md:inline-flex items-center rounded-full border border-white/25 px-3.5 lg:px-4 py-2 text-[13px] lg:text-[14px] font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              {t("nav.cta_consult")}
            </Link>
            <Link to="/order" className="btn-lime-sm hidden md:inline-flex whitespace-nowrap">
              {t("nav.cta_work")}
            </Link>
            {/* Mobile menu button: plain three lines, right corner */}
            <button
              className="md:hidden flex flex-col items-center justify-center gap-[6px] w-8 h-8"
              onClick={() => setOpen(!open)}
              aria-label={t("nav.menu_aria")}
            >
              <span
                className="block h-[2px] w-6 bg-white transition-all duration-300"
                style={{ transform: open ? "rotate(45deg) translateY(8px)" : "none" }}
              />
              <span
                className="block h-[2px] w-6 bg-white transition-all duration-300"
                style={{ opacity: open ? 0 : 1 }}
              />
              <span
                className="block h-[2px] w-6 bg-white transition-all duration-300"
                style={{ transform: open ? "rotate(-45deg) translateY(-8px)" : "none" }}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0b0b0b] md:hidden transition-all duration-300 ${
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
              {t("nav.cta_work")}
            </Link>
            <Link
              to="/consultation"
              onClick={() => setOpen(false)}
              className="self-start inline-flex items-center rounded-full border border-white/25 px-5 py-2.5 text-[15px] font-medium text-white"
            >
              {t("nav.cta_consult")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
