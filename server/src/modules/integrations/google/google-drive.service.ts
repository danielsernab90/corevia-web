import { Injectable, Logger } from "@nestjs/common";

import { GoogleAuthService } from "./google-auth.service";
import { GOOGLE_LEADS_BACKUP_PATH } from "./google.constants";

/**
 * JSON backup document stored at {@link GOOGLE_LEADS_BACKUP_PATH}.
 * Version field supports future replace/append strategies without schema churn.
 */
export type GoogleLeadsBackupDocument = {
  /** Monotonic or semver-like backup revision for Command Center. */
  version: number;
  /** ISO timestamp of last write. */
  updatedAt: string;
  /** Full lead snapshot (or append-only log — decided at sync time). */
  leads: unknown[];
};

/**
 * Google Drive integration — ONE JSON backup file: `Backups/leads.json`.
 *
 * Architecture only: no uploads, no folder creation, no sync.
 * Auth always flows through {@link GoogleAuthService}.
 *
 * Planned operations:
 * - readBackup
 * - appendLead (merge into JSON)
 * - replaceBackup (full document write)
 * - nextVersion (versioning helper)
 */
@Injectable()
export class GoogleDriveService {
  private readonly logger = new Logger(GoogleDriveService.name);

  static readonly SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
  ] as const;

  constructor(private readonly googleAuth: GoogleAuthService) {}

  /** Canonical relative path inside Drive for the leads JSON backup. */
  getBackupPath(): string {
    return GOOGLE_LEADS_BACKUP_PATH;
  }

  /**
   * Reads the single leads.json backup document.
   * Stub — will locate `Backups/leads.json` via Drive API later.
   */
  async readBackup(): Promise<GoogleLeadsBackupDocument | null> {
    this.assertReady("readBackup");
    await this.googleAuth.getAuthenticatedClient(GoogleDriveService.SCOPES);
    throw new Error("GoogleDriveService.readBackup() is not implemented yet.");
  }

  /**
   * Appends one lead entry into the JSON backup (read-merge-write).
   * Stub — orchestration of when to call this belongs outside this service.
   */
  async appendLead(_lead: unknown): Promise<GoogleLeadsBackupDocument> {
    this.assertReady("appendLead");
    await this.googleAuth.getAuthenticatedClient(GoogleDriveService.SCOPES);
    throw new Error("GoogleDriveService.appendLead() is not implemented yet.");
  }

  /**
   * Replaces the entire backup document and bumps version.
   */
  async replaceBackup(
    _document: Omit<GoogleLeadsBackupDocument, "version" | "updatedAt"> & {
      version?: number;
    }
  ): Promise<GoogleLeadsBackupDocument> {
    this.assertReady("replaceBackup");
    await this.googleAuth.getAuthenticatedClient(GoogleDriveService.SCOPES);
    throw new Error("GoogleDriveService.replaceBackup() is not implemented yet.");
  }

  /**
   * Computes the next backup version number from an existing document.
   * Pure helper — safe to use once sync is implemented.
   */
  nextVersion(current: GoogleLeadsBackupDocument | null): number {
    if (!current) return 1;
    return current.version + 1;
  }

  /**
   * Ensures the Backups folder + leads.json file exist.
   * Stub — still a single-file strategy; never create parallel backup files.
   */
  async ensureBackupFile(): Promise<string> {
    this.assertReady("ensureBackupFile");
    await this.googleAuth.getAuthenticatedClient(GoogleDriveService.SCOPES);
    throw new Error("GoogleDriveService.ensureBackupFile() is not implemented yet.");
  }

  private assertReady(method: string): void {
    const status = this.googleAuth.getCredentialsStatus();
    if (!status.configured) {
      this.logger.debug(
        `GoogleDriveService.${method}() — Google auth not configured (architecture stub).`
      );
    }
  }
}
