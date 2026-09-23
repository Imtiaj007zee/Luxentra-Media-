import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <SiteNav />
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[15px] tracking-[0.2em] uppercase text-white/40 mb-4">
          LuxEntra Media
        </p>
        <h1 className="text-[72px] md:text-[110px] font-bold tracking-[-0.03em] leading-none">
          404
        </h1>
        <p className="mt-4 text-lg text-white/70 max-w-md">
          This frame didn't make the cut. The page you're looking for doesn't
          exist or was moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c7ff00] px-6 py-3 text-[15px] font-semibold text-black hover:brightness-110 transition"
        >
          <ArrowLeft size={16} /> Back home
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
