#!/usr/bin/env node
import puppeteer from "puppeteer";
import fs from "fs";

const pages = [
  "/en",
  "/en/services",
  "/en/work",
  "/en/company",
  "/en/contact",
  "/en/book-consultation",
  "/en/privacy",
  "/en/terms",
  "/en/referral",
];

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});
const out = {};
for (const path of pages) {
  const page = await browser.newPage();
  const errors = [];
  const warnings = [];
  const failed = [];
  page.on("console", (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === "error") errors.push(text.slice(0, 400));
    if (type === "warning") warnings.push(text.slice(0, 400));
  });
  page.on("pageerror", (err) => errors.push(("PAGE:" + err.message).slice(0, 400)));
  page.on("requestfailed", (req) => {
    failed.push(`${req.failure()?.errorText || "fail"} ${req.url()}`.slice(0, 300));
  });
  await page.setViewport({ width: 1440, height: 900 });
  const res = await page.goto(`http://127.0.0.1:3002${path}`, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });
  // check images
  const brokenImgs = await page.evaluate(() =>
    [...document.images]
      .filter((i) => i.complete && i.naturalWidth === 0)
      .map((i) => i.currentSrc || i.src)
  );
  const links = await page.evaluate(() =>
    [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"))
  );
  out[path] = {
    status: res?.status(),
    errors,
    warnings,
    failedRequests: failed.filter((f) => !f.includes("favicon")),
    brokenImgs,
    linkCount: links.length,
  };
  await page.close();
}
await browser.close();
fs.writeFileSync("/tmp/corevia-audit/console-after.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
