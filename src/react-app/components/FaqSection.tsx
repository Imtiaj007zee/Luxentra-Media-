import { useState } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "How fast do I get my photos?",
    a: "Within 24 hours of the shoot. Every package includes 24-hour delivery, and your files land in a private branded gallery, ready for the MLS.",
  },
  {
    q: "How do I book a shoot?",
    a: "Pick a package on the booking page and tell us about the property. It takes three quick steps and there is no payment today. We confirm every booking by email within 24 hours.",
  },
  {
    q: "Where do you shoot?",
    a: "All across New York City and Long Island. If your listing is in the five boroughs or out on the island, we come to you.",
  },
  {
    q: "What is included in the $175 standard package?",
    a: "25 to 45 MLS-ready photos, one twilight photo, 24-hour delivery, a private branded gallery, and free revisions.",
  },
  {
    q: "Do you shoot video too?",
    a: "Yes, starting with Listing Premiere at $699, which includes a professionally edited cinematic property film. Market Launch at $399 is photography only. Agent Authority at $899 includes two films, the cinematic property film plus a personal branding video. We also shoot standalone personal branding reels for agents building their name.",
  },
  {
    q: "How do the personal branding plans work?",
    a: "They are monthly and done for you. Essential is $5,999 a month, Growth is $7,999, and Premium is $10,999 with a money-back guarantee. Plans start with a 3-month minimum.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[900px] mx-auto px-6">
        <p className="eyebrow text-black/40 mb-4">Questions</p>
        <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-12">
          Questions, answered.
        </h2>

        <div className="border-t border-black/10">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-black/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-[18px] md:text-[20px] font-bold tracking-tight">
                    {f.q}
                  </span>
                  <span
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isOpen ? "bg-[#c7ff00] text-black" : "bg-black/5 text-black"
                    }`}
                  >
                    <Plus
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[16px] text-black/60 leading-relaxed pb-6 pr-10">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-[16px] text-black/60">
          Still not sure?{" "}
          <Link
            to="/order?package=consultation"
            className="text-black font-semibold underline underline-offset-4 decoration-[#c7ff00] decoration-2"
          >
            Book a free one-on-one
          </Link>{" "}
          and we will point you to the right service.
        </p>
      </div>
    </section>
  );
}
