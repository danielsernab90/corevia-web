"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionReveal } from "@/components/shared/motion";

export function AboutClosing() {
  const t = useTranslations("About.closing");

  return (
    <Section
      tone="white"
      spacing="tight"
      aria-labelledby="about-closing-heading"
    >
      <Container size="md">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 id="about-closing-heading" className="sr-only">
            {t("label")}
          </h2>
          <p className="font-sans text-body-lg text-muted-foreground">
            {t("body")}
          </p>
        </SectionReveal>
      </Container>
    </Section>
  );
}
