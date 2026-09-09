import { SiteHeader, SiteFooter } from '@/react-app/components/SiteChrome';
import { Link } from "react-router";
import { ArrowLeft, Check } from "lucide-react";

import { PLANS as plans, PARTNERSHIP_FEATURES as features } from '@/react-app/data/catalog';

export default function SpecialPage() {
  return (
    <div className="legacy-page min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <SiteHeader /><main id="main">

      <div className="pt-32 pb-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Back link */}
          <Link to="/order" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-16">
            <ArrowLeft className="w-4 h-4" /> Back to Order
          </Link>

          {/* Intro */}
          <div className="mb-20 max-w-3xl">
            <div className="inline-block text-xs uppercase tracking-widest text-zinc-400 font-medium mb-6 border border-zinc-200 px-4 py-1.5 rounded-full">
              Exclusive Partnership
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight mb-6">
              Weekly<br />Partnership Plans
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl">
              Built for agents and teams who list consistently.<br />
              The more listings you bring in, the more optimized your pricing becomes.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 border transition-all duration-300 ${
                  plan.highlight
                    ? "bg-zinc-900 border-zinc-900 text-white"
                    : "bg-white border-zinc-200 hover:border-zinc-400 hover:shadow-xl"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-zinc-900 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-zinc-200 shadow-sm whitespace-nowrap">
                    Best Value
                  </div>
                )}

                {/* Plan name */}
                <div className={`text-xs uppercase tracking-widest font-medium mb-4 ${plan.highlight ? "text-zinc-400" : "text-zinc-400"}`}>
                  {plan.name} Plan
                </div>

                {/* Volume */}
                <div className={`text-sm font-medium mb-6 px-3 py-1.5 rounded-full inline-block ${plan.highlight ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-700"}`}>
                  {plan.volume}
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span className={`text-6xl font-bold tracking-tight ${plan.highlight ? "text-white" : "text-zinc-900"}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm ml-2 ${plan.highlight ? "text-zinc-400" : "text-zinc-500"}`}>/ listing</span>
                </div>

                {/* Savings */}
                <div className={`text-sm font-medium mb-6 ${plan.highlight ? "text-emerald-400" : "text-emerald-600"}`}>
                  Save ${plan.savings} per listing
                  <span className={`ml-2 line-through font-normal ${plan.highlight ? "text-zinc-500" : "text-zinc-400"}`}>
                    ${plan.standard}
                  </span>
                </div>

                <p className={`text-sm leading-relaxed mb-8 ${plan.highlight ? "text-zinc-400" : "text-zinc-500"}`}>
                  {plan.description}
                </p>

                {/* Divider */}
                <div className={`w-full h-px mb-8 ${plan.highlight ? "bg-white/10" : "bg-zinc-100"}`} />

                {/* Features */}
                <ul className="space-y-3">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${plan.highlight ? "bg-white/15" : "bg-zinc-100"}`}>
                        <Check className={`w-3 h-3 ${plan.highlight ? "text-white" : "text-zinc-700"}`} />
                      </div>
                      <span className={`text-sm leading-relaxed ${plan.highlight ? "text-zinc-300" : "text-zinc-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to={`/order?plan=${plan.id}`}
                  className={`mt-10 block text-center py-3.5 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                    plan.highlight
                      ? "bg-white text-zinc-900 hover:bg-zinc-100"
                      : "bg-zinc-900 text-white hover:bg-zinc-700"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          {/* Collaboration note */}
          <div className="bg-zinc-50 rounded-3xl p-10 mb-16 border border-zinc-100">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-4">How It Works</div>
              <p className="text-xl text-zinc-700 leading-relaxed mb-4">
                You can reach these volumes individually or by collaborating with other agents.
              </p>
              <p className="text-zinc-500 leading-relaxed">
                The total number of listings per week determines your pricing tier — not just one agent. Partner with your team and unlock better rates together.
              </p>
            </div>
          </div>

          {/* Closing line */}
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900">
              More volume. Better pricing.<br />
              <span className="text-zinc-400">Same premium standard.</span>
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      </main><SiteFooter />
    </div>
  );
}
