import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Plus, ArrowRight } from "lucide-react";
import { useT } from "@/react-app/lib/siteContent";

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const t = useT();

  const faqs = useMemo(
    () =>
      t("faq.items")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [q, a] = line.split("===");
          return { q: (q ?? "").trim(), a: (a ?? "").trim() };
        })
        .filter((f) => f.q && f.a),
    [t]
  );

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[900px] mx-auto px-6">
        <p className="eyebrow text-black/40 mb-4">{t("faq.eyebrow")}</p>
        <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-12">
          {t("faq.h2")}
        </h2>

        <div className="border-t border-black/10">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-black/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-[18px] md:text-[20px] font-bold tracking-tight">
                    {f.q}
                  </span>
                  <span
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isOpen ? "bg-[#c7ff00] text-black" : "bg-black/5 text-black"
                    }`}
                  >
                    <Plus
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[16px] text-black/60 leading-relaxed pb-6 pr-10">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-[16px] text-black/60">{t("faq.outro")}</p>
        <Link
          to="/order?package=consultation"
          className="btn-lime mt-5 inline-flex items-center gap-2"
        >
          {t("faq.cta")} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
