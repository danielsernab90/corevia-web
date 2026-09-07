"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import { Link } from "@/i18n/navigation";
import {
  featuredProjects,
  type FeaturedMedia,
  type FeaturedProject,
} from "@/lib/featured-work";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

function ProjectMediaFrame({
  media,
  alt,
  priority = false,
  className,
}: {
  media: FeaturedMedia;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/80 bg-card",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={media.src}
          alt={alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1023px) 100vw, 55vw"
          priority={priority}
        />
      </div>
    </div>
  );
}

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="relative flex aspect-[16/10] w-full items-end overflow-hidden rounded-xl border border-dashed border-border bg-muted/40 p-5"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-x-8 top-8 h-px bg-border/80" />
      <div className="pointer-events-none absolute inset-x-8 top-12 h-px bg-border/50" />
      <div className="pointer-events-none absolute inset-x-8 top-16 h-20 rounded-md border border-border/60 bg-background/50" />
      <p className="relative text-caption font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-2.5 border-t border-border/70 pt-6">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 font-sans text-sm leading-relaxed text-muted-foreground"
        >
          <span
            aria-hidden
            className="mt-2 size-1 shrink-0 rounded-full bg-primary"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ProjectCopy({
  project,
  reverse,
}: {
  project: FeaturedProject;
  reverse?: boolean;
}) {
  const t = useTranslations("Home.featuredWork");
  const features =
    project.id === "financial"
      ? ([0, 1, 2, 3, 4] as const).map((key) =>
          t(`projects.financial.features.${key}`)
        )
      : project.id === "operations"
        ? ([0, 1, 2, 3] as const).map((key) =>
            t(`projects.operations.features.${key}`)
          )
        : [];

  return (
    <div className={cn("min-w-0", reverse && "lg:pl-2")}>
      <p className="flex items-baseline gap-2.5">
        <span className="font-sans text-sm font-semibold tracking-[0.16em] text-primary tabular-nums">
          {project.number}
        </span>
        <span aria-hidden className="text-sm text-border">
          —
        </span>
        <span className="text-caption font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {t(`projects.${project.id}.category`)}
        </span>
      </p>

      <h3 className="mt-4 font-sans text-h3 font-semibold tracking-tight text-balance text-foreground">
        {t(`projects.${project.id}.title`)}
      </h3>

      <p className="mt-4 max-w-xl font-sans text-body leading-relaxed text-muted-foreground">
        {t(`projects.${project.id}.description`)}
      </p>

      {features.length > 0 ? <FeatureList items={features} /> : null}

      {project.href ? (
        <Link
          href={project.href}
          className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
        >
          {t("viewProject")}
          <span aria-hidden>→</span>
        </Link>
      ) : null}
    </div>
  );
}

function DualMediaStack({
  project,
  priority,
}: {
  project: FeaturedProject;
  priority?: boolean;
}) {
  const t = useTranslations("Home.featuredWork");
  const [primary, secondary] = project.media;

  if (!primary || (project.id !== "financial" && project.id !== "operations")) {
    return null;
  }

  const primaryAlt =
    project.id === "financial"
      ? t("projects.financial.mediaAlts.0")
      : t("projects.operations.mediaAlts.0");
  const secondaryAlt =
    project.id === "financial"
      ? t("projects.financial.mediaAlts.1")
      : t("projects.operations.mediaAlts.1");

  return (
    <div className="relative min-w-0">
      <ProjectMediaFrame
        media={primary}
        alt={primaryAlt}
        priority={priority}
      />
      {secondary ? (
        <div className="relative z-10 mt-4 w-[92%] sm:w-[88%] md:-mt-14 md:ml-auto md:w-[78%] lg:w-[72%]">
          <ProjectMediaFrame
            media={secondary}
            alt={secondaryAlt}
            className="shadow-[0_18px_36px_-20px_rgba(11,24,56,0.4)]"
          />
        </div>
      ) : null}
    </div>
  );
}

function AutomationExamples() {
  const t = useTranslations("Home.featuredWork");
  const project = featuredProjects.find((item) => item.id === "automation");
  if (!project?.examples) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      {project.examples.map((example) => {
        const label = t(
          `projects.automation.examples.${example.id}.label`
        );
        const title = t(
          `projects.automation.examples.${example.id}.title`
        );
        const description = t(
          `projects.automation.examples.${example.id}.description`
        );

        return (
          <div key={example.id} className="min-w-0">
            {example.media ? (
              <ProjectMediaFrame
                media={example.media}
                alt={title}
              />
            ) : (
              <MediaPlaceholder label={t("mediaPlaceholder")} />
            )}
            <p className="mt-5 text-caption font-semibold tracking-[0.12em] text-primary uppercase">
              {label}
            </p>
            <h4 className="mt-2 font-sans text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h4>
            <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground md:text-body">
              {description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Homepage Featured Work — curated editorial portfolio after Built Around.
 */
export function FeaturedWork() {
  const t = useTranslations("Home.featuredWork");
  const reduceMotion = useReducedMotion();

  return (
    <Section
      tone="surface"
      spacing="lg"
      aria-labelledby="featured-work-heading"
      className="border-t border-border/60"
    >
      <Container size="lg">
        <motion.div
          className="max-w-3xl"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={reduceMotion ? undefined : staggerContainer}
        >
          <motion.p
            variants={reduceMotion ? undefined : staggerItem}
            className="text-label font-semibold tracking-[0.14em] text-primary uppercase"
          >
            {t("eyebrow")}
          </motion.p>

          <motion.div variants={reduceMotion ? undefined : staggerItem}>
            <Heading
              id="featured-work-heading"
              size="h2"
              className="mt-5 max-w-[20ch] tracking-tight text-balance sm:max-w-[24ch]"
            >
              {t("title")}
            </Heading>
          </motion.div>

          <motion.p
            variants={reduceMotion ? undefined : staggerItem}
            className="mt-6 max-w-2xl font-sans text-body-lg leading-relaxed text-muted-foreground"
          >
            {t("description")}
          </motion.p>
        </motion.div>

        <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
          {featuredProjects.map((project, index) => {
            const reverse = index % 2 === 1;

            if (project.id === "automation") {
              return (
                <motion.article
                  key={project.id}
                  initial={reduceMotion ? false : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={reduceMotion ? undefined : fadeUp}
                  className="border-t border-border/70 pt-12 md:pt-16"
                >
                  <ProjectCopy project={project} />
                  <div className="mt-10 md:mt-12">
                    <AutomationExamples />
                  </div>
                </motion.article>
              );
            }

            return (
              <motion.article
                key={project.id}
                initial={reduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={reduceMotion ? undefined : fadeUp}
                className={cn(
                  "grid items-center gap-10 border-t border-border/70 pt-12 md:gap-12 md:pt-16 lg:grid-cols-2 lg:gap-14",
                  index === 0 && "border-t-0 pt-0 md:pt-0"
                )}
              >
                <div
                  className={cn(
                    "min-w-0",
                    reverse ? "lg:order-2" : "lg:order-1"
                  )}
                >
                  <DualMediaStack
                    project={project}
                    priority={index === 0}
                  />
                </div>
                <div
                  className={cn(
                    "min-w-0",
                    reverse ? "lg:order-1" : "lg:order-2"
                  )}
                >
                  <ProjectCopy project={project} reverse={reverse} />
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
