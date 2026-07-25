"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { SectionReveal } from "@/components/shared/motion";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqKeys } from "@/lib/consultation";

export function ConsultationFaq() {
  const t = useTranslations("BookConsultation.faq");

  return (
    <Section tone="white" spacing="tight" aria-labelledby="faq-heading">
      <Container size="md">
        <SectionReveal>
          <Heading
            id="faq-heading"
            size="h2"
            align="center"
            className="tracking-tight"
          >
            {t("title")}
          </Heading>
        </SectionReveal>

        <SectionReveal className="mt-8 rounded-2xl border border-border bg-card px-5 sm:px-6 elevation-sm">
          <Accordion>
            {faqKeys.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger>
                  {t(`items.${key}.question`)}
                </AccordionTrigger>
                <AccordionPanel>{t(`items.${key}.answer`)}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </SectionReveal>
      </Container>
    </Section>
  );
}
