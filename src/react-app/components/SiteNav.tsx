import { useState } from "react";
import { Link, useLocation } from "react-router";

const LINKS = [
  { label: "Work", to: "/#work" },
  { label: "Package", to: "/#package" },
  { label: "Add-ons", to: "/#addons" },
  { label: "Partnerships", to: "/special" },
  { label: "About", to: "/about" },
];

/**
 * Apple-style global navigation: 48px translucent bar, small links,
 * blue pill CTA, full-screen overlay menu on mobile.
 */
export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fbfbfd]/80 backdrop-blur-2xl saturate-150">
        <nav className="max-w-[1024px] mx-auto px-6 h-12 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5"
            onClick={() => setOpen(false)}
            aria-label="LuxEntra Media home"
          >
            <img
              src="/logo-mark.jpg"
              alt="LuxEntra Media logo"
              className="w-7 h-7 rounded-[8px] object-cover"
            />
            <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">
              LuxEntra Media
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((l) =>
              l.to.startsWith("/#") && isHome ? (
                <a
                  key={l.label}
                  href={l.to.slice(1)}
                  className="text-xs font-normal text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-xs font-normal text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors"
                >
                  {l.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/order" className="hidden md:inline-flex rounded-full bg-[#c7ff00] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#d9ff4d] transition-colors">
              Book a Shoot
            </Link>
            {/* Mobile hamburger — Apple style two lines */}
            <button
              className="md:hidden flex flex-col justify-center gap-[7px] w-8 h-8"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span
                className="block h-[1.5px] w-5 bg-[#1d1d1f] transition-all duration-300 mx-auto"
                style={{ transform: open ? "rotate(45deg) translateY(4.5px)" : "none" }}
              />
              <span
                className="block h-[1.5px] w-5 bg-[#1d1d1f] transition-all duration-300 mx-auto"
                style={{ transform: open ? "rotate(-45deg) translateY(-4.5px)" : "none" }}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#fbfbfd] md:hidden transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="pt-20 px-10 flex flex-col gap-2">
          <div className="flex items-center gap-2.5 pb-6">
            <img
              src="/logo-mark.jpg"
              alt="LuxEntra Media logo"
              className="w-8 h-8 rounded-[9px] object-cover"
            />
            <span className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
              LuxEntra Media
            </span>
          </div>
          {LINKS.map((l, i) =>
            l.to.startsWith("/#") && isHome ? (
              <a
                key={l.label}
                href={l.to.slice(1)}
                onClick={() => setOpen(false)}
                className={`text-[28px] font-semibold tracking-tight text-[#1d1d1f] py-2 border-b border-black/5 transition-all duration-300 ${
                  open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`text-[28px] font-semibold tracking-tight text-[#1d1d1f] py-2 border-b border-black/5 transition-all duration-300 ${
                  open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              >
                {l.label}
              </Link>
            )
          )}
          <Link
            to="/order"
            onClick={() => setOpen(false)}
            className="btn-apple-lg mt-8 self-start"
          >
            Book a Shoot
          </Link>
        </div>
      </div>
    </>
  );
}
