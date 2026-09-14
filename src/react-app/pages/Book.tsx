import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Label } from "@/react-app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";

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
    <div className="min-h-screen bg-white text-[#1d1d1f] pt-16">
      <SiteNav />

      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/" className="apple-link !text-[15px] mb-10">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="text-center mb-14">
            <p className="apple-eyebrow mb-4">Booking</p>
            <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-5">
              Book a shoot.
            </h1>
            <p className="text-[19px] text-[#6e6e73]">
              Fill out the form and we&apos;ll get back to you within 24 hours.
            </p>
          </div>

          {submitStatus === "success" && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-[18px]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Request submitted!</h3>
                  <p className="text-[15px] text-green-700">Thank you! We&apos;ll be in touch shortly.</p>
                </div>
              </div>
            </div>
          )}
          {submitStatus === "error" && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-[18px]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Submission error</h3>
                  <p className="text-[15px] text-red-700">Please try again or contact luxentra.media@gmail.com</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label className="text-base font-medium">Name *</Label>
              <Input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 text-base" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-medium">Email *</Label>
              <Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12 text-base" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-medium">Phone <span className="text-[#86868b] font-normal">(optional)</span></Label>
              <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-12 text-base" placeholder="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-medium">Borough *</Label>
              <Select value={formData.borough} onValueChange={(v) => setFormData({ ...formData, borough: v })} required>
                <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select borough" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manhattan">Manhattan</SelectItem>
                  <SelectItem value="Brooklyn">Brooklyn</SelectItem>
                  <SelectItem value="Queens">Queens</SelectItem>
                  <SelectItem value="Bronx">Bronx</SelectItem>
                  <SelectItem value="Staten Island">Staten Island</SelectItem>
                  <SelectItem value="Long Island">Long Island</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-base font-medium">Listing Type *</Label>
              <Select value={formData.listing_type} onValueChange={(v) => setFormData({ ...formData, listing_type: v })} required>
                <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select listing type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="House/Single-Family">House/Single-Family</SelectItem>
                  <SelectItem value="Apartment/Condo">Apartment/Condo</SelectItem>
                  <SelectItem value="Luxury Home">Luxury Home</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                  <SelectItem value="Rental Listing">Rental Listing</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-base font-medium">Request Details <span className="text-[#86868b] font-normal">(optional)</span></Label>
              <Textarea value={formData.request_details} onChange={(e) => setFormData({ ...formData, request_details: e.target.value })} className="min-h-32 text-base" placeholder="Tell us about your listing, preferred shoot date..." />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-[17px] rounded-full">
              {isSubmitting ? "Submitting..." : "Submit booking request"}
            </Button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
