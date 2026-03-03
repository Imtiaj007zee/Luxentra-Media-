import { useState } from "react";
import { Link } from "react-router";
import { Mail, Phone, ArrowLeft, Check, AlertCircle, Camera, Video, Plane, Box, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Label } from "@/react-app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";

type AddOn = { id: string; name: string; price: number; icon: typeof Box; };
const ADD_ONS: AddOn[] = [
  { id: "3d_tour", name: "3D Virtual Tour", price: 55, icon: Box },
  { id: "video", name: "Walkthrough/Cinematic Video", price: 75, icon: Video },
  { id: "drone", name: "Drone Photos & Video", price: 65, icon: Plane },
];
const FORMSPREE_URL = "https://formspree.io/f/meelbrbz";

export default function OrderPage() {
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", borough: "", listing_type: "", request_details: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const toggleAddOn = (id: string) => {
    const newSet = new Set(selectedAddOns);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setSelectedAddOns(newSet);
  };

  const standardPackagePrice = 175;
  const addOnsTotal = Array.from(selectedAddOns).reduce((sum, id) => sum + (ADD_ONS.find((a) => a.id === id)?.price || 0), 0);
  const totalPrice = standardPackagePrice + addOnsTotal;
  const selectedAddOnNames = Array.from(selectedAddOns).map((id) => ADD_ONS.find((a) => a.id === id)?.name).filter(Boolean).join(", ");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ ...formData, add_ons: selectedAddOnNames || "None", total_price: `$${totalPrice}`, _subject: `New Order: $${totalPrice} from ${formData.name}` }),
      });
      if (res.ok) { setSubmitStatus("success"); setFormData({ name: "", email: "", phone: "", borough: "", listing_type: "", request_details: "" }); setSelectedAddOns(new Set()); }
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
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-8"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
          {submitStatus === "success" && (<div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl"><div className="flex items-start gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><Check className="w-5 h-5 text-green-600" /></div><div><h3 className="font-semibold text-green-900 mb-1">Thank You!</h3><p className="text-sm text-green-700">Your order has been received. We'll reach out to finalize your booking!</p></div></div></div>)}
          {submitStatus === "error" && (<div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl"><div className="flex items-start gap-3"><div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-600" /></div><div><h3 className="font-semibold text-red-900 mb-1">Submission Error</h3><p className="text-sm text-red-700">Please try again or contact luxentra.media@gmail.com</p></div></div></div>)}
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Build Your Package</h1>
              <p className="text-lg text-zinc-600 mb-8">Start with our standard package and customize with add-ons.</p>
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center"><Camera className="w-6 h-6 text-white" /></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2"><h3 className="text-xl font-semibold">Standard Listing Media Package</h3><span className="text-xl font-bold">${standardPackagePrice}</span></div>
                    <ul className="text-sm text-zinc-600 space-y-1"><li>• 25–45 MLS-ready photos</li><li>• 1 twilight photo</li><li>• 2D black & white floor plans</li><li>• 12-hour delivery</li><li>• Private branded gallery</li><li>• Free revisions</li></ul>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-4">Optional Add-ons</h2>
              <div className="space-y-3">
                {ADD_ONS.map((addOn) => { const Icon = addOn.icon; const isSelected = selectedAddOns.has(addOn.id); return (
                  <div key={addOn.id} className={`border rounded-2xl p-4 cursor-pointer transition-all ${isSelected ? "bg-zinc-50 border-zinc-900" : "bg-white border-zinc-200 hover:border-zinc-300"}`} onClick={() => toggleAddOn(addOn.id)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-zinc-900" : "bg-zinc-100"}`}><Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-zinc-600"}`} /></div>
                      <div className="flex-1"><div className="flex items-center justify-between"><h3 className="font-semibold">{addOn.name}</h3><span className="font-bold">${addOn.price}</span></div></div>
                      <button type="button" className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isSelected ? "bg-zinc-900 border-zinc-900" : "bg-white border-zinc-300"}`}>{isSelected ? <Check className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-zinc-400" />}</button>
                    </div>
                  </div>
                );})}
              </div>
              <div className="mt-8 bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Order Summary</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between"><span className="text-zinc-600">Standard Package</span><span className="font-medium">${standardPackagePrice}</span></div>
                  {Array.from(selectedAddOns).map((id) => { const a = ADD_ONS.find((x) => x.id === id); if (!a) return null; return <div key={id} className="flex justify-between"><span className="text-zinc-600">{a.name}</span><span className="font-medium">${a.price}</span></div>; })}
                </div>
                <div className="pt-4 border-t border-zinc-300"><div className="flex justify-between text-xl font-bold"><span>Total</span><span>${totalPrice}</span></div></div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-semibold mb-4">Your Details</h2>
              <p className="text-zinc-600 mb-8">Fill out your information and we'll confirm within 24 hours.</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2"><Label className="text-base font-medium">Name *</Label><Input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 text-base" placeholder="John Doe" /></div>
                <div className="space-y-2"><Label className="text-base font-medium">Email *</Label><Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12 text-base" placeholder="john@example.com" /></div>
                <div className="space-y-2"><Label className="text-base font-medium">Phone <span className="text-zinc-500 font-normal">(optional)</span></Label><Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-12 text-base" placeholder="+1 (555) 123-4567" /></div>
                <div className="space-y-2"><Label className="text-base font-medium">Borough *</Label>
                  <Select value={formData.borough} onValueChange={(v) => setFormData({ ...formData, borough: v })} required><SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select borough" /></SelectTrigger><SelectContent><SelectItem value="Manhattan">Manhattan</SelectItem><SelectItem value="Brooklyn">Brooklyn</SelectItem><SelectItem value="Queens">Queens</SelectItem><SelectItem value="Bronx">Bronx</SelectItem><SelectItem value="Staten Island">Staten Island</SelectItem><SelectItem value="Long Island">Long Island</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-2"><Label className="text-base font-medium">Listing Type *</Label>
                  <Select value={formData.listing_type} onValueChange={(v) => setFormData({ ...formData, listing_type: v })} required><SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select listing type" /></SelectTrigger><SelectContent><SelectItem value="House/Single-Family">House/Single-Family</SelectItem><SelectItem value="Apartment/Condo">Apartment/Condo</SelectItem><SelectItem value="Luxury Home">Luxury Home</SelectItem><SelectItem value="Commercial">Commercial</SelectItem><SelectItem value="Multi-Family">Multi-Family</SelectItem><SelectItem value="Rental Listing">Rental Listing</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-2"><Label className="text-base font-medium">Additional Details <span className="text-zinc-500 font-normal">(optional)</span></Label><Textarea value={formData.request_details} onChange={(e) => setFormData({ ...formData, request_details: e.target.value })} className="min-h-24 text-base" placeholder="Preferred shoot date, special requirements..." /></div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg bg-zinc-900 hover:bg-zinc-800 rounded-full">{isSubmitting ? "Submitting Order..." : `Submit Order — $${totalPrice}`}</Button>
              </form>
            </div>
          </div>
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
