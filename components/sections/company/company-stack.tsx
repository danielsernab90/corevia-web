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
import { brandColors } from "@/lib/design-tokens";
import { companyStackKeys } from "@/lib/company";

export function CompanyStack() {
  const t = useTranslations("Company.stack");

  return (
    <Section
      tone="surface"
      spacing="tight"
      aria-labelledby="company-stack-heading"
    >
      <Container size="md">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <Heading
            id="company-stack-heading"
            size="h2"
            align="center"
            className="tracking-tight glow-text-brand-soft"
          >
            {t("title")}
          </Heading>
          <p className="mt-4 font-sans text-body-lg text-muted-foreground">
            {t("builds")}
          </p>
          <p className="mt-3 font-sans text-body text-muted-foreground">
            {t("benefit")}
          </p>
        </SectionReveal>

        <Stagger className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-3">
          {companyStackKeys.map((key) => (
            <StaggerItem key={key}>
              <span
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: brandColors.primarySoft,
                  color: brandColors.primary,
                  boxShadow: "0 0 16px rgba(22, 82, 240, 0.2)",
                }}
              >
                {t(`items.${key}`)}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
