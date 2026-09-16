import { useState } from "react";
import { Link, useLocation } from "react-router";

const LINKS = [
  { label: "Branding", to: "/branding" },
  { label: "Work", to: "/work" },
  { label: "Services", to: "/#services" },
  { label: "Pricing", to: "/#pricing" },
  { label: "About", to: "/about" },
];

/**
 * LuxEntra global navigation: solid black sticky bar, lime brand lockup,
 * centered links, lime pill CTA, full-screen black overlay menu on mobile.
 */
export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0b0b]">
        <nav className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" onClick={() => setOpen(false)} aria-label="LuxEntra Media home" className="flex items-center gap-3 shrink-0">
            <img src="/brand/symbol-lime.png" alt="LuxEntra Media" className="h-9 w-9 object-contain" />
            <img src="/brand/wordmark-lime.png" alt="" aria-hidden className="h-6 object-contain" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {LINKS.map((l) =>
              renderLink(
                l,
                "text-[14px] font-medium text-white/80 hover:text-white transition-colors"
              )
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/order" className="btn-lime-sm hidden md:inline-flex">
              Book a Shoot
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center gap-[7px] w-8 h-8"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span
                className="block h-[2px] w-6 bg-white transition-all duration-300"
                style={{ transform: open ? "rotate(45deg) translateY(4.5px)" : "none" }}
              />
              <span
                className="block h-[2px] w-6 bg-white transition-all duration-300"
                style={{ transform: open ? "rotate(-45deg) translateY(-4.5px)" : "none" }}
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
          <Link to="/order" onClick={() => setOpen(false)} className="btn-lime mt-8 self-start">
            Book a Shoot
          </Link>
        </div>
      </div>
    </>
  );
}
