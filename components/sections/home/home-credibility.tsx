"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { SectionReveal } from "@/components/shared/motion";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function HomeCredibility() {
  const t = useTranslations("Home.credibility");

  return (
    <Section
      tone="white"
      spacing="md"
      aria-labelledby="home-credibility-heading"
    >
      <Container size="xl">
        <SectionReveal className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div>
            <p className="text-caption font-semibold tracking-[0.14em] text-primary uppercase">
              {t("eyebrow")}
            </p>
            <Heading
              id="home-credibility-heading"
              size="h2"
              className="mt-3 font-display tracking-tight"
            >
              {t("title")}
            </Heading>
            <p className="mt-4 font-sans text-body-lg text-muted-foreground">
              {t("description")}
            </p>
            <p className="mt-4 font-sans text-body text-muted-foreground">
              {t("body")}
            </p>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: "outline", size: "cta" }),
                "mt-8 inline-flex"
              )}
            >
              {t("cta")}
            </Link>
          </div>
          <aside className="border border-border bg-muted/50 p-6 md:p-8">
            <p className="font-display text-h3 tracking-tight text-foreground">
              {t("asideTitle")}
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
              {t("asideBody")}
            </p>
          </aside>
        </SectionReveal>
      </Container>
    </Section>
  );
}
