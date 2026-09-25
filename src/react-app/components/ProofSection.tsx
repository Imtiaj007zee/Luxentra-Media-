// Verified LuxEntra impact figures. Live values come from Site Settings
// (editable at /backstage); these are the fallbacks.
const STATS = [
  {
    key: "properties" as const,
    label: "Properties Covered",
    explainer: "Homes across New York City and Long Island, shot and delivered.",
  },
  {
    key: "value" as const,
    label: "Property Value Covered",
    explainer: "The combined value of the listings our media has marketed.",
  },
  {
    key: "success" as const,
    label: "Marketing Success Rate",
    explainer: "Clients who got the result they wanted.",
  },
];

import { useSiteSettings } from "@/react-app/lib/siteSettings";

export default function ProofSection() {
  const { settings } = useSiteSettings();
  const numbers: Record<string, string> = {
    properties: `${settings.stat_properties}+`,
    value: `$${settings.stat_value_m}M+`,
    success: `${settings.stat_success_rate}%+`,
  };
  return (
    <section className="bg-[#f4f4f4] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="eyebrow text-black/40 mb-4">Proof</p>
        <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-5">
          The numbers speak.
        </h2>
        <p className="text-[17px] md:text-[19px] text-black/60 leading-relaxed mb-12 max-w-2xl">
          No borrowed reviews, no stock praise. Just the work, counted.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-md p-8 hover:shadow-lg transition-shadow"
            >
              <p className="price-num text-[52px] md:text-[60px] font-bold tracking-[-0.03em] leading-none mb-3">
                {numbers[s.key]}
              </p>
              <p className="text-[16px] font-bold tracking-tight mb-2">{s.label}</p>
              <p className="text-[14px] text-black/50 leading-relaxed">{s.explainer}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[16px] text-black/60">
          Shot with us before?{" "}
          <a
            href="mailto:luxentra.media@gmail.com?subject=My%20words%20for%20LuxEntra"
            className="text-black font-semibold underline underline-offset-4 decoration-[#c7ff00] decoration-2"
          >
            Send us a few words
          </a>{" "}
          and we will put them right here.
        </p>
      </div>
    </section>
  );
}
