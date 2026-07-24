/**
 * Corevia design-token reference for TypeScript consumers.
 * Prefer Tailwind token classes in components (`bg-primary`, `text-hero`, `elevation-md`).
 * CSS remains the runtime source of truth — see `styles/globals.css`.
 */

export const brandColors = {
  primary: "#1652F0",
  secondary: "#0B2F91",
  accent: "#1652F0",
  background: "#FFFFFF",
  surface: "#F5F7FB",
  border: "#E4E8F1",
  foreground: "#0B0F19",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  mutedForeground: "#4B5163",
} as const;

/**
 * Semantic spacing keys only (section / gutter).
 * Named sm–4xl spacing tokens are intentionally omitted — they collide with
 * Tailwind max-w-* / container sizes in v4.
 */
export const spacing = {
  sectionSm: "section-sm",
  section: "section",
  sectionLg: "section-lg",
  gutter: "gutter",
  gutterLg: "gutter-lg",
} as const;

/** Layout max-widths — use these names with max-w-* utilities. */
export const containers = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  "2xl": "2xl",
  "3xl": "3xl",
  "4xl": "4xl",
  "5xl": "5xl",
  "6xl": "6xl",
  "7xl": "7xl",
} as const;

export const typography = {
  hero: "hero",
  display: "display",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  bodyLg: "body-lg",
  body: "body",
  caption: "caption",
  label: "label",
} as const;

export const radius = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  pill: "pill",
} as const;

export const elevation = {
  sm: "elevation-sm",
  md: "elevation-md",
  lg: "elevation-lg",
  hover: "elevation-hover",
} as const;

export const gradients = {
  primary: "bg-gradient-primary",
  surface: "bg-gradient-surface",
  heroGlow: "bg-hero-glow",
  textPrimary: "text-gradient-primary",
} as const;

/** Lucide outlined icons — keep stroke consistent site-wide. */
export const iconDefaults = {
  strokeWidth: 1.5,
  absoluteStrokeWidth: false,
} as const;
