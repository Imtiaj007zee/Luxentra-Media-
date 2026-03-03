import { useState } from "react";
import { Link } from "react-router";
import { Mail, Phone, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Label } from "@/react-app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";

export default function BookPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    borough: "",
    listing_type: "",
    request_details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone || undefined,
          request_details: formData.request_details || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          borough: "",
          listing_type: "",
          request_details: "",
        });
      } else {
        setSubmitStatus("error");
        if (data.error === "email_failed") {
          setErrorMessage(data.message || "Failed to send email notification");
        } else {
          setErrorMessage("Something went wrong. Please try again or contact us directly.");
        }
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Unable to submit your request. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            LuxEntra Media
          </Link>
          <div className="flex items-center gap-6">
            <a
              href="mailto:luxentra.media@gmail.com"
              className="hidden md:flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <Mail className="w-4 h-4" />
              luxentra.media@gmail.com
            </a>
            <a
              href="tel:+13478371257"
              className="hidden md:flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +1 (347) 837-1257
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4">Book Now?</h1>
            <p className="text-xl text-zinc-600">
              Fill out the form below and we'll get back to you within 24 hours to schedule your
              shoot.
            </p>
          </div>

          {/* Success Message */}
          {submitStatus === "success" && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Request Submitted!</h3>
                  <p className="text-sm text-green-700">
                    Thank you for your booking request. We'll be in touch shortly to confirm your
                    shoot details.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === "error" && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Submission Error</h3>
                  <p className="text-sm text-red-700 mb-3">{errorMessage}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-red-700 font-medium">Contact us directly:</p>
                    <a
                      href="mailto:luxentra.media@gmail.com"
                      className="block text-sm text-red-700 hover:text-red-900 underline"
                    >
                      luxentra.media@gmail.com
                    </a>
                    <a
                      href="tel:+13478371257"
                      className="block text-sm text-red-700 hover:text-red-900 underline"
                    >
                      +1 (347) 837-1257
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Name *
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 text-base"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 text-base"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-medium">
                Phone <span className="text-zinc-500 font-normal">(optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-12 text-base"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Borough */}
            <div className="space-y-2">
              <Label htmlFor="borough" className="text-base font-medium">
                Borough *
              </Label>
              <Select
                value={formData.borough}
                onValueChange={(value) => setFormData({ ...formData, borough: value })}
                required
              >
                <SelectTrigger id="borough" className="h-12 text-base">
                  <SelectValue placeholder="Select borough" />
                </SelectTrigger>
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

            {/* Listing Type */}
            <div className="space-y-2">
              <Label htmlFor="listing_type" className="text-base font-medium">
                Listing Type *
              </Label>
              <Select
                value={formData.listing_type}
                onValueChange={(value) => setFormData({ ...formData, listing_type: value })}
                required
              >
                <SelectTrigger id="listing_type" className="h-12 text-base">
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
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

            {/* Request Details */}
            <div className="space-y-2">
              <Label htmlFor="request_details" className="text-base font-medium">
                Request Details <span className="text-zinc-500 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="request_details"
                value={formData.request_details}
                onChange={(e) => setFormData({ ...formData, request_details: e.target.value })}
                className="min-h-32 text-base"
                placeholder="Tell us about your listing, preferred shoot date, specific requirements, or any add-ons you're interested in..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg bg-zinc-900 hover:bg-zinc-800 rounded-full"
            >
              {isSubmitting ? "Submitting..." : "Submit Booking Request"}
            </Button>
          </form>

          {/* Contact Info */}
          <div className="mt-12 pt-12 border-t border-zinc-200">
            <p className="text-sm text-zinc-600 mb-4">Prefer to reach out directly?</p>
            <div className="space-y-2">
              <a
                href="mailto:luxentra.media@gmail.com"
                className="flex items-center gap-2 text-zinc-900 hover:text-zinc-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
                luxentra.media@gmail.com
              </a>
              <a
                href="tel:+13478371257"
                className="flex items-center gap-2 text-zinc-900 hover:text-zinc-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
                +1 (347) 837-1257
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-600">© 2025 LuxEntra Media. All rights reserved.</div>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <a
              href="mailto:luxentra.media@gmail.com"
              className="hover:text-zinc-900 transition-colors"
            >
              Contact
            </a>
            <Link to="/" className="hover:text-zinc-900 transition-colors">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
