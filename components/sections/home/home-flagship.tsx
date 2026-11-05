"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionReveal } from "@/components/shared/motion";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getFlagshipNarrativeScreenshots } from "@/lib/portfolio/home-flagship";
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
  const previews = useMemo(() => getFlagshipNarrativeScreenshots(), []);
  const [active, setActive] = useState(0);
  const current = previews[active] ?? previews[0];
  const groupLabel = localizeText(current.groupLabel, locale);

  const go = (delta: number) => {
    setActive((prev) => {
      const next = prev + delta;
      if (next < 0) return previews.length - 1;
      if (next >= previews.length) return 0;
      return next;
    });
  };

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
                href={`/work/${project.prototypeId}`}
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
              <span className="ml-3 truncate text-[10px] text-[#93aab9]">
                {groupLabel}
              </span>
            </div>
            <div className="relative mt-1 overflow-hidden rounded-[9px] bg-[#0b1a24]">
              <Image
                src={current.src}
                alt={localizeText(current.alt, locale)}
                width={1600}
                height={900}
                priority={active === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="aspect-[1.98] w-full object-contain object-top"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[#07131de6] to-transparent px-3 pb-2.5 pt-8">
                <p className="pointer-events-none text-[11px] text-[#d7e4ec]">
                  {t("stepLabel", {
                    current: active + 1,
                    total: previews.length,
                  })}
                  <span className="text-[#93aab9]"> · {groupLabel}</span>
                </p>
              </div>
              <div className="absolute top-1/2 right-2 left-2 flex -translate-y-1/2 justify-between">
                <button
                  type="button"
                  aria-label={t("previous")}
                  onClick={() => go(-1)}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-[#132633cc] text-lg text-white transition-colors hover:bg-[#1c3647] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label={t("next")}
                  onClick={() => go(1)}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-[#132633cc] text-lg text-white transition-colors hover:bg-[#1c3647] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  ›
                </button>
              </div>
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
                      "min-w-[88px] max-w-[100px] shrink-0 rounded-[9px] border-2 bg-[#223746] p-0.5 opacity-70 transition-[opacity,border-color]",
                      "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      selected && "border-primary opacity-100",
                      !selected && "border-transparent hover:opacity-90"
                    )}
                  >
                    <Image
                      src={shot.src}
                      alt=""
                      width={200}
                      height={102}
                      sizes="100px"
                      loading="lazy"
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
