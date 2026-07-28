#!/usr/bin/env node
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import lighthouse from "lighthouse";

async function run(url, out) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  try {
    const port = new URL(browser.wsEndpoint()).port;
    const result = await lighthouse(url, {
      port: Number(port),
      output: "json",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      formFactor: "desktop",
      screenEmulation: { disabled: true },
    });
    fs.writeFileSync(out, result.report);
    const cats = result.lhr.categories;
    const audits = result.lhr.audits;
    console.log("FILE", out);
    for (const [k, v] of Object.entries(cats)) {
      console.log(" ", k + ":", Math.round((v.score || 0) * 100));
    }
    for (const k of [
      "largest-contentful-paint",
      "cumulative-layout-shift",
      "total-blocking-time",
      "interactive",
      "first-contentful-paint",
      "speed-index",
    ]) {
      console.log(" ", k + ":", audits[k]?.displayValue);
    }
  } finally {
    await browser.close();
  }
}

const dir = "/tmp/corevia-audit";
fs.mkdirSync(dir, { recursive: true });
await run("http://127.0.0.1:3002/en", path.join(dir, "lh-home-after.json"));
await run(
  "http://127.0.0.1:3002/en/services",
  path.join(dir, "lh-services-after.json")
);
