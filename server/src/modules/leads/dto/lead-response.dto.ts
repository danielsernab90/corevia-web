import type { Lead, LeadLanguage } from "../entities/lead.entity";
import type { LeadStatus } from "../enums/lead-status.enum";

/**
 * Stable API response shape for a Lead.
 * Kept explicit so clients do not depend on entity internals.
 */
export class LeadResponseDto {
  id!: string;
  firstName!: string;
  lastName!: string;
  businessName!: string | null;
  email!: string;
  phone!: string;
  projectDescription!: string | null;
  leadSource!: string | null;
  businessCardAdvisor!: string | null;
  language!: LeadLanguage;
  status!: LeadStatus;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(lead: Lead): LeadResponseDto {
    const dto = new LeadResponseDto();
    dto.id = lead.id;
    dto.firstName = lead.firstName;
    dto.lastName = lead.lastName;
    dto.businessName = lead.businessName;
    dto.email = lead.email;
    dto.phone = lead.phone;
    dto.projectDescription = lead.projectDescription;
    dto.leadSource = lead.leadSource;
    dto.businessCardAdvisor = lead.businessCardAdvisor;
    dto.language = lead.language;
    dto.status = lead.status;
    dto.createdAt = lead.createdAt.toISOString();
    dto.updatedAt = lead.updatedAt.toISOString();
    return dto;
  }
}

export type LeadListResponse = {
  data: LeadResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
