import { SiteHeader, SiteFooter } from '@/react-app/components/SiteChrome';
import { Link } from "react-router";


export default function AboutPage() {
  return (
    <div className="legacy-page min-h-screen bg-white text-zinc-900">
      <SiteHeader /><main id="main">

      {/* Hero */}
      <div className="pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-b from-zinc-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block text-xs uppercase tracking-widest text-zinc-500 font-medium mb-4">Our Story</div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Meet the Team
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
            The creative minds behind LuxEntra Media — passionate about elevating every listing through cinematic storytelling.
          </p>
        </div>
      </div>

      {/* Creative Director - Shamrat Neero */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Photo */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100">
                <img
                  loading="lazy" src="/Neero.JPG"
                  alt="Shamrat Neero"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-zinc-900 text-white px-6 py-4 rounded-2xl shadow-xl">
                <div className="text-2xl font-bold">8+</div>
                <div className="text-xs text-zinc-400 uppercase tracking-widest">Years Experience</div>
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="inline-block text-xs uppercase tracking-widest text-zinc-500 font-medium mb-3">Creative Director</div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Shamrat Neero</h2>
              <p className="text-lg text-zinc-500 mb-8">Commercial Director · FPV Drone Pilot · DOP</p>

              <p className="text-zinc-600 leading-relaxed mb-10 text-lg">
                A cinematic filmmaker with over 8 years of experience in visual storytelling and commercial production. Shamrat has collaborated with 30+ national and international brands, blending creativity, motion, and precision to craft immersive visual experiences.
              </p>

              {/* Key Highlights */}
              <div className="space-y-4 mb-10">
                <h3 className="text-sm uppercase tracking-widest text-zinc-400 font-medium">Key Highlights</h3>
                {[
                  "30+ Brand Collaborations (Netflix, DJI, Sony, Tilta)",
                  "8+ Years in Cinematic & Commercial Production",
                  "Specialized in FPV Drone & Dynamic Camera Work",
                  "Expertise in Storytelling, Color, and Visual Direction",
                ].map((highlight, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-2.5 flex-shrink-0" />
                    <p className="text-zinc-700">{highlight}</p>
                  </div>
                ))}
              </div>

              {/* Signature Line */}
              <blockquote className="border-l-4 border-zinc-900 pl-6 py-2">
                <p className="text-xl italic text-zinc-700 leading-relaxed">
                  "We don't just capture visuals, we create cinematic experiences."
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Director - Imtiaj Sharker Zishan */}
      <section className="py-24 px-6 lg:px-8 bg-zinc-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Details */}
            <div>
              <div className="inline-block text-xs uppercase tracking-widest text-zinc-500 font-medium mb-3">Founder</div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Imtiaj Sharker Zishan</h2>
              <p className="text-lg text-zinc-500 mb-2">Known as <span className="font-medium text-zinc-700">Zee</span></p>
              <p className="text-lg text-zinc-500 mb-8">Founder · Photographer & Cinematographer</p>

              <p className="text-zinc-600 leading-relaxed mb-4 text-lg">
                A photographer and cinematographer with 6+ years of experience, Imtiaj specializes in capturing people, spaces, and moments with clarity and intention. Since stepping into commercial work in 2018, he has developed a strong portfolio across weddings, events, portraits, and corporate productions.
              </p>
              <p className="text-zinc-600 leading-relaxed mb-10 text-lg">
                His approach blends technical precision with a clean, modern visual style, delivering content that is both impactful and purpose-driven.
              </p>

              {/* Key Highlights */}
              <div className="space-y-4 mb-10">
                <h3 className="text-sm uppercase tracking-widest text-zinc-400 font-medium">Key Highlights</h3>
                {[
                  "6+ Years of Photography & Cinematography Experience",
                  "25+ Weddings & Large-Scale Events Covered",
                  "Professional Headshots & Portrait Specialist",
                  "Corporate & Institutional Projects (BMCC, NYC)",
                  "Experience with Celebrity & High-Profile Events",
                ].map((highlight, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-2.5 flex-shrink-0" />
                    <p className="text-zinc-700">{highlight}</p>
                  </div>
                ))}
              </div>

              {/* Signature Line */}
              <blockquote className="border-l-4 border-zinc-900 pl-6 py-2">
                <p className="text-xl italic text-zinc-700 leading-relaxed">
                  "Precision in every frame, purpose in every shot."
                </p>
              </blockquote>
            </div>

            {/* Photo */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100">
                <img
                  loading="lazy" src="/Zee2.JPG"
                  alt="Imtiaj Sharker Zishan"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-zinc-900 text-white px-6 py-4 rounded-2xl shadow-xl">
                <div className="text-2xl font-bold">6+</div>
                <div className="text-xs text-zinc-400 uppercase tracking-widest">Years Experience</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Team Member - Asgar Hossain Mahmud */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Photo */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100">
                <img
                  loading="lazy" src="/Asgar.JPG"
                  alt="Asgar Hossain Mahmud"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-zinc-900 text-white px-6 py-4 rounded-2xl shadow-xl">
                <div className="text-2xl font-bold">4+</div>
                <div className="text-xs text-zinc-400 uppercase tracking-widest">Years Experience</div>
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="inline-block text-xs uppercase tracking-widest text-zinc-500 font-medium mb-3">Founder</div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Asgar Hossain Mahmud</h2>
              <p className="text-lg text-zinc-500 mb-8">Managing Director · Visual Storyteller</p>

              <p className="text-zinc-600 leading-relaxed mb-4 text-lg">
                A creative professional with 4+ years of experience, Asgar specializes in managing productions and crafting visual stories through landscapes and portraits. With a strong background in event and shoot management, he has worked closely with production teams to ensure smooth execution from planning to final delivery.
              </p>
              <p className="text-zinc-600 leading-relaxed mb-10 text-lg">
                His work combines organizational precision with a natural eye for color, composition, and storytelling, bringing both structure and creativity to every project.
              </p>

              <div className="space-y-4 mb-10">
                <h3 className="text-sm uppercase tracking-widest text-zinc-400 font-medium">Key Highlights</h3>
                {[
                  "4+ Years of Experience in Production & Event Management",
                  "Founder & Managing Director Experience",
                  "Expertise in Shoot Coordination & On-Set Management",
                  "Strong Visual Storytelling in Landscape & Portrait Work",
                  "Skilled in Color, Composition, and Creative Direction",
                ].map((highlight, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-2.5 flex-shrink-0" />
                    <p className="text-zinc-700">{highlight}</p>
                  </div>
                ))}
              </div>

              <blockquote className="border-l-4 border-zinc-900 pl-6 py-2">
                <p className="text-xl italic text-zinc-700 leading-relaxed">
                  "Where vision meets execution."
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-8 bg-zinc-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Ready to Work With Us?</h2>
          <p className="text-xl text-zinc-600 mb-10">Let's create stunning media that makes your properties impossible to ignore.</p>
          <Link to="/order" className="inline-block bg-zinc-900 text-white text-lg px-10 py-4 rounded-full hover:bg-zinc-800 transition-all hover:scale-105">
            Book a Shoot
          </Link>
        </div>
      </section>

      </main><SiteFooter />
    </div>
  );
}
