import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";
import AboutPage from "./pages/About";
import HomePage from "@/react-app/pages/Home";
import BookPage from "@/react-app/pages/Book";
import OrderPage from "@/react-app/pages/Order";
import WorkPage from "@/react-app/pages/Work";
import BrandingPage from "./pages/Branding";
import ConsultationPage from "./pages/Consultation";
import PrivacyPage from "./pages/Privacy";
import NotFoundPage from "./pages/NotFound";
import PageMeta from "@/react-app/components/PageMeta";

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
    <Router>
      <PageMeta />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/branding" element={<BrandingPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
