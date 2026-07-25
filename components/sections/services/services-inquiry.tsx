"use client";

import { useTranslations } from "next-intl";

import { ConsultationFormFlow } from "@/components/sections/book-consultation/consultation-form-flow";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { FadeUp, SectionReveal } from "@/components/shared/motion";

export function ServicesInquiry() {
  const t = useTranslations("Services.inquiry");

  return (
    <Section
      id="services-inquiry"
      tone="dark"
      spacing="tight"
      aria-labelledby="services-inquiry-heading"
      className="relative scroll-mt-24 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%)]"
      />

      <Container size="md" className="relative">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <Heading
            id="services-inquiry-heading"
            size="h2"
            align="center"
            className="tracking-tight glow-text-white-soft"
            style={{ color: "var(--secondary-foreground)" }}
          >
            {t("title")}
          </Heading>
          <p className="mt-4 font-sans text-body-lg text-secondary-foreground/75">
            {t("description")}
          </p>
        </SectionReveal>

        <FadeUp className="mx-auto mt-10 max-w-xl">
          <ConsultationFormFlow
            idPrefix="services-"
            variant="inline"
            actionsAlign="center"
          />
        </FadeUp>
      </Container>
    </Section>
  );
}
