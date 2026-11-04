import type {
  PortfolioCategoryId,
  PortfolioProject,
  PortfolioRegistry,
  PortfolioScreenshot,
} from "@/types/portfolio";

import registryData from "./registry.data.json";

/**
 * Central portfolio registry for the approved five-project redesign.
 * Sourced from `reference/redesign-v2` prototypes + `asset-manifest.csv`.
 * Does not invent clients, metrics, or unverified dashboard URLs.
 */
export const portfolioRegistry = registryData as PortfolioRegistry;

export const portfolioProjects: readonly PortfolioProject[] =
  portfolioRegistry.projects;

export const portfolioCategories = portfolioRegistry.categories;

export function getPortfolioProject(
  id: string
): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.id === id);
}

export function getPortfolioProjectByPrototypeId(
  prototypeId: string
): PortfolioProject | undefined {
  return portfolioProjects.find(
    (project) => project.prototypeId === prototypeId
  );
}

export function getPortfolioProjectsByCategory(
  category: PortfolioCategoryId
): readonly PortfolioProject[] {
  if (category === "all") {
    return portfolioProjects;
  }

  return portfolioProjects.filter((project) =>
    project.categoryTags.includes(category)
  );
}

export function getProjectScreenshots(
  project: PortfolioProject
): readonly PortfolioScreenshot[] {
  return project.screenshots;
}

export function getScreenshotGroup(
  project: PortfolioProject,
  groupId: string
): readonly PortfolioScreenshot[] {
  const group = project.screenshotGroups.find((item) => item.id === groupId);
  if (!group) {
    return [];
  }

  const idSet = new Set(group.screenshotAssetIds);
  return project.screenshots.filter((shot) => idSet.has(shot.assetId));
}

export function getCoverScreenshot(
  project: PortfolioProject
): PortfolioScreenshot | undefined {
  return project.screenshots.find(
    (shot) => shot.assetId === project.coverAssetId
  );
}

/** Flagship project for homepage featured treatment (displayOrder === 1). */
export function getFlagshipProject(): PortfolioProject {
  const flagship = portfolioProjects.find(
    (project) => project.displayOrder === 1
  );
  if (!flagship) {
    throw new Error("Portfolio registry is missing a flagship project.");
  }
  return flagship;
}

export function assertPortfolioIntegrity(): {
  projectCount: number;
  screenshotCount: number;
  coverCount: number;
} {
  const screenshotCount = portfolioProjects.reduce(
    (total, project) => total + project.screenshots.length,
    0
  );
  const coverCount = portfolioProjects.filter(
    (project) =>
      Boolean(project.coverImage) &&
      project.screenshots.some((shot) => shot.assetId === project.coverAssetId)
  ).length;

  if (portfolioProjects.length !== 5) {
    throw new Error(
      `Expected 5 portfolio projects, found ${portfolioProjects.length}`
    );
  }
  if (screenshotCount !== 60) {
    throw new Error(
      `Expected 60 portfolio screenshots, found ${screenshotCount}`
    );
  }
  if (coverCount !== 5) {
    throw new Error(`Expected 5 cover images, found ${coverCount}`);
  }

  return {
    projectCount: portfolioProjects.length,
    screenshotCount,
    coverCount,
  };
}
