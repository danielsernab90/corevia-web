/**
 * Lead pipeline statuses for CRM / Command Center.
 * Values are durable analytics/CRM keys — do not rename in production.
 */
export enum LeadStatus {
  New = "New",
  Contacted = "Contacted",
  Qualified = "Qualified",
  ProposalSent = "Proposal Sent",
  Won = "Won",
  Lost = "Lost",
  Archive = "Archive",
}

export const LEAD_STATUSES = Object.values(LeadStatus);
