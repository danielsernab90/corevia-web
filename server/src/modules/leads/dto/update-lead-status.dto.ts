import { IsEnum } from "class-validator";

import { LeadStatus } from "../enums/lead-status.enum";

/** Body for PATCH /api/v1/leads/:id/status */
export class UpdateLeadStatusDto {
  @IsEnum(LeadStatus)
  status!: LeadStatus;
}
