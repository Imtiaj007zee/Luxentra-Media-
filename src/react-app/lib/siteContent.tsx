import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ORDERS_ENDPOINT,
  useCatalog,
  useSiteSettings,
  type SiteSettings,
} from "./siteSettings";

const fmtPrice = (n: number) => `$${n.toLocaleString()}`;
import {
  DEFAULT_COPY,
  DEFAULT_DISCOUNTS,
  DEFAULT_FILMS,
  DEFAULT_PACKAGES,
  DEFAULT_PHOTOS,
  DEFAULT_TEAM,
  DEFAULT_TERMS,
  type DiscountEntry,
  type FilmContent,
  type PackageContent,
  type PhotoContent,
  type TeamMember,
} from "./contentDefaults";
import type { BrandingPlan, LaunchBundle } from "../data/packages";

// ── LuxEntra site content ────────────────────────────────────────────────
// Everything editable at /backstage lives in Google Sheet tabs (Apps Script
// v3). This provider fetches ?action=content once, caches it, and merges
// sheet values over the built-in defaults. Empty tabs never blank the site:
// empty remote values fall back to defaults.

export type Film = FilmContent & { slug: string; src: string };
export type Photo = PhotoContent & { src: string };

type RemoteContent = {
  copy?: Record<string, string>;
  terms?: Record<string, string>;
  team?: TeamMember[];
  packages?: PackageContent[];
  films?: FilmContent[];
  photos?: PhotoContent[];
  discounts?: DiscountEntry[];
};

type ContentState = {
  copy: Record<string, string>;
  terms: Record<string, string>;
  team: TeamMember[];
  packages: PackageContent[];
  films: FilmContent[];
  photos: PhotoContent[];
  discounts: DiscountEntry[];
  loaded: boolean;
};

const CONTENT_CACHE_KEY = "lux_content_v1";

const DEFAULT_COPY_MAP: Record<string, string> = Object.fromEntries(
  DEFAULT_COPY.map((c) => [c.key, c.value])
);
const DEFAULT_TERMS_MAP: Record<string, string> = Object.fromEntries(
  DEFAULT_TERMS.map((t) => [t.key, t.value])
);

