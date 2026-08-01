/**
 * Adapter helpers: website inquiry payload → NestJS CreateLead DTO.
 *
 * Why this lives in the Next.js `/api/inquiry` route (not the browser):
 * - The frontend must stay unaware of the shared NestJS API.
 * - Only the server-side inquiry adapter may call `POST /api/v1/leads`.
 * - Future vendor integrations (Sheets, Drive, Slack, …) belong in NestJS
 *   `IntegrationsModule`, not in website Route Handlers or React components.
 */

import type { ConsultationFormData } from "@/lib/consultation";

export type NestCreateLeadPayload = {
  firstName: string;
  lastName: string;
  businessName: string | null;
  email: string;
  phone: string;
  projectDescription: string | null;
  leadSource: string | null;
  businessCardAdvisor: string | null;
  language: "en" | "es";
};

export type InquiryLeadSource = Pick<
  ConsultationFormData,
  | "fullName"
  | "businessName"
  | "email"
  | "phone"
  | "challenge"
  | "leadSource"
  | "businessCardFrom"
> & {
  language?: string;
};

/** Splits "Maria Delgado" → firstName / lastName for the Leads DTO. */
export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "Unknown", lastName: "Lead" };
  }
  if (parts.length === 1) {
    return { firstName: parts[0]!, lastName: "-" };
  }
  return {
    firstName: parts[0]!,
    lastName: parts.slice(1).join(" "),
  };
}

export function normalizeLeadLanguage(
  value: string | null | undefined
): "en" | "es" {
  const normalized = (value ?? "").trim().toLowerCase().split("-")[0];
  return normalized === "es" ? "es" : "en";
}

/**
 * Maps a validated inquiry body to the NestJS Leads create payload.
 * Extra consultation fields (industry, services, …) stay on the inquiry
 * fallback path until the shared Lead model is extended.
 */
export function mapInquiryToCreateLeadDto(
  inquiry: InquiryLeadSource
): NestCreateLeadPayload {
  const { firstName, lastName } = splitFullName(inquiry.fullName);
  const businessName = inquiry.businessName.trim();
  const projectDescription = inquiry.challenge.trim();
  const leadSource = inquiry.leadSource.trim();
  const advisor = inquiry.businessCardFrom?.trim() ?? "";

  return {
    firstName,
    lastName,
    businessName: businessName.length > 0 ? businessName : null,
    email: inquiry.email.trim().toLowerCase(),
    phone: inquiry.phone.trim(),
    projectDescription:
      projectDescription.length > 0 ? projectDescription : null,
    leadSource: leadSource.length > 0 ? leadSource : null,
    businessCardAdvisor: advisor.length > 0 ? advisor : null,
    language: normalizeLeadLanguage(inquiry.language),
  };
}

export type ForwardLeadResult =
  | { ok: true; id: string }
  | { ok: false; error: string; status?: number };

/**
 * Forwards a lead to the shared NestJS API.
 * Never throws — callers treat `{ ok: false }` as "use SQLite/email fallback".
 */
export async function forwardLeadToCoreviaApi(
  payload: NestCreateLeadPayload,
  options?: { baseUrl?: string; fetchImpl?: typeof fetch }
): Promise<ForwardLeadResult> {
  const baseUrl = (options?.baseUrl ?? process.env.COREVIA_API_URL ?? "")
    .trim()
    .replace(/\/$/, "");

  if (!baseUrl) {
    return {
      ok: false,
      error: "COREVIA_API_URL is not configured",
    };
  }

  const fetchImpl = options?.fetchImpl ?? fetch;

  try {
    const response = await fetchImpl(`${baseUrl}/api/v1/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Keep the inquiry route snappy if NestJS is down.
      signal: AbortSignal.timeout(8_000),
    });

    const body = (await response.json().catch(() => null)) as {
      data?: { id?: string };
      message?: string | string[];
      error?: string;
    } | null;

    if (!response.ok) {
      const message = Array.isArray(body?.message)
        ? body.message.join("; ")
        : body?.message || body?.error || response.statusText;
      return {
        ok: false,
        status: response.status,
        error: `NestJS Leads API returned ${response.status}: ${message}`,
      };
    }

    const id = body?.data?.id;
    if (!id) {
      return {
        ok: false,
        status: response.status,
        error: "NestJS Leads API succeeded without a lead id",
      };
    }

    return { ok: true, id };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to reach NestJS Leads API",
    };
  }
}
