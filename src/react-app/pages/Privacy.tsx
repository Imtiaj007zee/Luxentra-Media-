import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";

const sections = [
  {
    title: "Information we collect",
    body: "When you book a shoot, request a consultation, or contact us through our forms, we collect the details you provide: your name, email address, phone number, and anything you tell us about your project. We do not collect payment information through the app or website.",
  },
  {
    title: "How we use it",
    body: "We use your details only to respond to your booking or inquiry, schedule your shoot or consultation, and send you updates about your project. We do not sell your information, and we do not share it with third parties for marketing.",
  },
  {
    title: "Form submissions",
    body: "Our booking and contact forms are processed by Formspree. When you submit a form, your details are sent securely to Formspree so our team receives your request by email. Formspree's own privacy policy applies to that processing.",
  },
  {
    title: "Photos and videos",
    body: "Photos and videos we create for you are delivered to you directly. We only publish your content (for example in our portfolio) with your permission.",
  },
  {
    title: "Data retention",
    body: "We keep booking inquiries for as long as needed to serve you and meet basic record-keeping needs. You can ask us to delete your details at any time.",
  },
  {
    title: "Contact us",
    body: "For any privacy question or deletion request, reach us through the contact form on this site and we will take care of it.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-lime-300 hover:text-lime-200"
        >
          <ArrowLeft size={16} /> Back home
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-white/50">
          LuxEntra Media. Last updated September 19, 2026.
        </p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-semibold text-lime-300">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-white/70">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
