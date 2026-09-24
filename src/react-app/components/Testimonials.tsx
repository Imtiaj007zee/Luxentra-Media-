import { Quote, Star } from "lucide-react";

/**
 * SAMPLE QUOTES — replace each entry with a real client quote before launch.
 * Keep the shape: quote, name, role.
 */
const TESTIMONIALS = [
  {
    quote:
      "The photos made my listing look like a magazine feature. We had three offers the first weekend.",
    name: "Sarah K.",
    role: "Real Estate Agent, Queens",
  },
  {
    quote:
      "Booking took two minutes and the gallery was in my inbox the next morning. Easiest vendor I work with.",
    name: "David R.",
    role: "Broker, Long Island",
  },
  {
    quote:
      "My personal brand content finally looks like me on my best day. Clients mention my videos before they mention my listings.",
    name: "Amara O.",
    role: "Real Estate Agent, Brooklyn",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#f4f4f4] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="eyebrow text-black/40 mb-4">Client words</p>
        <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-12">
          Don&apos;t take our word for it.
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="bg-white rounded-md p-8 flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="w-10 h-10 rounded-full bg-[#c7ff00] flex items-center justify-center">
                  <Quote className="w-4 h-4 text-black" />
                </span>
                <span className="flex gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#c7ff00] text-[#c7ff00]" />
                  ))}
                </span>
              </div>
              <blockquote className="text-[17px] leading-relaxed text-black/80 flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8">
                <p className="text-[15px] font-bold tracking-tight">{t.name}</p>
                <p className="text-[13px] text-black/50 mt-0.5">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
