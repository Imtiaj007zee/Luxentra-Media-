import { Link } from "react-router";
import { Mail, Phone, ShoppingCart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight text-zinc-900">LuxEntra Media</Link>
          <nav className="hidden md:flex items-center gap-3">
            <Link to="/about" className="text-sm px-4 py-2 rounded-full border bg-zinc-900 border-zinc-900 text-white">About Us</Link>
            <a href="/#package" className="text-sm px-4 py-2 rounded-full border bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 shadow-sm">Package</a>
            <a href="/#addons" className="text-sm px-4 py-2 rounded-full border bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 shadow-sm">Add-ons</a>
            <Link to="/order" className="text-sm px-4 py-2 rounded-full border bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-700 flex items-center gap-2 font-medium">
              <ShoppingCart className="w-4 h-4" />
              Order Now
            </Link>
          </nav>
        </div>
      </header>

      <div className="pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block text-xs uppercase tracking-widest text-zinc-500 font-medium mb-4">Our Story</div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            About Us
          </h1>
          <p className="text-xl text-zinc-500">Coming soon — we're building this page step by step.</p>
        </div>
      </div>

      <footer className="py-12 px-6 lg:px-8 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-600">© 2025 LuxEntra Media. All rights reserved.</div>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <a href="mailto:luxentra.media@gmail.com" className="flex items-center gap-2 hover:text-zinc-900"><Mail className="w-4 h-4" />luxentra.media@gmail.com</a>
            <a href="tel:+13478371257" className="flex items-center gap-2 hover:text-zinc-900"><Phone className="w-4 h-4" />+1 (347) 837-1257</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
