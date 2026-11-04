"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionReveal } from "@/components/shared/motion";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { FLAGSHIP_PREVIEW_ASSET_IDS } from "@/lib/portfolio/home-flagship";
import { localizeText } from "@/lib/portfolio/localize";
import { getFlagshipProject } from "@/lib/portfolio/registry";
import { cn } from "@/lib/utils";

const HIGHLIGHT_KEYS = [
  "crm",
  "estimates",
  "projects",
  "scheduling",
  "workforce",
  "reporting",
  "portal",
  "aiReception",
] as const;

export function HomeFlagship() {
  const t = useTranslations("Home.flagship");
  const locale = useLocale() as AppLocale;
  const project = getFlagshipProject();
  const previews = FLAGSHIP_PREVIEW_ASSET_IDS.map((assetId) => {
    const shot = project.screenshots.find((item) => item.assetId === assetId);
    if (!shot) {
      throw new Error(`Missing flagship preview asset ${assetId}`);
    }
    return shot;
  });
  const [active, setActive] = useState(0);
  const current = previews[active] ?? previews[0];

  return (
    <Section
      id="featured"
      tone="dark"
      spacing="md"
      aria-labelledby="home-flagship-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_50%)]"
      />

      <Container size="xl" className="relative">
        <SectionReveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-caption font-semibold tracking-[0.14em] text-primary uppercase">
              {t("eyebrow")}
            </p>
            <h2
              id="home-flagship-heading"
              className="mt-3 font-display text-display tracking-tight text-secondary-foreground"
            >
              {t.rich("title", {
                br: () => <br />,
              })}
            </h2>
          </div>
          <p className="max-w-md font-sans text-body text-[#b4c4ce] lg:pb-1">
            {t("description")}
          </p>
        </SectionReveal>

        <SectionReveal className="mt-12 grid items-center gap-10 lg:mt-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:gap-12">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] tracking-[0.13em] text-[#abc1cf] uppercase">
              <span>{t("metaFlagship")}</span>
              <span aria-hidden>·</span>
              <span>{t("metaOs")}</span>
            </div>
            <h3 className="mt-4 font-display text-[clamp(2.25rem,4vw,3.75rem)] tracking-tight text-secondary-foreground">
              {localizeText(project.name, locale)}.
            </h3>
            <p className="mt-4 max-w-md font-sans text-[15px] leading-relaxed text-[#aabcc8]">
              {t("summary")}
            </p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {HIGHLIGHT_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-2 text-sm text-[#c0d0d9]"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  {t(`highlights.${key}`)}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={`/work#${project.prototypeId}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "cta" }),
                  "border-white/25 bg-transparent text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground"
                )}
              >
                {t("exploreCta")}
              </Link>
              <a
                href={project.demo.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "cta" }))}
              >
                {t("demoCta")}
              </a>
            </div>
            <p className="mt-4 text-[11px] text-[#8ea8b9]">
              {localizeText(project.demo.disclaimer, locale)}
            </p>
          </div>

          <div className="min-w-0 rounded-[18px] border border-white/15 bg-[linear-gradient(150deg,#20374b,#07131d)] p-3 shadow-[0_27px_80px_rgb(0_0_0/0.45)]">
            <div className="flex h-6 items-center gap-1.5 px-1.5">
              <span className="size-1.5 rounded-full bg-[#66869b]" />
              <span className="size-1.5 rounded-full bg-[#66869b]" />
              <span className="size-1.5 rounded-full bg-[#66869b]" />
              <span className="ml-3 text-[10px] text-[#93aab9]">
                {t("browserLabel")}
              </span>
            </div>
            <div className="relative mt-1 overflow-hidden rounded-[9px] bg-[#152b3b]">
              <Image
                src={current.src}
                alt={localizeText(current.alt, locale)}
                width={1600}
                height={900}
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="aspect-[1.98] w-full object-cover object-top transition-[opacity] duration-300"
              />
            </div>
            <div
              role="tablist"
              aria-label={t("thumbsLabel")}
              className="mt-3 flex gap-2 overflow-x-auto pb-1"
            >
              {previews.map((shot, index) => {
                const selected = index === active;
                return (
                  <button
                    key={shot.assetId}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={t("thumbAria", { index: index + 1 })}
                    onClick={() => setActive(index)}
                    className={cn(
                      "min-w-[105px] max-w-[115px] shrink-0 rounded-[9px] border-2 bg-[#223746] p-0.5 opacity-70 transition-[opacity,border-color]",
                      "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      selected && "border-primary opacity-100",
                      !selected && "border-transparent hover:opacity-90"
                    )}
                  >
                    <Image
                      src={shot.src}
                      alt=""
                      width={230}
                      height={118}
                      sizes="115px"
                      className="aspect-[1.95] w-full rounded-[5px] object-cover object-top"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </SectionReveal>
      </Container>
    </Section>
  );
}
