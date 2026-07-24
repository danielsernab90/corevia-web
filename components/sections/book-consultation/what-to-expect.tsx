"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { FadeUp, SectionReveal } from "@/components/shared/motion";

const expectKeys = ["learn", "identify", "answer", "share"] as const;

export function WhatToExpect() {
  const t = useTranslations("BookConsultation.expect");

  return (
    <Section tone="white" spacing="md" aria-labelledby="expect-heading">
      <Container size="md">
        <SectionReveal>
          <Heading id="expect-heading" size="h2" align="center" className="tracking-tight">
            {t("title")}
          </Heading>
          <p className="mx-auto mt-4 max-w-2xl text-center font-sans text-body-lg text-muted-foreground">
            {t("intro")}
          </p>
        </SectionReveal>

        <FadeUp className="mt-8 rounded-2xl border border-border bg-surface/60 p-6 sm:p-8 elevation-sm">
          <p className="font-medium text-foreground">{t("during")}</p>
          <ul className="mt-5 space-y-4">
            {expectKeys.map((key) => (
              <li key={key} className="flex gap-3 text-muted-foreground">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Check className="size-3.5" aria-hidden />
                </span>
                <span className="leading-relaxed">{t(`items.${key}`)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
            {t("closing")}
          </p>
        </FadeUp>
      </Container>
    </Section>
  );
}
