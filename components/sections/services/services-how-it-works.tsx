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
import { serviceProcessKeys } from "@/lib/services";

export function ServicesHowItWorks() {
  const t = useTranslations("Services.process");

  return (
    <Section
      tone="muted"
      spacing="md"
      aria-labelledby="services-process-heading"
    >
      <Container size="xl">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <p className="text-caption font-semibold tracking-[0.14em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <Heading
            id="services-process-heading"
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

        <Stagger className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {serviceProcessKeys.map((key, index) => (
            <StaggerItem key={key}>
              <article>
                <div className="flex size-10 items-center justify-center rounded-full border border-primary/30 bg-card font-display text-sm text-primary">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 font-display text-h3 tracking-tight text-foreground">
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                  {t(`steps.${key}.description`)}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
