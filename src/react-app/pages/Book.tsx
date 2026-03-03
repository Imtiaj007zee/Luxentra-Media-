import { useState } from "react";
import { Link } from "react-router";
import { Mail, Phone, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Label } from "@/react-app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";

const FORMSPREE_URL = "https://formspree.io/f/meelbrbz";

export default function BookPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", borough: "", listing_type: "", request_details: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ ...formData, _subject: `New Booking Request from ${formData.name}` }),
      });
      if (res.ok) { setSubmitStatus("success"); setFormData({ name: "", email: "", phone: "", borough: "", listing_type: "", request_details: "" }); }
      else setSubmitStatus("error");
    } catch { setSubmitStatus("error"); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight">LuxEntra Media</Link>
          <div className="flex items-center gap-6">
            <a href="mailto:luxentra.media@gmail.com" className="hidden md:flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"><Mail className="w-4 h-4" /> luxentra.media@gmail.com</a>
            <a href="tel:+13478371257" className="hidden md:flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"><Phone className="w-4 h-4" /> +1 (347) 837-1257</a>
          </div>
        </div>
      </header>
      <div className="pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-8"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
          <div className="mb-12"><h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4">Book Now</h1><p className="text-xl text-zinc-600">Fill out the form and we'll get back to you within 24 hours.</p></div>
          {submitStatus === "success" && (<div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl"><div className="flex items-start gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><Check className="w-5 h-5 text-green-600" /></div><div><h3 className="font-semibold text-green-900 mb-1">Request Submitted!</h3><p className="text-sm text-green-700">Thank you! We'll be in touch shortly.</p></div></div></div>)}
          {submitStatus === "error" && (<div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl"><div className="flex items-start gap-3"><div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-600" /></div><div><h3 className="font-semibold text-red-900 mb-1">Submission Error</h3><p className="text-sm text-red-700">Please try again or contact luxentra.media@gmail.com</p></div></div></div>)}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2"><Label className="text-base font-medium">Name *</Label><Input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 text-base" placeholder="John Doe" /></div>
            <div className="space-y-2"><Label className="text-base font-medium">Email *</Label><Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12 text-base" placeholder="john@example.com" /></div>
            <div className="space-y-2"><Label className="text-base font-medium">Phone <span className="text-zinc-500 font-normal">(optional)</span></Label><Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-12 text-base" placeholder="+1 (555) 123-4567" /></div>
            <div className="space-y-2"><Label className="text-base font-medium">Borough *</Label>
              <Select value={formData.borough} onValueChange={(v) => setFormData({ ...formData, borough: v })} required><SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select borough" /></SelectTrigger><SelectContent><SelectItem value="Manhattan">Manhattan</SelectItem><SelectItem value="Brooklyn">Brooklyn</SelectItem><SelectItem value="Queens">Queens</SelectItem><SelectItem value="Bronx">Bronx</SelectItem><SelectItem value="Staten Island">Staten Island</SelectItem><SelectItem value="Long Island">Long Island</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label className="text-base font-medium">Listing Type *</Label>
              <Select value={formData.listing_type} onValueChange={(v) => setFormData({ ...formData, listing_type: v })} required><SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select listing type" /></SelectTrigger><SelectContent><SelectItem value="House/Single-Family">House/Single-Family</SelectItem><SelectItem value="Apartment/Condo">Apartment/Condo</SelectItem><SelectItem value="Luxury Home">Luxury Home</SelectItem><SelectItem value="Commercial">Commercial</SelectItem><SelectItem value="Multi-Family">Multi-Family</SelectItem><SelectItem value="Rental Listing">Rental Listing</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label className="text-base font-medium">Request Details <span className="text-zinc-500 font-normal">(optional)</span></Label><Textarea value={formData.request_details} onChange={(e) => setFormData({ ...formData, request_details: e.target.value })} className="min-h-32 text-base" placeholder="Tell us about your listing, preferred shoot date..." /></div>
            <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg bg-zinc-900 hover:bg-zinc-800 rounded-full">{isSubmitting ? "Submitting..." : "Submit Booking Request"}</Button>
          </form>
        </div>
      </div>
      <footer className="py-12 px-6 lg:px-8 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-600">© 2025 LuxEntra Media. All rights reserved.</div>
          <div className="flex items-center gap-6 text-sm text-zinc-600"><a href="mailto:luxentra.media@gmail.com" className="hover:text-zinc-900">Contact</a><Link to="/" className="hover:text-zinc-900">Home</Link></div>
        </div>
      </footer>
    </div>
  );
}
