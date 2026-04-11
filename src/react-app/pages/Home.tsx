import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Camera, Video, Plane, Box, Clock, Shield, Mail, Phone, Sunset, ShoppingCart, Layers, FileText } from "lucide-react";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      video.muted = true;
      video.play().catch(() => {});
    };

    tryPlay();

    const interval = setInterval(() => {
      if (video.paused) {
        tryPlay();
      } else {
        clearInterval(interval);
      }
    }, 500);

    document.addEventListener("touchstart", tryPlay, { once: true });
    document.addEventListener("scroll", tryPlay, { once: true });
    document.addEventListener("click", tryPlay, { once: true });

    return () => {
      clearInterval(interval);
      document.removeEventListener("touchstart", tryPlay);
      document.removeEventListener("scroll", tryPlay);
      document.removeEventListener("click", tryPlay);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const playHover = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.setValueAtTime(800, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.05);
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.08);
  };


  const heroOpacity = Math.max(0, 1 - scrollY / 600);
  const isScrolled = scrollY > 80;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroScale = Math.max(0.92, 1 - scrollY / 3000);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-xl border-b border-zinc-200/50" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`text-xl font-semibold tracking-tight transition-colors duration-300 cursor-pointer ${isScrolled ? "text-zinc-900" : "text-white drop-shadow-lg"}`}>LuxEntra Media</a>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3">
            <Link to="/about" className={`text-sm px-4 py-2 rounded-full border transition-all duration-300 ${isScrolled ? "bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 shadow-sm" : "bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white/25"}`}>About Us</Link>
            <a href="#package" className={`text-sm px-4 py-2 rounded-full border transition-all duration-300 ${isScrolled ? "bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 shadow-sm" : "bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white/25"}`}>Package</a>
            <a href="#addons" className={`text-sm px-4 py-2 rounded-full border transition-all duration-300 ${isScrolled ? "bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 shadow-sm" : "bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white/25"}`}>Add-ons</a>
            <Link to="/order" className={`text-sm px-4 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 font-medium ${isScrolled ? "bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-700" : "bg-white text-zinc-900 border-white hover:bg-zinc-100"}`}>
              <ShoppingCart className="w-4 h-4" />
              Order Now
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isScrolled ? "bg-zinc-900" : "bg-white"}`} style={{ transform: mobileMenuOpen ? "rotate(45deg) translateY(8px)" : "none" }} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isScrolled ? "bg-zinc-900" : "bg-white"} ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isScrolled ? "bg-zinc-900" : "bg-white"}`} style={{ transform: mobileMenuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-900/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 md:hidden">
          <button className="absolute top-5 right-6 text-white text-3xl" onClick={() => setMobileMenuOpen(false)}>✕</button>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold text-white hover:text-zinc-300">About Us</Link>
          <a href="#package" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold text-white hover:text-zinc-300">Package</a>
          <a href="#addons" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold text-white hover:text-zinc-300">Add-ons</a>
          <Link to="/order" onClick={() => setMobileMenuOpen(false)} className="mt-4 text-lg font-medium px-8 py-4 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Order Now
          </Link>
        </div>
      )}

      {/* Video Hero Section - sticky for 2 screens */}
      <div className="sticky top-0 h-screen overflow-hidden z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/og-image.png"
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero content */}
        <div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: heroOpacity, transform: `scale(${heroScale})` }}
        >
          <div className="inline-block mb-4 text-xs uppercase tracking-widest text-white/70 font-medium">
            A Luxury Real Estate Media
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tight leading-none mb-6 text-white drop-shadow-2xl">
            LuxEntra<br />Media
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your one-stop solution for every listing.
          </p>
          <Link
            to="/order"
           
            className="inline-block bg-white text-zinc-900 text-lg px-10 py-4 rounded-full hover:bg-zinc-100 transition-all hover:scale-110 font-medium"
          >
            Start Your Order
          </Link>

          {/* Scroll indicator */}
          <div
            className="flex flex-col items-center gap-2 mt-8"
            style={{ opacity: Math.max(0, 1 - scrollY / 200), animation: "mouseJump 1.5s ease-in-out infinite" }}
          >
            <span className="text-white/60 text-xs uppercase tracking-widest font-medium">Scroll Down</span>
            <div>
              <svg width="28" height="44" viewBox="0 0 28 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="26" height="42" rx="13" stroke="white" strokeOpacity="0.6" strokeWidth="2"/>
                <rect x="12" y="8" width="4" height="8" rx="2" fill="white" fillOpacity="0.8"
                  style={{ animation: "scrollDot 1.5s ease-in-out infinite" }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Second hero panel - text stays centered as you scroll */}
      <div className="h-screen flex items-center justify-center bg-transparent relative">
        <div className="text-center px-6 sticky top-1/2" style={{ opacity: Math.min(1, Math.max(0, (scrollY - 200) / 300)) }}>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tight leading-none text-white drop-shadow-2xl">
            Elevate<br />Every Listing
          </h2>
        </div>
      </div>

      {/* Rest of content over the video */}
      <div className="relative z-10 bg-white">

        {/* Standard Package Section */}
        <section id="package" className="py-32 px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block text-xs uppercase tracking-widest text-zinc-500 font-medium mb-4">Our Core Offering</div>
              <h2 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]" style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Standard Listing<br />Media Package
              </h2>
              <div className="text-6xl md:text-8xl font-bold text-zinc-900 mb-4 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>$175</div>
              <p className="text-xl text-zinc-600 max-w-2xl mx-auto">Everything you need to make your listing stand out.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-200 hover:border-zinc-300 transition-all">
                <Camera className="w-10 h-10 text-zinc-900 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">25-45 MLS-Ready Photos</h3>
                <p className="text-zinc-600 leading-relaxed">Professional interior and exterior shots, expertly edited and optimized for MLS.</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-8 border border-orange-200 hover:border-orange-300 transition-all">
                <Sunset className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">1 Twilight Photo Included</h3>
                <p className="text-zinc-600 leading-relaxed">One stunning twilight exterior shot - the hero image that makes your listing unforgettable.</p>
              </div>
              <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-200 hover:border-zinc-300 transition-all">
                <Box className="w-10 h-10 text-zinc-900 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">2D Floor Plans</h3>
                <p className="text-zinc-600 leading-relaxed">Clean black and white floor plans for every floor, giving buyers a clear understanding of the space.</p>
              </div>
              <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-200 hover:border-zinc-300 transition-all">
                <Clock className="w-10 h-10 text-zinc-900 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">12-Hour Delivery</h3>
                <p className="text-zinc-600 leading-relaxed">Fast turnaround without compromising quality. Get your media within 12 hours of the shoot.</p>
              </div>
              <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-200 hover:border-zinc-300 transition-all md:col-span-2 md:w-1/2 md:mx-auto">
                <Shield className="w-10 h-10 text-zinc-900 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">Premium Delivery</h3>
                <p className="text-zinc-600 leading-relaxed">Private branded one-click gallery with high-res and MLS-optimized files. Full listing usage rights. Free light/color/exposure revisions.</p>
              </div>
            </div>
            <div className="text-center">
              <Link to="/order" className="inline-block bg-zinc-900 text-white text-lg px-10 py-4 rounded-full hover:bg-zinc-800 transition-all hover:scale-110">Select Package</Link>
            </div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section id="addons" className="py-32 px-6 lg:px-8 bg-gradient-to-b from-zinc-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block text-xs uppercase tracking-widest text-zinc-500 font-medium mb-4">Modular Upgrades</div>
              <h2 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]" style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Optional Add-ons
              </h2>
              <p className="text-xl text-zinc-600 max-w-2xl mx-auto">Enhance your package with premium upgrades tailored to your listing's needs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 hover:border-zinc-400 transition-all duration-300 hover:shadow-xl hover:scale-110 cursor-pointer" onMouseEnter={playHover}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 mb-4"><FileText className="w-8 h-8 text-white" /></div>
                <div className="text-4xl font-bold text-zinc-900 mb-2">$39</div>
                <h3 className="text-2xl font-semibold mb-3">Custom Listing Flyer</h3>
                <p className="text-zinc-600 leading-relaxed">Clean, professionally designed flyer to promote your property across social media and print.</p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 hover:border-zinc-400 transition-all duration-300 hover:shadow-xl hover:scale-110 cursor-pointer" onMouseEnter={playHover}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-zinc-900 mb-2">$99</div>
                <h3 className="text-2xl font-semibold mb-3">Drone Photos & Video</h3>
                <p className="text-zinc-600 leading-relaxed">Stunning aerial perspectives that capture the property and surrounding neighborhood.</p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 hover:border-zinc-400 transition-all duration-300 hover:shadow-xl hover:scale-110 cursor-pointer" onMouseEnter={playHover}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-4">
                  <Box className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-zinc-900 mb-2">$99</div>
                <h3 className="text-2xl font-semibold mb-3">3D Virtual Tour</h3>
                <p className="text-zinc-600 leading-relaxed">Interactive 3D walkthrough that lets buyers explore the property from anywhere.</p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 hover:border-zinc-400 transition-all duration-300 hover:shadow-xl hover:scale-110 cursor-pointer" onMouseEnter={playHover}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 mb-4">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Virtual Staging</h3>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  Transform vacant rooms into beautifully furnished spaces. Photorealistic digital staging delivered within 24 hours - helping buyers visualize the full potential of every listing.
                </p>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• 1 room - <span className="font-semibold text-zinc-900">$40</span></li>
                  <li>• 3 rooms - <span className="font-semibold text-zinc-900">$99</span></li>
                  <li>• 5 rooms - <span className="font-semibold text-zinc-900">$149</span></li>
                </ul>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 hover:border-zinc-400 transition-all duration-300 hover:shadow-xl hover:scale-110 cursor-pointer" onMouseEnter={playHover}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-4">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-zinc-900 mb-2">$179</div>
                <h3 className="text-2xl font-semibold mb-3">Cinematic Video</h3>
                <p className="text-zinc-600 leading-relaxed">Professional walkthrough video with cinematic editing to showcase the property's best features.</p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 hover:border-zinc-400 transition-all duration-300 hover:shadow-xl hover:scale-110 cursor-pointer" onMouseEnter={playHover}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-4">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-zinc-900 mb-2">$399</div>
                <h3 className="text-2xl font-semibold mb-3">Creative Personal Branding Reel</h3>
                <p className="text-zinc-600 leading-relaxed">Concept, scripting, filming, and editing a cinematic short-form video to promote your content and stand out on social media.</p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Link to="/order" className="inline-block bg-zinc-900 text-white text-lg px-10 py-4 rounded-full hover:bg-zinc-800 transition-all hover:scale-110">Customize Your Package</Link>
            </div>
          </div>
        </section>

        {/* Delivery Note Section */}
        <section className="py-32 px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Everything You Need,<br />Delivered Perfectly
            </h2>
            <div className="space-y-6 text-lg text-zinc-600 leading-relaxed">
              <p>All files delivered in high-resolution and MLS-optimized formats, ready for web and print.</p>
              <p>Every package includes full usage rights for listing purposes, hosted in a private branded gallery for easy one-click access.</p>
              <p className="text-zinc-500">Free revisions for light, color, and exposure adjustments to ensure perfection.</p>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-32 px-6 lg:px-8 bg-gradient-to-b from-zinc-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Ready to Elevate<br />Your Listings?
            </h2>
            <p className="text-xl text-zinc-600 mb-12">Let's create stunning media that makes your properties impossible to ignore.</p>
            <Link to="/order" className="inline-block bg-zinc-900 text-white text-lg px-10 py-4 rounded-full hover:bg-zinc-800 transition-all hover:scale-110 mb-12">Start Your Order</Link>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-zinc-600">
              <a href="mailto:luxentra.media@gmail.com" className="flex items-center gap-2 hover:text-zinc-900 transition-colors">
                <Mail className="w-5 h-5" />
                luxentra.media@gmail.com
              </a>
              <a href="tel:+13478371257" className="flex items-center gap-2 hover:text-zinc-900 transition-colors">
                <Phone className="w-5 h-5" />
                +1 (347) 837-1257
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 lg:px-8 bg-white border-t border-zinc-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-zinc-600">© 2025 LuxEntra Media. All rights reserved.</div>
            <div className="flex items-center gap-6 text-sm text-zinc-600">
              <a href="mailto:luxentra.media@gmail.com" className="hover:text-zinc-900 transition-colors">Contact</a>
              <Link to="/order" className="hover:text-zinc-900 transition-colors">Order Now</Link>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
 
 
// fixed
