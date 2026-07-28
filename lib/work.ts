/**
 * Our Work page content keys — labels live in next-intl (`Work.*`).
 */

export const workCaseKeys = [
  "financial",
  "vidaGreen",
  "portfolio",
] as const;

export type WorkCaseKey = (typeof workCaseKeys)[number];

export const workCaseImages: Record<WorkCaseKey, string> = {
  financial: "/images/work-financial-report.png",
  vidaGreen: "/images/work-vida-green-market.png",
  portfolio: "/images/work-property-portfolio.png",
};

/** Multi-image cases (carousel). Only vidaGreen for now. */
export const workCaseCarouselImages: Partial<
  Record<WorkCaseKey, readonly string[]>
> = {
  vidaGreen: [
    "/images/work-vida-green-market.png",
    "/images/work-juice-delivery.png",
  ],
};
