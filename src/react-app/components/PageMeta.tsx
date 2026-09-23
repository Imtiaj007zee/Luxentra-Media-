import { useEffect } from "react";
import { useLocation } from "react-router";

const SITE_URL = "https://luxentra-media.vercel.app";

const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "LuxEntra Media | Real Estate Photography & Film in NYC",
    description:
      "LuxEntra Media creates cinematic listing films, photography, and personal branding content for real estate professionals in New York City and Long Island.",
  },
  "/work": {
    title: "Our Work | LuxEntra Media",
    description:
      "Browse LuxEntra Media's portfolio of listing films, brand films, and real estate photography across NYC and Long Island.",
  },
  "/branding": {
    title: "Personal Branding for Agents | LuxEntra Media",
    description:
      "Monthly personal branding plans for real estate agents: cinematic content that turns your expertise into trust, leads, and revenue.",
  },
  "/about": {
    title: "Meet the Team | LuxEntra Media",
    description:
      "Meet the LuxEntra Media team: photographers, filmmakers, and editors crafting standout real estate marketing in New York.",
  },
  "/order": {
    title: "Book a Shoot | LuxEntra Media",
    description:
      "Book your real estate photography or film package with LuxEntra Media. Choose a package, add extras, and get a confirmation within 24 hours.",
  },
  "/book": {
    title: "Contact Us | LuxEntra Media",
    description:
      "Get in touch with LuxEntra Media for real estate photography, film, and personal branding in NYC and Long Island.",
  },
  "/consultation": {
    title: "One-on-One Consultancy | LuxEntra Media",
    description:
      "Book a one-on-one consultancy with LuxEntra Media to plan your personal brand and content strategy.",
  },
  "/privacy": {
    title: "Privacy Policy | LuxEntra Media",
    description:
      "How LuxEntra Media collects, uses, and protects your information when you book a shoot or contact us.",
  },
};

const FALLBACK_META = {
  title: "LuxEntra Media",
  description: "Designed for real estate professionals.",
};

/** Keeps <title>, meta description, and canonical URL in sync with the route. */
export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = ROUTE_META[pathname] ?? FALLBACK_META;
    document.title = meta.title;

    let desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content = meta.description;

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_URL}${pathname}`;
  }, [pathname]);

  return null;
}
