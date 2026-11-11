import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { WorkProjectPageExperience } from "@/components/sections/work/work-project-page";
import { routing } from "@/i18n/routing";
import {
  getPortfolioProjectByPrototypeId,
  portfolioProjects,
} from "@/lib/portfolio/registry";
import { localizeText } from "@/lib/portfolio/localize";
import { getLocaleAlternates, getOgImage, getSiteUrl } from "@/lib/site";
import type { AppLocale } from "@/i18n/routing";

type WorkProjectPageProps = {
  params: Promise<{ locale: string; projectId: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    portfolioProjects.map((project) => ({
      locale,
      projectId: project.prototypeId,
    }))
  );
}

export async function generateMetadata({
  params,
}: WorkProjectPageProps): Promise<Metadata> {
  const { locale: rawLocale, projectId } = await params;
  const locale = (
    hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale
  ) as AppLocale;
  const project = getPortfolioProjectByPrototypeId(projectId);
  const t = await getTranslations({ locale, namespace: "Work.projectMeta" });

  if (!project) {
    return {
      title: t("fallbackTitle"),
      description: t("fallbackDescription"),
    };
  }

  const name = localizeText(project.name, locale);
  const description = localizeText(project.caseStudySummary, locale);
  const title = t("title", { name });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [getOgImage(locale)],
      url: getSiteUrl(`/${locale}/work/${project.prototypeId}`),
    },
    alternates: getLocaleAlternates(locale, `/work/${project.prototypeId}`),
  };
}

export default async function WorkProjectPage({ params }: WorkProjectPageProps) {
  const { locale: rawLocale, projectId } = await params;

  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }

  const project = getPortfolioProjectByPrototypeId(projectId);
  if (!project) {
    notFound();
  }

  setRequestLocale(rawLocale);

  return <WorkProjectPageExperience prototypeId={project.prototypeId} />;
}
