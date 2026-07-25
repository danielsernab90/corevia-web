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

export const runtime = "nodejs";

type InquiryBody = ConsultationFormData & {
  source?: string;
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

  const servicesRaw = body.services;
  const services = Array.isArray(servicesRaw)
    ? servicesRaw.map((item) => String(item))
    : [];

  if (!fullName || !email || !phone || !challenge) {
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
    },
  };
}

async function sendInquiryEmailNotification(
  id: string,
  data: InquiryBody
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

  try {
    const resend = new Resend(apiKey);
    const servicesList = data.services.join(", ");
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `New Corevia inquiry from ${data.fullName}`,
      text: [
        `New website inquiry (${id})`,
        "",
        `Name: ${data.fullName}`,
        `Business: ${data.businessName || "(not provided)"}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Referred by: ${data.referredBy || "(not provided)"}`,
        `Industry: ${data.industry}`,
        `Role: ${data.role}`,
        `Company size: ${data.companySize}`,
        `Services: ${servicesList}`,
        data.otherService ? `Other service: ${data.otherService}` : null,
        "",
        "Challenge:",
        data.challenge,
        "",
        `Source: ${data.source ?? "website"}`,
        `DB: ${getCommandStationDbPath()}`,
      ]
        .filter((line) => line !== null)
        .join("\n"),
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

  try {
    insertCoreviaInquiry({
      id,
      ...parsed.data,
    });
  } catch (error) {
    console.error("[inquiry] SQLite insert failed:", error);
    return NextResponse.json(
      {
        error:
          "Could not save your inquiry. Please try again or contact us another way.",
      },
      { status: 500 }
    );
  }

  // Email is a redundant safety net — failure must not fail the inquiry.
  const email = await sendInquiryEmailNotification(id, parsed.data);

  return NextResponse.json({
    ok: true,
    id,
    emailNotification: email,
  });
}
