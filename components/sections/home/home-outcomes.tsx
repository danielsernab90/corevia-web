"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import {
  SectionReveal,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";

const OUTCOME_KEYS = ["saveTime", "gainControl", "growSmarter"] as const;

export function HomeOutcomes() {
  const t = useTranslations("Home.outcomes");

  return (
    <Section
      tone="white"
      spacing="md"
      aria-labelledby="home-outcomes-heading"
    >
      <Container size="xl">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <p className="text-caption font-semibold tracking-[0.14em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <Heading
            id="home-outcomes-heading"
            size="h2"
            align="center"
            className="mt-3 font-display tracking-tight"
          >
            {t("title")}
          </Heading>
          <p className="mt-4 font-sans text-body-lg text-muted-foreground">
            {t("description")}
          </p>
        </SectionReveal>

        <Stagger className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
          {OUTCOME_KEYS.map((key, index) => (
            <StaggerItem key={key}>
              <article className="h-full border-t border-border pt-6">
                <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-h3 tracking-tight text-foreground">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-3 font-sans text-body text-muted-foreground">
                  {t(`items.${key}.description`)}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
