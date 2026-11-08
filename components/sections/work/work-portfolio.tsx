"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { SectionReveal } from "@/components/shared/motion";
import { WorkProjectDetail } from "@/components/sections/work/work-project-detail";
import { buttonVariants } from "@/components/ui/button";
import type { AppLocale } from "@/i18n/routing";
import { localizeText } from "@/lib/portfolio/localize";
import {
  getCoverScreenshot,
  getHomepageProjects,
  portfolioCategories,
} from "@/lib/portfolio/registry";
import type { PortfolioCategoryId, PortfolioProject } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const FILTER_IDS = ["all", "websites", "software", "commerce"] as const;

type FilterId = (typeof FILTER_IDS)[number];

function isFilterId(value: string): value is FilterId {
  return (FILTER_IDS as readonly string[]).includes(value);
}

function matchesFilter(project: PortfolioProject, filter: FilterId): boolean {
  if (filter === "all") return true;
  return project.categoryTags.includes(filter);
}

type WorkPortfolioProps = {
  /** Prefill selected project from a dedicated route. */
  initialPrototypeId?: string;
  /** Hide the project grid when rendering a dedicated case study page. */
  detailOnly?: boolean;
};

export function WorkPortfolio({
  initialPrototypeId,
  detailOnly = false,
}: WorkPortfolioProps = {}) {
  const t = useTranslations("Work.portfolio");
  const locale = useLocale() as AppLocale;
  const projects = useMemo(() => getHomepageProjects(), []);
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeId, setActiveId] = useState(
    initialPrototypeId ?? projects[0]?.prototypeId ?? "summit"
  );

  const filtered = useMemo(
    () => projects.filter((project) => matchesFilter(project, filter)),
    [filter, projects]
  );

  const activeProject =
    projects.find((project) => project.prototypeId === activeId) ??
    filtered[0] ??
    projects[0];

  useEffect(() => {
    if (initialPrototypeId || detailOnly) return;
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      if (projects.some((project) => project.prototypeId === hash)) {
        setActiveId(hash);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [detailOnly, initialPrototypeId, projects]);

  useEffect(() => {
    if (detailOnly || initialPrototypeId) return;
    if (!activeProject) return;
    if (window.location.hash.replace(/^#/, "") === activeProject.prototypeId) {
      return;
    }
    // Keep URL shareable without fighting browser history for every click.
  }, [activeProject, detailOnly, initialPrototypeId]);

  const selectProject = (prototypeId: string) => {
    setActiveId(prototypeId);
    if (!detailOnly) {
      const url = `${window.location.pathname}${window.location.search}#${prototypeId}`;
      window.history.replaceState(null, "", url);
      window.requestAnimationFrame(() => {
        document
          .getElementById(prototypeId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  if (detailOnly && activeProject) {
    return (
      <Section tone="muted" spacing="md" aria-labelledby="work-detail-heading">
        <Container size="xl">
          <h2 id="work-detail-heading" className="sr-only">
            {localizeText(activeProject.name, locale)}
          </h2>
          <WorkProjectDetail project={activeProject} standalone />
        </Container>
      </Section>
    );
  }

  return (
    <Section
      id="projects"
      tone="white"
      spacing="md"
      aria-labelledby="work-portfolio-heading"
    >
      <Container size="xl">
        <SectionReveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-caption font-semibold tracking-[0.14em] text-primary uppercase">
              {t("eyebrow")}
            </p>
            <Heading
              id="work-portfolio-heading"
              size="h2"
              className="mt-3 font-display tracking-tight"
            >
              {t("title")}
            </Heading>
          </div>
          <p className="max-w-md font-sans text-body text-muted-foreground md:pb-1">
            {t("description")}
          </p>
        </SectionReveal>

        <div
          role="toolbar"
          aria-label={t("filtersLabel")}
          className="mt-8 flex flex-wrap gap-2"
        >
          {portfolioCategories.map((category) => {
            if (!isFilterId(category.id)) return null;
            const selected = filter === category.id;
            const label =
              locale === "es" && category.label.es
                ? category.label.es
                : category.label.en;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(category.id as FilterId)}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  selected
                    ? "border-primary bg-primary text-[#041924]"
                    : "border-[#cbd6dc] bg-background text-[#526978] hover:border-primary/50"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-border bg-muted/40 px-5 py-8 text-center text-sm text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {filtered.map((project, index) => {
              const cover =
                getCoverScreenshot(project) ?? project.screenshots[0];
              if (!cover) return null;
              const isActive = project.prototypeId === activeProject?.prototypeId;
              const accent = project.accentColor;

              return (
                <article
                  key={project.id}
                  className={cn(
                    "group overflow-hidden rounded-[18px] border bg-card transition-[transform,box-shadow,border-color] duration-300",
                    isActive
                      ? "border-primary shadow-[0_16px_40px_rgb(15_23_42/0.08)]"
                      : "border-[#dce4e8] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_#15344b19] motion-reduce:transform-none",
                    index === 0 && filter === "all" && "md:col-span-2"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => selectProject(project.prototypeId)}
                    className="block w-full text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden bg-muted",
                        index === 0 && filter === "all"
                          ? "aspect-[2.2] md:aspect-[2.6]"
                          : "aspect-[1.9]"
                      )}
                    >
                      <Image
                        src={cover.src}
                        alt={localizeText(cover.alt, locale)}
                        fill
                        sizes={
                          index === 0 && filter === "all"
                            ? "100vw"
                            : "(max-width: 768px) 100vw, 50vw"
                        }
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        priority={index < 2}
                      />
                      <span
                        aria-hidden
                        className="absolute top-0 left-0 h-1 w-full"
                        style={{ backgroundColor: accent }}
                      />
                    </div>
                  </button>
                  <div className="p-6">
                    <p className="text-[11px] font-extrabold tracking-[0.13em] text-[#38809a] uppercase">
                      {localizeText(project.eyebrow, locale)}
                    </p>
                    <h3 className="mt-2 font-display text-[1.8rem] tracking-tight text-foreground">
                      {localizeText(project.name, locale)}
                    </h3>
                    <p className="mt-2 min-h-[2.75rem] font-sans text-sm leading-relaxed text-[#70838e]">
                      {localizeText(project.shortDescription, locale)}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => selectProject(project.prototypeId)}
                        className={cn(
                          buttonVariants({ variant: "secondary", size: "sm" })
                        )}
                      >
                        {t("exploreCta")}
                      </button>
                      <a
                        href={project.demo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ size: "sm" }))}
                      >
                        {project.demo.ctaLabel
                          ? localizeText(project.demo.ctaLabel, locale)
                          : t("demoCta")}
                      </a>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.categoryTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#e4f7ff] px-2.5 py-1 text-[10px] font-extrabold tracking-[0.1em] text-[#126c8a] uppercase"
                        >
                          {categoryChipLabel(tag, locale)}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {activeProject ? (
          <div className="mt-10 scroll-mt-28" id="details">
            <WorkProjectDetail
              key={activeProject.id}
              project={activeProject}
            />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

function categoryChipLabel(tag: Exclude<PortfolioCategoryId, "all">, locale: AppLocale) {
  const match = portfolioCategories.find((category) => category.id === tag);
  if (!match) return tag;
  return locale === "es" && match.label.es ? match.label.es : match.label.en;
}
