import { Injectable, NotFoundException } from "@nestjs/common";

import { CreateLeadDto } from "./dto/create-lead.dto";
import {
  LeadResponseDto,
  type LeadListResponse,
} from "./dto/lead-response.dto";
import { ListLeadsQueryDto } from "./dto/list-leads-query.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { UpdateLeadStatusDto } from "./dto/update-lead-status.dto";
import { LeadStatus } from "./enums/lead-status.enum";
import { LeadsRepository } from "./leads.repository";

/**
 * Lead business rules. Controllers stay thin; SQL stays in the repository.
 */
@Injectable()
export class LeadsService {
  constructor(private readonly leadsRepository: LeadsRepository) {}

  create(dto: CreateLeadDto): LeadResponseDto {
    const lead = this.leadsRepository.create({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      businessName: normalizeOptional(dto.businessName),
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone.trim(),
      projectDescription: normalizeOptional(dto.projectDescription),
      leadSource: normalizeOptional(dto.leadSource),
      businessCardAdvisor: normalizeOptional(dto.businessCardAdvisor),
      language: dto.language,
      status: LeadStatus.New,
    });

    return LeadResponseDto.fromEntity(lead);
  }

  findAll(query: ListLeadsQueryDto): LeadListResponse {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const result = this.leadsRepository.findAll({
      status: query.status,
      language: query.language,
      page,
      limit,
    });

    return {
      data: result.items.map(LeadResponseDto.fromEntity),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.max(1, Math.ceil(result.total / result.limit)),
      },
    };
  }

  findOne(id: string): LeadResponseDto {
    const lead = this.leadsRepository.findById(id);
    if (!lead) {
      throw new NotFoundException(`Lead "${id}" was not found.`);
    }
    return LeadResponseDto.fromEntity(lead);
  }

  update(id: string, dto: UpdateLeadDto): LeadResponseDto {
    this.ensureExists(id);

    const lead = this.leadsRepository.update(id, {
      firstName: dto.firstName?.trim(),
      lastName: dto.lastName?.trim(),
      businessName:
        dto.businessName === undefined
          ? undefined
          : normalizeOptional(dto.businessName),
      email: dto.email?.trim().toLowerCase(),
      phone: dto.phone?.trim(),
      projectDescription:
        dto.projectDescription === undefined
          ? undefined
          : normalizeOptional(dto.projectDescription),
      leadSource:
        dto.leadSource === undefined
          ? undefined
          : normalizeOptional(dto.leadSource),
      businessCardAdvisor:
        dto.businessCardAdvisor === undefined
          ? undefined
          : normalizeOptional(dto.businessCardAdvisor),
      language: dto.language,
    });

    if (!lead) {
      throw new NotFoundException(`Lead "${id}" was not found.`);
    }

    return LeadResponseDto.fromEntity(lead);
  }

  updateStatus(id: string, dto: UpdateLeadStatusDto): LeadResponseDto {
    this.ensureExists(id);

    const lead = this.leadsRepository.update(id, { status: dto.status });
    if (!lead) {
      throw new NotFoundException(`Lead "${id}" was not found.`);
    }

    return LeadResponseDto.fromEntity(lead);
  }

  private ensureExists(id: string): void {
    if (!this.leadsRepository.findById(id)) {
      throw new NotFoundException(`Lead "${id}" was not found.`);
    }
  }
}

function normalizeOptional(
  value: string | null | undefined
): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
