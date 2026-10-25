import { Link } from "react-router";
import { Check } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";
import { useT, useTeam } from "@/react-app/lib/siteContent";

export default function AboutPage() {
  const t = useT();
  const team = useTeam();

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-16 relative">
      <SiteNav />

      {/* Ambient canvas, same as the home page: soft lime glows bleeding
          across the whole scroll behind every section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 55% 22% at 50% 16%, rgba(199,255,0,0.05), transparent 70%)",
            "radial-gradient(ellipse 50% 20% at 50% 36%, rgba(199,255,0,0.028), transparent 70%)",
            "radial-gradient(ellipse 55% 20% at 50% 56%, rgba(199,255,0,0.035), transparent 70%)",
            "radial-gradient(ellipse 50% 20% at 50% 76%, rgba(199,255,0,0.028), transparent 70%)",
            "radial-gradient(ellipse 60% 22% at 50% 94%, rgba(199,255,0,0.05), transparent 70%)",
          ].join(","),
        }}
      />

      {/* Strong top glow, same as the home screen's first screen: the
          olive wash behind the hero. The faint canvas below is the same
          as home; this is what makes the top read olive, not flat black. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[900px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 30%, rgba(199,255,0,0.10), transparent 70%)",
        }}
      />

      {/* Hero */}
      <section className="relative pt-20 md:pt-28 pb-8 md:pb-10">
        <div className="max-w-[1024px] mx-auto px-6 text-center">
          <p className="eyebrow text-white/50 mb-4">{t("about.hero_eyebrow")}</p>
          <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-6">
            {t("about.hero_h1")}
          </h1>
          <p className="text-[19px] md:text-[21px] text-white/60 max-w-2xl mx-auto">
            {t("about.hero_sub")}
          </p>
        </div>
      </section>

      {/* Team members */}
      {team.map((m, i) => (
        <section
          key={m.id}
          className={`${i % 2 === 1 ? "bg-white/[0.03]" : "bg-transparent"} relative py-14 md:py-20`}
        >
          <div className="max-w-[1024px] mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Photo */}
            <div className={`relative ${i % 2 === 1 ? "md:order-2" : ""}`}>
              <div className="aspect-[3/4] rounded-[18px] overflow-hidden bg-white/10">
                <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
              </div>
              {m.badge && (
                <div
                  className={`absolute -bottom-6 ${
                    i % 2 === 1 ? "-left-6" : "-right-6"
                  } bg-black text-white px-6 py-4 rounded-[18px]`}
                >
                  <div className="text-2xl font-semibold">{m.badge}</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest">
                    {t("about.exp_label")}
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <p className="eyebrow text-white/50 mb-3">{m.role}</p>
              <h2 className="text-[32px] md:text-[40px] font-semibold tracking-tight mb-2">
                {m.name}
              </h2>
              {m.knownAs && (
                <p className="text-[17px] text-white/60 mb-1">
                  {t("about.known_as")}{" "}
                  <span className="font-medium text-white">{m.knownAs}</span>
                </p>
              )}
              <p className="text-[17px] text-white/60 mb-8">{m.title}</p>

              {m.bio
                .split("\n\n")
                .map((p) => p.trim())
                .filter(Boolean)
                .map((p, j) => (
                  <p key={j} className="text-[17px] text-white/80 leading-relaxed mb-4">
                    {p}
                  </p>
                ))}

              <h3 className="eyebrow text-white/50 mt-10 mb-5">
                {t("about.highlights_title")}
              </h3>
              <ul className="space-y-3.5 mb-10">
                {m.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-[15px]">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#c7ff00]/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#c7ff00]" />
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {m.quote && (
                <blockquote className="border-l-2 border-[#c7ff00] pl-6 py-1">
                  <p className="text-[19px] italic text-white/80 leading-relaxed">
                    &ldquo;{m.quote}&rdquo;
                  </p>
                </blockquote>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="relative text-white py-24 md:py-32">
        <div className="max-w-[820px] mx-auto px-6 text-center">
          <h2 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-5">
            {t("about.cta_h2")}
          </h2>
          <p className="text-[19px] text-white/70 mb-10">{t("about.cta_copy")}</p>
          <Link to="/order" className="btn-apple-lg">
            {t("about.cta_button")}
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
