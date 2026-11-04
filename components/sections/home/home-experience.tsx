import { HomeCredibility } from "@/components/sections/home/home-credibility";
import { HomeFinalCta } from "@/components/sections/home/home-final-cta";
import { HomeFlagship } from "@/components/sections/home/home-flagship";
import { HomeHero } from "@/components/sections/home/home-hero";
import { HomeOutcomes } from "@/components/sections/home/home-outcomes";
import { HomeProcess } from "@/components/sections/home/home-process";
import { HomeProjectGrid } from "@/components/sections/home/home-project-grid";
import { HomeSolutions } from "@/components/sections/home/home-solutions";

export function HomeExperience() {
  return (
    <>
      <HomeHero />
      <HomeOutcomes />
      <HomeFlagship />
      <HomeProjectGrid />
      <HomeSolutions />
      <HomeProcess />
      <HomeCredibility />
      <HomeFinalCta />
    </>
  );
}
