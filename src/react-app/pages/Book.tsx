import { SiteHeader, SiteFooter } from '@/react-app/components/SiteChrome';
import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
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
    <div className="legacy-page min-h-screen bg-white text-zinc-900">
      <SiteHeader /><main id="main">
      <div className="pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-8"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
          <div className="mb-12"><h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4">Let’s talk about your shoot.</h1><p className="text-xl text-zinc-600">Fill out the form and we'll get back to you within 24 hours.</p></div>
          {submitStatus === "success" && (<div role="status" className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl"><div className="flex items-start gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><Check className="w-5 h-5 text-green-600" /></div><div><h3 className="font-semibold text-green-900 mb-1">Request Submitted!</h3><p className="text-sm text-green-700">Thank you! We'll be in touch shortly.</p></div></div></div>)}
          {submitStatus === "error" && (<div role="alert" className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl"><div className="flex items-start gap-3"><div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-600" /></div><div><h3 className="font-semibold text-red-900 mb-1">Submission Error</h3><p className="text-sm text-red-700">Please try again or contact luxentra.media@gmail.com</p></div></div></div>)}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2"><Label htmlFor="name" className="text-base font-medium">Name *</Label><Input id="name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 text-base" placeholder="John Doe" /></div>
            <div className="space-y-2"><Label htmlFor="email" className="text-base font-medium">Email *</Label><Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12 text-base" placeholder="john@example.com" /></div>
            <div className="space-y-2"><Label htmlFor="phone" className="text-base font-medium">Phone <span className="text-zinc-500 font-normal">(optional)</span></Label><Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-12 text-base" placeholder="+1 (555) 123-4567" /></div>
            <div className="space-y-2"><Label id="borough-label" className="text-base font-medium">Service area *</Label>
              <Select value={formData.borough} onValueChange={(v) => setFormData({ ...formData, borough: v })} required><SelectTrigger aria-labelledby="borough-label" className="h-12 text-base"><SelectValue placeholder="Select service area" /></SelectTrigger><SelectContent><SelectItem value="Manhattan">Manhattan</SelectItem><SelectItem value="Brooklyn">Brooklyn</SelectItem><SelectItem value="Queens">Queens</SelectItem><SelectItem value="Bronx">Bronx</SelectItem><SelectItem value="Staten Island">Staten Island</SelectItem><SelectItem value="Long Island">Long Island</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label id="listing_type-label" className="text-base font-medium">Listing Type *</Label>
              <Select value={formData.listing_type} onValueChange={(v) => setFormData({ ...formData, listing_type: v })} required><SelectTrigger aria-labelledby="listing_type-label" className="h-12 text-base"><SelectValue placeholder="Select listing type" /></SelectTrigger><SelectContent><SelectItem value="House/Single-Family">House/Single-Family</SelectItem><SelectItem value="Apartment/Condo">Apartment/Condo</SelectItem><SelectItem value="Luxury Home">Luxury Home</SelectItem><SelectItem value="Commercial">Commercial</SelectItem><SelectItem value="Multi-Family">Multi-Family</SelectItem><SelectItem value="Rental Listing">Rental Listing</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label htmlFor="request_details" className="text-base font-medium">Request Details <span className="text-zinc-500 font-normal">(optional)</span></Label><Textarea id="request_details" value={formData.request_details} onChange={(e) => setFormData({ ...formData, request_details: e.target.value })} className="min-h-32 text-base" placeholder="Tell us about your listing, preferred shoot date..." /></div>
            <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg bg-zinc-900 hover:bg-zinc-800 rounded-full">{isSubmitting ? "Submitting..." : "Submit Booking Request"}</Button>
          </form>
        </div>
      </div>
      </main><SiteFooter />
    </div>
  );
}
