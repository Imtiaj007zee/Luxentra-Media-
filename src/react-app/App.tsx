import { useEffect } from "react";
import SpecialPage from './pages/Special';
import AboutPage from './pages/About';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";
import HomePage from "@/react-app/pages/Home";
import BookPage from "@/react-app/pages/Book";
import OrderPage from "@/react-app/pages/Order";

function ScrollToPage() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToPage />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/special" element={<SpecialPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </Router>
  );
}
