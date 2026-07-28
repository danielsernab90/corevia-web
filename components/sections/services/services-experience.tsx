"use client";

import { ServicesCategories } from "@/components/sections/services/services-categories";
import { ServicesHero } from "@/components/sections/services/services-hero";
import { ServicesHowItWorks } from "@/components/sections/services/services-how-it-works";
import { ServicesInquiry } from "@/components/sections/services/services-inquiry";

export function ServicesExperience() {
  return (
    <main id="main-content" tabIndex={-1}>
      <ServicesHero />
      <ServicesCategories />
      <ServicesHowItWorks />
      <ServicesInquiry />
    </main>
  );
}
