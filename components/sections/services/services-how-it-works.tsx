"use client";

import { ArrowDown } from "lucide-react";
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
      tone="white"
      spacing="tight"
      aria-labelledby="services-process-heading"
    >
      <Container size="md">
        <SectionReveal className="mx-auto w-full max-w-2xl text-center">
          <Heading
            id="services-process-heading"
            size="h2"
            align="center"
            className="tracking-tight glow-text-brand-soft"
          >
            {t("title")}
          </Heading>
          <p className="mt-4 text-center text-muted-foreground">
            {t("description")}
          </p>
        </SectionReveal>

        <Stagger className="mx-auto mt-10 max-w-lg">
          {serviceProcessKeys.map((key, index) => (
            <StaggerItem key={key}>
              <div className="flex flex-col items-center">
                <div className="w-full rounded-2xl border border-border bg-card p-5 text-center shadow-[0_0_24px_rgb(22_82_240/0.4),0_0_48px_rgb(22_82_240/0.22)] sm:p-6">
                  <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
                    {t("stepLabel", { number: index + 1 })}
                  </p>
                  <p className="mt-2 font-sans text-lg font-semibold text-foreground">
                    {t(`steps.${key}.title`)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`steps.${key}.description`)}
                  </p>
                </div>
                {index < serviceProcessKeys.length - 1 ? (
                  <ArrowDown
                    aria-hidden
                    className="my-3 size-5 text-muted-foreground"
                  />
                ) : null}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
