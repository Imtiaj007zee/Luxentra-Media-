import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FileText, Plane, Box, Video } from "lucide-react";
import {
  LAUNCH_BUNDLES,
  BRANDING_PLANS,
  type LaunchBundle,
  type BrandingPlan,
} from "@/react-app/data/packages";

// Free order database + site settings backend: Google Apps Script web app.
// text/plain avoids a CORS preflight.
export const ORDERS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwz11hRMrInyVjGKXjbNMSRUoTlojQH_YZO85xZdrEJHmk30u-a-7GziCNk_Bpvmf-ecA/exec";

export type SiteSettings = {
  stat_properties: number;
  stat_value_m: number;
  stat_success_rate: number;
  price_standard: number;
  price_addon_flyer: number;
  price_addon_drone: number;
  price_addon_3d_tour: number;
  price_addon_video: number;
  price_addon_reel: number;
  price_staging_1: number;
  price_staging_3: number;
  price_staging_5: number;
  price_bundle_market_launch: number;
  price_bundle_listing_premiere: number;
  price_bundle_agent_authority: number;
  price_branding_essential: number;
  price_branding_growth: number;
  price_branding_premium: number;
  price_branding_content: number;
};

// Hardcoded fallbacks. The live values come from the "Site Settings" tab of
// the LuxEntra Orders spreadsheet and can be changed from /backstage.
export const DEFAULT_SETTINGS: SiteSettings = {
  stat_properties: 27,
  stat_value_m: 18.3,
  stat_success_rate: 92,
  price_standard: 175,
  price_addon_flyer: 39,
  price_addon_drone: 99,
  price_addon_3d_tour: 99,
  price_addon_video: 299,
  price_addon_reel: 499,
  price_staging_1: 40,
  price_staging_3: 99,
  price_staging_5: 149,
  price_bundle_market_launch: 399,
  price_bundle_listing_premiere: 699,
  price_bundle_agent_authority: 899,
  price_branding_essential: 5999,
  price_branding_growth: 7999,
  price_branding_premium: 10999,
  price_branding_content: 1800,
};

const CACHE_KEY = "lux_site_settings_v1";

const num = (v: unknown, fallback: number): number => {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : fallback;
};

function mergeSettings(raw: Record<string, unknown> | null | undefined): SiteSettings {
  const out = { ...DEFAULT_SETTINGS };
  if (!raw) return out;
  (Object.keys(out) as (keyof SiteSettings)[]).forEach((k) => {
    if (raw[k] !== undefined) out[k] = num(raw[k], out[k]);
  });
  return out;
}

const SettingsCtx = createContext<{ settings: SiteSettings; loaded: boolean }>({
  settings: DEFAULT_SETTINGS,
  loaded: false,
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return mergeSettings(JSON.parse(cached));
    } catch {
      /* ignore */
    }
    return DEFAULT_SETTINGS;
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${ORDERS_ENDPOINT}?action=settings`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();
        if (!cancelled && data && data.ok && data.settings) {
          const merged = mergeSettings(data.settings);
          setSettings(merged);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* offline or old script version: keep cache/defaults */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ settings, loaded }), [settings, loaded]);
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}

export function useSiteSettings() {
  return useContext(SettingsCtx);
}

// ── Catalog: static package data with live price overrides ────────────────

export type AddOn = {
  id: string;
  name: string;
  price: number;
  icon: typeof Box;
  description?: string;
};

const BASE_ADD_ONS: Omit<AddOn, "price">[] = [
  { id: "flyer", name: "Custom Listing Flyer", icon: FileText },
  { id: "drone", name: "Drone Photos & Video", icon: Plane },
  { id: "3d_tour", name: "3D Virtual Tour", icon: Box },
  { id: "video", name: "Walkthrough/Cinematic Video", icon: Video },
  { id: "reel", name: "Creative Personal Branding Reel", icon: Video },
];

const ADD_ON_PRICE_KEY: Record<string, keyof SiteSettings> = {
  flyer: "price_addon_flyer",
  drone: "price_addon_drone",
  "3d_tour": "price_addon_3d_tour",
  video: "price_addon_video",
  reel: "price_addon_reel",
};

const BASE_STAGING = [
  { id: "staging_1", label: "1 Room", key: "price_staging_1" as const },
  { id: "staging_3", label: "3 Rooms", key: "price_staging_3" as const },
  { id: "staging_5", label: "5 Rooms", key: "price_staging_5" as const },
];

const BUNDLE_PRICE_KEY: Record<string, keyof SiteSettings> = {
  "market-launch": "price_bundle_market_launch",
  "listing-premiere": "price_bundle_listing_premiere",
  "agent-authority": "price_bundle_agent_authority",
};

const PLAN_PRICE_KEY: Record<string, keyof SiteSettings> = {
  essential: "price_branding_essential",
  growth: "price_branding_growth",
  premium: "price_branding_premium",
  "brand-content": "price_branding_content",
};

export function useCatalog() {
  const { settings } = useSiteSettings();
  return useMemo(() => {
    const bundles: LaunchBundle[] = LAUNCH_BUNDLES.map((b) => ({
      ...b,
      price: settings[BUNDLE_PRICE_KEY[b.id]] ?? b.price,
    }));
    const brandingPlans: BrandingPlan[] = BRANDING_PLANS.map((p) => ({
      ...p,
      price: settings[PLAN_PRICE_KEY[p.id]] ?? p.price,
    }));
    const addOns: AddOn[] = BASE_ADD_ONS.map((a) => ({
      ...a,
      price: settings[ADD_ON_PRICE_KEY[a.id]],
    }));
    const stagingTiers = BASE_STAGING.map((t) => ({
      id: t.id,
      label: t.label,
      price: settings[t.key],
    }));
    const getBundleById = (id: string | null | undefined) =>
      bundles.find((b) => b.id === id) ?? null;
    const getBrandingPlanById = (id: string | null | undefined) =>
      brandingPlans.find((p) => p.id === id) ?? null;
    return {
      bundles,
      brandingPlans,
      addOns,
      stagingTiers,
      standardPrice: settings.price_standard,
      getBundleById,
      getBrandingPlanById,
    };
  }, [settings]);
}

// ── Admin API (password is checked server-side in Apps Script) ────────────

async function postAction(body: Record<string, unknown>) {
  const res = await fetch(ORDERS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function verifyAdmin(password: string): Promise<boolean> {
  try {
    const data = await postAction({
      action: "verifyAdmin",
      password,
      device: typeof navigator !== "undefined" ? navigator.userAgent : "",
    });
    return data && data.ok === true;
  } catch {
    return false;
  }
}

export type LoginEntry = { time: string; device: string; result: string };

export async function getLoginLog(password: string): Promise<LoginEntry[]> {
  try {
    const data = await postAction({ action: "getLoginLog", password });
    if (data && data.ok === true && Array.isArray(data.log)) return data.log;
  } catch {
    /* ignore */
  }
  return [];
}

export async function saveSiteSettings(
  password: string,
  settings: SiteSettings
): Promise<{ ok: boolean; error?: string }> {
  try {
    const data = await postAction({ action: "saveSettings", password, settings });
    if (data && data.ok === true) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(settings));
      } catch {
        /* ignore */
      }
      return { ok: true };
    }
    return { ok: false, error: data?.error || "Could not save." };
  } catch {
    return { ok: false, error: "Could not reach the server." };
  }
}
