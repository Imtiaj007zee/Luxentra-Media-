export interface PortfolioItem {
  slug: string;
  title: string;
  category: string;
  src: string;
  poster: string;
  ratio: "portrait" | "landscape";
}

/**
 * Portfolio films — grouped by the owner's categories:
 * Listing Films, Personal Branding, and Brand Story.
 */
export const PORTFOLIO: PortfolioItem[] = [
  // ——— Listing Films ———
  {
    slug: "850-e-223-st",
    title: "850 E 223 St",
    category: "Listing Films",
    src: "/work/850-e-223-st.mp4",
    poster: "/work/posters/850-e-223-st.jpg",
    ratio: "portrait",
  },
  {
    slug: "2802-miles-ave",
    title: "2802 Miles Ave",
    category: "Listing Films",
    src: "/work/2802-miles-ave.mp4",
    poster: "/work/posters/2802-miles-ave.jpg",
    ratio: "portrait",
  },
  {
    slug: "25112-maclay-ave",
    title: "25112 Maclay Ave",
    category: "Listing Films",
    src: "/work/25112-maclay-ave.mp4",
    poster: "/work/posters/25112-maclay-ave.jpg",
    ratio: "portrait",
  },
  {
    slug: "3277-park-side-place",
    title: "3277 Park Side Place",
    category: "Listing Films",
    src: "/work/3277-park-side-place.mp4",
    poster: "/work/posters/3277-park-side-place.jpg",
    ratio: "portrait",
  },
  {
    slug: "324-under-hill-ave",
    title: "324 Under Hill Ave",
    category: "Listing Films",
    src: "/work/324-under-hill-ave.mp4",
    poster: "/work/posters/324-under-hill-ave.jpg",
    ratio: "portrait",
  },
  {
    slug: "3640-palmer-ave",
    title: "3640 Palmer Ave",
    category: "Listing Films",
    src: "/work/3640-palmer-ave.mp4",
    poster: "/work/posters/3640-palmer-ave.jpg",
    ratio: "portrait",
  },
  // ——— Personal Branding ———
  {
    slug: "how-i-sale",
    title: "How I Sell",
    category: "Personal Branding",
    src: "/work/how-i-sale.mp4",
    poster: "/work/posters/how-i-sale.jpg",
    ratio: "portrait",
  },
  {
    slug: "sold-it",
    title: "Sold It",
    category: "Personal Branding",
    src: "/work/sold-it.mp4",
    poster: "/work/posters/sold-it.jpg",
    ratio: "portrait",
  },
  {
    slug: "honk-me-one-more-time",
    title: "Honk Me One More Time",
    category: "Personal Branding",
    src: "/work/honk-me-one-more-time.mp4",
    poster: "/work/posters/honk-me-one-more-time.jpg",
    ratio: "portrait",
  },
  {
    slug: "the-immigrant-story",
    title: "The Immigrant Story",
    category: "Personal Branding",
    src: "/work/the-immigrant-story.mp4",
    poster: "/work/posters/the-immigrant-story.jpg",
    ratio: "portrait",
  },
  {
    slug: "how-i-do-it-all",
    title: "How I Do It All",
    category: "Personal Branding",
    src: "/work/how-i-do-it-all.mp4",
    poster: "/work/posters/how-i-do-it-all.jpg",
    ratio: "portrait",
  },
  {
    slug: "truth-vs-myth",
    title: "Truth Vs Myth",
    category: "Personal Branding",
    src: "/work/truth-vs-myth.mp4",
    poster: "/work/posters/truth-vs-myth.jpg",
    ratio: "portrait",
  },
  {
    slug: "i-just-need-30-min",
    title: "I Just Need 30 Min",
    category: "Personal Branding",
    src: "/work/i-just-need-30-min.mp4",
    poster: "/work/posters/i-just-need-30-min.jpg",
    ratio: "portrait",
  },
  // ——— Brand Story ———
  {
    slug: "the-dream-never-disappears",
    title: "The Dream Never Disappears",
    category: "Brand Story",
    src: "/work/the-dream-never-disappears.mp4",
    poster: "/work/posters/the-dream-never-disappears.jpg",
    ratio: "landscape",
  },
  {
    slug: "home-central-capital",
    title: "Home Central Capital",
    category: "Brand Story",
    src: "/work/home-central-capital.mp4",
    poster: "/work/posters/home-central-capital.jpg",
    ratio: "portrait",
  },
  {
    slug: "you-find-the-house",
    title: "You Find the House",
    category: "Brand Story",
    src: "/work/you-find-the-house.mp4",
    poster: "/work/posters/you-find-the-house.jpg",
    ratio: "portrait",
  },
];
