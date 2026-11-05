import {
  COLOMBIA_WHATSAPP_E164_DIGITS,
  US_PHONE_E164_DIGITS,
} from "@/lib/contact";
import { getSiteUrl, ogImage, siteConfig } from "@/lib/site";

/**
 * Organization structured data from verified public brand facts only.
 * No invented addresses, ratings, or awards.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: getSiteUrl(),
    logo: getSiteUrl("/logos/corevia-nav-logo-light.png"),
    image: getSiteUrl(ogImage.url),
    sameAs: [
      "https://www.instagram.com/corevia_software/",
      "https://www.facebook.com/coreviasoftware/",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        availableLanguage: ["English", "Spanish"],
        telephone: `+${COLOMBIA_WHATSAPP_E164_DIGITS}`,
        areaServed: ["CO", "US"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["English", "Spanish"],
        telephone: `+${US_PHONE_E164_DIGITS}`,
        areaServed: ["US", "CO"],
      },
    ],
    description:
      "Custom software, digital platforms, and AI-powered tools built for how businesses actually work.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
