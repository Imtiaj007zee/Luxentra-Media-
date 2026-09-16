import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, ArrowRight, Check, AlertCircle, CalendarCheck, Camera, Video, Plane, Box, Plus, ShoppingCart, Layers, FileText, Rocket } from "lucide-react";
import { LAUNCH_BUNDLES, getBundleById, BRANDING_PLANS, getBrandingPlanById, SERVICE_TYPES } from "@/react-app/data/packages";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Label } from "@/react-app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";

type AddOn = { id: string; name: string; price: number; icon: typeof Box; description?: string; };

const ADD_ONS: AddOn[] = [
  { id: "flyer", name: "Custom Listing Flyer", price: 39, icon: FileText },
  { id: "drone", name: "Drone Photos & Video", price: 99, icon: Plane },
  { id: "3d_tour", name: "3D Virtual Tour", price: 99, icon: Box },
  { id: "video", name: "Walkthrough/Cinematic Video", price: 299, icon: Video },
  { id: "reel", name: "Creative Personal Branding Reel", price: 499, icon: Video },
];

const VIRTUAL_STAGING_TIERS = [
  { id: "staging_1", label: "1 Room", price: 40 },
  { id: "staging_3", label: "3 Rooms", price: 99 },
  { id: "staging_5", label: "5 Rooms", price: 149 },
];

const FORMSPREE_URL = "https://formspree.io/f/meelbrbz";