function readCache(): RemoteContent | null {
  try {
    const raw = localStorage.getItem(CONTENT_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(remote: RemoteContent) {
  try {
    localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(remote));
  } catch {
    // storage full or unavailable: content still works from the fetch
  }
}

// ── Merging (empty remote values fall back to defaults) ──────────────────

function str(remote: unknown, fallback: string): string {
  return typeof remote === "string" && remote.trim() !== "" ? remote : fallback;
}

function mergeStringMap(
  defaults: Record<string, string>,
  remote?: Record<string, string>
): Record<string, string> {
  if (!remote) return { ...defaults };
  const out = { ...defaults };
  for (const [k, v] of Object.entries(remote)) {
    if (typeof v === "string" && v.trim() !== "") out[k] = v;
  }
  return out;
}

function mergeRows<T extends Record<string, unknown>>(
  defaults: T[],
  remote: unknown[] | undefined,
  keyOf: (r: T) => string,
  apply: (base: T, over: Record<string, unknown>) => T
): T[] {
  if (!Array.isArray(remote) || remote.length === 0) return defaults.map((d) => ({ ...d }));
  const overByKey = new Map<string, Record<string, unknown>>();
  for (const r of remote) {
    if (r && typeof r === "object") {
      const rec = r as Record<string, unknown>;
      const k = String(rec.id ?? rec.slug ?? "").trim();
      if (k) overByKey.set(k, rec);
    }
  }
  const merged = defaults.map((d) => {
    const over = overByKey.get(keyOf(d));
    if (!over) return { ...d };
    overByKey.delete(keyOf(d));
    return apply({ ...d }, over);
  });
  // Rows added in the sheet that have no built-in default, appended last.
  for (const over of overByKey.values()) {
    merged.push(apply({} as T, over));
  }
  return merged;
}

const num = (v: unknown, fallback: number) =>
  typeof v === "number" && isFinite(v) ? v : fallback;
const bool = (v: unknown, fallback: boolean) =>
  typeof v === "boolean" ? v : fallback;

function applyTeam(base: TeamMember, over: Record<string, unknown>): TeamMember {
  return {
    id: str(over.id, base.id),
    name: str(over.name, base.name),
    knownAs: typeof over.knownAs === "string" ? over.knownAs : base.knownAs,
    role: str(over.role, base.role),
    title: str(over.title, base.title),
    photo: str(over.photo, base.photo),
    badge: typeof over.badge === "string" ? over.badge : base.badge,
    bio: typeof over.bio === "string" && over.bio.trim() !== "" ? over.bio : base.bio,
    highlights:
      Array.isArray(over.highlights) && over.highlights.length > 0
        ? (over.highlights as string[]).map(String)
        : base.highlights,
    quote: str(over.quote, base.quote),
    order: num(over.order, base.order),
    visible: bool(over.visible, base.visible),
  };
}

function applyPackage(base: PackageContent, over: Record<string, unknown>): PackageContent {
  return {
    id: str(over.id, base.id),
    kind: over.kind === "plan" ? "plan" : over.kind === "bundle" ? "bundle" : base.kind,
    name: str(over.name, base.name),
    tagline: typeof over.tagline === "string" ? over.tagline : base.tagline,
    blurb: str(over.blurb, base.blurb),
    features:
      Array.isArray(over.features) && over.features.length > 0
        ? (over.features as string[]).map(String)
        : base.features,
    badge: typeof over.badge === "string" ? over.badge : base.badge,
    featured: bool(over.featured, base.featured),
    order: num(over.order, base.order),
    visible: bool(over.visible, base.visible),
  };
}

function applyFilm(base: FilmContent, over: Record<string, unknown>): FilmContent {
  return {
    id: str(over.id, base.id),
    title: str(over.title, base.title),
    category: str(over.category, base.category),
    poster: str(over.poster, base.poster),
    video: str(over.video, base.video),
    ratio: over.ratio === "portrait" ? "portrait" : "landscape",
    order: num(over.order, base.order),
    visible: bool(over.visible, base.visible),
    url_override: typeof over.url_override === "string" ? over.url_override.trim() : base.url_override,
  };
}

function applyPhoto(base: PhotoContent, over: Record<string, unknown>): PhotoContent {
  return {
    slug: str(over.slug, base.slug),
    title: str(over.title, base.title),
    label: str(over.label, base.label),
    filter: str(over.filter, base.filter),
    showcase: num(over.showcase, base.showcase),
    order: num(over.order, base.order),
    visible: bool(over.visible, base.visible),
    url_override: typeof over.url_override === "string" ? over.url_override.trim() : base.url_override,
  };
}

function applyDiscount(base: DiscountEntry, over: Record<string, unknown>): DiscountEntry {
  return {
    code: str(over.code, base.code).toUpperCase(),
    amount: num(over.amount, base.amount),
    active: bool(over.active, base.active),
    public: bool(over.public, base.public),
  };
}

function mergeContent(remote: RemoteContent | null): ContentState {
  const r = remote ?? {};
  return {
    copy: mergeStringMap(DEFAULT_COPY_MAP, r.copy),
    terms: mergeStringMap(DEFAULT_TERMS_MAP, r.terms),
    team: mergeRows(DEFAULT_TEAM, r.team, (m) => m.id, applyTeam),
    packages: mergeRows(DEFAULT_PACKAGES, r.packages, (p) => p.id, applyPackage),
    films: mergeRows(DEFAULT_FILMS, r.films, (f) => f.id, applyFilm),
    photos: mergeRows(DEFAULT_PHOTOS, r.photos, (p) => p.slug, applyPhoto),
    discounts: mergeRows(DEFAULT_DISCOUNTS, r.discounts, (d) => d.code, applyDiscount),
    loaded: !!remote,
  };
}

// ── Token resolution ─────────────────────────────────────────────────────
// Copy can contain {{tokens}}: {{price_standard}}, {{stat_properties}},
// {{delivery_time}}, {{contact_email}}, {{year}}, {{n}}, {{name}}, etc.

const PRICE_TOKEN_KEYS: (keyof SiteSettings)[] = [
  "price_standard",
  "price_addon_flyer",
  "price_addon_drone",
  "price_addon_3d_tour",
  "price_addon_video",
  "price_addon_reel",
  "price_bundle_market_launch",
  "price_bundle_listing_premiere",
  "price_bundle_agent_authority",
  "price_branding_essential",
  "price_branding_growth",
  "price_branding_premium",
  "price_branding_content",
  "price_staging_1",
  "price_staging_3",
  "price_staging_5",
];

function resolveTokens(
  text: string,
  vars: Record<string, string | number> | undefined,
  settings: SiteSettings,
  terms: Record<string, string>
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_m, name: string) => {
    if (vars && name in vars) return String(vars[name]);
    if (name === "year") return String(new Date().getFullYear());
    if (name === "stat_properties") return String(settings.stat_properties);
    if (name === "stat_value_m") return String(settings.stat_value_m);
    if (name === "stat_success_rate") return String(settings.stat_success_rate);
    if (name === "total") return String(vars?.total ?? "");
    if (PRICE_TOKEN_KEYS.includes(name as keyof SiteSettings)) {
      const v = settings[name as keyof SiteSettings];
      return typeof v === "number" ? String(Math.round(v)) : "";
    }
    if (name in terms) return terms[name];
    return "";
  });
}

