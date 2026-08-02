/**
 * Best-effort forward of website inquiries → Command Station
 * POST /api/leads/capture (Tailscale Funnel).
 *
 * Never throws to callers of the fire-and-forget wrapper. Failures must not
 * block the visitor-facing inquiry success path.
 */

import type { ConsultationFormData } from "@/lib/consultation";

export type CommandStationLeadPayload = {
  name: string;
  email: string;
  phone: string;
  source: string;
  message: string;
};

export type ForwardCommandStationLeadResult =
  | { ok: true; id: string }
  | { ok: false; error: string; status?: number };

function buildMessage(inquiry: {
  businessName?: string | null;
  challenge?: string | null;
  industry?: string | null;
  role?: string | null;
  companySize?: string | null;
  services?: string[] | null;
  otherService?: string | null;
  referredBy?: string | null;
  leadSource?: string | null;
  businessCardFrom?: string | null;
  language?: string | null;
}): string {
  const lines: string[] = [];
  const businessName = inquiry.businessName?.trim();
  if (businessName) lines.push(`Business: ${businessName}`);
  const industry = inquiry.industry?.trim();
  if (industry) lines.push(`Industry: ${industry}`);
  const role = inquiry.role?.trim();
  if (role) lines.push(`Role: ${role}`);
  const companySize = inquiry.companySize?.trim();
  if (companySize) lines.push(`Company size: ${companySize}`);
  if (inquiry.services?.length) {
    lines.push(`Services: ${inquiry.services.join(", ")}`);
  }
  const otherService = inquiry.otherService?.trim();
  if (otherService) lines.push(`Other service: ${otherService}`);
  const leadSource = inquiry.leadSource?.trim();
  if (leadSource) lines.push(`Lead source (form): ${leadSource}`);
  const businessCardFrom = inquiry.businessCardFrom?.trim();
  if (businessCardFrom) lines.push(`Business card from: ${businessCardFrom}`);
  const referredBy = inquiry.referredBy?.trim();
  if (referredBy) lines.push(`Referred by: ${referredBy}`);
  const language = inquiry.language?.trim();
  if (language) lines.push(`Language: ${language}`);
  const challenge = inquiry.challenge?.trim();
  if (challenge) {
    lines.push("", "Challenge / project:", challenge);
  }
  return lines.join("\n").trim();
}

export function mapInquiryToCommandStationLead(
  inquiry: Pick<
    ConsultationFormData,
    | "fullName"
    | "businessName"
    | "email"
    | "phone"
    | "challenge"
    | "industry"
    | "role"
    | "companySize"
    | "services"
    | "otherService"
    | "referredBy"
    | "leadSource"
    | "businessCardFrom"
  > & {
    source?: string;
    language?: string;
  }
): CommandStationLeadPayload {
  return {
    name: inquiry.fullName.trim(),
    email: inquiry.email.trim().toLowerCase(),
    phone: inquiry.phone.trim(),
    source: (inquiry.source?.trim() || "corevia-web").slice(0, 200),
    message: buildMessage(inquiry),
  };
}

/**
 * POST to Command Station lead capture. Never throws.
 */
export async function forwardLeadToCommandStation(
  payload: CommandStationLeadPayload
): Promise<ForwardCommandStationLeadResult> {
  const baseUrl = process.env.COMMAND_STATION_LEADS_URL?.trim().replace(/\/$/, "");
  const apiKey = process.env.COMMAND_STATION_LEADS_API_KEY?.trim();

  if (!baseUrl) {
    return {
      ok: false,
      error: "COMMAND_STATION_LEADS_URL is not configured",
    };
  }
  if (!apiKey) {
    return {
      ok: false,
      error: "COMMAND_STATION_LEADS_API_KEY is not configured",
    };
  }

  const endpoint = baseUrl.endsWith("/api/leads/capture")
    ? baseUrl
    : `${baseUrl}/api/leads/capture`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        ok: false,
        status: response.status,
        error: `Command Station returned HTTP ${response.status}${
          text ? `: ${text.slice(0, 200)}` : ""
        }`,
      };
    }

    const data = (await response.json().catch(() => null)) as {
      id?: string;
      ok?: boolean;
    } | null;

    const id = typeof data?.id === "string" ? data.id : "";
    if (!id) {
      return { ok: false, error: "Command Station response missing id" };
    }
    return { ok: true, id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Command Station request failed";
    const cause =
      error instanceof Error && error.cause instanceof Error
        ? error.cause.message
        : error instanceof Error && error.cause
          ? String(error.cause)
          : "";
    return {
      ok: false,
      error: cause ? `${message}: ${cause}` : message,
    };
  }
}

/**
 * Fire-and-forget: log failures, never reject to the inquiry route.
 */
export function forwardLeadToCommandStationBestEffort(
  payload: CommandStationLeadPayload
): void {
  void forwardLeadToCommandStation(payload)
    .then((result) => {
      if (result.ok) {
        console.log(
          `[inquiry] Forwarded lead to Command Station — id=${result.id}`
        );
        return;
      }
      console.warn(
        `[inquiry] Command Station lead capture skipped/failed (non-blocking): ${result.error}`
      );
    })
    .catch((error) => {
      console.error(
        "[inquiry] Command Station lead capture threw (non-blocking):",
        error
      );
    });
}