export default function OrderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [selectedStagingTier, setSelectedStagingTier] = useState<string | null>(null);
  const [flyerQty, setFlyerQty] = useState(1);
  const [reelQty, setReelQty] = useState(1);
  const [includeStandard, setIncludeStandard] = useState(true);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [selectedBranding, setSelectedBranding] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", borough: "", borough_custom: "", service_type: "", shoot_date: "", shoot_time: "", shoot_location: "", request_details: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Read ?package=<id> from the URL and pre-select the matching bundle or
  // personal-branding plan. The id is only a lookup key — the price always
  // comes from our package data, never from the URL. A single selected value
  // means refresh can't duplicate it and picking another replaces the previous.
  const packageParam = searchParams.get("package");
  useEffect(() => {
    const bundle = getBundleById(packageParam);
    if (bundle) {
      setSelectedBundle(bundle.id);
      setSelectedBranding(null);
      setIncludeStandard(false);
      return;
    }
    const plan = getBrandingPlanById(packageParam);
    if (plan) {
      setSelectedBranding(plan.id);
      setSelectedBundle(null);
      setIncludeStandard(false);
    }
  }, [packageParam]);

  const selectedBundleData = getBundleById(selectedBundle);
  const bundlePrice = selectedBundleData?.price ?? 0;

  const selectedBrandingData = getBrandingPlanById(selectedBranding);
  const brandingPrice = selectedBrandingData?.price ?? 0;

  const toggleAddOn = (id: string) => {
    const newSet = new Set(selectedAddOns);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setSelectedAddOns(newSet);
  };

  const stagingPrice = selectedStagingTier
    ? VIRTUAL_STAGING_TIERS.find((t) => t.id === selectedStagingTier)?.price || 0
    : 0;

  const standardPackagePrice = 175;

  const addOnsTotal = Array.from(selectedAddOns).reduce((sum, id) => {
    const addon = ADD_ONS.find((a) => a.id === id);
    if (!addon) return sum;
    if (id === "flyer") return sum + (flyerQty === 1 ? 39 : flyerQty * 35);
    if (id === "reel") return sum + (addon.price * reelQty);
    return sum + addon.price;
  }, 0);
  const totalPrice = (includeStandard ? standardPackagePrice : 0) + bundlePrice + brandingPrice + addOnsTotal + stagingPrice;

  const selectedAddOnNames = [
    selectedBundleData ? `${selectedBundleData.name} Bundle` : null,
    selectedBrandingData ? `${selectedBrandingData.name} Personal Branding ($${selectedBrandingData.price.toLocaleString()}/mo)` : null,
    ...Array.from(selectedAddOns).map((id) => ADD_ONS.find((a) => a.id === id)?.name).filter(Boolean),
    selectedStagingTier ? `Virtual Staging (${VIRTUAL_STAGING_TIERS.find((t) => t.id === selectedStagingTier)?.label})` : null,
  ].filter(Boolean).join(", ");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ ...formData, add_ons: selectedAddOnNames || "None", bundle: selectedBundleData ? `${selectedBundleData.name} ($${selectedBundleData.price})` : "None", branding_plan: selectedBrandingData ? `${selectedBrandingData.name} ($${selectedBrandingData.price.toLocaleString()}/mo)` : "None", total_price: `$${totalPrice}`, _subject: `New Order: $${totalPrice} from ${formData.name}` }),
      });
      if (res.ok) { setSubmitStatus("success"); setFormData({ name: "", email: "", phone: "", borough: "", borough_custom: "", service_type: "", shoot_date: "", shoot_time: "", shoot_location: "", request_details: "" }); setSelectedAddOns(new Set()); setSelectedStagingTier(null); setReelQty(1); setIncludeStandard(true); setSelectedBundle(null); setSelectedBranding(null); }
      else setSubmitStatus("error");
    } catch { setSubmitStatus("error"); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-16">
      <SiteNav />

      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <Link to="/" className="link-lime !text-[15px] mb-10">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="text-center mb-14">
            <p className="eyebrow text-white/40 mb-4">Order</p>
            <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-5">
              Build your package.
            </h1>
            <p className="text-[19px] text-white/60">
              Start with our standard package and customize with add-ons.
            </p>
          </div>

          {submitStatus === "success" && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Thank you!</h3>
                  <p className="text-[15px] text-green-700">Your order has been received. We&apos;ll reach out to finalize your booking!</p>
                </div>
              </div>
            </div>
          )}
          {submitStatus === "error" && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Submission error</h3>
                  <p className="text-[15px] text-red-700">Please try again or contact luxentra.media@gmail.com</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: package builder */}
            <div>
              {/* Standard package card */}
              <div
                className={`rounded-md p-6 mb-8 cursor-pointer border transition-colors ${includeStandard ? "border-[#c7ff00] bg-[#c7ff00]/[0.06]" : "border-white/15 hover:border-white/40"}`}
                onClick={() => {
                  const next = !includeStandard;
                  setIncludeStandard(next);
                  if (next) { setSelectedBundle(null); setSelectedBranding(null); }
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center shrink-0 ${includeStandard ? "bg-[#c7ff00]" : "bg-white/10"}`}>
                    <Camera className={`w-6 h-6 ${includeStandard ? "text-black" : "text-white/60"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-[19px] font-semibold tracking-tight">
                        Standard Listing Media Package
                      </h3>
                      <div className="text-right flex items-center gap-2 shrink-0">
                        <span className="text-[19px] font-semibold">${standardPackagePrice}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${includeStandard ? "bg-[#c7ff00]" : "border-2 border-white/15"}`}>
                          {includeStandard ? <Check className="w-3.5 h-3.5 text-black" /> : <Plus className="w-3.5 h-3.5 text-white/40" />}
                        </div>
                      </div>
                    </div>
                    <ul className="text-[15px] text-white/60 space-y-1.5">
                      <li>• 25–45 MLS-ready photos</li>
                      <li>• 1 twilight photo</li>
                      <li>• 24-hour delivery</li>
                      <li>• Private branded gallery</li>
                      <li>• Free revisions</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Launch bundles */}
              <h2 className="text-[24px] font-semibold tracking-tight mb-5">Launch bundles</h2>
              <div className="space-y-3 mb-8">
                {LAUNCH_BUNDLES.map((bundle) => {
                  const isSelected = selectedBundle === bundle.id;
                  return (
                    <div
                      key={bundle.id}
                      className={`rounded-md p-4 border transition-colors ${isSelected ? "border-[#c7ff00] bg-[#c7ff00]/[0.06]" : "border-white/15 hover:border-white/40"}`}
                    >
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => {
                        if (isSelected) {
                          setSelectedBundle(null);
                        } else {
                          setSelectedBundle(bundle.id);
                          setSelectedBranding(null);
                          setIncludeStandard(false);
                        }
                      }}>
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${isSelected ? "bg-[#c7ff00]" : "bg-white/10"}`}>
                          <Rocket className={`w-5 h-5 ${isSelected ? "text-black" : "text-white/60"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-[17px]">
                              {bundle.name}
                              {bundle.badge && (
                                <span className="ml-2 text-[11px] font-bold uppercase tracking-[0.12em] bg-[#c7ff00] text-black px-2 py-0.5 rounded-full align-middle">
                                  {bundle.badge}
                                </span>
                              )}
                            </h3>
                            <span className="font-semibold shrink-0">${bundle.price}</span>
                          </div>
                          <p className="text-[13px] text-white/40 mt-0.5">{bundle.blurb}</p>
                        </div>
                        <button
                          type="button"
                          aria-label={isSelected ? `Remove ${bundle.name}` : `Add ${bundle.name}`}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-[#c7ff00]" : "border-2 border-white/15"}`}
                        >
                          {isSelected ? <Check className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4 text-white/40" />}
                        </button>
                      </div>
                      {isSelected && (
                        <ul className="mt-3 pt-3 border-t border-white/10 text-[14px] text-white/60 space-y-1.5">
                          {bundle.features.map((f) => (
                            <li key={f}>• {f}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Personal branding plans */}
              <h2 className="text-[24px] font-semibold tracking-tight mb-5">Personal branding plans</h2>
              <div className="space-y-3 mb-8">
                {BRANDING_PLANS.map((plan) => {
                  const isSelected = selectedBranding === plan.id;
                  return (
                    <div
                      key={plan.id}
                      className={`rounded-md p-4 border transition-colors ${isSelected ? "border-[#c7ff00] bg-[#c7ff00]/[0.06]" : "border-white/15 hover:border-white/40"}`}
                    >
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => {
                        if (isSelected) {
                          setSelectedBranding(null);
                        } else {
                          setSelectedBranding(plan.id);
                          setSelectedBundle(null);
                          setIncludeStandard(false);
                        }
                      }}>
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${isSelected ? "bg-[#c7ff00]" : "bg-white/10"}`}>
                          <Video className={`w-5 h-5 ${isSelected ? "text-black" : "text-white/60"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-[17px]">
                              {plan.name}
                              {plan.badge && (
                                <span className="ml-2 text-[11px] font-bold uppercase tracking-[0.12em] bg-[#c7ff00] text-black px-2 py-0.5 rounded-full align-middle">
                                  {plan.badge}
                                </span>
                              )}
                            </h3>
                            <span className="font-semibold shrink-0">${plan.price.toLocaleString()}<span className="text-white/45 text-[13px] font-normal">/mo</span></span>
                          </div>
                          <p className="text-[13px] text-white/40 mt-0.5">{plan.tagline}</p>
                        </div>
                        <button
                          type="button"
                          aria-label={isSelected ? `Remove ${plan.name}` : `Add ${plan.name}`}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-[#c7ff00]" : "border-2 border-white/15"}`}
                        >
                          {isSelected ? <Check className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4 text-white/40" />}
                        </button>
                      </div>
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <ul className="text-[14px] text-white/60 space-y-1.5">
                            {plan.features.map((f) => (
                              <li key={f}>• {f}</li>
                            ))}
                          </ul>
                          <p className="text-[12.5px] text-white/40 mt-3">
                            3-month minimum commitment. Active clients get 15% off additional services during their agreement.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* One-on-one consultancy — opens the consultation booking page */}
              <div
                className="rounded-md p-4 border border-[#c7ff00]/50 bg-[#c7ff00]/[0.06] cursor-pointer hover:bg-[#c7ff00]/[0.12] transition-colors"
                onClick={() => navigate("/consultation")}
                role="link"
                aria-label="Book a one-on-one consultancy"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-[#c7ff00] flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[17px]">One-on-One Consultancy</h3>
                    <p className="text-[13px] text-white/40 mt-0.5">
                      Not sure which plan fits? Book a consultation and we&apos;ll find the right direction together.
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#c7ff00] flex items-center justify-center shrink-0">
                    <ArrowRight className="w-4 h-4 text-black" />
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              <h2 className="text-[24px] font-semibold tracking-tight mb-5">Optional add-ons</h2>
              <div className="space-y-3">
                {ADD_ONS.map((addOn) => {
                  const Icon = addOn.icon;
                  const isSelected = selectedAddOns.has(addOn.id);
                  const displayPrice =
                    addOn.id === "flyer"
                      ? flyerQty === 1 ? 39 : flyerQty * 35
                      : addOn.id === "reel"
                        ? addOn.price * reelQty
                        : addOn.price;
                  return (
                    <div
                      key={addOn.id}
                      className={`rounded-md p-4 border transition-colors ${isSelected ? "border-[#c7ff00] bg-[#c7ff00]/[0.06]" : "border-white/15 hover:border-white/40"}`}
                    >
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggleAddOn(addOn.id)}>
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${isSelected ? "bg-[#c7ff00]" : "bg-white/10"}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? "text-black" : "text-white/60"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-[17px]">{addOn.name}</h3>
                            <span className="font-semibold shrink-0">${displayPrice}</span>
                          </div>
                          {addOn.id === "flyer" && <p className="text-[13px] text-white/40 mt-0.5">$39 for 1 · $35 each for 2+</p>}
                          {addOn.id === "reel" && <p className="text-[13px] text-white/40 mt-0.5">Concept, scripting, filming & editing</p>}
                        </div>
                        <button
                          type="button"
                          aria-label={isSelected ? `Remove ${addOn.name}` : `Add ${addOn.name}`}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-[#c7ff00]" : "border-2 border-white/15"}`}
                        >
                          {isSelected ? <Check className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4 text-white/40" />}
                        </button>
                      </div>
                      {addOn.id === "flyer" && isSelected && (
                        <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/10">
                          <span className="text-[15px] text-white/60 font-medium">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setFlyerQty(Math.max(1, flyerQty - 1))} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 font-bold">−</button>
                            <span className="w-8 text-center font-semibold">{flyerQty}</span>
                            <button type="button" onClick={() => setFlyerQty(flyerQty + 1)} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 font-bold">+</button>
                          </div>
                          <span className="text-[15px] text-white/60">= <span className="font-semibold text-white">${flyerQty === 1 ? 39 : flyerQty * 35}</span></span>
                          {flyerQty > 1 && (
                            <span className="text-[13px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                              Save ${39 * flyerQty - flyerQty * 35} vs full price
                            </span>
                          )}
                        </div>
                      )}
                      {addOn.id === "reel" && isSelected && (
                        <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/10">
                          <span className="text-[15px] text-white/60 font-medium">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setReelQty(Math.max(1, reelQty - 1))} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 font-bold">−</button>
                            <span className="w-8 text-center font-semibold">{reelQty}</span>
                            <button type="button" onClick={() => setReelQty(reelQty + 1)} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 font-bold">+</button>
                          </div>
                          <span className="text-[15px] text-white/60">= <span className="font-semibold text-white">${addOn.price * reelQty}</span></span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Virtual Staging */}
                <div className={`rounded-md p-4 border transition-colors ${selectedStagingTier ? "border-[#c7ff00] bg-[#c7ff00]/[0.06]" : "border-white/15"}`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${selectedStagingTier ? "bg-[#c7ff00]" : "bg-white/10"}`}>
                      <Layers className={`w-5 h-5 ${selectedStagingTier ? "text-black" : "text-white/60"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[17px]">Virtual Staging</h3>
                      <p className="text-[15px] text-white/60">Photorealistic digital staging, delivered in 24hrs</p>
                    </div>
                    {selectedStagingTier && (
                      <span className="font-semibold shrink-0">${VIRTUAL_STAGING_TIERS.find((t) => t.id === selectedStagingTier)?.price}</span>
                    )}
                  </div>
                  <div className="flex gap-2 ml-14">
                    {VIRTUAL_STAGING_TIERS.map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedStagingTier(selectedStagingTier === tier.id ? null : tier.id)}
                        className={`flex-1 py-2 px-3 rounded-md text-[15px] font-medium border-2 transition-colors ${
                          selectedStagingTier === tier.id
                            ? "bg-[#c7ff00] text-black border-[#c7ff00]"
                            : "bg-transparent text-white border-white/25 hover:border-white/50"
                        }`}
                      >
                        {tier.label}
                        <br />
                        <span className="font-semibold">${tier.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="mt-8 bg-white/10 rounded-md p-6">
                <h3 className="text-[19px] font-semibold tracking-tight mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Order summary
                </h3>
                <div className="space-y-2 text-[15px] mb-4">
                  {includeStandard && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Standard Package</span>
                      <span className="font-medium">${standardPackagePrice}</span>
                    </div>
                  )}
                  {selectedBundleData && (
                    <div className="flex justify-between">
                      <span className="text-white/60">{selectedBundleData.name} Bundle</span>
                      <span className="font-medium">${selectedBundleData.price}</span>
                    </div>
                  )}
                  {selectedBrandingData && (
                    <div className="flex justify-between">
                      <span className="text-white/60">{selectedBrandingData.name} — Personal Branding</span>
                      <span className="font-medium">${selectedBrandingData.price.toLocaleString()}/mo</span>
                    </div>
                  )}
                  {Array.from(selectedAddOns).map((id) => { const a = ADD_ONS.find((x) => x.id === id); if (!a) return null; return <div key={id} className="flex justify-between"><span className="text-white/60">{a.name}</span><span className="font-medium">${a.price}</span></div>; })}
                  {selectedStagingTier && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Virtual Staging ({VIRTUAL_STAGING_TIERS.find((t) => t.id === selectedStagingTier)?.label})</span>
                      <span className="font-medium">${stagingPrice}</span>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-white/15">
                  <div className="flex justify-between text-[21px] font-semibold"><span>Total</span><span>${totalPrice}</span></div>
                </div>
              </div>
            </div>

            {/* Right: details form */}
            <div>
              <h2 className="text-[32px] font-semibold tracking-tight mb-4">Your details</h2>
              <p className="text-[17px] text-white/60 mb-8">Fill out your information and we&apos;ll confirm within 24 hours.</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Name *</Label>
                  <Input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 text-base" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Email *</Label>
                  <Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12 text-base" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Phone <span className="text-white/40 font-normal">(optional)</span></Label>
                  <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-12 text-base" placeholder="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Borough *</Label>
                  <Select value={formData.borough} onValueChange={(v) => setFormData({ ...formData, borough: v })} required>
                    <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select borough" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manhattan">Manhattan</SelectItem>
                      <SelectItem value="Brooklyn">Brooklyn</SelectItem>
                      <SelectItem value="Queens">Queens</SelectItem>
                      <SelectItem value="Bronx">Bronx</SelectItem>
                      <SelectItem value="Staten Island">Staten Island</SelectItem>
                      <SelectItem value="Long Island">Long Island</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.borough === "other" && (
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Specify Location *</Label>
                    <Input type="text" placeholder="Enter your borough or area..." value={formData.borough_custom} onChange={(e) => setFormData({ ...formData, borough_custom: e.target.value })} className="h-12 text-base" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Service Type *</Label>
                  <Select value={formData.service_type} onValueChange={(v) => setFormData({ ...formData, service_type: v })} required>
                    <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select service type" /></SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Preferred Shoot Date</Label>
                  <Input type="date" value={formData.shoot_date} onChange={(e) => setFormData({ ...formData, shoot_date: e.target.value })} className="h-12 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Preferred Shoot Time</Label>
                  <Input type="time" value={formData.shoot_time} onChange={(e) => setFormData({ ...formData, shoot_time: e.target.value })} className="h-12 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Property Address / Location</Label>
                  <Input type="text" placeholder="123 Main St, Brooklyn, NY..." value={formData.shoot_location} onChange={(e) => setFormData({ ...formData, shoot_location: e.target.value })} className="h-12 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Additional Details <span className="text-white/40 font-normal">(optional)</span></Label>
                  <Textarea value={formData.request_details} onChange={(e) => setFormData({ ...formData, request_details: e.target.value })} className="min-h-24 text-base" placeholder="Preferred shoot date, special requirements..." />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-[17px] rounded-full">
                  {isSubmitting ? "Submitting Order..." : `Submit Order — $${totalPrice}`}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
