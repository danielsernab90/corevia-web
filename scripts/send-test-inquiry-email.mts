/**
 * Sends a REAL inquiry notification email through Resend using the actual
 * template, so you can verify every field renders correctly in your inbox.
 *
 * Usage (reads .env.local automatically):
 *   npx tsx scripts/send-test-inquiry-email.mts
 *
 * Or with an explicit key / recipient:
 *   RESEND_API_KEY=re_xxx INQUIRY_NOTIFY_EMAIL=you@example.com \
 *     npx tsx scripts/send-test-inquiry-email.mts
 *
 * Pass `fallback` to send the no-schedule variant instead of the Calendly one:
 *   npx tsx scripts/send-test-inquiry-email.mts fallback
 */
import { readFileSync } from "node:fs";

import { Resend } from "resend";

import { buildInquiryEmail, type InquiryEmailInput } from "../lib/inquiry-email";

function loadEnvLocal(): void {
  try {
    const contents = readFileSync(".env.local", "utf8");
    for (const line of contents.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...rest] = trimmed.split("=");
      const value = rest.join("=").trim().replace(/^["']|["']$/g, "");
      if (!process.env[key.trim()]) process.env[key.trim()] = value;
    }
  } catch {
    console.warn("No .env.local found — relying on shell environment.");
  }
}

loadEnvLocal();

const apiKey = process.env.RESEND_API_KEY?.trim();
const to = process.env.INQUIRY_NOTIFY_EMAIL?.trim() || "danielsernab90@gmail.com";
const from =
  process.env.INQUIRY_FROM_EMAIL?.trim() ||
  "Corevia Inquiries <onboarding@resend.dev>";

if (!apiKey) {
  console.error(
    "RESEND_API_KEY is not set. Add it to .env.local or pass it inline:\n" +
      "  RESEND_API_KEY=re_xxx npx tsx scripts/send-test-inquiry-email.mts"
  );
  process.exit(1);
}

const useFallback = process.argv[2] === "fallback";

const calendlyCase: InquiryEmailInput = {
  fullName: "Maria Delgado (TEST)",
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
  source: "manual-test",
  scheduledViaCalendly: true,
};

const fallbackCase: InquiryEmailInput = {
  fullName: "Tom Becker (TEST)",
  businessName: "",
  email: "tom.becker@beckerlogistics.io",
  phone: "+1 512 555 0193",
  referredBy: "",
  industry: "logistics",
  role: "operations",
  companySize: "medium",
  services: ["dashboards"],
  otherService: "",
  challenge: "",
  source: "manual-test",
  scheduledViaCalendly: false,
};

const data = useFallback ? fallbackCase : calendlyCase;

const { subject, text, html } = buildInquiryEmail(
  `manual-test-${Date.now()}`,
  data,
  {
    dbSaved: !useFallback,
    dbPath: "~/Library/Application Support/cesar-property-management/data.db",
  }
);

const masked =
  apiKey.length > 8
    ? `${apiKey.slice(0, 5)}…${apiKey.slice(-4)} (len ${apiKey.length})`
    : `<len ${apiKey.length}>`;

console.log(
  `Sending ${useFallback ? "FALLBACK (no-schedule)" : "CALENDLY (booked)"} test email`
);
console.log(`  key:  ${masked}`);
console.log(`  from: ${from}`);
console.log(`  to:   ${to}`);
console.log(`  subj: ${subject}`);

const resend = new Resend(apiKey);
const { data: result, error } = await resend.emails.send({
  from,
  to: [to],
  subject,
  text,
  html,
});

if (error) {
  console.error("\nRESEND ERROR:", error);
  process.exit(1);
}

console.log("\nSent successfully. Resend message id:", result?.id);
console.log("Check your inbox and the Resend dashboard Logs for this id.");
