import type {
  PortfolioCategoryId,
  PortfolioProject,
  PortfolioRegistry,
  PortfolioScreenshot,
} from "@/types/portfolio";

import registryData from "./registry.data.json";

/**
 * Central portfolio registry for the approved CoreVia case-study set.
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

/** All approved portfolio projects in display order. */
export function getHomepageProjects(): readonly PortfolioProject[] {
  return [...portfolioProjects].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
}

/** Non-flagship projects for the homepage editorial grid. */
export function getHomepageSecondaryProjects(): readonly PortfolioProject[] {
  return getHomepageProjects().filter(
    (project) => project.displayOrder !== 1
  );
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

  if (portfolioProjects.length !== 8) {
    throw new Error(
      `Expected 8 portfolio projects, found ${portfolioProjects.length}`
    );
  }
  if (screenshotCount !== 81) {
    throw new Error(
      `Expected 81 portfolio screenshots, found ${screenshotCount}`
    );
  }
  if (coverCount !== 8) {
    throw new Error(`Expected 8 cover images, found ${coverCount}`);
  }

  return {
    projectCount: portfolioProjects.length,
    screenshotCount,
    coverCount,
  };
}
