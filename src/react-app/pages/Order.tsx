import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
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

const EMPTY_SHOOT = { name: "", email: "", phone: "", borough: "", service_type: "", shoot_date: "", shoot_time: "", shoot_location: "", request_details: "" };
const EMPTY_CONSULT = { name: "", email: "", phone: "", role: "", meeting_format: "", preferred_date: "", preferred_time: "", goals: "" };

const fmt = (n: number) => `$${n.toLocaleString()}`;

const cardClass = (selected: boolean) =>
  `rounded-md p-4 border transition-colors cursor-pointer ${selected ? "border-[#c7ff00] bg-[#c7ff00]/[0.06]" : "border-white/15 hover:border-white/40"}`;

function SelectButton({ selected, label }: { selected: boolean; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selected ? "bg-[#c7ff00]" : "border-2 border-white/15"}`}
    >
      {selected ? <Check className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4 text-white/40" />}
    </button>
  );
}

export default function OrderPage() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [selectedStagingTier, setSelectedStagingTier] = useState<string | null>(null);
  const [flyerQty, setFlyerQty] = useState(1);
  const [reelQty, setReelQty] = useState(1);
  const [includeStandard, setIncludeStandard] = useState(true);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [selectedBranding, setSelectedBranding] = useState<string | null>(null);
  const [isConsultation, setIsConsultation] = useState(false);
  const [shootForm, setShootForm] = useState(EMPTY_SHOOT);
  const [consultForm, setConsultForm] = useState(EMPTY_CONSULT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Read ?package=<id> from the URL and pre-select the matching bundle,
  // personal-branding plan, or consultation. The id is only a lookup key —
  // the price always comes from our package data, never from the URL.
  const packageParam = searchParams.get("package");
  useEffect(() => {
    if (packageParam === "consultation") {
      setIsConsultation(true);
      setIncludeStandard(false);
      setSelectedBundle(null);
      setSelectedBranding(null);
      return;
    }
    const bundle = getBundleById(packageParam);
    if (bundle) {
      setSelectedBundle(bundle.id);
      setSelectedBranding(null);
      setIsConsultation(false);
      setIncludeStandard(false);
      return;
    }
    const plan = getBrandingPlanById(packageParam);
    if (plan) {
      setSelectedBranding(plan.id);
      setSelectedBundle(null);
      setIsConsultation(false);
      setIncludeStandard(false);
    }
  }, [packageParam]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const selectedBundleData = getBundleById(selectedBundle);
  const bundlePrice = selectedBundleData?.price ?? 0;

  const selectedBrandingData = getBrandingPlanById(selectedBranding);
  const brandingPrice = selectedBrandingData?.price ?? 0;

  const hasPlan = includeStandard || selectedBundle !== null || selectedBranding !== null || isConsultation;

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

  const planLabel = () => {
    if (isConsultation) return "Free one-on-one consultation";
    if (selectedBrandingData) return `${selectedBrandingData.name} · ${fmt(selectedBrandingData.price)}/mo`;
    if (selectedBundleData) return `${selectedBundleData.name} bundle · ${fmt(selectedBundleData.price)}`;
    if (includeStandard) return `Standard Listing Media Package · ${fmt(standardPackagePrice)}`;
    return "No plan selected yet";
  };

  const addOnCount = selectedAddOns.size + (selectedStagingTier ? 1 : 0);

  const stepLabels = isConsultation ? ["Plan", "Details"] : ["Plan", "Add-ons", "Details"];
  const labelIndex = isConsultation ? (step === 2 ? 1 : 0) : step;

  const goToLabel = (i: number) => {
    if (isConsultation) setStep(i === 0 ? 0 : 2);
    else setStep(i);
  };
  const goNext = () => {
    if (step === 0) setStep(isConsultation ? 2 : 1);
    else if (step === 1) setStep(2);
  };
  const goBack = () => {
    if (step === 2) setStep(isConsultation ? 0 : 1);
    else if (step === 1) setStep(0);
  };

  const pickShootPlan = (fn: () => void) => {
    setIsConsultation(false);
    fn();
  };

  const resetAll = () => {
    setSelectedAddOns(new Set());
    setSelectedStagingTier(null);
    setFlyerQty(1);
    setReelQty(1);
    setIncludeStandard(true);
    setSelectedBundle(null);
    setSelectedBranding(null);
    setIsConsultation(false);
    setShootForm(EMPTY_SHOOT);
    setConsultForm(EMPTY_CONSULT);
    setStep(0);
  };

  const handleShootSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const selectedAddOnNames = [
      ...Array.from(selectedAddOns).map((id) => ADD_ONS.find((a) => a.id === id)?.name).filter(Boolean),
      selectedStagingTier ? `Virtual Staging (${VIRTUAL_STAGING_TIERS.find((t) => t.id === selectedStagingTier)?.label})` : null,
    ].filter(Boolean).join(", ");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ ...shootForm, add_ons: selectedAddOnNames || "None", bundle: selectedBundleData ? `${selectedBundleData.name} (${fmt(selectedBundleData.price)})` : "None", branding_plan: selectedBrandingData ? `${selectedBrandingData.name} (${fmt(selectedBrandingData.price)}/mo)` : "None", total_price: fmt(totalPrice), _subject: `New Order: ${fmt(totalPrice)} from ${shootForm.name}` }),
      });
      if (res.ok) { setSubmitStatus("success"); resetAll(); }
      else setSubmitStatus("error");
    } catch { setSubmitStatus("error"); } finally { setIsSubmitting(false); }
  };

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ ...consultForm, _subject: `New One-on-One Consultation Request from ${consultForm.name}` }),
      });
      if (res.ok) { setSubmitStatus("success"); resetAll(); }
      else setSubmitStatus("error");
    } catch { setSubmitStatus("error"); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-16">
      <SiteNav />

      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="link-lime !text-[15px] mb-10">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="text-center mb-10">
            <p className="eyebrow text-white/40 mb-4">Book</p>
            <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-5">
              {isConsultation ? "Book your free consultation." : "Book a shoot."}
            </h1>
            <p className="text-[19px] text-white/60">
              Three quick steps. No payment today, we confirm by email.
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
                  <p className="text-[15px] text-green-700">Your request is in. We&apos;ll reach out within 24 hours to confirm.</p>
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

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-8" aria-label="Booking progress">
            {stepLabels.map((label, i) => {
              const done = i < labelIndex;
              const active = i === labelIndex;
              return (
                <div key={label} className="flex items-center gap-2 md:gap-3">
                  {i > 0 && <div className={`w-8 md:w-16 h-[2px] rounded ${done || active ? "bg-[#c7ff00]" : "bg-white/15"}`} />}
                  <button
                    type="button"
                    disabled={!done}
                    onClick={() => goToLabel(i)}
                    className={`flex items-center gap-2 ${done ? "cursor-pointer" : "cursor-default"}`}
                    aria-current={active ? "step" : undefined}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold ${done ? "bg-[#c7ff00] text-black" : active ? "border-2 border-[#c7ff00] text-[#c7ff00]" : "border-2 border-white/15 text-white/40"}`}>
                      {done ? <Check className="w-4 h-4" /> : i + 1}
                    </span>
                    <span className={`text-[14px] font-medium ${active ? "text-white" : done ? "text-white/70" : "text-white/40"}`}>{label}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Live summary bar */}
          {step < 2 && (
            <div className="flex items-center justify-between gap-4 rounded-md border border-white/15 bg-white/[0.04] px-5 py-4 mb-10">
              <span className="text-[15px] text-white/70 truncate">
                {planLabel()}
                {!isConsultation && addOnCount > 0 && <span className="text-white/40"> · {addOnCount} add-on{addOnCount > 1 ? "s" : ""}</span>}
              </span>
              <span className="price-num text-[17px] font-semibold shrink-0">{isConsultation ? "Free" : fmt(totalPrice)}</span>
            </div>
          )}

          {/* ── STEP 0: plan ── */}
          {step === 0 && (
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight mb-2">Choose your plan</h2>
              <p className="text-[15px] text-white/50 mb-8">Pick one. You can change it any time before you submit.</p>

              {/* Standard package */}
              <div className={`${cardClass(includeStandard)} mb-4`} onClick={() => pickShootPlan(() => { const next = !includeStandard; setIncludeStandard(next); if (next) { setSelectedBundle(null); setSelectedBranding(null); } })}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center shrink-0 ${includeStandard ? "bg-[#c7ff00]" : "bg-white/10"}`}>
                    <Camera className={`w-6 h-6 ${includeStandard ? "text-black" : "text-white/60"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-[19px] font-semibold tracking-tight">Standard Listing Media Package</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[19px] font-semibold">{fmt(standardPackagePrice)}</span>
                        <SelectButton selected={includeStandard} label="Select standard package" />
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
              <h3 className="text-[20px] font-semibold tracking-tight mt-8 mb-4">Launch bundles</h3>
              <div className="space-y-3 mb-4">
                {LAUNCH_BUNDLES.map((bundle) => {
                  const isSelected = selectedBundle === bundle.id;
                  return (
                    <div key={bundle.id} className={cardClass(isSelected)} onClick={() => pickShootPlan(() => { setSelectedBundle(isSelected ? null : bundle.id); if (!isSelected) { setSelectedBranding(null); setIncludeStandard(false); } })}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${isSelected ? "bg-[#c7ff00]" : "bg-white/10"}`}>
                          <Rocket className={`w-5 h-5 ${isSelected ? "text-black" : "text-white/60"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-[17px]">
                              {bundle.name}
                              {bundle.badge && (
                                <span className="ml-2 text-[11px] font-bold uppercase tracking-[0.12em] bg-[#c7ff00] text-black px-2 py-0.5 rounded-full align-middle">{bundle.badge}</span>
                              )}
                            </h4>
                            <span className="price-num font-semibold shrink-0">{fmt(bundle.price)}</span>
                          </div>
                          <p className="text-[13px] text-white/40 mt-0.5">{bundle.blurb}</p>
                        </div>
                        <SelectButton selected={isSelected} label={`Select ${bundle.name}`} />
                      </div>
                      {isSelected && (
                        <ul className="mt-3 pt-3 border-t border-white/10 text-[14px] text-white/60 space-y-1.5">
                          {bundle.features.map((f) => <li key={f}>• {f}</li>)}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Personal branding plans */}
              <h3 className="text-[20px] font-semibold tracking-tight mt-8 mb-4">Personal branding plans</h3>
              <div className="space-y-3 mb-4">
                {BRANDING_PLANS.map((plan) => {
                  const isSelected = selectedBranding === plan.id;
                  return (
                    <div key={plan.id} className={cardClass(isSelected)} onClick={() => pickShootPlan(() => { setSelectedBranding(isSelected ? null : plan.id); if (!isSelected) { setSelectedBundle(null); setIncludeStandard(false); } })}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${isSelected ? "bg-[#c7ff00]" : "bg-white/10"}`}>
                          <Video className={`w-5 h-5 ${isSelected ? "text-black" : "text-white/60"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-[17px]">
                              {plan.name}
                              {plan.badge && (
                                <span className="ml-2 text-[11px] font-bold uppercase tracking-[0.12em] bg-[#c7ff00] text-black px-2 py-0.5 rounded-full align-middle">{plan.badge}</span>
                              )}
                            </h4>
                            <span className="price-num font-semibold shrink-0">{fmt(plan.price)}<span className="text-white/45 text-[13px] font-normal">/mo</span></span>
                          </div>
                          <p className="text-[13px] text-white/40 mt-0.5">{plan.tagline}</p>
                        </div>
                        <SelectButton selected={isSelected} label={`Select ${plan.name}`} />
                      </div>
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <ul className="text-[14px] text-white/60 space-y-1.5">
                            {plan.features.map((f) => <li key={f}>• {f}</li>)}
                          </ul>
                          <p className="text-[12.5px] text-white/40 mt-3">3-month minimum commitment. Active clients get 15% off additional services during their agreement.</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Consultation option */}
              <div
                className={`rounded-md p-5 border transition-colors cursor-pointer mt-8 ${isConsultation ? "border-[#c7ff00] bg-[#c7ff00]/[0.06]" : "border-[#c7ff00]/40 hover:border-[#c7ff00]"}`}
                onClick={() => { setIsConsultation(!isConsultation); if (!isConsultation) { setIncludeStandard(false); setSelectedBundle(null); setSelectedBranding(null); } }}
                role="button"
                aria-pressed={isConsultation}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-[#c7ff00] flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[18px]">Not sure yet? Talk to us first.</h4>
                    <p className="text-[14px] text-white/55 mt-1">Book a free one-on-one. We&apos;ll hear your story and find the right direction together, no prep needed.</p>
                  </div>
                  <SelectButton selected={isConsultation} label="Select free consultation" />
                </div>
              </div>

              <Button onClick={goNext} disabled={!hasPlan} className="w-full h-14 text-[17px] rounded-full mt-10">
                Continue <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              {!hasPlan && <p className="text-center text-[14px] text-white/40 mt-3">Select a plan above to continue.</p>}
            </div>
          )}

          {/* ── STEP 1: add-ons ── */}
          {step === 1 && (
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight mb-2">Make it yours</h2>
              <p className="text-[15px] text-white/50 mb-8">Add-ons are optional. Skip ahead whenever you&apos;re ready.</p>

              <div className="space-y-3">
                {ADD_ONS.map((addOn) => {
                  const Icon = addOn.icon;
                  const isSelected = selectedAddOns.has(addOn.id);
                  const displayPrice = addOn.id === "flyer" ? (flyerQty === 1 ? 39 : flyerQty * 35) : addOn.id === "reel" ? addOn.price * reelQty : addOn.price;
                  return (
                    <div key={addOn.id} className={cardClass(isSelected)} onClick={() => toggleAddOn(addOn.id)}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${isSelected ? "bg-[#c7ff00]" : "bg-white/10"}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? "text-black" : "text-white/60"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-[17px]">{addOn.name}</h3>
                            <span className="font-semibold shrink-0">{fmt(displayPrice)}</span>
                          </div>
                          {addOn.id === "flyer" && <p className="text-[13px] text-white/40 mt-0.5">$39 for 1 · $35 each for 2+</p>}
                          {addOn.id === "reel" && <p className="text-[13px] text-white/40 mt-0.5">Concept, scripting, filming and editing</p>}
                        </div>
                        <SelectButton selected={isSelected} label={isSelected ? `Remove ${addOn.name}` : `Add ${addOn.name}`} />
                      </div>
                      {addOn.id === "flyer" && isSelected && (
                        <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[15px] text-white/60 font-medium">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setFlyerQty(Math.max(1, flyerQty - 1))} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 font-bold">−</button>
                            <span className="w-8 text-center font-semibold">{flyerQty}</span>
                            <button type="button" onClick={() => setFlyerQty(flyerQty + 1)} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 font-bold">+</button>
                          </div>
                          <span className="text-[15px] text-white/60">= <span className="font-semibold text-white">{fmt(flyerQty === 1 ? 39 : flyerQty * 35)}</span></span>
                          {flyerQty > 1 && (
                            <span className="text-[13px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">Save {fmt(39 * flyerQty - flyerQty * 35)} vs full price</span>
                          )}
                        </div>
                      )}
                      {addOn.id === "reel" && isSelected && (
                        <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[15px] text-white/60 font-medium">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setReelQty(Math.max(1, reelQty - 1))} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 font-bold">−</button>
                            <span className="w-8 text-center font-semibold">{reelQty}</span>
                            <button type="button" onClick={() => setReelQty(reelQty + 1)} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 font-bold">+</button>
                          </div>
                          <span className="text-[15px] text-white/60">= <span className="price-num font-semibold text-white">{fmt(addOn.price * reelQty)}</span></span>
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
                    {selectedStagingTier && <span className="font-semibold shrink-0">{fmt(stagingPrice)}</span>}
                  </div>
                  <div className="flex gap-2 ml-14">
                    {VIRTUAL_STAGING_TIERS.map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedStagingTier(selectedStagingTier === tier.id ? null : tier.id)}
                        className={`flex-1 py-2 px-3 rounded-md text-[15px] font-medium border-2 transition-colors ${selectedStagingTier === tier.id ? "bg-[#c7ff00] text-black border-[#c7ff00]" : "bg-transparent text-white border-white/25 hover:border-white/50"}`}
                      >
                        {tier.label}<br /><span className="price-num font-semibold">{fmt(tier.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <Button onClick={goBack} variant="outline" className="h-14 px-8 text-[16px] rounded-full border-white/25 text-white hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5 mr-1" /> Back
                </Button>
                <Button onClick={goNext} className="flex-1 h-14 text-[17px] rounded-full">
                  Continue <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: details ── */}
          {step === 2 && !isConsultation && (
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight mb-2">Your details</h2>
              <p className="text-[15px] text-white/50 mb-8">Last step. We&apos;ll confirm everything by email within 24 hours.</p>

              <div className="bg-white/[0.04] border border-white/15 rounded-md p-6 mb-10">
                <h3 className="text-[17px] font-semibold tracking-tight mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Your booking
                </h3>
                <div className="space-y-2 text-[15px] mb-4">
                  {includeStandard && <div className="flex justify-between"><span className="text-white/60">Standard Package</span><span className="font-medium">{fmt(standardPackagePrice)}</span></div>}
                  {selectedBundleData && <div className="flex justify-between"><span className="text-white/60">{selectedBundleData.name} Bundle</span><span className="price-num font-medium">{fmt(selectedBundleData.price)}</span></div>}
                  {selectedBrandingData && <div className="flex justify-between"><span className="text-white/60">{selectedBrandingData.name} · Personal Branding</span><span className="price-num font-medium">{fmt(selectedBrandingData.price)}/mo</span></div>}
                  {Array.from(selectedAddOns).map((id) => { const a = ADD_ONS.find((x) => x.id === id); if (!a) return null; return <div key={id} className="flex justify-between"><span className="text-white/60">{a.name}</span><span className="price-num font-medium">{fmt(a.price)}</span></div>; })}
                  {selectedStagingTier && <div className="flex justify-between"><span className="text-white/60">Virtual Staging ({VIRTUAL_STAGING_TIERS.find((t) => t.id === selectedStagingTier)?.label})</span><span className="font-medium">{fmt(stagingPrice)}</span></div>}
                </div>
                <div className="pt-4 border-t border-white/15">
                  <div className="flex justify-between text-[21px] font-semibold"><span>Total</span><span className="price-num">{fmt(totalPrice)}</span></div>
                </div>
                <button type="button" onClick={() => goToLabel(0)} className="link-lime !text-[14px] mt-4">Change plan or add-ons</button>
              </div>

              <form onSubmit={handleShootSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Name *</Label>
                  <Input type="text" required value={shootForm.name} onChange={(e) => setShootForm({ ...shootForm, name: e.target.value })} className="h-12 text-base" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Email *</Label>
                  <Input type="email" required value={shootForm.email} onChange={(e) => setShootForm({ ...shootForm, email: e.target.value })} className="h-12 text-base" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Phone <span className="text-white/40 font-normal">(optional)</span></Label>
                  <Input type="tel" value={shootForm.phone} onChange={(e) => setShootForm({ ...shootForm, phone: e.target.value })} className="h-12 text-base" placeholder="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Borough *</Label>
                  <Select value={shootForm.borough} onValueChange={(v) => setShootForm({ ...shootForm, borough: v })} required>
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
                <div className="space-y-2">
                  <Label className="text-base font-medium">Service Type *</Label>
                  <Select value={shootForm.service_type} onValueChange={(v) => setShootForm({ ...shootForm, service_type: v })} required>
                    <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select service type" /></SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Preferred Shoot Date</Label>
                    <Input type="date" value={shootForm.shoot_date} onChange={(e) => setShootForm({ ...shootForm, shoot_date: e.target.value })} className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Preferred Shoot Time</Label>
                    <Input type="time" value={shootForm.shoot_time} onChange={(e) => setShootForm({ ...shootForm, shoot_time: e.target.value })} className="h-12 text-base" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Property Address / Location</Label>
                  <Input type="text" placeholder="123 Main St, Brooklyn, NY..." value={shootForm.shoot_location} onChange={(e) => setShootForm({ ...shootForm, shoot_location: e.target.value })} className="h-12 text-base" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Additional Details <span className="text-white/40 font-normal">(optional)</span></Label>
                  <Textarea value={shootForm.request_details} onChange={(e) => setShootForm({ ...shootForm, request_details: e.target.value })} className="min-h-24 text-base" placeholder="Special requirements, gate codes, anything we should know..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" onClick={goBack} variant="outline" className="h-14 px-8 text-[16px] rounded-full border-white/25 text-white hover:bg-white/10">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1 h-14 text-[17px] rounded-full">
                    {isSubmitting ? "Sending..." : `Request booking · ${fmt(totalPrice)}`}
                  </Button>
                </div>
                <p className="flex items-center justify-center gap-2 text-center text-[14px] text-white/45">
                  <Check className="w-4 h-4 text-[#c7ff00] shrink-0" /> No payment today. We confirm every booking by email within 24 hours.
                </p>
              </form>
            </div>
          )}

          {/* ── STEP 2: consultation details ── */}
          {step === 2 && isConsultation && (
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight mb-2">Book your meeting</h2>
              <p className="text-[15px] text-white/50 mb-8">Tell us a little about yourself and we&apos;ll set a time to talk.</p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-md border border-[#c7ff00]/25 bg-white/[0.03] p-8 h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-md bg-[#c7ff00] flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-[22px] font-semibold tracking-tight">What to expect</h3>
                  </div>
                  <ul className="space-y-5 text-[15px] text-white/65 leading-relaxed">
                    <li className="flex items-start gap-3"><Check className="w-5 h-5 mt-0.5 shrink-0 text-[#c7ff00]" /><span>We&apos;ll hear your story and understand your goals, no prep needed.</span></li>
                    <li className="flex items-start gap-3"><Check className="w-5 h-5 mt-0.5 shrink-0 text-[#c7ff00]" /><span>Together we&apos;ll find the right direction for your personal brand.</span></li>
                    <li className="flex items-start gap-3"><Check className="w-5 h-5 mt-0.5 shrink-0 text-[#c7ff00]" /><span>If we genuinely believe we can help, and it feels right for you, we&apos;ll build it together.</span></li>
                    <li className="flex items-start gap-3"><Check className="w-5 h-5 mt-0.5 shrink-0 text-[#c7ff00]" /><span>If not, you&apos;ll still leave with greater clarity about your next step.</span></li>
                  </ul>
                </div>

                <form onSubmit={handleConsultSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Name *</Label>
                    <Input type="text" required value={consultForm.name} onChange={(e) => setConsultForm({ ...consultForm, name: e.target.value })} className="h-12 text-base" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Email *</Label>
                    <Input type="email" required value={consultForm.email} onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })} className="h-12 text-base" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Phone <span className="text-white/40 font-normal">(optional)</span></Label>
                    <Input type="tel" value={consultForm.phone} onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })} className="h-12 text-base" placeholder="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">What do you do? *</Label>
                    <Input type="text" required value={consultForm.role} onChange={(e) => setConsultForm({ ...consultForm, role: e.target.value })} className="h-12 text-base" placeholder="Real estate agent, broker, business owner..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Preferred meeting format</Label>
                    <Select value={consultForm.meeting_format} onValueChange={(v) => setConsultForm({ ...consultForm, meeting_format: v })}>
                      <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select format" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Video call">Video call</SelectItem>
                        <SelectItem value="Phone call">Phone call</SelectItem>
                        <SelectItem value="In person">In person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Preferred day</Label>
                      <Input type="date" value={consultForm.preferred_date} onChange={(e) => setConsultForm({ ...consultForm, preferred_date: e.target.value })} className="h-12 text-base" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Preferred time</Label>
                      <Input type="time" value={consultForm.preferred_time} onChange={(e) => setConsultForm({ ...consultForm, preferred_time: e.target.value })} className="h-12 text-base" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">What would you like to talk about? <span className="text-white/40 font-normal">(optional)</span></Label>
                    <Textarea value={consultForm.goals} onChange={(e) => setConsultForm({ ...consultForm, goals: e.target.value })} className="min-h-24 text-base" placeholder="Your goals, what's holding you back, what you'd like clarity on..." />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" onClick={goBack} variant="outline" className="h-14 px-8 text-[16px] rounded-full border-white/25 text-white hover:bg-white/10">
                      <ArrowLeft className="w-5 h-5 mr-1" /> Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1 h-14 text-[17px] rounded-full">
                      {isSubmitting ? "Sending..." : "Request my one-on-one"}
                    </Button>
                  </div>
                  <p className="flex items-center justify-center gap-2 text-center text-[14px] text-white/45">
                    <Check className="w-4 h-4 text-[#c7ff00] shrink-0" /> Free to request. We reply within 24 hours to set a time.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
