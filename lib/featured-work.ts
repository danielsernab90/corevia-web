/**
 * Homepage Featured Work — media paths and structure.
 * Copy lives in next-intl (`Home.featuredWork`).
 */

export type FeaturedMedia = {
  src: string;
  /** Translation key under the project: e.g. mediaAlts.0 */
  altKey: string;
};

export type FeaturedExample = {
  id: "scheduling" | "ordering";
  /** Null until real product screenshots are added. */
  media: FeaturedMedia | null;
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
        // No massage-scheduling screenshot in the repo yet.
        media: null,
      },
      {
        id: "ordering",
        // No restaurant-ordering screenshot in the repo yet.
        media: null,
      },
    ],
  },
] as const;
