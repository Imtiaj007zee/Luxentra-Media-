import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router";
import HomePreviewPage from "@/react-app/pages/HomePreview";
// Route-level code splitting: the homepage loads only its own code.
// Every other page loads on demand when the visitor navigates to it,
// so the first visit does not pay for the booking flow, the work
// gallery, or the backstage panel. (Locations exports two pages from
// one module, so both lazy imports share one chunk.)
const AboutPage = lazy(() => import("./pages/About"));
const OrderPage = lazy(() => import("@/react-app/pages/Order"));
const WorkPage = lazy(() => import("@/react-app/pages/Work"));
const BrandingPage = lazy(() => import("./pages/Branding"));
const PhotographyPage = lazy(() => import("./pages/Photography"));
const FilmPage = lazy(() => import("./pages/Film"));
const QueensPage = lazy(() =>
  import("./pages/Locations").then((m) => ({ default: m.QueensPage }))
);
const LongIslandPage = lazy(() =>
  import("./pages/Locations").then((m) => ({ default: m.LongIslandPage }))
);
const PrivacyPage = lazy(() => import("./pages/Privacy"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));
const AdminPage = lazy(() => import("./pages/Admin"));
import PageMeta from "@/react-app/components/PageMeta";
import ChatBot from "@/react-app/components/ChatBot";
import { SiteSettingsProvider } from "@/react-app/lib/siteSettings";
import { ContentProvider } from "@/react-app/lib/siteContent";

/** Scrolls to an in-page anchor (e.g. /#package) after navigation. */
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    // Lazy pages render after their chunk arrives, so the anchor may
    // not exist yet on the first check; retry briefly before giving up.
    let tries = 0;
    const iv = window.setInterval(() => {
      const el = document.querySelector(hash);
      if (el) {
        window.clearInterval(iv);
        el.scrollIntoView({ behavior: "smooth" });
      } else if (++tries >= 20) {
        window.clearInterval(iv);
        window.scrollTo({ top: 0 });
      }
    }, 100);
    return () => window.clearInterval(iv);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <SiteSettingsProvider>
    <ContentProvider>
    <Router>
      <PageMeta />
      <ScrollToHash />
      {/* Fallback is the site background, so navigating to a lazy page
          never flashes white while its chunk loads. */}
      <Suspense fallback={<div className="min-h-screen bg-[#0b0b0b]" aria-hidden />}>
      <Routes>
        <Route path="/" element={<HomePreviewPage />} />
        <Route path="/preview-home" element={<HomePreviewPage />} />
        <Route path="/book" element={<Navigate to="/order" replace />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/branding" element={<BrandingPage />} />
        <Route path="/real-estate-photography" element={<PhotographyPage />} />
        <Route path="/real-estate-film" element={<FilmPage />} />
        <Route path="/personal-branding-queens" element={<QueensPage />} />
        <Route path="/personal-branding-long-island" element={<LongIslandPage />} />
        <Route path="/consultation" element={<Navigate to="/order?package=consultation" replace />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        {/* Hidden control panel: not linked anywhere on the public site. */}
        <Route path="/backstage" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
      <ChatBot />
    </Router>
    </ContentProvider>
    </SiteSettingsProvider>
  );
}
