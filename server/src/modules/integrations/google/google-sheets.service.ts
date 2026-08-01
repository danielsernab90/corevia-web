import { Injectable, Logger } from "@nestjs/common";

import { GoogleAuthService } from "./google-auth.service";
import { GOOGLE_LEADS_SPREADSHEET_NAME } from "./google.constants";

/**
 * Row shape that will eventually be appended to "COREVIA Leads".
 * Keep this DTO-like type provider-local; domain modules map into it.
 */
export type GoogleLeadSheetRow = {
  id: string;
  firstName: string;
  lastName: string;
  businessName: string | null;
  email: string;
  phone: string;
  projectDescription: string | null;
  leadSource: string | null;
  businessCardAdvisor: string | null;
  language: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Google Sheets integration — ONE spreadsheet: {@link GOOGLE_LEADS_SPREADSHEET_NAME}.
 *
 * Architecture only: no network calls, no spreadsheet creation, no sync.
 * When implementing:
 * 1. Inject {@link GoogleAuthService} (already done) — never auth independently.
 * 2. Resolve or create the single spreadsheet by name.
 * 3. Append one row per lead; never create additional spreadsheets.
 */
@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name);

  /** Spreadsheet scopes required when auth is wired. */
  static readonly SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
  ] as const;

  constructor(private readonly googleAuth: GoogleAuthService) {}

  /** Canonical product spreadsheet name — never invent a second workbook. */
  getSpreadsheetName(): string {
    return GOOGLE_LEADS_SPREADSHEET_NAME;
  }

  /**
   * Ensures the single "COREVIA Leads" spreadsheet exists and returns its id.
   * Stub — will use Drive/Sheets APIs via {@link GoogleAuthService} later.
   */
  async ensureLeadsSpreadsheet(): Promise<string> {
    this.assertReady("ensureLeadsSpreadsheet");
    await this.googleAuth.getAuthenticatedClient(GoogleSheetsService.SCOPES);
    throw new Error("GoogleSheetsService.ensureLeadsSpreadsheet() is not implemented yet.");
  }

  /**
   * Appends one lead as a new row. Synchronization orchestration lives elsewhere
   * (e.g. LeadsService / NotificationsModule); this method is the Sheets adapter.
   */
  async appendLeadRow(_row: GoogleLeadSheetRow): Promise<void> {
    this.assertReady("appendLeadRow");
    await this.googleAuth.getAuthenticatedClient(GoogleSheetsService.SCOPES);
    throw new Error("GoogleSheetsService.appendLeadRow() is not implemented yet.");
  }

  /**
   * Optional header bootstrap for the single workbook.
   * Stub kept here so future sync does not invent a second spreadsheet.
   */
  async ensureHeaderRow(): Promise<void> {
    this.assertReady("ensureHeaderRow");
    await this.googleAuth.getAuthenticatedClient(GoogleSheetsService.SCOPES);
    throw new Error("GoogleSheetsService.ensureHeaderRow() is not implemented yet.");
  }

  private assertReady(method: string): void {
    const status = this.googleAuth.getCredentialsStatus();
    if (!status.configured) {
      this.logger.debug(
        `GoogleSheetsService.${method}() — Google auth not configured (architecture stub).`
      );
    }
  }
}
