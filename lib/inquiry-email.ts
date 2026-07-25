import type { ConsultationFormData } from "@/lib/consultation";
import enMessages from "@/messages/en.json";

/**
 * Notification email template for new Corevia inquiries (sent via Resend).
 *
 * Option labels are read from the EN next-intl messages so the email always
 * matches the wording the client saw in the form — never hardcode them here.
 */

/** Which path the client took on the final scheduling step. */
export type SchedulingPath = "calendly" | "fallback";

export type InquiryEmailInput = ConsultationFormData & {
  source?: string;
  /** True only when Calendly confirmed an actual booking via postMessage. */
  scheduledViaCalendly?: boolean;
};

export type InquiryEmailMeta = {
  /** Whether the Command Station SQLite write succeeded for this inquiry. */
  dbSaved: boolean;
  dbPath: string;
};

export type InquiryEmailContent = {
  subject: string;
  text: string;
  html: string;
};

const NOT_PROVIDED = "Not provided";

const modal = enMessages.BookConsultation.modal;
const industryLabels = modal.industries as Record<string, string>;
const roleLabels = modal.roles as Record<string, string>;
const companySizeLabels = modal.companySizes as Record<string, string>;
const serviceLabels = modal.services as Record<string, string>;

/** Falls back to the raw key so an unmapped option is still visible. */
function label(group: Record<string, string>, key: string): string {
  if (!key.trim()) return NOT_PROVIDED;
  return group[key] ?? key;
}

