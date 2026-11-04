"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import {
  WorkLightbox,
  type LightboxImage,
} from "@/components/sections/work/work-lightbox";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { localizeText } from "@/lib/portfolio/localize";
import { getScreenshotGroup } from "@/lib/portfolio/registry";
import { getShotCaption } from "@/lib/portfolio/shot-captions";
import type { PortfolioProject } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { requestOpenBooking } from "@/lib/booking-events";
import { Button } from "@/components/ui/button";

type WorkProjectDetailProps = {
  project: PortfolioProject;
  /** When true, render as a standalone page section (not nested in portfolio). */
  standalone?: boolean;
};

export function WorkProjectDetail({
  project,
  standalone = false,
}: WorkProjectDetailProps) {
  const t = useTranslations("Work.portfolio");
  const locale = useLocale() as AppLocale;
  const [groupIndex, setGroupIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeGroup =
    project.screenshotGroups[groupIndex] ?? project.screenshotGroups[0];
  const shots = useMemo(
    () => (activeGroup ? getScreenshotGroup(project, activeGroup.id) : []),
    [activeGroup, project]
  );
  const current = shots[imageIndex] ?? shots[0];

  const lightboxImages: LightboxImage[] = shots.map((shot) => ({
    src: shot.src,
    alt: localizeText(shot.alt, locale),
    caption: (() => {
      const caption = getShotCaption(shot.assetId);
      return caption ? localizeText(caption, locale) : undefined;
    })(),
  }));

  const selectGroup = (next: number) => {
    setGroupIndex(next);
    setImageIndex(0);
  };

  const moveShot = (delta: number) => {
    if (shots.length === 0) return;
    setImageIndex((prev) => (prev + delta + shots.length) % shots.length);
  };

  if (!current || !activeGroup) {
    return null;
  }

  const caption = getShotCaption(current.assetId);
  const captionText = caption ? localizeText(caption, locale) : null;

  return (
    <article
      id={project.prototypeId}
      className={cn(
        "overflow-hidden rounded-[22px] border border-border bg-card",
        standalone && "mt-0"
      )}
    >
      <header className="bg-[#0c1c29] px-6 py-7 text-secondary-foreground md:px-8 md:py-8">
        <p className="text-caption font-semibold tracking-[0.14em] text-primary uppercase">
          {t("caseEyebrow", {
            project: localizeText(project.eyebrow, locale),
          })}
        </p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] tracking-tight">
          {localizeText(project.name, locale)}
        </h2>
        <p className="mt-2 text-sm tracking-[0.08em] text-[#abc1cf] uppercase">
          {localizeText(project.industry, locale)}
        </p>
        <p className="mt-4 max-w-3xl font-sans text-[15px] leading-relaxed text-[#c0d0d9]">
          {localizeText(project.detailedDescription, locale)}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={project.demo.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "cta" }))}
          >
            {t("demoCta")}
          </a>
          {!standalone ? (
            <Link
              href={`/work/${project.prototypeId}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "cta" }),
                "border-white/25 bg-transparent text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground"
              )}
            >
              {t("openCaseCta")}
            </Link>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="cta"
              className="border-white/25 bg-transparent text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground"
              onClick={requestOpenBooking}
            >
              {t("similarCta")}
            </Button>
          )}
        </div>

        <div
          role="tablist"
          aria-label={t("groupsLabel")}
          className="mt-6 flex flex-wrap gap-2"
        >
          {project.screenshotGroups.map((group, index) => {
            const selected = index === groupIndex;
            const count = group.screenshotAssetIds.length;
            return (
              <button
                key={group.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectGroup(index)}
                className={cn(
                  "rounded-lg border px-3.5 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  selected
                    ? "border-primary bg-primary font-semibold text-[#07121e]"
                    : "border-[#507185] bg-transparent text-[#a9c0ce] hover:border-primary/60 hover:text-white"
                )}
              >
                {localizeText(group.label, locale)} · {count}
              </button>
            );
          })}
        </div>
      </header>

      <div className="grid gap-5 p-4 md:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] md:gap-5 md:p-6">
        <div className="min-w-0 rounded-[14px] bg-[#0b1924] p-3">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="group relative block w-full overflow-hidden rounded-lg bg-[#06121c] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label={t("expandImage")}
          >
            <Image
              src={current.src}
              alt={localizeText(current.alt, locale)}
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, 65vw"
              className="aspect-[1.97] w-full object-contain object-center transition-opacity duration-300"
              priority={standalone || groupIndex === 0}
            />
            <span className="pointer-events-none absolute right-3 bottom-3 rounded-md bg-black/55 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              {t("expandHint")}
            </span>
          </button>

          <div
            role="tablist"
            aria-label={t("thumbsLabel")}
            className="mt-3 flex gap-2 overflow-x-auto pb-1"
          >
            {shots.map((shot, index) => {
              const selected = index === imageIndex;
              return (
                <button
                  key={shot.assetId}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={t("thumbAria", { index: index + 1 })}
                  onClick={() => setImageIndex(index)}
                  className={cn(
                    "w-[120px] shrink-0 rounded-[9px] border-2 bg-[#213849] p-0.5 transition-[opacity,border-color] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    selected
                      ? "border-primary opacity-100"
                      : "border-transparent opacity-70 hover:opacity-90"
                  )}
                >
                  <Image
                    src={shot.src}
                    alt=""
                    width={240}
                    height={120}
                    sizes="120px"
                    className="aspect-[2] w-full rounded-[5px] object-cover object-top"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <aside className="px-1 py-2 md:px-2">
          <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
            {localizeText(activeGroup.label, locale)}
          </p>
          <h3 className="mt-3 font-display text-[1.55rem] tracking-tight text-foreground">
            {captionText ??
              t("screenshotCounter", {
                current: imageIndex + 1,
                total: shots.length,
              })}
          </h3>
          {captionText ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {t("screenshotCounter", {
                current: imageIndex + 1,
                total: shots.length,
              })}
            </p>
          ) : null}
          <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">
            {t("galleryHelp")}
          </p>

          <ul className="mt-5 space-y-2">
            {project.featureHighlights.map((feature) => (
              <li
                key={feature.en}
                className="flex items-start gap-2 text-sm text-foreground/90"
              >
                <span
                  aria-hidden
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                />
                {localizeText(feature, locale)}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => moveShot(-1)}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              {t("previous")}
            </button>
            <button
              type="button"
              onClick={() => moveShot(1)}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              {t("next")}
            </button>
          </div>

          <div className="mt-5 rounded-[10px] border border-border bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">
              {t("statusLabel")}
            </strong>{" "}
            {localizeText(project.demo.statusLabel, locale)}.{" "}
            {localizeText(project.demo.disclaimer, locale)}
          </div>

          {standalone ? (
            <div className="mt-6">
              <Link
                href="/work"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                {t("backToLibrary")}
              </Link>
            </div>
          ) : null}
        </aside>
      </div>

      <WorkLightbox
        open={lightboxOpen}
        images={lightboxImages}
        index={imageIndex}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setImageIndex}
        labels={{
          dialog: t("lightboxDialog"),
          close: t("lightboxClose"),
          previous: t("lightboxPrevious"),
          next: t("lightboxNext"),
          counter: t("lightboxCounter"),
        }}
      />
    </article>
  );
}
