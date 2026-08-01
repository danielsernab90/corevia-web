import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { DatabaseService } from "../../database/database.service";
import {
  mapLeadRow,
  type Lead,
  type LeadLanguage,
  type LeadRow,
} from "./entities/lead.entity";
import type { LeadStatus } from "./enums/lead-status.enum";

export type CreateLeadRecord = {
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
};

export type UpdateLeadRecord = Partial<
  Omit<CreateLeadRecord, "status"> & { status: LeadStatus }
>;

export type ListLeadsFilter = {
  status?: LeadStatus;
  language?: LeadLanguage;
  page: number;
  limit: number;
};

export type ListLeadsResult = {
  items: Lead[];
  total: number;
  page: number;
  limit: number;
};

/**
 * Persistence for leads. All SQL stays here so Postgres (etc.) can replace
 * SQLite without touching the service or controller.
 */
@Injectable()
export class LeadsRepository {
  constructor(private readonly database: DatabaseService) {}

  create(input: CreateLeadRecord): Lead {
    const id = randomUUID();
    const now = new Date().toISOString();

    this.database.connection
      .prepare(
        `INSERT INTO leads (
          id,
          first_name,
          last_name,
          business_name,
          email,
          phone,
          project_description,
          lead_source,
          business_card_advisor,
          language,
          status,
          created_at,
          updated_at
        ) VALUES (
          @id,
          @firstName,
          @lastName,
          @businessName,
          @email,
          @phone,
          @projectDescription,
          @leadSource,
          @businessCardAdvisor,
          @language,
          @status,
          @createdAt,
          @updatedAt
        )`
      )
      .run({
        id,
        firstName: input.firstName,
        lastName: input.lastName,
        businessName: input.businessName,
        email: input.email,
        phone: input.phone,
        projectDescription: input.projectDescription,
        leadSource: input.leadSource,
        businessCardAdvisor: input.businessCardAdvisor,
        language: input.language,
        status: input.status,
        createdAt: now,
        updatedAt: now,
      });

    const created = this.findById(id);
    if (!created) {
      throw new Error("Lead insert succeeded but row could not be read.");
    }
    return created;
  }

  findById(id: string): Lead | null {
    const row = this.database.connection
      .prepare(`SELECT * FROM leads WHERE id = ?`)
      .get(id) as LeadRow | undefined;

    return row ? mapLeadRow(row) : null;
  }

  findAll(filter: ListLeadsFilter): ListLeadsResult {
    const where: string[] = [];
    const params: Record<string, string | number> = {};

    if (filter.status) {
      where.push("status = @status");
      params.status = filter.status;
    }
    if (filter.language) {
      where.push("language = @language");
      params.language = filter.language;
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
    const totalRow = this.database.connection
      .prepare(`SELECT COUNT(*) AS count FROM leads ${whereSql}`)
      .get(params) as { count: number };

    const offset = (filter.page - 1) * filter.limit;
    const rows = this.database.connection
      .prepare(
        `SELECT * FROM leads
         ${whereSql}
         ORDER BY created_at DESC
         LIMIT @limit OFFSET @offset`
      )
      .all({ ...params, limit: filter.limit, offset }) as LeadRow[];

    return {
      items: rows.map(mapLeadRow),
      total: totalRow.count,
      page: filter.page,
      limit: filter.limit,
    };
  }

  update(id: string, patch: UpdateLeadRecord): Lead | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const next: CreateLeadRecord & { status: LeadStatus } = {
      firstName: patch.firstName ?? existing.firstName,
      lastName: patch.lastName ?? existing.lastName,
      businessName:
        patch.businessName !== undefined
          ? patch.businessName
          : existing.businessName,
      email: patch.email ?? existing.email,
      phone: patch.phone ?? existing.phone,
      projectDescription:
        patch.projectDescription !== undefined
          ? patch.projectDescription
          : existing.projectDescription,
      leadSource:
        patch.leadSource !== undefined ? patch.leadSource : existing.leadSource,
      businessCardAdvisor:
        patch.businessCardAdvisor !== undefined
          ? patch.businessCardAdvisor
          : existing.businessCardAdvisor,
      language: patch.language ?? existing.language,
      status: patch.status ?? existing.status,
    };

    const updatedAt = new Date().toISOString();

    this.database.connection
      .prepare(
        `UPDATE leads SET
          first_name = @firstName,
          last_name = @lastName,
          business_name = @businessName,
          email = @email,
          phone = @phone,
          project_description = @projectDescription,
          lead_source = @leadSource,
          business_card_advisor = @businessCardAdvisor,
          language = @language,
          status = @status,
          updated_at = @updatedAt
        WHERE id = @id`
      )
      .run({
        id,
        ...next,
        updatedAt,
      });

    return this.findById(id);
  }
}
