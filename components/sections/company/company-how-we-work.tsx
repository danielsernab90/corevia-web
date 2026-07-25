"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { SectionReveal } from "@/components/shared/motion";

export function CompanyHowWeWork() {
  const t = useTranslations("Company.howWeWork");

  return (
    <Section
      tone="white"
      spacing="tight"
      aria-labelledby="company-how-heading"
    >
      <Container size="md">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <Heading
            id="company-how-heading"
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
      </Container>
    </Section>
  );
}
