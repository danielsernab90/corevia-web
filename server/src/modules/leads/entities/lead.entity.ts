import type { LeadStatus } from "../enums/lead-status.enum";

/** Supported UI languages for leads captured from the website. */
export type LeadLanguage = "en" | "es";

/**
 * Canonical Lead domain model.
 * Controllers never return raw DB rows — they map through this shape / DTOs.
 */
export type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  businessName: string | null;
  email: string;
  phone: string;
  projectDescription: string | null;
  leadSource: string | null;
  businessCardAdvisor: string | null;
  language: LeadLanguage;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
};

/** Persistence row (snake_case) before mapping to {@link Lead}. */
export type LeadRow = {
  id: string;
  first_name: string;
  last_name: string;
  business_name: string | null;
  email: string;
  phone: string;
  project_description: string | null;
  lead_source: string | null;
  business_card_advisor: string | null;
  language: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export function mapLeadRow(row: LeadRow): Lead {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    businessName: row.business_name,
    email: row.email,
    phone: row.phone,
    projectDescription: row.project_description,
    leadSource: row.lead_source,
    businessCardAdvisor: row.business_card_advisor,
    language: row.language as LeadLanguage,
    status: row.status as LeadStatus,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
