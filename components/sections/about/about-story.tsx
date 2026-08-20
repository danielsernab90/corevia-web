"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { FadeUp, SectionReveal } from "@/components/shared/motion";

const CHAPTER_KEYS = ["military", "filmmaking", "return"] as const;

export function AboutStory() {
  const t = useTranslations("About");

  return (
    <Section
      tone="surface"
      spacing="tight"
      aria-labelledby="about-intro-heading"
    >
      <Container size="md">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12 lg:gap-14">
          <FadeUp className="mx-auto w-full max-w-sm md:mx-0 md:max-w-none">
            <div className="overflow-hidden rounded-2xl glow-consultation-visual">
              <Image
                src="/images/about-founder.jpg"
                alt={t("intro.imageAlt")}
                width={1600}
                height={1035}
                priority
                sizes="(max-width: 768px) 90vw, 360px"
                className="h-auto w-full object-cover object-[center_20%]"
              />
            </div>
          </FadeUp>

          <SectionReveal>
            <h2 id="about-intro-heading" className="sr-only">
              {t("meta.title")}
            </h2>
            <p className="font-sans text-body-lg text-muted-foreground">
              {t("intro.body")}
            </p>
          </SectionReveal>
        </div>

        <div className="mt-14 space-y-12 md:mt-16 md:space-y-14">
          {CHAPTER_KEYS.map((key) => (
            <SectionReveal key={key} className="mx-auto max-w-2xl">
              <Heading
                size="h3"
                className="tracking-tight glow-text-brand-soft"
              >
                {t(`chapters.${key}.title`)}
              </Heading>
              <p className="mt-4 font-sans text-body text-muted-foreground">
                {t(`chapters.${key}.body`)}
              </p>
            </SectionReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
