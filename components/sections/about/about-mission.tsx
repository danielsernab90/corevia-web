"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { SectionReveal } from "@/components/shared/motion";

export function AboutMission() {
  const tMission = useTranslations("About.mission");
  const tPhilosophy = useTranslations("About.philosophy");
  const tWhat = useTranslations("About.whatWeDo");

  return (
    <Section
      tone="surface"
      spacing="tight"
      aria-labelledby="about-mission-heading"
    >
      <Container size="md">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <Heading
            id="about-mission-heading"
            size="h2"
            align="center"
            className="tracking-tight glow-text-brand-soft"
          >
            {tMission("title")}
          </Heading>
          <p className="mt-5 font-sans text-body-lg text-muted-foreground">
            {tMission("body")}
          </p>
        </SectionReveal>

        <SectionReveal className="mx-auto mt-12 max-w-2xl text-center md:mt-14">
          <Heading
            size="h3"
            align="center"
            className="tracking-tight glow-text-brand-soft"
          >
            {tPhilosophy("title")}
          </Heading>
          <p className="mt-4 font-sans text-body text-muted-foreground">
            {tPhilosophy("body")}
          </p>
        </SectionReveal>

        <SectionReveal className="mx-auto mt-12 max-w-2xl text-center md:mt-14">
          <Heading
            size="h3"
            align="center"
            className="tracking-tight glow-text-brand-soft"
          >
            {tWhat("headline")}
          </Heading>
          <p className="mt-5 font-sans text-body-lg text-muted-foreground">
            {tWhat("body1")}
          </p>
          <p className="mt-4 font-sans text-body text-muted-foreground">
            {tWhat("body2")}
          </p>
          <p className="mt-4 font-sans text-body text-muted-foreground">
            {tWhat("body3")}
          </p>
        </SectionReveal>
      </Container>
    </Section>
  );
}
