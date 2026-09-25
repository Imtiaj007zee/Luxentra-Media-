import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Lock, Save, LogOut, CheckCircle2, AlertCircle, History, ShieldCheck } from "lucide-react";
import {
  useSiteSettings,
  verifyAdmin,
  saveSiteSettings,
  getLoginLog,
  type SiteSettings,
  type LoginEntry,
} from "@/react-app/lib/siteSettings";

// Hidden control panel. Not linked anywhere on the public site.
// The password is checked server-side in the Apps Script web app.

const SESSION_KEY = "lux_admin_ok_v1";
const SAVED_PASSWORD_KEY = "lux_admin_pw_v1";

type Field = { key: keyof SiteSettings; label: string; step?: string };
type Group = { title: string; hint?: string; fields: Field[] };

const GROUPS: Group[] = [
  {
    title: "Your numbers",
    hint: "The stats shown on the homepage.",
    fields: [
      { key: "stat_properties", label: "Properties covered" },
      { key: "stat_value_m", label: "Property value covered ($M)", step: "0.1" },
      { key: "stat_success_rate", label: "Marketing success rate (%)" },
    ],
  },
  {
    title: "Package prices",
    hint: "Standard package, add-ons, and virtual staging on the booking page.",
    fields: [
      { key: "price_standard", label: "Standard Listing Media Package ($)" },
      { key: "price_addon_flyer", label: "Custom Listing Flyer ($)" },
      { key: "price_addon_drone", label: "Drone Photos & Video ($)" },
      { key: "price_addon_3d_tour", label: "3D Virtual Tour ($)" },
      { key: "price_addon_video", label: "Walkthrough / Cinematic Video ($)" },
      { key: "price_addon_reel", label: "Creative Personal Branding Reel ($)" },
      { key: "price_staging_1", label: "Virtual Staging, 1 room ($)" },
      { key: "price_staging_3", label: "Virtual Staging, 3 rooms ($)" },
      { key: "price_staging_5", label: "Virtual Staging, 5 rooms ($)" },
    ],
  },
  {
    title: "Launch bundles",
    hint: "The three package cards on the homepage and booking page.",
    fields: [
      { key: "price_bundle_market_launch", label: "Market Launch ($)" },
      { key: "price_bundle_listing_premiere", label: "Listing Premiere ($)" },
      { key: "price_bundle_agent_authority", label: "Agent Authority ($)" },
    ],
  },
  {
    title: "Branding plans",
    hint: "Monthly plans on the branding page and booking page.",
    fields: [
      { key: "price_branding_essential", label: "Essential ($/mo)" },
      { key: "price_branding_growth", label: "Growth ($/mo)" },
      { key: "price_branding_premium", label: "Premium ($/mo)" },
      { key: "price_branding_content", label: "Brand Content ($/mo)" },
    ],
  },
];

const inputClass =
  "w-full h-11 px-3 rounded-md bg-white/10 border border-white/20 text-white text-[15px] outline-none focus:border-[#c7ff00] [color-scheme:dark]";

/** Turn a raw user-agent string into a short readable device label. */
function prettyDevice(ua: string): string {
  if (!ua) return "Unknown device";
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) {
    const m = ua.match(/Android[^;]*;\s*([^;)]+)/i);
    return m ? `Android (${m[1].trim()})` : "Android";
  }
  if (/Macintosh/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows PC";
  if (/Linux/i.test(ua)) return "Linux";
  return ua.slice(0, 60);
}

function prettyTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const { settings: liveSettings, loaded } = useSiteSettings();
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [password, setPassword] = useState(() => {
    try {
      return sessionStorage.getItem(SAVED_PASSWORD_KEY) || "";
    } catch {
      return "";
    }
  });
  const [loginError, setLoginError] = useState("");
  const [checking, setChecking] = useState(false);
  const [form, setForm] = useState<SiteSettings>(liveSettings);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loginLog, setLoginLog] = useState<LoginEntry[]>([]);
  const synced = useRef(false);

  // Pull the latest saved values into the form once they arrive.
  useEffect(() => {
    if (loaded && !synced.current) {
      synced.current = true;
      setForm(liveSettings);
    }
  }, [loaded, liveSettings]);

  // Load the login history whenever the panel is unlocked.
  useEffect(() => {
    if (authed && password) {
      getLoginLog(password).then(setLoginLog).catch(() => {});
    }
  }, [authed, password]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setChecking(true);
    setLoginError("");
    const ok = await verifyAdmin(password);
    setChecking(false);
    if (ok) {
      setAuthed(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
        sessionStorage.setItem(SAVED_PASSWORD_KEY, password);
      } catch {
        /* ignore */
      }
    } else {
      setLoginError("Wrong password, or the control panel is not connected yet.");
    }
  };

  const logout = () => {
    setAuthed(false);
    setPassword("");
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SAVED_PASSWORD_KEY);
    } catch {
      /* ignore */
    }
  };

  const setField = (key: keyof SiteSettings, value: string) => {
    const n = parseFloat(value);
    setForm((f) => ({ ...f, [key]: Number.isFinite(n) ? n : 0 }));
    setSaveMsg(null);
  };

  const save = async () => {
    setSaving(true);
    setSaveMsg(null);
    const res = await saveSiteSettings(password, form);
    setSaving(false);
    if (res.ok) {
      setSaveMsg({ ok: true, text: "Saved. The whole site now uses these numbers." });
    } else {
      setSaveMsg({ ok: false, text: res.error || "Could not save." });
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-sm rounded-lg border border-white/10 bg-white/[0.03] p-8">
          <p className="eyebrow text-[#c7ff00] mb-5">LuxEntra · Admin</p>
          <div className="w-12 h-12 rounded-md bg-[#c7ff00]/15 border border-[#c7ff00]/30 flex items-center justify-center mb-6">
            <ShieldCheck className="w-5 h-5 text-[#c7ff00]" />
          </div>
          <h1 className="text-[28px] font-bold tracking-tight mb-2">Admin login</h1>
          <p className="text-[14px] text-white/50 mb-6">
            This panel controls the numbers and prices on the live site. Authorized access only.
          </p>
          <form onSubmit={login}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoComplete="current-password"
              className={`${inputClass} mb-3`}
            />
            {loginError && (
              <p className="flex items-center gap-2 text-[13px] text-red-400 mb-3">
                <AlertCircle className="w-4 h-4 shrink-0" /> {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={checking || !password}
              className="btn-lime w-full h-12 disabled:opacity-40 inline-flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> {checking ? "Checking..." : "Log in"}
            </button>
          </form>
          <Link to="/" className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/70 mt-6">
            <ArrowLeft className="w-4 h-4" /> Back to the site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-16">
      <div className="max-w-[720px] mx-auto px-6 py-10 md:py-14">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.02em]">Control panel</h1>
            <p className="text-[14px] text-white/50 mt-1">
              Change any number below and hit save. Every page updates.
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/80 border border-white/15 rounded-md px-3 py-2"
          >
            <LogOut className="w-4 h-4" /> Lock
          </button>
        </div>

        {GROUPS.map((g) => (
          <section key={g.title} className="mt-10">
            <h2 className="text-[19px] font-bold tracking-tight mb-1">{g.title}</h2>
            {g.hint && <p className="text-[13px] text-white/40 mb-4">{g.hint}</p>}
            <div className="rounded-md border border-white/10 bg-white/[0.03] divide-y divide-white/10">
              {g.fields.map((f) => (
                <div key={f.key} className="flex items-center justify-between gap-4 px-4 py-3">
                  <label className="text-[14px] text-white/75">{f.label}</label>
                  <input
                    type="number"
                    step={f.step || "1"}
                    min="0"
                    value={form[f.key]}
                    onChange={(e) => setField(f.key, e.target.value)}
                    className="w-28 h-10 px-3 rounded-md bg-white/10 border border-white/20 text-white text-[15px] text-right outline-none focus:border-[#c7ff00] [color-scheme:dark]"
                  />
                </div>
              ))}
            </div>
          </section>
        ))}

        {saveMsg && (
          <p
            className={`flex items-center gap-2 text-[14px] mt-8 ${
              saveMsg.ok ? "text-[#c7ff00]" : "text-red-400"
            }`}
          >
            {saveMsg.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {saveMsg.text}
          </p>
        )}

        <button onClick={save} disabled={saving} className="btn-lime w-full h-12 mt-6 disabled:opacity-40 inline-flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save all changes"}
        </button>

        <section className="mt-12">
          <h2 className="text-[19px] font-bold tracking-tight mb-1 inline-flex items-center gap-2">
            <History className="w-4 h-4 text-white/50" /> Login history
          </h2>
          <p className="text-[13px] text-white/40 mb-4">
            Every login attempt, with the time and device. Failed attempts show up too.
          </p>
          {loginLog.length === 0 ? (
            <p className="text-[13px] text-white/35">No logins recorded yet.</p>
          ) : (
            <div className="rounded-md border border-white/10 bg-white/[0.03] divide-y divide-white/10">
              {loginLog.map((entry, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div>
                    <p className="text-[14px] text-white/85">{prettyTime(entry.time)}</p>
                    <p className="text-[12px] text-white/40">{prettyDevice(entry.device)}</p>
                  </div>
                  <span
                    className={`text-[12px] font-medium px-2.5 py-1 rounded-full ${
                      entry.result === "Success"
                        ? "bg-[#c7ff00]/15 text-[#c7ff00]"
                        : "bg-red-400/15 text-red-400"
                    }`}
                  >
                    {entry.result}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <Link to="/" className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/70 mt-8">
          <ArrowLeft className="w-4 h-4" /> Back to the site
        </Link>
      </div>
    </div>
  );
}
