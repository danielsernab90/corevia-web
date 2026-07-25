"use client";

import {
  BadgeCheck,
  Compass,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import {
  CardHover,
  SectionReveal,
  StaggerGrid,
  StaggerItem,
} from "@/components/shared/motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trustKeys } from "@/lib/consultation";
import { coreviaIconProps } from "@/lib/icons";

const trustIcons: Record<(typeof trustKeys)[number], LucideIcon> = {
  personalized: BadgeCheck,
  noObligation: ShieldCheck,
  actionable: Compass,
};

export function TrustSection() {
  const t = useTranslations("BookConsultation.trust");

  return (
    <Section
      tone="gradient"
      spacing="tight"
      aria-labelledby="trust-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_55%)]"
      />

      <Container size="xl" className="relative">
        <SectionReveal>
          <Heading
            id="trust-heading"
            size="h2"
            align="center"
            className="tracking-tight"
          >
            {t("title")}
          </Heading>
        </SectionReveal>

        <StaggerGrid className="mt-10 grid gap-5 md:grid-cols-3">
          {trustKeys.map((key) => {
            const Icon = trustIcons[key];
            return (
              <StaggerItem key={key}>
                <CardHover className="h-full">
                  <Card variant="glass" className="h-full elevation-md">
                    <CardHeader>
                      <span className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                        <Icon className="size-5" {...coreviaIconProps} />
                      </span>
                      <CardTitle className="text-base font-semibold">
                        {t(`items.${key}.title`)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="leading-relaxed">
                        {t(`items.${key}.description`)}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </CardHover>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </Container>
    </Section>
  );
}
