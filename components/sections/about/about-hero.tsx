"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { SectionReveal } from "@/components/shared/motion";

/** Full horizontal 3D wordmark for dark heroes (1024×341 intrinsic). */
const HERO_LOGO_WIDTH = 220;
const HERO_LOGO_HEIGHT = 73;

export function AboutHero() {
  const t = useTranslations("About.hero");
  const tCommon = useTranslations("Common");

  return (
    <Section
      tone="dark"
      spacing="none"
      aria-labelledby="about-hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%)]"
      />
      <Container
        size="xl"
        className="relative flex min-h-[min(52dvh,28rem)] flex-col justify-center py-14 md:py-16 lg:py-20"
      >
        <SectionReveal className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <Image
            src="/logos/corevia-logo-3d-white.png"
            alt={tCommon("brand")}
            width={HERO_LOGO_WIDTH}
            height={HERO_LOGO_HEIGHT}
            priority
            className="h-auto w-[min(11.5rem,55vw)] object-contain sm:w-[13.75rem]"
          />
          <p className="mt-6 text-caption font-semibold tracking-[0.12em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <Heading
            id="about-hero-heading"
            size="h1"
            align="center"
            className="mt-4 tracking-tight glow-text-white-soft"
            style={{ color: "var(--secondary-foreground)" }}
          >
            {t.rich("title", {
              break: () => <br />,
            })}
          </Heading>
        </SectionReveal>
      </Container>
    </Section>
  );
}
