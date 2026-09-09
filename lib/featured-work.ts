/**
 * Homepage Featured Work — media paths and structure.
 * Copy lives in next-intl (`Home.featuredWork`).
 */

export type FeaturedMedia = {
  src: string;
  /** Translation key under the project: e.g. mediaAlts.0 */
  altKey: string;
  width?: number;
  height?: number;
};

export type FeaturedExample = {
  id: "scheduling" | "ordering";
  /** Single preview when available; null shows text-only for that example. */
  media: FeaturedMedia | null;
  /**
   * Multi-screenshot product evidence (journey stages).
   * Scheduling: services → booking → confirmation.
   * Ordering: menu → customize → cart/checkout.
   */
  screenshots?: readonly FeaturedMedia[];
};

export type FeaturedProject = {
  id: "financial" | "operations" | "automation";
  number: "01" | "02" | "03";
  /** Existing /work page covers these systems when set. */
  href: "/work" | null;
  media: readonly FeaturedMedia[];
  featureKeys: readonly string[];
  examples?: readonly FeaturedExample[];
};

/**
 * Curated homepage portfolio (not the full /work catalog).
 * Media reused from existing Our Work screenshots where available.
 */
export const featuredProjects: readonly FeaturedProject[] = [
  {
    id: "financial",
    number: "01",
    href: "/work",
    media: [
      {
        src: "/images/work-financial-report.png",
        altKey: "mediaAlts.0",
      },
      {
        src: "/images/work-property-portfolio.png",
        altKey: "mediaAlts.1",
      },
    ],
    featureKeys: ["0", "1", "2", "3", "4"],
  },
  {
    id: "operations",
    number: "02",
    href: "/work",
    media: [
      {
        src: "/images/work-vida-green-market.png",
        altKey: "mediaAlts.0",
      },
      {
        src: "/images/work-juice-delivery.png",
        altKey: "mediaAlts.1",
      },
    ],
    featureKeys: ["0", "1", "2", "3"],
  },
  {
    id: "automation",
    number: "03",
    href: null,
    media: [],
    featureKeys: [],
    examples: [
      {
        id: "scheduling",
        media: null,
        screenshots: [
          {
            src: "/images/home/massage-automation-services.jpg",
            altKey: "screenshots.0",
            width: 554,
            height: 1024,
          },
          {
            src: "/images/home/massage-automation-scheduling.jpg",
            altKey: "screenshots.1",
            width: 534,
            height: 1024,
          },
          {
            src: "/images/home/massage-automation-confirmation.jpg",
            altKey: "screenshots.2",
            width: 556,
            height: 1024,
          },
        ],
      },
      {
        id: "ordering",
        media: null,
        screenshots: [
          {
            src: "/images/home/automated-ordering-main.jpg",
            altKey: "screenshots.0",
            width: 533,
            height: 1024,
          },
          {
            src: "/images/home/automated-ordering-customize.jpg",
            altKey: "screenshots.1",
            width: 552,
            height: 1024,
          },
          {
            src: "/images/home/automated-ordering-cart.jpg",
            altKey: "screenshots.2",
            width: 571,
            height: 1024,
          },
        ],
      },
    ],
  },
] as const;
