"use client";

import { ArrowDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import {
  FadeUp,
  SectionReveal,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import type { AppLocale } from "@/i18n/routing";
import { processStepKeys } from "@/lib/consultation";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function HowItWorks() {
  const t = useTranslations("BookConsultation.process");
  const locale = useLocale() as AppLocale;
  const whatsappHref = buildWhatsAppLink(locale);

  return (
    <Section tone="surface" spacing="tight" aria-labelledby="process-heading">
      <Container size="md">
        <SectionReveal className="mx-auto w-full max-w-2xl text-center">
          <Heading
            id="process-heading"
            size="h2"
            align="center"
            className="tracking-tight"
          >
            {t("title")}
          </Heading>
          <p className="mt-4 text-center text-muted-foreground">
            <span className="font-medium text-foreground">
              {t("durationLabel")}
            </span>{" "}
            {t("duration")}
          </p>
        </SectionReveal>

        <Stagger className="mx-auto mt-10 max-w-lg">
          {processStepKeys.map((key, index) => (
            <StaggerItem key={key}>
              <div className="flex flex-col items-center">
                <div className="w-full rounded-2xl border border-border bg-background p-5 text-center elevation-sm sm:p-6">
                  <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
                    {t("stepLabel", { number: index + 1 })}
                  </p>
                  <p className="mt-2 font-sans text-lg font-semibold text-foreground">
                    {t(`steps.${key}`)}
                  </p>
                </div>
                {index < processStepKeys.length - 1 ? (
                  <ArrowDown
                    aria-hidden
                    className="my-3 size-5 text-muted-foreground"
                  />
                ) : null}
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeUp className="mt-8 flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {t("durationLabel")}
            </span>
            <span className="mx-2 text-border">·</span>
            {t("duration")}
          </span>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-md text-caption leading-relaxed text-muted-foreground underline-offset-4 transition-colors hover:text-foreground"
          >
            {t.rich("whatsappNote", {
              wa: (chunks) => (
                <span className="font-medium text-primary underline underline-offset-4">
                  {chunks}
                </span>
              ),
            })}
          </a>
        </FadeUp>
      </Container>
    </Section>
  );
}
