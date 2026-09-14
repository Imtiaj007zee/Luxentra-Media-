import { Link } from "react-router";
import { Check } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";

type Member = {
  role: string;
  name: string;
  knownAs?: string;
  title: string;
  bio: string[];
  highlights: string[];
  quote: string;
  badge: string;
  photo: string;
};

const TEAM: Member[] = [
  {
    role: "Creative Director",
    name: "Shamrat Neero",
    title: "Commercial Director · FPV Drone Pilot · DOP",
    bio: [
      "A cinematic filmmaker with over 8 years of experience in visual storytelling and commercial production. Shamrat has collaborated with 30+ national and international brands, blending creativity, motion, and precision to craft immersive visual experiences.",
    ],
    highlights: [
      "30+ Brand Collaborations (Netflix, DJI, Sony, Tilta)",
      "8+ Years in Cinematic & Commercial Production",
      "Specialized in FPV Drone & Dynamic Camera Work",
      "Expertise in Storytelling, Color, and Visual Direction",
    ],
    quote: "We don't just capture visuals, we create cinematic experiences.",
    badge: "8+",
    photo: "/Neero.JPG",
  },
  {
    role: "Founder",
    name: "Imtiaj Sharker Zishan",
    knownAs: "Zee",
    title: "Founder · Photographer & Cinematographer",
    bio: [
      "A photographer and cinematographer with 6+ years of experience, Imtiaj specializes in capturing people, spaces, and moments with clarity and intention. Since stepping into commercial work in 2018, he has developed a strong portfolio across weddings, events, portraits, and corporate productions.",
      "His approach blends technical precision with a clean, modern visual style, delivering content that is both impactful and purpose-driven.",
    ],
    highlights: [
      "6+ Years of Photography & Cinematography Experience",
      "25+ Weddings & Large-Scale Events Covered",
      "Professional Headshots & Portrait Specialist",
      "Corporate & Institutional Projects (BMCC, NYC)",
      "Experience with Celebrity & High-Profile Events",
    ],
    quote: "Precision in every frame, purpose in every shot.",
    badge: "6+",
    photo: "/Zee2.JPG",
  },
  {
    role: "Founder",
    name: "Asgar Hossain Mahmud",
    title: "Managing Director · Visual Storyteller",
    bio: [
      "A creative professional with 4+ years of experience, Asgar specializes in managing productions and crafting visual stories through landscapes and portraits. With a strong background in event and shoot management, he has worked closely with production teams to ensure smooth execution from planning to final delivery.",
      "His work combines organizational precision with a natural eye for color, composition, and storytelling, bringing both structure and creativity to every project.",
    ],
    highlights: [
      "4+ Years of Experience in Production & Event Management",
      "Founder & Managing Director Experience",
      "Expertise in Shoot Coordination & On-Set Management",
      "Strong Visual Storytelling in Landscape & Portrait Work",
      "Skilled in Color, Composition, and Creative Direction",
    ],
    quote: "Where vision meets execution.",
    badge: "4+",
    photo: "/Asgar.JPG",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] pt-16">
      <SiteNav />

      {/* Hero */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1024px] mx-auto px-6 text-center">
          <p className="apple-eyebrow mb-4">Our story</p>
          <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-6">
            Meet the team.
          </h1>
          <p className="text-[19px] md:text-[21px] text-[#6e6e73] max-w-2xl mx-auto">
            The creative minds behind LuxEntra Media — passionate about elevating every listing through cinematic storytelling.
          </p>
        </div>
      </section>

      {/* Team members */}
      {TEAM.map((m, i) => (
        <section
          key={m.name}
          className={`${i % 2 === 1 ? "bg-[#f5f5f7]" : "bg-white"} py-24 md:py-32`}
        >
          <div className="max-w-[1024px] mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Photo */}
            <div className={`relative ${i % 2 === 1 ? "md:order-2" : ""}`}>
              <div className="aspect-[3/4] rounded-[18px] overflow-hidden bg-[#e8e8ed]">
                <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <div
                className={`absolute -bottom-6 ${
                  i % 2 === 1 ? "-left-6" : "-right-6"
                } bg-black text-white px-6 py-4 rounded-[18px]`}
              >
                <div className="text-2xl font-semibold">{m.badge}</div>
                <div className="text-xs text-white/60 uppercase tracking-widest">Years Experience</div>
              </div>
            </div>

            {/* Details */}
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <p className="apple-eyebrow mb-3">{m.role}</p>
              <h2 className="text-[32px] md:text-[40px] font-semibold tracking-tight mb-2">
                {m.name}
              </h2>
              {m.knownAs && (
                <p className="text-[17px] text-[#6e6e73] mb-1">
                  Known as <span className="font-medium text-[#1d1d1f]">{m.knownAs}</span>
                </p>
              )}
              <p className="text-[17px] text-[#6e6e73] mb-8">{m.title}</p>

              {m.bio.map((p, j) => (
                <p key={j} className="text-[17px] text-[#1d1d1f]/80 leading-relaxed mb-4">
                  {p}
                </p>
              ))}

              <h3 className="apple-eyebrow !text-[11px] mt-10 mb-5">Key highlights</h3>
              <ul className="space-y-3.5 mb-10">
                {m.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-[15px]">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#65a30d]/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#65a30d]" />
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <blockquote className="border-l-2 border-[#65a30d] pl-6 py-1">
                <p className="text-[19px] italic text-[#1d1d1f]/80 leading-relaxed">
                  &ldquo;{m.quote}&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="max-w-[820px] mx-auto px-6 text-center">
          <h2 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-tight mb-5">
            Ready to work with us?
          </h2>
          <p className="text-[19px] text-white/70 mb-10">
            Let&apos;s create stunning media that makes your properties impossible to ignore.
          </p>
          <Link to="/order" className="btn-apple-lg">
            Start your order
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
