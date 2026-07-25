/**
 * Local preview for the inquiry notification email. Renders both scheduling
 * paths (Calendly booked vs no-schedule fallback) plus a blank-challenge case.
 *
 * Run: npx tsx scripts/preview-inquiry-email.mts
 */
import { writeFileSync } from "node:fs";

import { buildInquiryEmail, type InquiryEmailInput } from "../lib/inquiry-email";

const scheduled: InquiryEmailInput = {
  fullName: "Maria Delgado",
  businessName: "Delgado Dental Group",
  email: "maria@delgadodental.com",
  phone: "+1 (305) 555-8842",
  referredBy: "Carlos Rivera",
  industry: "dental",
  role: "owner",
  companySize: "small",
  services: ["workflowAutomation", "crmErp", "other"],
  otherService: "Automated insurance claim follow-ups",
  challenge:
    "Front desk spends 3+ hours a day on insurance verification and appointment reminders.\nWe also lose track of treatment plan follow-ups.",
  source: "website",
  scheduledViaCalendly: true,
};

const fallbackBlankChallenge: InquiryEmailInput = {
  fullName: "Tom Becker",
  businessName: "",
  email: "tom.becker@beckerlogistics.io",
  phone: "+1 512 555 0193",
  referredBy: "",
  industry: "logistics",
  role: "operations",
  companySize: "medium",
  services: ["dashboards"],
  otherService: "",
  challenge: "   ",
  source: "website",
  scheduledViaCalendly: false,
};

const cases: Array<{ name: string; data: InquiryEmailInput; dbSaved: boolean }> = [
  { name: "A · Calendly booked + full challenge", data: scheduled, dbSaved: true },
  {
    name: "B · No-schedule fallback + BLANK challenge + no business/referral",
    data: fallbackBlankChallenge,
    dbSaved: false,
  },
];

const htmlParts: string[] = [];

for (const testCase of cases) {
  const email = buildInquiryEmail(
    `test-${testCase.data.fullName.toLowerCase().replace(/\W+/g, "-")}`,
    testCase.data,
    { dbSaved: testCase.dbSaved, dbPath: "~/Library/Application Support/cesar-property-management/data.db" }
  );

  console.log("\n" + "=".repeat(78));
  console.log("CASE " + testCase.name);
  console.log("=".repeat(78));
  console.log("SUBJECT: " + email.subject);
  console.log("-".repeat(78));
  console.log(email.text);

  htmlParts.push(
    `<h3 style="font-family:sans-serif;padding:8px 16px;background:#0f172a;color:#fff;margin:0;">CASE ${testCase.name}</h3><p style="font-family:sans-serif;padding:4px 16px;margin:0;background:#e2e8f0;"><b>Subject:</b> ${email.subject}</p>${email.html}`
  );
}

writeFileSync("inquiry-email-preview.html", htmlParts.join("\n<hr/>\n"));
console.log("\n\nHTML preview written to inquiry-email-preview.html");
