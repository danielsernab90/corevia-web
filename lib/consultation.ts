/**
 * Consultation booking form option keys.
 * Labels come from next-intl (`BookConsultation.form.*`) — never hardcode copy here.
 */

export const industryOptions = [
  "accounting",
  "architecture",
  "construction",
  "dental",
  "ecommerce",
  "education",
  "healthcare",
  "hospitality",
  "hr",
  "insurance",
  "legal",
  "logistics",
  "manufacturing",
  "marketing",
  "nonprofit",
  "professional",
  "realEstate",
  "restaurant",
  "retail",
  "software",
  "wholesale",
  "other",
] as const;

export const roleOptions = [
  "owner",
  "founder",
  "ceo",
  "executive",
  "operations",
  "it",
  "office",
  "department",
  "consultant",
  "other",
] as const;

export const companySizeOptions = [
  "solo",
  "small",
  "medium",
  "large",
  "enterprise",
] as const;

export const serviceOptions = [
  "aiSolutions",
  "aiAssistants",
  "workflowAutomation",
  "customSoftware",
  "webApps",
  "mobileApps",
  "crmErp",
  "dashboards",
  "analytics",
  "integrations",
  "cloudMigration",
  "processConsulting",
  "digitalTransformation",
  "websiteDesign",
  "techSupport",
  "other",
] as const;

/**
 * Marketing attribution — how the lead discovered Corevia.
 * Stable option keys for CRM / analytics (labels live in next-intl).
 */
export const leadSourceOptions = [
  "businessCard",
  "website",
  "google",
  "socialMedia",
  "referral",
  "other",
] as const;

export const audienceKeys = [
  "healthcare",
  "dental",
  "accounting",
  "legal",
  "construction",
  "realEstate",
  "restaurants",
  "retail",
  "professional",
  "manufacturing",
  "software",
  "smb",
] as const;

export const outcomeKeys = [
  "assessment",
  "aiAnalysis",
  "roadmap",
  "estimate",
] as const;

export const processStepKeys = [
  "learn",
  "identify",
  "recommend",
  "nextSteps",
] as const;

export const faqKeys = [
  "free",
  "duration",
  "technical",
  "after",
  "industries",
  "integrate",
] as const;

export const trustKeys = [
  "personalized",
  "noObligation",
  "actionable",
] as const;

export type IndustryOption = (typeof industryOptions)[number];
export type RoleOption = (typeof roleOptions)[number];
export type CompanySizeOption = (typeof companySizeOptions)[number];
export type ServiceOption = (typeof serviceOptions)[number];
export type LeadSourceOption = (typeof leadSourceOptions)[number];

export type ConsultationFormData = {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  /** Optional — name of the person who referred the lead. */
  referredBy: string;
  /**
   * Required marketing attribution (CRM `lead_source`).
   * Empty string only while the field is unanswered in the UI.
   */
  leadSource: LeadSourceOption | "";
  /**
   * Who handed the business card when `leadSource === "businessCard"`.
   * `null` when that source is not selected (hidden field).
   */
  businessCardFrom: string | null;
  industry: IndustryOption | "";
  role: RoleOption | "";
  companySize: CompanySizeOption | "";
  services: ServiceOption[];
  otherService: string;
  challenge: string;
};

/** True when the business-card attribution follow-up should be collected. */
export function isBusinessCardLeadSource(
  leadSource: ConsultationFormData["leadSource"]
): boolean {
  return leadSource === "businessCard";
}
