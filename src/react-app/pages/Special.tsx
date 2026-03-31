import { Link } from "react-router";
import { ArrowLeft, ShoppingCart } from "lucide-react";

export default function SpecialPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight">LuxEntra Media</Link>
          <Link to="/order" className="text-sm px-4 py-2 rounded-full bg-zinc-900 text-white flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Order Now
          </Link>
        </div>
      </header>
      <div className="pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/order" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Order
          </Link>
          <div className="text-center">
            <div className="inline-block text-xs uppercase tracking-widest text-zinc-500 font-medium mb-4">Exclusive Offer</div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Special Package
            </h1>
            <p className="text-xl text-zinc-500">Coming soon — exclusive bundles being crafted for you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
