/**
 * Central navigation config.
 * Labels come from next-intl (`Navigation.*` / `Footer.*`) — never hardcode copy here.
 */
export const mainNavItems = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/work", key: "work" },
  { href: "/company", key: "company" },
  { href: "/contact", key: "contact" },
] as const;

export type MainNavKey = (typeof mainNavItems)[number]["key"];
export type MainNavHref = (typeof mainNavItems)[number]["href"];

export const footerNav = {
  company: [
    { href: "/", key: "home" },
    { href: "/company", key: "company" },
    { href: "/contact", key: "contact" },
  ],
  services: [
    { href: "/services", key: "servicesOverview" },
  ],
  resources: [
    { href: "/privacy", key: "privacy" },
    { href: "/terms", key: "terms" },
  ],
  contact: [{ href: "/contact", key: "contact" }],
} as const;

export const socialLinks = [
  {
    key: "linkedin",
    href: "https://www.linkedin.com/",
  },
  {
    key: "x",
    href: "https://x.com/",
  },
  {
    key: "github",
    href: "https://github.com/",
  },
] as const;

export type SocialKey = (typeof socialLinks)[number]["key"];
