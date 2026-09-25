import { useEffect, useState } from "react";
import { Link } from "react-router";
import { X, ArrowRight } from "lucide-react";
import { ORDERS_ENDPOINT as ENDPOINT } from "@/react-app/lib/siteSettings";
import { usePublicDiscount, useT } from "@/react-app/lib/siteContent";

const SEEN_KEY = "luxentra_lead_seen_v1";

function hasSeen(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

const inputClass =
  "w-full h-12 rounded-md bg-white/10 border border-white/15 px-4 text-[15px] text-white placeholder:text-white/40 outline-none focus:border-[#c7ff00] transition-colors";

export default function LeadCapturePopup() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", brokerage: "" });
  const t = useT();
  const publicDiscount = usePublicDiscount();
  const discountCode = publicDiscount?.code ?? "WELCOME25";
  const discountAmount = publicDiscount?.amount ?? 25;

  // Auto-popup: once per visitor, 12 seconds after the homepage loads.
  useEffect(() => {
    if (hasSeen()) return;
    const tmr = window.setTimeout(() => setOpen(true), 12000);
    return () => window.clearTimeout(tmr);
  }, []);

  const close = () => {
    markSeen();
    setOpen(false);
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setMissing((m) => m.filter((x) => x !== k));
  };

  const fieldClass = (k: keyof typeof form) =>
    `${inputClass} ${missing.includes(k) ? "!border-red-400" : ""}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Every field is required: no stars, just tell them what to fill in.
    const empty: string[] = [];
    if (!form.name.trim()) empty.push("name");
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      empty.push("email");
    if (!form.phone.trim()) empty.push("phone");
    if (!form.brokerage.trim()) empty.push("brokerage");
    if (empty.length > 0) {
      setMissing(empty);
      return;
    }
    setMissing([]);
    setSending(true);
    try {
      await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          form_type: "lead",
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          brokerage: form.brokerage.trim(),
          discount_code: discountCode,
        }),
      });
    } catch {
      /* lead still likely recorded; show the code anyway */
    } finally {
      setSending(false);
      setDone(true);
      markSeen();
    }
  };

  if (!open) return null;

  const missingLabel = (m: string) =>
    m === "name" ? t("popup.missing_name") : m === "email" ? t("popup.missing_email") : m;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("popup.aria_label")}
    >
      <button
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
      />
      <div className="relative w-full max-w-[440px] bg-[#0b0b0b] text-white rounded-2xl p-8 md:p-10 shadow-2xl border border-white/10">
        <button
          onClick={close}
          aria-label="Dismiss"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!done ? (
          <>
            <p className="eyebrow text-[#c7ff00] mb-4">{t("popup.eyebrow")}</p>
            <h3 className="text-[32px] md:text-[38px] font-bold tracking-[-0.03em] leading-[1.05] mb-3">
              {t("popup.title", { amount: discountAmount })}
            </h3>
            <p className="text-[15px] text-white/60 leading-relaxed mb-7">{t("popup.copy")}</p>
            <form onSubmit={submit} noValidate className="space-y-3">
              {missing.length > 0 && (
                <div className="rounded-md border border-red-400/50 bg-red-400/10 px-4 py-3 text-[14px] text-white/85">
                  {t("popup.validation_prefix")}{" "}
                  <span className="font-semibold text-white">
                    {missing.map(missingLabel).join(", ")}
                  </span>{" "}
                  {t("popup.validation_suffix", { amount: discountAmount })}
                </div>
              )}
              <input
                className={fieldClass("name")}
                placeholder={t("popup.ph_name")}
                value={form.name}
                onChange={set("name")}
                autoComplete="name"
              />
              <input
                className={fieldClass("email")}
                placeholder={t("popup.ph_email")}
                type="email"
                value={form.email}
                onChange={set("email")}
                autoComplete="email"
              />
              <input
                className={fieldClass("phone")}
                placeholder={t("popup.ph_phone")}
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                autoComplete="tel"
              />
              <input
                className={fieldClass("brokerage")}
                placeholder={t("popup.ph_brokerage")}
                value={form.brokerage}
                onChange={set("brokerage")}
                autoComplete="organization"
              />
              <button
                type="submit"
                disabled={sending}
                className="btn-lime w-full !mt-5 disabled:opacity-60"
              >
                {sending ? t("popup.sending") : t("popup.cta", { amount: discountAmount })}
              </button>
            </form>
            <button
              onClick={close}
              className="mt-4 w-full text-center text-[13px] text-white/40 hover:text-white/70 transition-colors"
            >
              {t("popup.skip")}
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="eyebrow text-[#c7ff00] mb-4">{t("popup.success_eyebrow")}</p>
            <h3 className="text-[32px] font-bold tracking-[-0.03em] leading-[1.05] mb-3">
              {t("popup.success_title")}
            </h3>
            <p className="price-num text-[44px] font-bold tracking-tight text-[#c7ff00] mb-5">
              {discountCode}
            </p>
            <p className="text-[15px] text-white/60 leading-relaxed mb-8">
              {t("popup.success_copy", { amount: discountAmount })}
            </p>
            <Link to="/order" onClick={close} className="btn-lime inline-flex items-center gap-2">
              {t("popup.success_cta")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
