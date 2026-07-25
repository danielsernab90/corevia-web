"use client";

import {
  AppWindow,
  ChartColumn,
  Cloud,
  Combine,
  Layers,
  Sparkles,
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
import { brandColors } from "@/lib/design-tokens";
import { coreviaIconProps } from "@/lib/icons";
import {
  serviceCategoryKeys,
  type ServiceCategoryKey,
} from "@/lib/services";

const categoryIcons: Record<ServiceCategoryKey, LucideIcon> = {
  software: Layers,
  ai: Sparkles,
  apps: AppWindow,
  integrations: Combine,
  dashboards: ChartColumn,
  cloud: Cloud,
};

export function ServicesCategories() {
  const t = useTranslations("Services.categories");

  return (
    <Section
      tone="dark"
      spacing="tight"
      aria-labelledby="services-categories-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%)]"
      />

      <Container size="xl" className="relative">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <Heading
            id="services-categories-heading"
            size="h2"
            align="center"
            className="tracking-tight glow-text-white-soft"
            style={{ color: "var(--secondary-foreground)" }}
          >
            {t("title")}
          </Heading>
          <p className="mt-4 font-sans text-body-lg text-secondary-foreground/75">
            {t("description")}
          </p>
        </SectionReveal>

        {/* Light cards on dark section — same contrast pattern as CTAs on Ready to Get Started */}
        <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategoryKeys.map((key) => {
            const Icon = categoryIcons[key];
            return (
              <StaggerItem key={key}>
                <CardHover className="h-full">
                  <Card variant="feature" className="h-full">
                    <CardHeader>
                      <span
                        className="mb-3 inline-flex size-11 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: brandColors.primarySoft,
                          color: brandColors.primary,
                        }}
                      >
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
