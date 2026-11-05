import type { PortfolioScreenshot } from "@/types/portfolio";

import { getFlagshipProject } from "@/lib/portfolio/registry";

/**
 * Homepage Summit & Stone narrative order — website → Construction OS → portal.
 * Includes every Summit screenshot so the featured carousel tells the full story.
 * Group order in the registry is the source of truth.
 */
export function getFlagshipNarrativeScreenshots(): PortfolioScreenshot[] {
  const project = getFlagshipProject();
  const byId = new Map(
    project.screenshots.map((shot) => [shot.assetId, shot] as const)
  );
  const ordered: PortfolioScreenshot[] = [];

  for (const group of project.screenshotGroups) {
    for (const assetId of group.screenshotAssetIds) {
      const shot = byId.get(assetId);
      if (shot) ordered.push(shot);
    }
  }

  // Safety: any screenshot not listed in a group still appears at the end.
  for (const shot of project.screenshots) {
    if (!ordered.some((item) => item.assetId === shot.assetId)) {
      ordered.push(shot);
    }
  }

  if (ordered.length === 0) {
    throw new Error("Flagship project has no screenshots for the homepage carousel.");
  }

  return ordered;
}
