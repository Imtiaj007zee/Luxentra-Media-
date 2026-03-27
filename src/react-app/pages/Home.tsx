import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  Camera,
  Video,
  Plane,
  Box,
  Clock,
  Shield,
  Mail,
  Phone,
  Sunset,
  ShoppingCart,
  Layers,
} from "lucide-react";

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = Math.max(0, 1 - scrollY / 500);
  const scale = Math.max(0.95, 1 - scrollY / 2000);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="text-xl font-semibold tracking-tight">
            LuxEntra Media
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#package"
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Package
            </a>
            <a
              href="#addons"
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Add-ons
            </a>
            <Link
              to="/order"
              className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm text-white transition-all hover:bg-zinc-800"
            >
              <ShoppingCart className="h-4 w-4" />
              Order Now
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16"
        style={{
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-100" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-8">
          <div className="mb-4 inline-block text-xs font-medium uppercase tracking-widest text-zinc-500">
            Luxury Real Estate Media
          </div>

          <h1
            className="mb-8 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-6xl font-semibold leading-none tracking-tight text-transparent drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] md:text-8xl lg:text-9xl"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Elevate
            <br />
            Every Listing
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-zinc-600 md:text-2xl">
            Premium photography and media services designed for luxury real
            estate professionals.
          </p>

          <Link
            to="/order"
            className="inline-block rounded-full bg-zinc-900 px-10 py-4 text-lg text-white transition-all hover:scale-105 hover:bg-zinc-800"
          >
            Start Your Order
          </Link>
        </div>
      </section>

      {/* Standard Package Section */}
      <section id="package" className="bg-white px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <div className="mb-4 inline-block text-xs font-medium uppercase tracking-widest text-zinc-500">
              Our Core Offering
            </div>

            <h2
              className="mb-6 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-5xl font-semibold tracking-tight text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:text-7xl"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Standard Listing
              <br />
              Media Package
            </h2>

            <div
              className="mb-4 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-6xl font-bold text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] md:text-8xl"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              $175
            </div>

            <p className="mx-auto max-w-2xl text-xl text-zinc-600">
              Everything you need to make your listing stand out.
            </p>
          </div>

          <div className="mb-16 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 transition-all hover:border-zinc-300">
              <Camera className="mb-4 h-10 w-10 text-zinc-900" />
              <h3 className="mb-3 text-2xl font-semibold">
                25–45 MLS-Ready Photos
              </h3>
              <p className="leading-relaxed text-zinc-600">
                Professional interior and exterior shots, expertly edited and
                optimized for MLS.
              </p>
            </div>

            <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50 p-8 transition-all hover:border-orange-300">
              <Sunset className="mb-4 h-10 w-10 text-orange-600" />
              <h3 className="mb-3 text-2xl font-semibold">
                1 Twilight Photo Included
              </h3>
              <p className="leading-relaxed text-zinc-600">
                One stunning twilight exterior shot that makes your listing
                unforgettable.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 transition-all hover:border-zinc-300">
              <Box className="mb-4 h-10 w-10 text-zinc-900" />
              <h3 className="mb-3 text-2xl font-semibold">2D Floor Plans</h3>
              <p className="leading-relaxed text-zinc-600">
                Clean black and white floor plans for every floor, giving buyers
                a clear understanding of the space.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 transition-all hover:border-zinc-300">
              <Clock className="mb-4 h-10 w-10 text-zinc-900" />
              <h3 className="mb-3 text-2xl font-semibold">12-Hour Delivery</h3>
              <p className="leading-relaxed text-zinc-600">
                Fast turnaround without compromising quality. Get your media
                within 12 hours of the shoot.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 transition-all hover:border-zinc-300 md:col-span-2">
              <Shield className="mb-4 h-10 w-10 text-zinc-900" />
              <h3 className="mb-3 text-2xl font-semibold">Premium Delivery</h3>
              <p className="leading-relaxed text-zinc-600">
                Private branded one-click gallery with high-resolution and
                MLS-optimized files, full listing usage rights, and free light,
                color, and exposure revisions.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/order"
              className="inline-block rounded-full bg-zinc-900 px-10 py-4 text-lg text-white transition-all hover:scale-105 hover:bg-zinc-800"
            >
              Select Package
            </Link>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section
        id="addons"
        className="bg-gradient-to-b from-zinc-50 to-white px-6 py-32 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <div className="mb-4 inline-block text-xs font-medium uppercase tracking-widest text-zinc-500">
              Modular Upgrades
            </div>

            <h2
              className="mb-6 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-5xl font-semibold tracking-tight text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:text-7xl"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Optional Add-ons
            </h2>

            <p className="mx-auto max-w-2xl text-xl text-zinc-600">
              Enhance your package with premium upgrades tailored to your
              listing&apos;s needs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-400 hover:shadow-xl">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <div className="mb-2 text-4xl font-bold text-zinc-900">$99</div>
              <h3 className="mb-3 text-2xl font-semibold">
                Drone Photos and Video
              </h3>
              <p className="leading-relaxed text-zinc-600">
                Stunning aerial perspectives that capture the property and
                surrounding neighborhood.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-400 hover:shadow-xl">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600">
                <Box className="h-8 w-8 text-white" />
              </div>
              <div className="mb-2 text-4xl font-bold text-zinc-900">$99</div>
              <h3 className="mb-3 text-2xl font-semibold">3D Virtual Tour</h3>
              <p className="leading-relaxed text-zinc-600">
                Interactive 3D walkthrough that lets buyers explore the property
                from anywhere.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-400 hover:shadow-xl">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600">
                <Layers className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold">Virtual Staging</h3>
              <p className="mb-4 leading-relaxed text-zinc-600">
                Transform vacant rooms into beautifully furnished spaces with
                photorealistic digital staging delivered within 24 hours.
              </p>
              <ul className="space-y-1 text-sm text-zinc-600">
                <li>
                  • 1 room -{" "}
                  <span className="font-semibold text-zinc-900">$40</span>
                </li>
                <li>
                  • 3 rooms -{" "}
                  <span className="font-semibold text-zinc-900">$99</span>
                </li>
                <li>
                  • 5 rooms -{" "}
                  <span className="font-semibold text-zinc-900">$149</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-400 hover:shadow-xl">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Video className="h-8 w-8 text-white" />
              </div>
              <div className="mb-2 text-4xl font-bold text-zinc-900">$150</div>
              <h3 className="mb-3 text-2xl font-semibold">
                Walkthrough / Cinematic Video
              </h3>
              <p className="leading-relaxed text-zinc-600">
                Professional walkthrough video with cinematic editing to
                showcase the property&apos;s best features.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/order"
              className="inline-block rounded-full bg-zinc-900 px-10 py-4 text-lg text-white transition-all hover:scale-105 hover:bg-zinc-800"
            >
              Customize Your Package
            </Link>
          </div>
        </div>
      </section>

      {/* Delivery Note Section */}
      <section className="bg-white px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="mb-8 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-4xl font-semibold tracking-tight text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:text-5xl"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Everything You Need,
            <br />
            Delivered Perfectly
          </h2>

          <div className="space-y-6 text-lg leading-relaxed text-zinc-600">
            <p>
              All files are delivered in high-resolution and MLS-optimized
              formats, ready for web and print.
            </p>
            <p>
              Every package includes full usage rights for listing purposes,
              hosted in a private branded gallery for easy one-click access.
            </p>
            <p className="text-zinc-500">
              Free revisions for light, color, and exposure adjustments to
              ensure perfection.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="bg-gradient-to-b from-zinc-50 to-white px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="mb-8 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-5xl font-semibold tracking-tight text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:text-6xl"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ready to Elevate
            <br />
            Your Listings?
          </h2>

          <p className="mb-12 text-xl text-zinc-600">
            Let&apos;s create stunning media that makes your properties
            impossible to ignore.
          </p>

          <Link
            to="/order"
            className="mb-12 inline-block rounded-full bg-zinc-900 px-10 py-4 text-lg text-white transition-all hover:scale-105 hover:bg-zinc-800"
          >
            Start Your Order
          </Link>

          <div className="flex flex-col items-center justify-center gap-6 text-zinc-600 sm:flex-row">
            <a
              href="mailto:luxentra.media@gmail.com"
              className="flex items-center gap-2 transition-colors hover:text-zinc-900"
            >
              <Mail className="h-5 w-5" />
              luxentra.media@gmail.com
            </a>

            <a
              href="tel:+13478371257"
              className="flex items-center gap-2 transition-colors hover:text-zinc-900"
            >
              <Phone className="h-5 w-5" />
              +1 (347) 837-1257
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-zinc-600">
            © 2025 LuxEntra Media. All rights reserved.
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <a
              href="mailto:luxentra.media@gmail.com"
              className="transition-colors hover:text-zinc-900"
            >
              Contact
            </a>
            <Link to="/order" className="transition-colors hover:text-zinc-900">
              Order Now
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
