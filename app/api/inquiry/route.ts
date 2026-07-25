import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  insertCoreviaInquiry,
  getCommandStationDbPath,
} from "@/lib/command-station-db";
import {
  companySizeOptions,
  industryOptions,
  roleOptions,
  serviceOptions,
  type ConsultationFormData,
} from "@/lib/consultation";
import {
  isValidEmail,
  isValidPhone,
} from "@/lib/consultation-validation";
import { buildInquiryEmail } from "@/lib/inquiry-email";

export const runtime = "nodejs";

type InquiryBody = ConsultationFormData & {
  source?: string;
  /** True only when Calendly confirmed a real booking on the schedule step. */
  scheduledViaCalendly?: boolean;
};

function isIndustry(value: string): value is ConsultationFormData["industry"] {
  return value === "" || (industryOptions as readonly string[]).includes(value);
}

function isRole(value: string): value is ConsultationFormData["role"] {
  return value === "" || (roleOptions as readonly string[]).includes(value);
}

function isCompanySize(
  value: string
): value is ConsultationFormData["companySize"] {
  return (
    value === "" || (companySizeOptions as readonly string[]).includes(value)
  );
}

function parseBody(raw: unknown): { ok: true; data: InquiryBody } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Invalid JSON body." };
  }

  const body = raw as Record<string, unknown>;
  const fullName = String(body.fullName ?? "").trim();
  const businessName = String(body.businessName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const referredBy = String(body.referredBy ?? "").trim();
  const industry = String(body.industry ?? "").trim();
  const role = String(body.role ?? "").trim();
  const companySize = String(body.companySize ?? "").trim();
  const otherService = String(body.otherService ?? "").trim();
  const challenge = String(body.challenge ?? "").trim();
  const source = String(body.source ?? "website").trim() || "website";
  const scheduledViaCalendly = body.scheduledViaCalendly === true;

  const servicesRaw = body.services;
  const services = Array.isArray(servicesRaw)
    ? servicesRaw.map((item) => String(item))
    : [];

  // challenge is optional — only contact essentials are required.
  if (!fullName || !email || !phone) {
    return { ok: false, error: "Missing required fields." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "Invalid email address." };
  }
  if (!isValidPhone(phone)) {
    return { ok: false, error: "Invalid phone number." };
  }
  if (!industry || !isIndustry(industry) || industry === "") {
    return { ok: false, error: "Invalid industry." };
  }
  if (!role || !isRole(role) || role === "") {
    return { ok: false, error: "Invalid role." };
  }
  if (!companySize || !isCompanySize(companySize) || companySize === "") {
    return { ok: false, error: "Invalid company size." };
  }
  if (services.length === 0) {
    return { ok: false, error: "Select at least one service." };
  }
  for (const service of services) {
    if (!(serviceOptions as readonly string[]).includes(service)) {
      return { ok: false, error: "Invalid service selection." };
    }
  }
  if (services.includes("other") && !otherService) {
    return { ok: false, error: "Please describe the other service." };
  }

  return {
    ok: true,
    data: {
      fullName,
      businessName,
      email,
      phone,
      referredBy,
      industry,
      role,
      companySize,
      services: services as ConsultationFormData["services"],
      otherService,
      challenge,
      source,
      scheduledViaCalendly,
    },
  };
}

async function sendInquiryEmailNotification(
  id: string,
  data: InquiryBody,
  meta: { dbSaved: boolean }
): Promise<{ sent: boolean; skippedReason?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.INQUIRY_NOTIFY_EMAIL?.trim() || "danielsernab90@gmail.com";
  const from =
    process.env.INQUIRY_FROM_EMAIL?.trim() || "Corevia Inquiries <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(
      "[inquiry] RESEND_API_KEY not set — skipping email notification safety net."
    );
    return { sent: false, skippedReason: "RESEND_API_KEY not configured" };
  }

  const maskedKey =
    apiKey.length > 8
      ? `${apiKey.slice(0, 5)}…${apiKey.slice(-4)} (len ${apiKey.length})`
      : `<len ${apiKey.length}>`;
  console.log(
    `[inquiry] Attempting to send email via Resend — key ${maskedKey}, from="${from}", to="${to}"`
  );

  try {
    const resend = new Resend(apiKey);
    const { subject, text, html } = buildInquiryEmail(id, data, {
      dbSaved: meta.dbSaved,
      dbPath: getCommandStationDbPath(),
    });
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[inquiry] Resend email failed:", error);
      return { sent: false, skippedReason: error.message };
    }

    return { sent: true };
  } catch (error) {
    console.error("[inquiry] Resend email threw:", error);
    return {
      sent: false,
      skippedReason: error instanceof Error ? error.message : "Email send failed",
    };
  }
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseBody(raw);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const id = randomUUID();

  // Attempt the local SQLite write, but do NOT let its failure short-circuit
  // the email safety net. On serverless hosts (e.g. Vercel) the Command Station
  // DB file does not exist, so this insert throws every time — the email below
  // is the whole reason it exists as a fallback capture path.
  let dbSaved = false;
  let dbError: string | undefined;
  try {
    insertCoreviaInquiry({
      id,
      ...parsed.data,
    });
    dbSaved = true;
  } catch (error) {
    dbError = error instanceof Error ? error.message : String(error);
    console.error(
      `[inquiry] SQLite insert failed (db=${getCommandStationDbPath()}):`,
      error
    );
  }

  // Email is a redundant safety net — it must run even when the DB write fails.
  const email = await sendInquiryEmailNotification(id, parsed.data, { dbSaved });

  // Only fail the request if BOTH capture paths failed — otherwise the inquiry
  // is safely recorded somewhere (DB and/or Daniel's inbox).
  if (!dbSaved && !email.sent) {
    console.error(
      `[inquiry] BOTH capture paths failed — db="${dbError}", email="${email.skippedReason}"`
    );
    return NextResponse.json(
      {
        error:
          "Could not save your inquiry. Please try again or contact us another way.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    id,
    dbSaved,
    emailNotification: email,
  });
}
