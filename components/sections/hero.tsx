import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HeroContent } from "@/components/sections/hero-content";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <Section
      tone="hero"
      spacing="none"
      aria-labelledby="hero-heading"
      className="relative overflow-x-clip"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-hero-glow"
      />
      {/* Soft ambient depth — simplified on small screens for paint cost */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[12%] right-[-10%] -z-10 hidden h-[70%] w-[70%] max-w-[52rem] rounded-full bg-[radial-gradient(ellipse_at_center,var(--surface)_0%,transparent_68%)] opacity-90 blur-3xl md:block sm:right-[-5%] sm:w-[60%] lg:right-[-8%] lg:w-[55%]"
      />

      <Container
        size="xl"
        className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-14 md:py-16 lg:py-20 xl:py-24"
      >
        <HeroContent
          badge={t("badge")}
          title={t("title")}
          description={t("description")}
          primaryCta={t("primaryCta")}
          secondaryCta={t("secondaryCta")}
          trustItems={[
            t("trust.customSoftware"),
            t("trust.aiSolutions"),
            t("trust.webMobile"),
            t("trust.automation"),
            t("trust.integrations"),
            t("trust.growth"),
          ]}
        />
      </Container>
    </Section>
  );
}
