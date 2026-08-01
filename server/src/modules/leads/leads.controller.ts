import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { CreateLeadDto } from "./dto/create-lead.dto";
import type { LeadListResponse, LeadResponseDto } from "./dto/lead-response.dto";
import { ListLeadsQueryDto } from "./dto/list-leads-query.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { UpdateLeadStatusDto } from "./dto/update-lead-status.dto";
import { LeadsService } from "./leads.service";

/**
 * REST boundary for leads.
 * No business logic or SQL — delegates entirely to {@link LeadsService}.
 */
@Controller("api/v1/leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() dto: CreateLeadDto): LeadResponseDto {
    return this.leadsService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListLeadsQueryDto): LeadListResponse {
    // Already shaped as { data, meta } — ResponseInterceptor passes it through.
    return this.leadsService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string): LeadResponseDto {
    return this.leadsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadDto
  ): LeadResponseDto {
    return this.leadsService.update(id, dto);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadStatusDto
  ): LeadResponseDto {
    return this.leadsService.updateStatus(id, dto);
  }
}
