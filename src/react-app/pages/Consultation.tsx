import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Check, AlertCircle, CalendarCheck } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Label } from "@/react-app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";

const FORMSPREE_URL = "https://formspree.io/f/meelbrbz";

export default function ConsultationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    meeting_format: "",
    preferred_date: "",
    preferred_time: "",
    goals: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...formData,
          _subject: `New One-on-One Consultation Request from ${formData.name}`,
        }),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "",
          meeting_format: "",
          preferred_date: "",
          preferred_time: "",
          goals: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-16">
      <SiteNav />

      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <Link to="/branding" className="link-lime !text-[15px] mb-10">
            <ArrowLeft className="w-4 h-4" /> Back to branding
          </Link>

          <div className="text-center mb-14">
            <p className="eyebrow text-[#c7ff00] mb-4">One-on-one consultation</p>
            <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-5">
              Let&apos;s sit down <span className="text-[#c7ff00]">and talk.</span>
            </h1>
            <p className="text-[19px] text-white/60 max-w-2xl mx-auto">
              Tell us a little about yourself and we&apos;ll schedule a one-on-one
              meeting to find the right direction for your personal brand.
            </p>
          </div>

          {submitStatus === "success" && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Request received!</h3>
                  <p className="text-[15px] text-green-700">
                    Thank you — we&apos;ll reach out shortly to schedule your one-on-one.
                  </p>
                </div>
              </div>
            </div>
          )}
          {submitStatus === "error" && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Submission error</h3>
                  <p className="text-[15px] text-red-700">
                    Please try again or contact luxentra.media@gmail.com
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: what to expect */}
            <div>
              <div className="rounded-md border border-[#c7ff00]/25 bg-white/[0.03] p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-md bg-[#c7ff00] flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-6 h-6 text-black" />
                  </div>
                  <h2 className="text-[24px] font-semibold tracking-tight">What to expect</h2>
                </div>
                <ul className="space-y-5 text-[16px] text-white/65 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 shrink-0 text-[#c7ff00]" />
                    <span>We&apos;ll hear your story and understand your goals — no prep needed.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 shrink-0 text-[#c7ff00]" />
                    <span>Together we&apos;ll find the right direction for your personal brand.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 shrink-0 text-[#c7ff00]" />
                    <span>If we genuinely believe we can help — and it feels right for you — we&apos;ll build it together.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 shrink-0 text-[#c7ff00]" />
                    <span>If not, you&apos;ll still leave with greater clarity about your next step.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: form */}
            <div>
              <h2 className="text-[32px] font-semibold tracking-tight mb-4">Book your meeting</h2>
              <p className="text-[17px] text-white/60 mb-8">
                Fill this out and we&apos;ll reach out to confirm a time.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Name *</Label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 text-base"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Email *</Label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 text-base"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    Phone <span className="text-white/40 font-normal">(optional)</span>
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-12 text-base"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">What do you do? *</Label>
                  <Input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="h-12 text-base"
                    placeholder="Real estate agent, broker, business owner…"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Preferred meeting format</Label>
                  <Select
                    value={formData.meeting_format}
                    onValueChange={(v) => setFormData({ ...formData, meeting_format: v })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Video call">Video call</SelectItem>
                      <SelectItem value="Phone call">Phone call</SelectItem>
                      <SelectItem value="In person">In person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Preferred day</Label>
                    <Input
                      type="date"
                      value={formData.preferred_date}
                      onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Preferred time</Label>
                    <Input
                      type="time"
                      value={formData.preferred_time}
                      onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                      className="h-12 text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    What would you like to talk about?{" "}
                    <span className="text-white/40 font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    className="min-h-24 text-base"
                    placeholder="Your goals, what's holding you back, what you'd like clarity on…"
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-[17px] rounded-full">
                  {isSubmitting ? "Sending…" : "Request my one-on-one"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
