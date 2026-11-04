/**
 * Central navigation config.
 * Labels come from next-intl (`Navigation.*` / `Footer.*`) — never hardcode copy here.
 */

export const mainNavItems = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/work", key: "work" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export type MainNavKey = (typeof mainNavItems)[number]["key"];
export type MainNavHref = (typeof mainNavItems)[number]["href"];

export const footerNav = {
  company: [
    { href: "/", key: "home" },
    { href: "/about", key: "about" },
    { href: "/work", key: "work" },
    { href: "/contact", key: "contact" },
  ],
  services: [{ href: "/services", key: "servicesOverview" }],
  resources: [
    { href: "/privacy", key: "privacy" },
    { href: "/terms", key: "terms" },
  ],
} as const;

/**
 * Verified public profiles only (also used on Contact).
 * Do not add placeholder LinkedIn / X / GitHub destinations.
 */
export const verifiedSocialLinks = [
  {
    key: "instagram",
    href: "https://www.instagram.com/corevia_software/",
    handle: "@corevia_software",
  },
  {
    key: "facebook",
    href: "https://www.facebook.com/coreviasoftware/",
    handle: "CoreVia",
  },
] as const;

export type VerifiedSocialKey = (typeof verifiedSocialLinks)[number]["key"];
