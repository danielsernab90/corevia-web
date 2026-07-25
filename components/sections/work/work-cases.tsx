"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import {
  FadeUp,
  SectionReveal,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import { brandColors } from "@/lib/design-tokens";
import {
  workCaseImages,
  workCaseKeys,
} from "@/lib/work";

const tagKeys = ["0", "1", "2"] as const;

export function WorkCases() {
  const t = useTranslations("Work.cases");

  return (
    <Section
      tone="surface"
      spacing="tight"
      aria-labelledby="work-cases-heading"
    >
      <Container size="xl">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <Heading
            id="work-cases-heading"
            size="h2"
            align="center"
            className="tracking-tight glow-text-brand-soft"
          >
            {t("title")}
          </Heading>
          <p className="mt-4 font-sans text-body-lg text-muted-foreground">
            {t("description")}
          </p>
        </SectionReveal>

        <Stagger className="mt-12 space-y-12 md:mt-14 md:space-y-16">
          {workCaseKeys.map((key, index) => {
            const reverse = index % 2 === 1;
            const tags = tagKeys.map((tagKey) =>
              t(`items.${key}.tags.${tagKey}`)
            );

            return (
              <StaggerItem key={key}>
                <FadeUp>
                  <article
                    className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
                      reverse ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div className="rounded-2xl glow-brand-soft">
                      <div className="overflow-hidden rounded-2xl border border-border bg-card">
                        <Image
                          src={workCaseImages[key]}
                          alt={t(`items.${key}.imageAlt`)}
                          width={1672}
                          height={941}
                          className="h-auto w-full object-cover object-top"
                          sizes="(max-width: 1023px) 100vw, 50vw"
                          priority={index === 0}
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
                        {t(`items.${key}.category`)}
                      </p>
                      <h3 className="mt-3 font-sans text-h3 font-semibold tracking-tight text-foreground">
                        {t(`items.${key}.title`)}
                      </h3>
                      <p className="mt-3 text-body leading-relaxed text-muted-foreground">
                        {t(`items.${key}.outcome`)}
                      </p>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <li
                            key={tag}
                            className="inline-flex items-center rounded-full px-3 py-1.5 text-caption font-medium"
                            style={{
                              backgroundColor: brandColors.primarySoft,
                              color: brandColors.primary,
                            }}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </FadeUp>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}