// ── Context ──────────────────────────────────────────────────────────────

type ContentContextValue = ContentState & {
  replaceRemoteContent: (remote: RemoteContent | null) => void;
};

const ContentContext = createContext<ContentContextValue>({
  ...mergeContent(null),
  replaceRemoteContent: () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [remote, setRemote] = useState<RemoteContent | null>(() => readCache());

  const replaceRemoteContent = useCallback((next: RemoteContent | null) => {
    if (next) writeCache(next);
    setRemote(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${ORDERS_ENDPOINT}?action=getContent`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data && data.ok && data.content && typeof data.content === "object") {
          setRemote(data.content as RemoteContent);
          writeCache(data.content as RemoteContent);
        }
      })
      .catch(() => {
        // Apps Script unreachable: keep cache/defaults, site still renders
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const state = useMemo<ContentContextValue>(
    () => ({ ...mergeContent(remote), replaceRemoteContent }),
    [remote, replaceRemoteContent]
  );
  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  return useContext(ContentContext);
}

// t("home.h2") — copy value with {{tokens}} resolved.
export function useT(): (key: string, vars?: Record<string, string | number>) => string {
  const { copy, terms } = useContent();
  const { settings } = useSiteSettings();
  return useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      resolveTokens(copy[key] ?? key, vars, settings, terms),
    [copy, terms, settings]
  );
}

export function useCopy(key: string, vars?: Record<string, string | number>): string {
  return useT()(key, vars);
}

export function useTerms(): Record<string, string> {
  return useContent().terms;
}

export function useTeam(): TeamMember[] {
  const { team } = useContent();
  return useMemo(
    () => team.filter((m) => m.visible).sort((a, b) => a.order - b.order),
    [team]
  );
}

export function useFilms(): Film[] {
  const { films } = useContent();
  return useMemo(
    () =>
      films
        .filter((f) => f.visible)
        .sort((a, b) => a.order - b.order)
        .map((f) => ({
          ...f,
          slug: f.id,
          src: f.url_override || f.video,
        })),
    [films]
  );
}

export function usePhotos(): Photo[] {
  const { photos } = useContent();
  return useMemo(
    () =>
      photos
        .filter((p) => p.visible)
        .sort((a, b) => a.order - b.order)
        .map((p) => ({
          ...p,
          src: p.url_override || `/work/photos/${p.slug}.jpg`,
        })),
    [photos]
  );
}

// "Fresh from the field" showcase: photos with a showcase rank, in rank order.
export function useShowcasePhotos(): Photo[] {
  const photos = usePhotos();
  return useMemo(
    () => photos.filter((p) => p.showcase > 0).sort((a, b) => a.showcase - b.showcase),
    [photos]
  );
}

export function useDiscounts(): DiscountEntry[] {
  const { discounts } = useContent();
  return useMemo(() => discounts.filter((d) => d.active), [discounts]);
}

// The one code that may appear on the public site.
export function usePublicDiscount(): DiscountEntry | null {
  const discounts = useDiscounts();
  return useMemo(
    () => discounts.find((d) => d.public) ?? null,
    [discounts]
  );
}

// ── Live catalog: package marketing content from the Packages tab, ───────
// prices still from Site Settings. Mirrors useCatalog's shape.

export type LiveLaunchBundle = LaunchBundle & { visible: boolean; order: number };
export type LiveBrandingPlan = BrandingPlan & { visible: boolean; order: number };

export function useLiveCatalog() {
  const base = useCatalog();
  const { packages } = useContent();
  const liveAddOns = useAddOns();
  const liveStaging = useStagingTiers();
  return useMemo(() => {
    const byId = new Map(packages.map((p) => [p.id, p]));
    const bundles: LiveLaunchBundle[] = base.bundles
      .map((b) => {
        const o = byId.get(b.id);
        if (!o)
          return { ...b, visible: true, order: 999 };
        return {
          ...b,
          name: o.name,
          blurb: o.blurb,
          features: o.features,
          badge: o.badge || undefined,
          featured: o.featured,
          visible: o.visible,
          order: o.order,
        };
      })
      .filter((b) => b.visible)
      .sort((a, b) => a.order - b.order);
    const brandingPlans: LiveBrandingPlan[] = base.brandingPlans
      .map((p) => {
        const o = byId.get(p.id);
        if (!o) return { ...p, visible: true, order: 999 };
        return {
          ...p,
          name: o.name,
          tagline: o.tagline,
          desc: o.blurb,
          features: o.features,
          badge: o.badge || undefined,
          featured: o.featured,
          visible: o.visible,
          order: o.order,
        };
      })
      .filter((p) => p.visible)
      .sort((a, b) => a.order - b.order);
    const getPackageById = (id: string | null) =>
      packages.find((p) => p.id === id) ?? null;
    return {
      ...base,
      addOns: liveAddOns,
      stagingTiers: liveStaging,
      bundles,
      brandingPlans,
      standard: getPackageById("standard"),
      getPackageById,
      getBundleById: (id: string | null) => bundles.find((b) => b.id === id) ?? null,
      getBrandingPlanById: (id: string | null) =>
        brandingPlans.find((p) => p.id === id) ?? null,
    };
  }, [base, packages]);
}

// ── Add-ons with editable names/notes ────────────────────────────────────

export type AddOnItem = {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  note: string;
};

export type StagingTierItem = { id: string; label: string; price: number };

export function useAddOns(): AddOnItem[] {
  const { settings } = useSiteSettings();
  const t = useT();
  return useMemo(
    () => [
      {
        id: "flyer",
        name: t("home.addon_flyer_name"),
        price: fmtPrice(settings.price_addon_flyer),
        priceNum: settings.price_addon_flyer,
        note: t("order.flyer_note"),
      },
      {
        id: "staging",
        name: t("home.addon_staging_name"),
        price: `From ${fmtPrice(settings.price_staging_1)}`,
        priceNum: settings.price_staging_1,
        note: t("order.staging_desc"),
      },
      {
        id: "drone",
        name: t("home.addon_drone_name"),
        price: fmtPrice(settings.price_addon_drone),
        priceNum: settings.price_addon_drone,
        note: t("order.desc_drone"),
      },
      {
        id: "3d_tour",
        name: t("home.addon_3d_tour_name"),
        price: fmtPrice(settings.price_addon_3d_tour),
        priceNum: settings.price_addon_3d_tour,
        note: t("order.desc_3d_tour"),
      },
      {
        id: "video",
        name: t("home.addon_video_name"),
        price: fmtPrice(settings.price_addon_video),
        priceNum: settings.price_addon_video,
        note: t("order.desc_video"),
      },
      {
        id: "reel",
        name: t("home.addon_reel_name"),
        price: fmtPrice(settings.price_addon_reel),
        priceNum: settings.price_addon_reel,
        note: t("order.reel_note"),
      },
    ],
    [settings, t]
  );
}

export function useStagingTiers(): StagingTierItem[] {
  const { settings } = useSiteSettings();
  const t = useT();
  return useMemo(() => {
    const labels = t("order.staging_tiers").split("\n");
    return [
      { id: "1room", label: labels[0] ?? "1 Room", price: settings.price_staging_1 },
      { id: "3rooms", label: labels[1] ?? "3 Rooms", price: settings.price_staging_3 },
      { id: "5rooms", label: labels[2] ?? "5 Rooms", price: settings.price_staging_5 },
    ];
  }, [settings, t]);
}

// ── Admin API ────────────────────────────────────────────────────────────

export type ContentPayload = {
  copy?: Record<string, string>;
  terms?: Record<string, string>;
  team?: TeamMember[];
  packages?: PackageContent[];
  films?: FilmContent[];
  photos?: PhotoContent[];
  discounts?: DiscountEntry[];
};

export async function saveContentApi(
  username: string,
  password: string,
  payload: ContentPayload
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(ORDERS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "saveContent", username, password, content: payload }),
  });
  return res.json();
}

// Local cache refresh after a save, so the panel and public content agree.
export function writeContentCache(remote: RemoteContent) {
  writeCache(remote);
}
