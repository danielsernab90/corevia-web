"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { SectionReveal } from "@/components/shared/motion";

export function AboutHowWeWork() {
  const t = useTranslations("About.howWeWork");
  const tDiff = useTranslations("About.differentiate");

  return (
    <Section
      tone="surface"
      spacing="tight"
      aria-labelledby="about-how-heading"
    >
      <Container size="md">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <Heading
            id="about-how-heading"
            size="h2"
            align="center"
            className="tracking-tight glow-text-brand-soft"
          >
            {t("title")}
          </Heading>
          <p className="mt-5 font-sans text-body-lg text-muted-foreground">
            {t("description")}
          </p>
        </SectionReveal>

        <SectionReveal className="mx-auto mt-12 max-w-2xl text-center md:mt-14">
          <Heading
            size="h3"
            align="center"
            className="tracking-tight glow-text-brand-soft"
          >
            {tDiff("title")}
          </Heading>
          <p className="mt-4 font-sans text-body text-muted-foreground">
            {tDiff("body")}
          </p>
        </SectionReveal>
      </Container>
    </Section>
  );
}
