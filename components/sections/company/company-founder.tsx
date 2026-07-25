"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { SectionReveal } from "@/components/shared/motion";

export function CompanyFounder() {
  const t = useTranslations("Company.whatWeDo");

  return (
    <Section
      tone="surface"
      spacing="tight"
      aria-labelledby="company-what-we-do-heading"
    >
      <Container size="md">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <Heading
            id="company-what-we-do-heading"
            size="h2"
            align="center"
            className="tracking-tight glow-text-brand-soft"
          >
            {t("headline")}
          </Heading>
          <p className="mt-5 font-sans text-body-lg text-muted-foreground">
            {t("body1")}
          </p>
          <p className="mt-4 font-sans text-body text-muted-foreground">
            {t("body2")}
          </p>
        </SectionReveal>
      </Container>
    </Section>
  );
}