function orNotProvided(value: string): string {
  return value.trim() ? value.trim() : NOT_PROVIDED;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Row = { label: string; value: string };
type Section = { heading: string; rows?: Row[]; list?: string[]; body?: string };

export function getSchedulingPath(data: InquiryEmailInput): SchedulingPath {
  return data.scheduledViaCalendly ? "calendly" : "fallback";
}

function schedulingSummary(path: SchedulingPath): string {
  return path === "calendly"
    ? "Booked a time via Calendly — the slot is on your Calendly calendar."
    : "Did NOT book a time — needs direct outreach (call / text / WhatsApp) to coordinate.";
}

export function buildInquiryEmail(
  id: string,
  data: InquiryEmailInput,
  meta: InquiryEmailMeta
): InquiryEmailContent {
  const businessName = data.businessName.trim();
  const otherService = data.otherService.trim();
  const path = getSchedulingPath(data);

  const services = data.services.map((service) => {
    const name = label(serviceLabels, service);
    return service === "other" && otherService
      ? `${name}: ${otherService}`
      : name;
  });

  const sections: Section[] = [
    {
      heading: "Contact",
      rows: [
        { label: "Name", value: orNotProvided(data.fullName) },
        { label: "Business / Company", value: orNotProvided(businessName) },
        { label: "Email", value: orNotProvided(data.email) },
        { label: "Phone", value: orNotProvided(data.phone) },
        { label: "Referred by", value: orNotProvided(data.referredBy) },
      ],
    },
    {
      heading: "Business Profile",
      rows: [
        { label: "Industry", value: label(industryLabels, data.industry) },
        { label: "Position / Role", value: label(roleLabels, data.role) },
        {
          label: "Company Size",
          value: label(companySizeLabels, data.companySize),
        },
      ],
    },
    {
      heading: "Services They're Looking For",
      list: services.length > 0 ? services : [NOT_PROVIDED],
    },
    {
      heading: "Their Challenge",
      body: orNotProvided(data.challenge),
    },
    {
      heading: "Scheduling",
      rows: [
        {
          label: "Path taken",
          value:
            path === "calendly"
              ? "Scheduled via Calendly"
              : "No-schedule fallback",
        },
        { label: "What this means", value: schedulingSummary(path) },
      ],
    },
    {
      heading: "Submission Details",
      rows: [
        { label: "Inquiry ID", value: id },
        { label: "Source", value: orNotProvided(data.source ?? "website") },
        { label: "Submitted (UTC)", value: new Date().toISOString() },
        {
          label: "Command Station DB",
          value: meta.dbSaved
            ? `Saved to ${meta.dbPath}`
            : `NOT SAVED (${meta.dbPath}) — this email is the only record of this inquiry.`,
        },
      ],
    },
  ];

  const subject = businessName
    ? `New Corevia inquiry — ${data.fullName} · ${businessName}`
    : `New Corevia inquiry — ${data.fullName}`;

  return {
    subject,
    text: renderText(sections, path),
    html: renderHtml(sections, path, data),
  };
}

function renderText(sections: Section[], path: SchedulingPath): string {
  const lines: string[] = ["NEW COREVIA INQUIRY", "===================", ""];

  if (path === "fallback") {
    lines.push("** ACTION NEEDED: no time booked — reach out directly. **", "");
  }

  for (const section of sections) {
    lines.push(section.heading.toUpperCase());
    lines.push("-".repeat(section.heading.length));

    if (section.rows) {
      const width = Math.max(...section.rows.map((row) => row.label.length));
      for (const row of section.rows) {
        lines.push(`${row.label.padEnd(width)}  ${row.value}`);
      }
    }
    if (section.list) {
      for (const item of section.list) lines.push(`- ${item}`);
    }
    if (section.body) {
      lines.push(section.body);
    }

    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

function renderHtml(
  sections: Section[],
  path: SchedulingPath,
  data: InquiryEmailInput
): string {
  const banner =
    path === "fallback"
      ? `<div style="margin:0 0 20px;padding:12px 14px;border-radius:8px;background:#fff7ed;border:1px solid #fdba74;color:#9a3412;font-size:14px;font-weight:600;">
           Action needed: this client did not book a time — reach out directly.
         </div>`
      : `<div style="margin:0 0 20px;padding:12px 14px;border-radius:8px;background:#ecfdf5;border:1px solid #6ee7b7;color:#065f46;font-size:14px;font-weight:600;">
           This client booked a time via Calendly — check your calendar.
         </div>`;

  const body = sections
    .map((section) => {
      let inner = "";

      if (section.rows) {
        inner = `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;">
          ${section.rows
            .map(
              (row) => `<tr>
                <td style="padding:6px 12px 6px 0;color:#64748b;white-space:nowrap;vertical-align:top;width:170px;">${escapeHtml(row.label)}</td>
                <td style="padding:6px 0;color:#0f172a;font-weight:500;vertical-align:top;">${escapeHtml(row.value)}</td>
              </tr>`
            )
            .join("")}
        </table>`;
      }

      if (section.list) {
        inner = `<ul style="margin:0;padding-left:20px;font-size:14px;color:#0f172a;">
          ${section.list.map((item) => `<li style="margin:4px 0;">${escapeHtml(item)}</li>`).join("")}
        </ul>`;
      }

      if (section.body) {
        inner = `<p style="margin:0;padding:12px 14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;font-size:14px;line-height:1.6;color:#0f172a;white-space:pre-wrap;">${escapeHtml(section.body)}</p>`;
      }

      return `<div style="margin:0 0 24px;">
        <h2 style="margin:0 0 10px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#1652f0;font-weight:700;">${escapeHtml(section.heading)}</h2>
        ${inner}
      </div>`;
    })
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;padding:28px;">
      <h1 style="margin:0 0 6px;font-size:20px;color:#0f172a;">New Corevia Inquiry</h1>
      <p style="margin:0 0 20px;font-size:14px;color:#64748b;">
        From ${escapeHtml(data.fullName)}${data.businessName.trim() ? ` at ${escapeHtml(data.businessName.trim())}` : ""}
      </p>
      ${banner}
      ${body}
      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
        Sent automatically by the Corevia website inquiry form.
      </p>
    </div>
  </body>
</html>`;
}
