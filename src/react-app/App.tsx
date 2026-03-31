import SpecialPage from './pages/Special';
import AboutPage from './pages/About';
import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import BookPage from "@/react-app/pages/Book";
import OrderPage from "@/react-app/pages/Order";

export default function App() {
  return (
    <Router>
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
