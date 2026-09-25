import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router";
import AboutPage from "./pages/About";
import HomePage from "@/react-app/pages/Home";
import OrderPage from "@/react-app/pages/Order";
import WorkPage from "@/react-app/pages/Work";
import BrandingPage from "./pages/Branding";
import PrivacyPage from "./pages/Privacy";
import NotFoundPage from "./pages/NotFound";
import AdminPage from "./pages/Admin";
import PageMeta from "@/react-app/components/PageMeta";
import { SiteSettingsProvider } from "@/react-app/lib/siteSettings";
import { ContentProvider } from "@/react-app/lib/siteContent";

/** Scrolls to an in-page anchor (e.g. /#package) after navigation. */
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        // Wait a tick so the target page has rendered.
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
        return;
      }
    }
    window.scrollTo({ top: 0 });
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book" element={<Navigate to="/order" replace />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/branding" element={<BrandingPage />} />
        <Route path="/consultation" element={<Navigate to="/order?package=consultation" replace />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        {/* Hidden control panel: not linked anywhere on the public site. */}
        <Route path="/backstage" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
    </ContentProvider>
    </SiteSettingsProvider>
  );
}
