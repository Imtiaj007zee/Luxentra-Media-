import { Link } from "react-router";
import { ArrowLeft, Check } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";

const plans = [
  {
    name: "Growth",
    volume: "4 listings / week",
    price: 400,
    savings: 75,
    standard: 475,
    highlight: false,
    description: "The entry point for agents ready to scale their listing game consistently.",
  },
  {
    name: "Scale",
    volume: "6 listings / week",
    price: 380,
    savings: 95,
    standard: 475,
    highlight: false,
    description: "For agents and small teams building momentum in competitive markets.",
  },
  {
    name: "Dominance",
    volume: "8+ listings / week",
    price: 350,
    savings: 125,
    standard: 475,
    highlight: true,
    description: "Maximum value for high-volume teams who demand premium at scale.",
  },
];

const features = [
  "Up to 1,999 sq ft properties",
  "20–45 professionally edited images",
  "Full interior + exterior coverage",
  "Same-day or 24-hour delivery",
  "Priority scheduling",
  "Walkthrough / Cinematic Video",
  "Private online gallery (one-click download)",
  "Virtual Staging images or Drone coverage",
];

export default function SpecialPage() {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] pt-12">
      <SiteNav />

      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <Link to="/order" className="apple-link !text-[15px] mb-10">
            <ArrowLeft className="w-4 h-4" /> Back to order
          </Link>

          {/* Intro */}
          <div className="mb-16 max-w-3xl">
            <p className="apple-eyebrow mb-4">Exclusive partnership</p>
            <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-6">
              Weekly Partnership Plans
            </h1>
            <p className="text-[19px] md:text-[21px] text-[#6e6e73] leading-relaxed">
              Built for agents and teams who list consistently.<br />
              The more listings you bring in, the more optimized your pricing becomes.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-[18px] p-8 border ${
                  plan.highlight
                    ? "bg-black border-black text-white"
                    : "bg-white border-[#d2d2d7]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-[#1d1d1f] text-[11px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#d2d2d7] whitespace-nowrap">
                    Best Value
                  </div>
                )}

                <p className={`apple-eyebrow mb-4 ${plan.highlight ? "!text-white/50" : ""}`}>
                  {plan.name} Plan
                </p>

                <div
                  className={`text-[13px] font-medium mb-6 px-3 py-1.5 rounded-full inline-block ${
                    plan.highlight ? "bg-white/10 text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"
                  }`}
                >
                  {plan.volume}
                </div>

                <div className="mb-2">
                  <span className="text-[56px] font-semibold tracking-tight leading-none">
                    ${plan.price}
                  </span>
                  <span className={`text-[15px] ml-2 ${plan.highlight ? "text-white/60" : "text-[#6e6e73]"}`}>
                    / listing
                  </span>
                </div>

                <p className={`text-[15px] font-medium mb-6 ${plan.highlight ? "text-emerald-400" : "text-emerald-600"}`}>
                  Save ${plan.savings} per listing
                  <span className={`ml-2 line-through font-normal ${plan.highlight ? "text-white/40" : "text-[#86868b]"}`}>
                    ${plan.standard}
                  </span>
                </p>

                <p className={`text-[15px] leading-relaxed mb-8 ${plan.highlight ? "text-white/60" : "text-[#6e6e73]"}`}>
                  {plan.description}
                </p>

                <div className={`w-full h-px mb-8 ${plan.highlight ? "bg-white/10" : "bg-[#e8e8ed]"}`} />

                <ul className="space-y-3 mb-10">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          plan.highlight ? "bg-white/15" : "bg-[#65a30d]/10"
                        }`}
                      >
                        <Check className={`w-3 h-3 ${plan.highlight ? "text-white" : "text-[#65a30d]"}`} />
                      </span>
                      <span className={`text-[15px] leading-relaxed ${plan.highlight ? "text-white/80" : "text-[#1d1d1f]/80"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/order"
                  state={{ specialPlan: { name: plan.name, price: plan.price, volume: plan.volume, savings: plan.savings } }}
                  className="btn-apple w-full"
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="bg-[#f5f5f7] rounded-[18px] p-10 mb-16">
            <div className="max-w-3xl">
              <p className="apple-eyebrow mb-4">How it works</p>
              <p className="text-[21px] font-medium text-[#1d1d1f] leading-relaxed mb-4">
                You can reach these volumes individually or by collaborating with other agents.
              </p>
              <p className="text-[17px] text-[#6e6e73] leading-relaxed">
                The total number of listings per week determines your pricing tier — not just one agent. Partner with your team and unlock better rates together.
              </p>
            </div>
          </div>

          {/* Closing line */}
          <div className="text-center">
            <p className="text-[32px] md:text-[40px] font-semibold tracking-tight text-[#1d1d1f] leading-tight">
              More volume. Better pricing.<br />
              <span className="text-[#86868b]">Same premium standard.</span>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
