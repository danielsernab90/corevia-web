"use client";

import {
  AppWindow,
  ChartColumn,
  Combine,
  Layers,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
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
import { coreviaIconProps } from "@/lib/icons";
import {
  serviceGroupExamples,
  serviceGroupKeys,
  type ServiceGroupKey,
} from "@/lib/services";
import { cn } from "@/lib/utils";

const groupIcons: Record<ServiceGroupKey, LucideIcon> = {
  customSoftware: Layers,
  aiAutomation: Sparkles,
  dashboards: ChartColumn,
  websites: AppWindow,
  integrations: Combine,
  digitalGrowth: Target,
};

export function ServicesCategories() {
  const t = useTranslations("Services.groups");

  return (
    <Section
      tone="white"
      spacing="md"
      aria-labelledby="services-groups-heading"
    >
      <Container size="xl">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <p className="text-caption font-semibold tracking-[0.14em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <Heading
            id="services-groups-heading"
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

        <Stagger className="mt-12 space-y-8">
          {serviceGroupKeys.map((key, index) => {
            const Icon = groupIcons[key];
            const examples = serviceGroupExamples[key];
            return (
              <StaggerItem key={key}>
                <article
                  id={key}
                  className="scroll-mt-28 border-t border-border pt-8 md:grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] md:gap-10 lg:gap-14"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-primary">
                        <Icon className="size-5" {...coreviaIconProps} />
                      </span>
                      <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                    </div>
                    <h3 className="mt-4 font-display text-h2 tracking-tight text-foreground">
                      {t(`items.${key}.title`)}
                    </h3>
                    <p className="mt-3 font-sans text-body text-muted-foreground">
                      {t(`items.${key}.summary`)}
                    </p>
                    <Link
                      href="/book-consultation"
                      className={cn(
                        buttonVariants({ size: "cta" }),
                        "mt-6 inline-flex"
                      )}
                    >
                      {t("cta")}
                    </Link>
                  </div>

                  <div className="mt-6 space-y-5 md:mt-0">
                    <DetailBlock
                      label={t("labels.problems")}
                      body={t(`items.${key}.problems`)}
                    />
                    <DetailBlock
                      label={t("labels.who")}
                      body={t(`items.${key}.who`)}
                    />
                    <DetailBlock
                      label={t("labels.build")}
                      body={t(`items.${key}.build`)}
                    />
                    <div>
                      <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
                        {t("labels.examples")}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {examples.map((example) => (
                          <li key={example.labelKey}>
                            <Link
                              href={`/work/${example.prototypeId}`}
                              className="inline-flex rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                            >
                              {t(`examples.${example.labelKey}`)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}

function DetailBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-caption font-semibold tracking-[0.12em] text-foreground/70 uppercase">
        {label}
      </p>
      <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}
