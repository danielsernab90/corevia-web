"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { SectionReveal } from "@/components/shared/motion";

export function CompanyFounder() {
  const t = useTranslations("Company.founder");

  return (
    <Section
      tone="surface"
      spacing="tight"
      aria-labelledby="company-founder-heading"
    >
      <Container size="md">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <Heading
            id="company-founder-heading"
            size="h2"
            align="center"
            className="mt-3 tracking-tight glow-text-brand-soft"
          >
            {t("name")}
          </Heading>
          <p className="mt-5 font-sans text-body-lg text-muted-foreground">
            {t("dayToDay")}
          </p>
          <p className="mt-4 font-sans text-body text-muted-foreground">
            {t("background")}
          </p>
        </SectionReveal>
      </Container>
    </Section>
  );
}
