export interface PortfolioItem {
  slug: string;
  title: string;
  category: string;
  src: string;
  poster: string;
  ratio: "portrait" | "landscape";
}

/**
 * Portfolio pieces from the PortfolioLux Google Drive folder —
 * the videos behind LuxEntra's best-performing content.
 */
export const PORTFOLIO: PortfolioItem[] = [
  {
    slug: "sold-it-fin",
    title: "1925 Bogart Ave, Bronx",
    category: "Listing Film",
    src: "/work/sold-it-fin.mp4",
    poster: "/work/posters/sold-it-fin.jpg",
    ratio: "portrait",
  },
  {
    slug: "cj",
    title: "HomeCentral Capital",
    category: "Brand Story",
    src: "/work/cj.mp4",
    poster: "/work/posters/cj.jpg",
    ratio: "portrait",
  },
  {
    slug: "comp-1-2",
    title: "Throggs Neck",
    category: "Aerial Film",
    src: "/work/comp-1-2.mp4",
    poster: "/work/posters/comp-1-2.jpg",
    ratio: "portrait",
  },
  {
    slug: "timeline-2-1",
    title: "The Dream Never Disappears",
    category: "Brand Film",
    src: "/work/timeline-2-1.mp4",
    poster: "/work/posters/timeline-2-1.jpg",
    ratio: "landscape",
  },
  {
    slug: "324-underhill-avenue",
    title: "324 Underhill Avenue",
    category: "Listing Film",
    src: "/work/324-underhill-avenue.mp4",
    poster: "/work/posters/324-underhill-avenue.jpg",
    ratio: "portrait",
  },
  {
    slug: "lux-9-fin-1",
    title: "Two-Family Tour",
    category: "Listing Film",
    src: "/work/lux-9-fin-1.mp4",
    poster: "/work/posters/lux-9-fin-1.jpg",
    ratio: "portrait",
  },
  {
    slug: "honka-honka",
    title: "The Immigrant Story",
    category: "Brand Story",
    src: "/work/honka-honka.mp4",
    poster: "/work/posters/honka-honka.jpg",
    ratio: "portrait",
  },
  {
    slug: "lux-7-fin2",
    title: "Live In One, Rent the Rest",
    category: "Listing Film",
    src: "/work/lux-7-fin2.mp4",
    poster: "/work/posters/lux-7-fin2.jpg",
    ratio: "portrait",
  },
  {
    slug: "how-do-i-do-it",
    title: "How I Did It",
    category: "Brand Story",
    src: "/work/how-do-i-do-it.mp4",
    poster: "/work/posters/how-do-i-do-it.jpg",
    ratio: "portrait",
  },
  {
    slug: "lux-8",
    title: "3BR + 4BR Walkout",
    category: "Listing Film",
    src: "/work/lux-8.mp4",
    poster: "/work/posters/lux-8.jpg",
    ratio: "portrait",
  },
  {
    slug: "lux-6-fin-5",
    title: "The Home Gym",
    category: "Brand Reel",
    src: "/work/lux-6-fin-5.mp4",
    poster: "/work/posters/lux-6-fin-5.jpg",
    ratio: "portrait",
  },
  {
    slug: "timeline-1",
    title: "How Housing Changed Me",
    category: "Brand Story",
    src: "/work/timeline-1.mp4",
    poster: "/work/posters/timeline-1.jpg",
    ratio: "portrait",
  },
];
