import { Link } from "react-router";
import { useT, useTerms } from "@/react-app/lib/siteContent";

/**
 * LuxEntra footer: black, brand lockup left, tagline center,
 * contact right, fine-print bottom bar.
 */
export default function SiteFooter() {
  const t = useT();
  const terms = useTerms();
  const telHref = `tel:+${terms.contact_phone.replace(/\D/g, "")}`;

  return (
    <footer className="bg-[#0b0b0b] text-white">
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label={t("footer.home_aria")}>
            <img src="/brand/symbol-lime.png" alt={t("footer.brand_alt")} className="h-9 w-9 object-contain" />
            <img src="/brand/wordmark-lime.png" alt="" aria-hidden className="h-6 object-contain" />
          </Link>

          <p className="text-[15px] text-white/70">{t("footer.tagline")}</p>

          <div className="flex flex-col gap-2 md:text-right">
            <a
              href={`mailto:${terms.contact_email}`}
              className="text-[15px] font-medium text-white hover:text-[#c7ff00] transition-colors"
            >
              {terms.contact_email}
            </a>
            <a
              href={telHref}
              className="text-[15px] font-medium text-white hover:text-[#c7ff00] transition-colors"
            >
              {terms.contact_phone}
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-[13px] text-white/50">{t("footer.fineprint")}</p>
          <div className="flex items-center gap-8">
            <Link to="/about" className="text-[13px] text-white/70 hover:text-[#c7ff00] transition-colors">
              {t("footer.link_team")}
            </Link>
            <Link to="/order" className="text-[13px] text-white/70 hover:text-[#c7ff00] transition-colors">
              {t("footer.link_book")}
            </Link>
            <Link to="/privacy" className="text-[13px] text-white/70 hover:text-[#c7ff00] transition-colors">
              {t("footer.link_privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
