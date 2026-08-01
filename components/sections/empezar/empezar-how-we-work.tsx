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

const stepKeys = ["learn", "design", "build"] as const;

export function EmpezarHowWeWork() {
  const t = useTranslations("Empezar.process");

  return (
    <Section
      tone="white"
      spacing="tight"
      aria-labelledby="empezar-process-heading"
    >
      <Container size="lg">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <Heading
            id="empezar-process-heading"
            size="h2"
            align="center"
            className="tracking-tight glow-text-brand-soft"
          >
            {t("title")}
          </Heading>
        </SectionReveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {stepKeys.map((key, index) => (
            <StaggerItem key={key}>
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
                  {t("stepLabel", { number: index + 1 })}
                </p>
                <p className="mt-3 max-w-xs font-sans text-lg font-semibold tracking-tight text-foreground md:max-w-none">
                  {t(`steps.${key}`)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
