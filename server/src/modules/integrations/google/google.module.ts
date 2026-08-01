import { Module } from "@nestjs/common";

import { GoogleAuthService } from "./google-auth.service";
import { GoogleDriveService } from "./google-drive.service";
import { GoogleSheetsService } from "./google-sheets.service";

/**
 * Google provider module.
 *
 * Exports product services for domain modules (Leads, Notifications, etc.).
 * Authentication is internal: inject GoogleSheetsService / GoogleDriveService,
 * not GoogleAuthService, unless you are adding another Google product service
 * inside this folder (Gmail, Calendar).
 *
 * Dependency graph:
 *   GoogleSheetsService ──► GoogleAuthService
 *   GoogleDriveService  ──► GoogleAuthService
 */
@Module({
  providers: [GoogleAuthService, GoogleSheetsService, GoogleDriveService],
  exports: [GoogleSheetsService, GoogleDriveService, GoogleAuthService],
})
export class GoogleModule {}
