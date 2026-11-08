"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

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
import type { AppLocale } from "@/i18n/routing";
import { localizeText } from "@/lib/portfolio/localize";
import {
  getCoverScreenshot,
  getHomepageSecondaryProjects,
} from "@/lib/portfolio/registry";
import { cn } from "@/lib/utils";

const SECONDARY_PROJECT_IDS = [
  "cotinga-hotel-spa",
  "dixie-remodeling",
  "perritos-gourmet",
  "la-gallinita",
  "montana-inmobiliaria",
  "odontologia-miguel-maya",
  "dra-lida-uribe-berrio",
] as const;

type SecondaryProjectId = (typeof SECONDARY_PROJECT_IDS)[number];

function isSecondaryProjectId(id: string): id is SecondaryProjectId {
  return (SECONDARY_PROJECT_IDS as readonly string[]).includes(id);
}

export function HomeProjectGrid() {
  const t = useTranslations("Home.projects");
  const locale = useLocale() as AppLocale;
  const byId = new Map(
    getHomepageSecondaryProjects().map((project) => [project.id, project])
  );
  const projects = SECONDARY_PROJECT_IDS.map((id) => {
    const project = byId.get(id);
    if (!project) {
      throw new Error(`Missing homepage secondary project ${id}`);
    }
    return project;
  });

  return (
    <Section
      tone="muted"
      spacing="md"
      aria-labelledby="home-projects-heading"
    >
      <Container size="xl">
        <SectionReveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-caption font-semibold tracking-[0.14em] text-primary uppercase">
              {t("eyebrow")}
            </p>
            <Heading
              id="home-projects-heading"
              size="h2"
              className="mt-3 font-display tracking-tight"
            >
              {t.rich("title", {
                br: () => <br />,
              })}
            </Heading>
          </div>
          <p className="max-w-md font-sans text-body text-muted-foreground md:pb-1">
            {t("description")}
          </p>
        </SectionReveal>

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => {
            if (!isSecondaryProjectId(project.id)) {
              throw new Error(`Unexpected homepage project ${project.id}`);
            }
            const cover =
              getCoverScreenshot(project) ?? project.screenshots[0];
            if (!cover) {
              throw new Error(`Missing cover for ${project.id}`);
            }
            const category = t(`categories.${project.id}`);
            const blurb = t(`blurbs.${project.id}`);

            return (
              <StaggerItem key={project.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_12px_40px_rgb(15_23_42/0.04)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgb(15_23_42/0.08)] motion-reduce:transform-none">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={cover.src}
                      alt={localizeText(cover.alt, locale)}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
                      {category}
                    </p>
                    <h3 className="mt-2 font-display text-h3 tracking-tight text-foreground">
                      {localizeText(project.name, locale)}
                    </h3>
                    <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
                      {blurb}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        href={`/work/${project.prototypeId}`}
                        className={cn(buttonVariants({ size: "sm" }))}
                      >
                        {t("viewCta")}
                      </Link>
                      <a
                        href={project.demo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${
                          project.demo.ctaLabel
                            ? localizeText(project.demo.ctaLabel, locale)
                            : t("demoCta")
                        }: ${localizeText(project.name, locale)}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" })
                        )}
                      >
                        {project.demo.ctaLabel
                          ? localizeText(project.demo.ctaLabel, locale)
                          : t("demoCta")}
                        <ExternalLink data-icon="inline-end" aria-hidden />
                      </a>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>

        <SectionReveal className="mt-10 flex justify-center">
          <Link
            href="/work"
            className={cn(
              buttonVariants({ variant: "secondary", size: "cta" })
            )}
          >
            {t("allCta")}
          </Link>
        </SectionReveal>
      </Container>
    </Section>
  );
}
