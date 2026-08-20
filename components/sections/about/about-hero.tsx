"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { SectionReveal } from "@/components/shared/motion";

export function AboutHero() {
  const t = useTranslations("About.hero");

  return (
    <Section
      tone="dark"
      spacing="none"
      aria-labelledby="about-hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%)]"
      />
      <Container
        size="xl"
        className="relative flex min-h-[min(52dvh,28rem)] flex-col justify-center py-14 md:py-16 lg:py-20"
      >
        <SectionReveal className="mx-auto max-w-3xl text-center">
          <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <Heading
            id="about-hero-heading"
            size="h1"
            align="center"
            className="mt-4 tracking-tight glow-text-white-soft"
            style={{ color: "var(--secondary-foreground)" }}
          >
            {t("title")}
          </Heading>
        </SectionReveal>
      </Container>
    </Section>
  );
}
