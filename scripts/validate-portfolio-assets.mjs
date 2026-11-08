#!/usr/bin/env node
/**
 * Phase 1 integrity check: registry paths, covers, and 60-file account.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(
  readFileSync(join(root, "lib/portfolio/registry.data.json"), "utf8")
);
const manifest = readFileSync(
  join(root, "reference/redesign-v2/asset-manifest.csv"),
  "utf8"
)
  .trim()
  .split("\n")
  .slice(1)
  .filter(Boolean);

const expectedCounts = {
  "summit-and-stone": 16,
  "cotinga-hotel-spa": 14,
  "dixie-remodeling": 10,
  "perritos-gourmet": 8,
  "la-gallinita": 12,
  "montana-inmobiliaria": 8,
  "odontologia-miguel-maya": 7,
  "dra-lida-uribe-berrio": 6,
  "as-maderas": 7,
};

const errors = [];
const seenAssetIds = new Set();
const seenOriginals = new Set();

if (registry.projects.length !== 9) {
  errors.push(`Expected 9 projects, got ${registry.projects.length}`);
}

if (manifest.length !== 60) {
  errors.push(`Expected 60 redesign-v2 manifest rows, got ${manifest.length}`);
}

let screenshotTotal = 0;

for (const project of registry.projects) {
  const expected = expectedCounts[project.id];
  if (expected == null) {
    errors.push(`Unexpected project id: ${project.id}`);
    continue;
  }
  if (project.screenshots.length !== expected) {
    errors.push(
      `${project.id}: expected ${expected} screenshots, got ${project.screenshots.length}`
    );
  }

  const coverPath = join(root, "public", project.coverImage.replace(/^\//, ""));
  if (!existsSync(coverPath)) {
    errors.push(`Missing cover: ${project.coverImage}`);
  }

  const coverShot = project.screenshots.find(
    (shot) => shot.assetId === project.coverAssetId
  );
  if (!coverShot) {
    errors.push(`${project.id}: coverAssetId ${project.coverAssetId} not in screenshots`);
  }

  if (!project.demo?.url) {
    errors.push(`${project.id}: missing demo URL`);
  }

  for (const shot of project.screenshots) {
    screenshotTotal += 1;
    if (seenAssetIds.has(shot.assetId)) {
      errors.push(`Duplicate assetId: ${shot.assetId}`);
    }
    seenAssetIds.add(shot.assetId);

    if (seenOriginals.has(shot.exactOriginalFilename)) {
      errors.push(`Duplicate original filename: ${shot.exactOriginalFilename}`);
    }
    seenOriginals.add(shot.exactOriginalFilename);

    const abs = join(root, "public", shot.src.replace(/^\//, ""));
    if (!existsSync(abs)) {
      errors.push(`Missing file: ${shot.src}`);
    }
  }
}

if (screenshotTotal !== 88) {
  errors.push(`Expected 88 registry screenshots, got ${screenshotTotal}`);
}

if (errors.length) {
  console.error("Portfolio asset validation FAILED:");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("Portfolio asset validation OK");
console.log(`  projects: ${registry.projects.length}`);
console.log(`  screenshots: ${screenshotTotal}`);
console.log(`  covers: ${registry.projects.length}`);
console.log(
  `  demos: ${registry.projects.map((p) => p.demo.url).join(", ")}`
);
