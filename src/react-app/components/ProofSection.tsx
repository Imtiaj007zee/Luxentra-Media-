import { useSiteSettings } from "@/react-app/lib/siteSettings";
import { useT, useTerms } from "@/react-app/lib/siteContent";

export default function ProofSection() {
  const { settings } = useSiteSettings();
  const t = useT();
  const terms = useTerms();

  const stats = [
    {
      value: `${settings.stat_properties}+`,
      label: t("proof.stat1_label"),
      explainer: t("proof.stat1_explainer"),
    },
    {
      value: `$${settings.stat_value_m}M+`,
      label: t("proof.stat2_label"),
      explainer: t("proof.stat2_explainer"),
    },
    {
      value: `${settings.stat_success_rate}%+`,
      label: t("proof.stat3_label"),
      explainer: t("proof.stat3_explainer"),
    },
  ];

  return (
    <section className="bg-[#f4f4f4] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="eyebrow text-black/40 mb-4">{t("proof.eyebrow")}</p>
        <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-5">
          {t("proof.h2")}
        </h2>
        <p className="text-[17px] md:text-[19px] text-black/60 leading-relaxed mb-12 max-w-2xl">
          {t("proof.intro")}
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-md p-8 hover:shadow-lg transition-shadow"
            >
              <p className="price-num text-[52px] md:text-[60px] font-bold tracking-[-0.03em] leading-none mb-3">
                {s.value}
              </p>
              <p className="text-[16px] font-bold tracking-tight mb-2">{s.label}</p>
              <p className="text-[14px] text-black/50 leading-relaxed">{s.explainer}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[16px] text-black/60">
          {t("proof.cta_line1")}
          <a
            href={`mailto:${terms.contact_email}?subject=${encodeURIComponent(t("proof.mailto_subject"))}`}
            className="text-black font-semibold underline underline-offset-4 decoration-[#c7ff00] decoration-2"
          >
            {t("proof.cta_link")}
          </a>
          {t("proof.cta_line2")}
        </p>
      </div>
    </section>
  );
}
