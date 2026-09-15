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
    blurb: "Enter the market looking polished, professional, and ready to compete.",
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
    blurb: "Create the kind of listing buyers stop scrolling to experience.",
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
    blurb: "Showcase the property while building the trusted name behind it.",
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
