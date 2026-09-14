import { Link } from "react-router";

/**
 * LuxEntra footer: black, brand lockup left, tagline center,
 * contact right, fine-print bottom bar.
 */
export default function SiteFooter() {
  return (
    <footer className="bg-[#0b0b0b] text-white">
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="LuxEntra Media home">
            <img src="/brand/symbol-lime.png" alt="LuxEntra Media" className="h-9 w-9 object-contain" />
            <img src="/brand/wordmark-lime.png" alt="" aria-hidden className="h-6 object-contain" />
          </Link>

          <p className="text-[15px] text-white/70">
            Real estate photography &amp; film. New York City &amp; Long Island.
          </p>

          <div className="flex flex-col gap-2 md:text-right">
            <a
              href="mailto:luxentra.media@gmail.com"
              className="text-[15px] font-medium text-white hover:text-[#c7ff00] transition-colors"
            >
              luxentra.media@gmail.com
            </a>
            <a
              href="tel:+13478371257"
              className="text-[15px] font-medium text-white hover:text-[#c7ff00] transition-colors"
            >
              +1 (347) 837-1257
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-[13px] text-white/50">© 2026 LuxEntra Media.</p>
          <div className="flex items-center gap-8">
            <Link to="/special" className="text-[13px] text-white/70 hover:text-[#c7ff00] transition-colors">
              Partnerships
            </Link>
            <Link to="/about" className="text-[13px] text-white/70 hover:text-[#c7ff00] transition-colors">
              Our team
            </Link>
            <Link to="/book" className="text-[13px] text-white/70 hover:text-[#c7ff00] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
