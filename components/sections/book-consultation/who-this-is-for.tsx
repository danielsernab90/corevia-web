"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import {
  SectionReveal,
  StaggerGrid,
  StaggerItem,
} from "@/components/shared/motion";
import { audienceKeys } from "@/lib/consultation";

export function WhoThisIsFor() {
  const t = useTranslations("BookConsultation.audience");

  return (
    <Section tone="white" spacing="tight" aria-labelledby="audience-heading">
      <Container size="xl">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
          <SectionReveal className="w-full max-w-2xl text-center">
            <Heading
              id="audience-heading"
              size="h2"
              align="center"
              className="tracking-tight glow-text-brand-soft"
            >
              {t("title")}
            </Heading>
            <p className="mt-4 font-sans text-body-lg text-muted-foreground">
              {t("description")}
            </p>
          </SectionReveal>

          <StaggerGrid className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {audienceKeys.map((key) => (
              <StaggerItem key={key} className="h-full min-w-0">
                <div className="glow-brand-soft flex h-full min-h-14 items-center justify-center rounded-xl border border-border bg-card px-4 py-5 text-center text-sm font-medium text-foreground transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:glow-brand-soft-strong">
                  {t(`items.${key}`)}
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </Container>
    </Section>
  );
}
