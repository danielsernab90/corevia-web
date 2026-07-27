import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HeroChecklist } from "@/components/sections/hero-checklist";
import { HeroContent } from "@/components/sections/hero-content";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <Section
      tone="hero"
      spacing="none"
      aria-labelledby="hero-heading"
      className="relative overflow-visible"
    >
      {/* Clip only decorative bleed — keep the devices glow from being cropped */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-x-clip">
        <div className="absolute inset-0 bg-hero-glow" />
        {/* Soft ambient depth — simplified on small screens for paint cost */}
        <div className="absolute top-[12%] right-[-10%] hidden h-[70%] w-[70%] max-w-[52rem] rounded-full bg-[radial-gradient(ellipse_at_center,var(--surface)_0%,transparent_68%)] opacity-90 blur-3xl md:block sm:right-[-5%] sm:w-[60%] lg:right-[-8%] lg:w-[55%]" />
      </div>
      <Container
        size="xl"
        className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-14 md:py-16 lg:py-20 xl:py-24"
      >
        <HeroContent
          badge={t("badge")}
          title={t("title")}
          description={t("description")}
          dedicatedGuidance={t("dedicatedGuidance")}
          primaryCta={t("primaryCta")}
          secondaryCta={t("secondaryCta")}
          whatsappCta={t("whatsappCta")}
        />
      </Container>

      <HeroChecklist
        items={[
          t("trust.automate"),
          t("trust.organize"),
          t("trust.revenue"),
          t("trust.saveTime"),
          t("trust.visibility"),
          t("trust.neverMiss"),
        ]}
      />
    </Section>
  );
}
