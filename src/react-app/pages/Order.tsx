import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, ArrowRight, Check, AlertCircle, CalendarCheck, Camera, Video, Rocket, Tag, Plus, ShoppingCart, Layers, FileText, Plane, Box } from "lucide-react";
import { SERVICE_TYPES } from "@/react-app/data/packages";
import { ORDERS_ENDPOINT } from "@/react-app/lib/siteSettings";
import {
  useDiscounts,
  useLiveCatalog,
  useT,
  useTerms,
} from "@/react-app/lib/siteContent";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Label } from "@/react-app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";

// Add-ons, staging tiers, bundles, plans, prices, discounts and all copy
// come from the content system (editable at /backstage).

const ADDON_ICONS: Record<string, typeof Box> = {
  flyer: FileText,
  drone: Plane,
  "3d_tour": Box,
  video: Video,
  reel: Video,
};

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
  const t = useT();
  const terms = useTerms();
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
  const [planTab, setPlanTab] = useState<"listing" | "brand">("listing");
  const [shootForm, setShootForm] = useState(EMPTY_SHOOT);
  const [consultForm, setConsultForm] = useState(EMPTY_CONSULT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Live catalog: prices, add-ons, plans and discounts update from
  // the content system (/backstage).
  const {
    addOns,
    stagingTiers,
    bundles,
    brandingPlans,
    standardPrice: standardPackagePrice,
    standard,
    getBundleById,
    getBrandingPlanById,
  } = useLiveCatalog();
  const discounts = useDiscounts();
  const flyerUnit = addOns.find((a) => a.id === "flyer")?.priceNum ?? 39;
  const FLYER_BULK_UNIT = Number(terms.flyer_bulk_price) || 35;

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
      setStep(2);
      return;
    }
    const bundle = getBundleById(packageParam);
    if (bundle) {
      setSelectedBundle(bundle.id);
      setSelectedBranding(null);
      setIsConsultation(false);
      setIncludeStandard(false);
      setPlanTab("listing");
      return;
    }
    const plan = getBrandingPlanById(packageParam);
    if (plan) {
      setSelectedBranding(plan.id);
      setSelectedBundle(null);
      setIsConsultation(false);
      setIncludeStandard(false);
      setPlanTab("brand");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageParam]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const selectedBundleData = getBundleById(selectedBundle);
  const bundlePrice = selectedBundleData?.price ?? 0;

  const selectedBrandingData = getBrandingPlanById(selectedBranding);
  const brandingPrice = selectedBrandingData?.price ?? 0;

  const hasPlan = includeStandard || selectedBundle !== null || selectedBranding !== null || isConsultation;
  const showConsultCard = t("order.consult_card_visible") === "on";

  const toggleAddOn = (id: string) => {
    const newSet = new Set(selectedAddOns);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setSelectedAddOns(newSet);
  };

  const stagingPrice = selectedStagingTier
    ? stagingTiers.find((t) => t.id === selectedStagingTier)?.price || 0
    : 0;

  const addOnsTotal = Array.from(selectedAddOns).reduce((sum, id) => {
    const addon = addOns.find((a) => a.id === id);
    if (!addon) return sum;
    if (id === "flyer") return sum + (flyerQty === 1 ? flyerUnit : flyerQty * FLYER_BULK_UNIT);
    if (id === "reel") return sum + (addon.priceNum * reelQty);
    return sum + addon.priceNum;
  }, 0);
  const totalPrice = (includeStandard ? standardPackagePrice : 0) + bundlePrice + brandingPrice + addOnsTotal + stagingPrice;

  // Discount codes come from the content system (Discount Codes tab,
  // editable at /backstage). Only active codes apply.
  const DISCOUNT_CODES: Record<string, number> = Object.fromEntries(
    discounts.filter((d) => d.active).map((d) => [d.code.toUpperCase(), d.amount])
  );
  const enteredCode = discountCode.trim().toUpperCase();
  const discountAmount = !isConsultation ? DISCOUNT_CODES[enteredCode] ?? 0 : 0;
  const finalTotal = Math.max(0, totalPrice - discountAmount);

  const planLabel = () => {
    if (isConsultation) return t("order.summary_consult");
    if (selectedBrandingData) return `${selectedBrandingData.name} · ${fmt(selectedBrandingData.price)}/mo`;
    if (selectedBundleData) return `${selectedBundleData.name} ${t("order.row_bundle_suffix").toLowerCase()} · ${fmt(selectedBundleData.price)}`;
    if (includeStandard) return `${standard?.name ?? t("order.plan_standard_name")} · ${fmt(standardPackagePrice)}`;
    return t("order.summary_no_plan");
  };

  const addOnCount = selectedAddOns.size + (selectedStagingTier ? 1 : 0);

  const stepLabels = isConsultation
    ? [t("order.step_plan"), t("order.step_details")]
    : [t("order.step_plan"), t("order.step_addons"), t("order.step_details")];
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
    setDiscountCode("");
    setStep(0);
  };

  const handleShootSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const selectedAddOnNames = [
      ...Array.from(selectedAddOns).map((id) => addOns.find((a) => a.id === id)?.name).filter(Boolean),
      selectedStagingTier ? `Virtual Staging (${stagingTiers.find((t) => t.id === selectedStagingTier)?.label})` : null,
    ].filter(Boolean).join(", ");
    try {
      const res = await fetch(ORDERS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ form_type: "shoot", ...shootForm, add_ons: selectedAddOnNames || "None", bundle: selectedBundleData ? `${selectedBundleData.name} (${fmt(selectedBundleData.price)})` : "None", branding_plan: selectedBrandingData ? `${selectedBrandingData.name} (${fmt(selectedBrandingData.price)}/mo)` : "None", discount_code: discountAmount > 0 ? discountCode.trim().toUpperCase() : "None", total_price: fmt(finalTotal), _subject: `New Order: ${fmt(finalTotal)} from ${shootForm.name}` }),
      });
      if (res.ok) { setSubmitStatus("success"); resetAll(); }
      else setSubmitStatus("error");
    } catch { setSubmitStatus("error"); } finally { setIsSubmitting(false); }
  };

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(ORDERS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ form_type: "consultation", ...consultForm, _subject: `New One-on-One Consultation Request from ${consultForm.name}` }),
      });
      if (res.ok) { setSubmitStatus("success"); resetAll(); }
      else setSubmitStatus("error");
    } catch { setSubmitStatus("error"); } finally { setIsSubmitting(false); }
  };

  const boroughs = t("order.boroughs").split("\n").map((b) => b.trim()).filter(Boolean);
  const formatOptions = t("order.format_options").split("\n").map((b) => b.trim()).filter(Boolean);
  const standardFeatures = t("order.plan_standard_features").split("\n").map((b) => b.trim()).filter(Boolean);
  const expectBullets = t("order.expect_bullets").split("\n").map((b) => b.trim()).filter(Boolean);

  return (
    <div className="dark min-h-screen bg-[#0b0b0b] text-white pt-16">
      <SiteNav />

      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="link-lime !text-[15px] mb-10">
            <ArrowLeft className="w-4 h-4" /> {t("order.back")}
          </Link>

          <div className="text-center mb-10">
            <p className="eyebrow text-white/40 mb-4">{t("order.eyebrow")}</p>
            <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-5">
              {isConsultation ? t("order.h1_consult") : t("order.h1_shoot")}
            </h1>
            <p className="text-[19px] text-white/60">
              {t("order.sub")}
            </p>
          </div>

          {submitStatus === "success" && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">{t("order.success_title")}</h3>
                  <p className="text-[15px] text-green-700">{t("order.success_copy")}</p>
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
                  <h3 className="font-semibold text-red-900 mb-1">{t("order.error_title")}</h3>
                  <p className="text-[15px] text-red-700">{t("order.error_copy")}</p>
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
                {!isConsultation && addOnCount > 0 && <span className="text-white/40"> · {t("order.summary_addons", { n: addOnCount })}</span>}
              </span>
              <span className="price-num text-[17px] font-semibold shrink-0">{isConsultation ? t("order.summary_free") : fmt(finalTotal)}</span>
            </div>
          )}

          {/* ── STEP 0: plan ── */}
          {step === 0 && (
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight mb-2">{t("order.plan_title")}</h2>
              <p className="text-[15px] text-white/50 mb-6">{t("order.plan_sub")}</p>

              {/* Plan audience tabs */}
              <p className="text-center text-[15px] font-semibold text-white/80 mb-3">{t("order.plan_tab_question")}</p>
              <div className="flex bg-white/[0.06] border border-white/15 rounded-full p-1 gap-1 mb-8" role="tablist" aria-label={t("order.plan_tab_question")}>
                {(["listing", "brand"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={planTab === tab}
                    onClick={() => setPlanTab(tab)}
                    className={`flex-1 rounded-full py-2.5 text-[14px] font-bold transition-colors ${planTab === tab ? "bg-[#c7ff00] text-black" : "text-white/55 hover:text-white"}`}
                  >
                    {t(tab === "listing" ? "order.plan_tab_listing" : "order.plan_tab_brand")}
                  </button>
                ))}
              </div>

              {planTab === "listing" && (
              <>
              {/* Standard package */}
              <div className={`${cardClass(includeStandard)} mb-4`} onClick={() => pickShootPlan(() => { const next = !includeStandard; setIncludeStandard(next); if (next) { setSelectedBundle(null); setSelectedBranding(null); } })}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center shrink-0 ${includeStandard ? "bg-[#c7ff00]" : "bg-white/10"}`}>
                    <Camera className={`w-6 h-6 ${includeStandard ? "text-black" : "text-white/60"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-[19px] font-semibold tracking-tight">{standard?.name ?? t("order.plan_standard_name")}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[19px] font-semibold">{fmt(standardPackagePrice)}</span>
                        <SelectButton selected={includeStandard} label={t("order.select_plan")} />
                      </div>
                    </div>
                    <ul className="text-[15px] text-white/60 space-y-1.5">
                      {standardFeatures.map((f) => (
                        <li key={f}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Launch bundles */}
              <h3 className="text-[20px] font-semibold tracking-tight mt-8 mb-4">{t("order.plan_bundles_title")}</h3>
              <div className="space-y-3 mb-4">
                {bundles.map((bundle) => {
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

              </>
              )}

              {planTab === "brand" && (
              <>
              {/* Personal branding plans */}
              <h3 className="text-[20px] font-semibold tracking-tight mb-4">{t("order.plan_branding_title")}</h3>
              <div className="space-y-3 mb-4">
                {brandingPlans.map((plan) => {
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
                          <p className="text-[12.5px] text-white/40 mt-3">{t("order.plan_footnote")}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              </>
              )}

              {showConsultCard ? (
              /* Consultation big card → consultation booking */
              <Link
                to="/order?package=consultation"
                className="block rounded-md p-5 border transition-colors mt-8 border-[#c7ff00]/40 hover:border-[#c7ff00]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-[#c7ff00] flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[18px]">{t("order.consult_card_title")}</h4>
                    <p className="text-[14px] text-white/55 mt-1">{t("order.consult_card_copy")}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#c7ff00] shrink-0" />
                </div>
              </Link>
              ) : (
              /* Consultation quiet link → consultation booking */
              <p className="text-center text-[14px] mt-8">
                <Link
                  to="/order?package=consultation"
                  className="underline underline-offset-4 decoration-[#c7ff00]/60 hover:decoration-[#c7ff00] transition-colors text-white/55 hover:text-white"
                >
                  {t("order.plan_consult_link")}
                </Link>
              </p>
              )}

              <Button onClick={goNext} disabled={!hasPlan} className="w-full h-14 text-[17px] rounded-full mt-10">
                {t("order.continue")} <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              {!hasPlan && <p className="text-center text-[14px] text-white/40 mt-3">{t("order.select_plan")}</p>}
            </div>
          )}

          {/* ── STEP 1: add-ons ── */}
          {step === 1 && (
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight mb-2">{t("order.addons_title")}</h2>
              <p className="text-[15px] text-white/50 mb-8">{t("order.addons_sub")}</p>

              <div className="space-y-3">
                {addOns.map((addOn) => {
                  const Icon = ADDON_ICONS[addOn.id] ?? Box;
                  const isSelected = selectedAddOns.has(addOn.id);
                  const displayPrice = addOn.id === "flyer" ? (flyerQty === 1 ? flyerUnit : flyerQty * FLYER_BULK_UNIT) : addOn.id === "reel" ? addOn.priceNum * reelQty : addOn.priceNum;
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
                          {addOn.id === "flyer" && <p className="text-[13px] text-white/40 mt-0.5">{t("order.flyer_note")}</p>}
                          {addOn.id === "reel" && <p className="text-[13px] text-white/40 mt-0.5">{t("order.reel_note")}</p>}
                        </div>
                        <SelectButton selected={isSelected} label={isSelected ? `Remove ${addOn.name}` : `Add ${addOn.name}`} />
                      </div>
                      {addOn.id === "flyer" && isSelected && (
                        <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[15px] text-white/60 font-medium">{t("order.qty")}</span>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setFlyerQty(Math.max(1, flyerQty - 1))} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 font-bold">−</button>
                            <span className="w-8 text-center font-semibold">{flyerQty}</span>
                            <button type="button" onClick={() => setFlyerQty(flyerQty + 1)} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 font-bold">+</button>
                          </div>
                          <span className="text-[15px] text-white/60">= <span className="font-semibold text-white">{fmt(flyerQty === 1 ? flyerUnit : flyerQty * FLYER_BULK_UNIT)}</span></span>
                          {flyerQty > 1 && (
                            <span className="text-[13px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">{t("order.save_badge", { n: fmt(flyerUnit * flyerQty - flyerQty * FLYER_BULK_UNIT) })}</span>
                          )}
                        </div>
                      )}
                      {addOn.id === "reel" && isSelected && (
                        <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[15px] text-white/60 font-medium">{t("order.qty")}</span>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setReelQty(Math.max(1, reelQty - 1))} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 font-bold">−</button>
                            <span className="w-8 text-center font-semibold">{reelQty}</span>
                            <button type="button" onClick={() => setReelQty(reelQty + 1)} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 font-bold">+</button>
                          </div>
                          <span className="text-[15px] text-white/60">= <span className="price-num font-semibold text-white">{fmt(addOn.priceNum * reelQty)}</span></span>
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
                      <h3 className="font-semibold text-[17px]">{t("order.staging_name")}</h3>
                      <p className="text-[15px] text-white/60">{t("order.staging_desc")}</p>
                    </div>
                    {selectedStagingTier && <span className="font-semibold shrink-0">{fmt(stagingPrice)}</span>}
                  </div>
                  <div className="flex gap-2 ml-14">
                    {stagingTiers.map((tier) => (
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
                  <ArrowLeft className="w-5 h-5 mr-1" /> {t("order.back_btn")}
                </Button>
                <Button onClick={goNext} className="flex-1 h-14 text-[17px] rounded-full">
                  {t("order.continue")} <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: details ── */}
          {step === 2 && !isConsultation && (
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight mb-2">{t("order.details_title")}</h2>
              <p className="text-[15px] text-white/50 mb-8">{t("order.details_sub")}</p>

              <div className="bg-white/[0.04] border border-white/15 rounded-md p-6 mb-10">
                <h3 className="text-[17px] font-semibold tracking-tight mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> {t("order.booking_title")}
                </h3>
                <div className="space-y-2 text-[15px] mb-4">
                  {includeStandard && <div className="flex justify-between"><span className="text-white/60">{t("order.row_standard")}</span><span className="font-medium">{fmt(standardPackagePrice)}</span></div>}
                  {selectedBundleData && <div className="flex justify-between"><span className="text-white/60">{selectedBundleData.name} {t("order.row_bundle_suffix")}</span><span className="price-num font-medium">{fmt(selectedBundleData.price)}</span></div>}
                  {selectedBrandingData && <div className="flex justify-between"><span className="text-white/60">{selectedBrandingData.name}{t("order.row_plan_suffix")}</span><span className="price-num font-medium">{fmt(selectedBrandingData.price)}/mo</span></div>}
                  {Array.from(selectedAddOns).map((id) => { const a = addOns.find((x) => x.id === id); if (!a) return null; return <div key={id} className="flex justify-between"><span className="text-white/60">{a.name}</span><span className="price-num font-medium">{fmt(a.priceNum)}</span></div>; })}
                  {selectedStagingTier && <div className="flex justify-between"><span className="text-white/60">{t("order.staging_name")} ({stagingTiers.find((t) => t.id === selectedStagingTier)?.label})</span><span className="font-medium">{fmt(stagingPrice)}</span></div>}
                </div>
                <div className="pt-4 border-t border-white/15">
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[15px] mb-2"><span className="text-[#c7ff00]">{t("order.row_discount", { code: enteredCode })}</span><span className="price-num font-medium text-[#c7ff00]">−{fmt(discountAmount)}</span></div>
                  )}
                  <div className="flex justify-between text-[21px] font-semibold"><span>{t("order.row_total")}</span><span className="price-num">{fmt(finalTotal)}</span></div>
                </div>
                <button type="button" onClick={() => goToLabel(0)} className="link-lime !text-[14px] mt-4">{t("order.change")}</button>
              </div>

              <form onSubmit={handleShootSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium">{t("order.label_name")}</Label>
                  <Input type="text" required value={shootForm.name} onChange={(e) => setShootForm({ ...shootForm, name: e.target.value })} className="h-12 text-base" placeholder={t("order.ph_name")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">{t("order.label_email")}</Label>
                  <Input type="email" required value={shootForm.email} onChange={(e) => setShootForm({ ...shootForm, email: e.target.value })} className="h-12 text-base" placeholder={t("order.ph_email")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">{t("order.label_phone")}</Label>
                  <Input type="tel" value={shootForm.phone} onChange={(e) => setShootForm({ ...shootForm, phone: e.target.value })} className="h-12 text-base" placeholder={t("order.ph_phone")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">{t("order.label_borough")}</Label>
                  <Select value={shootForm.borough} onValueChange={(v) => setShootForm({ ...shootForm, borough: v })} required>
                    <SelectTrigger className="h-12 text-base"><SelectValue placeholder={t("order.ph_borough")} /></SelectTrigger>
                    <SelectContent>
                      {boroughs.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">{t("order.label_service")}</Label>
                  <Select value={shootForm.service_type} onValueChange={(v) => setShootForm({ ...shootForm, service_type: v })} required>
                    <SelectTrigger className="h-12 text-base"><SelectValue placeholder={t("order.ph_service")} /></SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">{t("order.label_date")}</Label>
                    <Input type="date" value={shootForm.shoot_date} onChange={(e) => setShootForm({ ...shootForm, shoot_date: e.target.value })} className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">{t("order.label_time")}</Label>
                    <Input type="time" value={shootForm.shoot_time} onChange={(e) => setShootForm({ ...shootForm, shoot_time: e.target.value })} className="h-12 text-base" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">{t("order.label_address")}</Label>
                  <Input type="text" placeholder={t("order.ph_address")} value={shootForm.shoot_location} onChange={(e) => setShootForm({ ...shootForm, shoot_location: e.target.value })} className="h-12 text-base" />
                </div>
                <div className="rounded-md border border-[#c7ff00]/40 bg-[#c7ff00]/[0.06] p-5">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#c7ff00]" /> {t("order.discount_title")}
                  </Label>
                  <p className="text-[13px] text-white/45 mt-1 mb-3">{t("order.discount_copy")}</p>
                  <Input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="h-12 text-base uppercase text-white placeholder:normal-case placeholder:text-white/35 bg-white/10 border-white/20"
                    placeholder={t("order.discount_ph")}
                  />
                  {discountCode.trim() !== "" && discountAmount === 0 && (
                    <p className="text-[13px] text-white/40 mt-2">{t("order.discount_invalid")}</p>
                  )}
                  {discountAmount > 0 && (
                    <p className="text-[13px] text-[#c7ff00] mt-2">{t("order.discount_valid", { code: enteredCode, amount: fmt(discountAmount) })}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">{t("order.label_details")}</Label>
                  <Textarea value={shootForm.request_details} onChange={(e) => setShootForm({ ...shootForm, request_details: e.target.value })} className="min-h-24 text-base" placeholder={t("order.ph_details")} />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" onClick={goBack} variant="outline" className="h-14 px-8 text-[16px] rounded-full border-white/25 text-white hover:bg-white/10">
                    <ArrowLeft className="w-5 h-5 mr-1" /> {t("order.back_btn")}
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1 h-14 text-[17px] rounded-full">
                    {isSubmitting ? t("order.sending") : t("order.submit", { total: fmt(finalTotal) })}
                  </Button>
                </div>
                <p className="flex items-center justify-center gap-2 text-center text-[14px] text-white/45">
                  <Check className="w-4 h-4 text-[#c7ff00] shrink-0" /> {t("order.reassurance")}
                </p>
              </form>
            </div>
          )}

          {/* ── STEP 2: consultation details ── */}
          {step === 2 && isConsultation && (
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight mb-2">{t("order.consult_title")}</h2>
              <p className="text-[15px] text-white/50 mb-8">{t("order.consult_sub")}</p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-md border border-[#c7ff00]/25 bg-white/[0.03] p-8 h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-md bg-[#c7ff00] flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-[22px] font-semibold tracking-tight">{t("order.expect_title")}</h3>
                  </div>
                  <ul className="space-y-5 text-[15px] text-white/65 leading-relaxed">
                    {expectBullets.map((b) => (
                      <li key={b} className="flex items-start gap-3"><Check className="w-5 h-5 mt-0.5 shrink-0 text-[#c7ff00]" /><span>{b}</span></li>
                    ))}
                  </ul>
                </div>

                <form onSubmit={handleConsultSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">{t("order.label_name")}</Label>
                    <Input type="text" required value={consultForm.name} onChange={(e) => setConsultForm({ ...consultForm, name: e.target.value })} className="h-12 text-base" placeholder={t("order.ph_name")} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">{t("order.label_email")}</Label>
                    <Input type="email" required value={consultForm.email} onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })} className="h-12 text-base" placeholder={t("order.ph_email")} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">{t("order.label_phone")}</Label>
                    <Input type="tel" value={consultForm.phone} onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })} className="h-12 text-base" placeholder={t("order.ph_phone")} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">{t("order.label_role")}</Label>
                    <Input type="text" required value={consultForm.role} onChange={(e) => setConsultForm({ ...consultForm, role: e.target.value })} className="h-12 text-base" placeholder={t("order.ph_role")} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">{t("order.label_format")}</Label>
                    <Select value={consultForm.meeting_format} onValueChange={(v) => setConsultForm({ ...consultForm, meeting_format: v })}>
                      <SelectTrigger className="h-12 text-base"><SelectValue placeholder={t("order.ph_format")} /></SelectTrigger>
                      <SelectContent>
                        {formatOptions.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">{t("order.label_day")}</Label>
                      <Input type="date" value={consultForm.preferred_date} onChange={(e) => setConsultForm({ ...consultForm, preferred_date: e.target.value })} className="h-12 text-base" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">{t("order.label_time2")}</Label>
                      <Input type="time" value={consultForm.preferred_time} onChange={(e) => setConsultForm({ ...consultForm, preferred_time: e.target.value })} className="h-12 text-base" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">{t("order.label_goals")}</Label>
                    <Textarea value={consultForm.goals} onChange={(e) => setConsultForm({ ...consultForm, goals: e.target.value })} className="min-h-24 text-base" placeholder={t("order.ph_goals")} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" onClick={goBack} variant="outline" className="h-14 px-8 text-[16px] rounded-full border-white/25 text-white hover:bg-white/10">
                      <ArrowLeft className="w-5 h-5 mr-1" /> {t("order.back_btn")}
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1 h-14 text-[17px] rounded-full">
                      {isSubmitting ? t("order.sending") : t("order.consult_submit")}
                    </Button>
                  </div>
                  <p className="flex items-center justify-center gap-2 text-center text-[14px] text-white/45">
                    <Check className="w-4 h-4 text-[#c7ff00] shrink-0" /> {t("order.consult_reassurance")}
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
