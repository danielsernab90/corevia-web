"use client";

import { AboutClosing } from "@/components/sections/about/about-closing";
import { AboutHero } from "@/components/sections/about/about-hero";
import { AboutStory } from "@/components/sections/about/about-story";

export function AboutExperience() {
  return (
    <main id="main-content" tabIndex={-1}>
      <AboutHero />
      <AboutStory />
      <AboutClosing />
    </main>
  );
}
