"use client";

import {
  ClipboardList,
  Map,
  Sparkles,
  WalletCards,
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
import { outcomeKeys } from "@/lib/consultation";
import { coreviaIconProps } from "@/lib/icons";

const outcomeIcons: Record<(typeof outcomeKeys)[number], LucideIcon> = {
  assessment: ClipboardList,
  aiAnalysis: Sparkles,
  roadmap: Map,
  estimate: WalletCards,
};

export function Outcomes() {
  const t = useTranslations("BookConsultation.outcomes");

  return (
    <Section tone="surface" spacing="tight" aria-labelledby="outcomes-heading">
      <Container size="xl">
        <SectionReveal>
          <Heading
            id="outcomes-heading"
            size="h2"
            align="center"
            className="tracking-tight"
          >
            {t("title")}
          </Heading>
        </SectionReveal>

        <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {outcomeKeys.map((key) => {
            const Icon = outcomeIcons[key];
            return (
              <StaggerItem key={key}>
                <CardHover className="h-full rounded-xl glow-outcome-card">
                  <Card variant="feature" className="h-full">
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
