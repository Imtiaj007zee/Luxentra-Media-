import { useEffect } from "react";
import { useLocation } from "react-router";
import { useT, useTerms } from "@/react-app/lib/siteContent";

const ROUTE_KEYS: Record<string, { title: string; description: string }> = {
  "/": { title: "seo.home_title", description: "seo.home_desc" },
  "/work": { title: "seo.work_title", description: "seo.work_desc" },
  "/branding": { title: "seo.branding_title", description: "seo.branding_desc" },
  "/about": { title: "seo.about_title", description: "seo.about_desc" },
  "/order": { title: "seo.order_title", description: "seo.order_desc" },
  "/privacy": { title: "seo.privacy_title", description: "seo.privacy_desc" },
};

/** Keeps <title>, meta description, and canonical URL in sync with the route. */
export default function PageMeta() {
  const { pathname } = useLocation();
  const t = useT();
  const terms = useTerms();
  const siteUrl = (terms.site_url || "https://www.luxentramedia.com").replace(/\/$/, "");

  useEffect(() => {
    const keys = ROUTE_KEYS[pathname] ?? { title: "seo.fallback_title", description: "seo.fallback_desc" };
    document.title = t(keys.title);

    let desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content = t(keys.description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${siteUrl}${pathname}`;
  }, [pathname, t, siteUrl]);

  return null;
}
