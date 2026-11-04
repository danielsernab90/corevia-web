/**
 * Services page content keys — labels live in next-intl (`Services.*`).
 * Six capability groups preserve CoreVia’s existing offerings without inventing new ones.
 */

export const serviceGroupKeys = [
  "customSoftware",
  "aiAutomation",
  "dashboards",
  "websites",
  "integrations",
  "digitalGrowth",
] as const;

export type ServiceGroupKey = (typeof serviceGroupKeys)[number];

export const serviceExampleLabelKeys = [
  "summit",
  "summitAi",
  "summitOs",
  "summitWeb",
  "cotingaOps",
  "cotingaWeb",
  "perritosOps",
  "dixie",
  "dixieStory",
  "gallinita",
  "gallinitaFlow",
] as const;

export type ServiceExampleLabelKey = (typeof serviceExampleLabelKeys)[number];

/** Portfolio demos linked as real examples (prototypeId → /work/[id]). */
export const serviceGroupExamples: Record<
  ServiceGroupKey,
  readonly { prototypeId: string; labelKey: ServiceExampleLabelKey }[]
> = {
  customSoftware: [
    { prototypeId: "summit", labelKey: "summit" },
    { prototypeId: "gallinita", labelKey: "gallinita" },
  ],
  aiAutomation: [{ prototypeId: "summit", labelKey: "summitAi" }],
  dashboards: [
    { prototypeId: "summit", labelKey: "summitOs" },
    { prototypeId: "cotinga", labelKey: "cotingaOps" },
    { prototypeId: "perritos", labelKey: "perritosOps" },
  ],
  websites: [
    { prototypeId: "cotinga", labelKey: "cotingaWeb" },
    { prototypeId: "dixie", labelKey: "dixie" },
    { prototypeId: "summit", labelKey: "summitWeb" },
  ],
  integrations: [{ prototypeId: "gallinita", labelKey: "gallinitaFlow" }],
  digitalGrowth: [{ prototypeId: "dixie", labelKey: "dixieStory" }],
};

export const serviceProcessKeys = [
  "discover",
  "design",
  "build",
  "launch",
] as const;

export type ServiceProcessKey = (typeof serviceProcessKeys)[number];

/** @deprecated Prefer serviceGroupKeys — kept for any residual imports. */
export const serviceCategoryKeys = serviceGroupKeys;
export type ServiceCategoryKey = ServiceGroupKey;
