export type LaunchBundle = {
  id: string;
  name: string;
  price: number;
  blurb: string;
  badge?: string;
  featured?: boolean;
  features: string[];
};

// Official launch bundle catalog. Prices are always read from here —
// never from the URL — so customers cannot tamper with them.
export const LAUNCH_BUNDLES: LaunchBundle[] = [
  {
    id: "market-launch",
    name: "Market Launch",
    price: 399,
    blurb: "Everything you need to list with confidence.",
    features: [
      "Premium interior and exterior photography",
      "Aerial drone photography",
      "Whole-property virtual staging",
      "Professionally edited, listing-ready visuals",
      "MLS-, web-, and social-ready delivery",
    ],
  },
  {
    id: "listing-premiere",
    name: "Listing Premiere",
    price: 699,
    blurb: "Photos plus a cinematic film buyers will remember.",
    features: [
      "Everything included in Market Launch",
      "Cinematic property film",
      "Interior, exterior, and aerial storytelling",
      "Professional editing, color, and music",
      "Optimized delivery for websites and social media",
    ],
  },
  {
    id: "agent-authority",
    name: "Agent Authority",
    price: 899,
    badge: "Most chosen",
    featured: true,
    blurb: "Sell the home and build your name at the same time.",
    features: [
      "Everything included in Listing Premiere",
      "Complete A-to-Z creative production",
      "Personalized concept development",
      "Custom-crafted agent script",
      "Guided on-camera direction",
      "Premium agent branding incorporated naturally throughout the film",
    ],
  },
];

export const getBundleById = (id: string | null | undefined): LaunchBundle | null =>
  LAUNCH_BUNDLES.find((b) => b.id === id) ?? null;

export type BrandingPlan = {
  id: string;
  name: string;
  price: number; // monthly price in USD
  tagline: string;
  desc: string;
  badge?: string;
  featured?: boolean;
  features: string[];
};

// Official personal-branding plan catalog. Prices are always read from here —
// never from the URL — so customers cannot tamper with them.
export const BRANDING_PLANS: BrandingPlan[] = [
  {
    id: "essential",
    name: "Essential",
    price: 5999,
    tagline: "Build Your Presence",
    desc: "For professionals who need a consistent, polished, and fully managed personal brand.",
    features: [
      "15 short-form videos",
      "5 carousel posts",
      "15–20 stories",
      "Personal-brand and content strategy",
      "Monthly content planning",
      "Scripts, hooks, storytelling frameworks, and calls to action",
      "Professional filming and editing",
      "Captions, scheduling, and publishing",
      "Instagram, Facebook, and TikTok management",
      "Trend and algorithm research",
      "Monthly performance summary",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 7999,
    tagline: "Turn Attention Into Leads",
    desc: "For professionals ready to expand their reach and turn content engagement into qualified opportunities.",
    features: [
      "20 short-form videos",
      "10 carousel posts",
      "30 stories",
      "Everything included in Essential",
      "In-depth competitor and audience research",
      "Offer and campaign positioning",
      "Complete lead-generation funnel",
      "Lead-capture page or inquiry form",
      "Clear booking or consultation pathway",
      "Lead tracking and follow-up framework",
      "Paid-ad strategy and campaign development",
      "Advertising creatives and copy",
      "Audience targeting",
      "Campaign setup and management",
      "Dedicated brand-management device purchased, set up, and operated by our team",
      "Detailed monthly performance reporting",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 10999,
    tagline: "Convert, Optimize, and Scale",
    desc: "Our most advanced system for turning content into leads, potential clients, and measurable revenue opportunities.",
    badge: "Money-back guarantee",
    featured: true,
    features: [
      "30 short-form videos",
      "15 carousel posts",
      "60 stories",
      "Everything included in Growth",
      "Advanced multi-stage lead-generation funnel",
      "Full-funnel advertising strategy",
      "Audience targeting and retargeting",
      "Continuous campaign testing and optimization",
      "Lead-nurturing and conversion framework",
      "Advanced algorithm and audience analysis",
      "Platform monetization preparation and optimization",
      "Advanced performance and conversion reporting",
      "Priority production and account support",
      "50% money-back guarantee if the agreed-upon performance benchmark is not achieved, subject to the campaign terms",
    ],
  },
  {
    id: "brand-content",
    name: "Brand Content",
    price: 1800,
    tagline: "Content, ready to post",
    desc: "Already have your brand but need professional content? We'll handle the production and deliver videos ready to post.",
    features: [
      "4 branding videos per month",
      "Strategy, scripting, filming, and editing",
      "1 complimentary video in your first month",
      "15% off additional services",
      "3-month minimum commitment",
    ],
  },
];

export const getBrandingPlanById = (id: string | null | undefined): BrandingPlan | null =>
  BRANDING_PLANS.find((p) => p.id === id) ?? null;

// Every bookable LuxEntra service — used for the "Service Type" dropdown
// on the booking forms.
export const SERVICE_TYPES = [
  "Real Estate Photography",
  "Walkthrough / Cinematic Video",
  "Personal Branding",
  "Drone Photos & Video",
  "3D Virtual Tour",
  "Custom Listing Flyer",
  "Virtual Staging",
  "One-on-One Consultation",
  "Other",
];
