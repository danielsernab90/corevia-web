/**
 * Our Work page content keys — labels live in next-intl (`Work.*`).
 */

export const workCaseKeys = [
  "financial",
  "vidaGreen",
  "alchones",
  "cleaningOs",
  "lending",
] as const;

export type WorkCaseKey = (typeof workCaseKeys)[number];

export const workCaseImages: Record<WorkCaseKey, string> = {
  financial: "/images/work-financial-report.png",
  vidaGreen: "/images/work-vida-green-market.png",
  alchones: "/images/work-alchones-dashboard.png",
  cleaningOs: "/images/work-cleaningos-agenda.png",
  lending: "/images/work-lending-operations.png",
};

/** Multi-image cases (carousel). */
export const workCaseCarouselImages: Partial<
  Record<WorkCaseKey, readonly string[]>
> = {
  financial: [
    "/images/work-financial-report.png",
    "/images/work-property-portfolio.png",
  ],
  vidaGreen: [
    "/images/work-vida-green-market.png",
    "/images/work-juice-delivery.png",
  ],
  alchones: [
    "/images/work-alchones-dashboard.png",
    "/images/work-alchones-players.png",
    "/images/work-alchones-payments.png",
    "/images/work-alchones-reports.png",
  ],
  cleaningOs: [
    "/images/work-cleaningos-agenda.png",
    "/images/work-cleaningos-clients.png",
    "/images/work-cleaningos-expenses.png",
  ],
  lending: [
    "/images/work-lending-operations.png",
    "/images/work-lending-operations-2.png",
    "/images/work-lending-client.png",
    "/images/work-lending-new-loan.png",
    "/images/work-lending-loans.png",
    "/images/work-lending-register-client.png",
    "/images/work-lending-route.png",
  ],
};
