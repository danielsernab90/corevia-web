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
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const SOLUTION_KEYS = [
  "customSoftware",
  "aiAutomation",
  "dashboards",
  "websites",
  "integrations",
  "digitalGrowth",
] as const;

export function HomeSolutions() {
  const t = useTranslations("Home.solutions");

  return (
    <Section
      tone="white"
      spacing="md"
      aria-labelledby="home-solutions-heading"
    >
      <Container size="xl">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <p className="text-caption font-semibold tracking-[0.14em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <Heading
            id="home-solutions-heading"
            size="h2"
            align="center"
            className="mt-3 font-display tracking-tight"
          >
            {t("title")}
          </Heading>
          <p className="mt-4 font-sans text-body-lg text-muted-foreground">
            {t("description")}
          </p>
        </SectionReveal>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTION_KEYS.map((key, index) => (
            <StaggerItem key={key}>
              <article className="flex h-full flex-col border-l-2 border-primary/40 bg-muted/40 px-5 py-6 transition-colors hover:bg-muted/70">
                <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-h3 tracking-tight text-foreground">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${key}.description`)}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <SectionReveal className="mt-10 flex justify-center">
          <Link
            href="/services"
            className={cn(buttonVariants({ variant: "outline", size: "cta" }))}
          >
            {t("cta")}
          </Link>
        </SectionReveal>
      </Container>
    </Section>
  );
}
