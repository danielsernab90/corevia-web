import { Injectable, Logger } from "@nestjs/common";

import type {
  GoogleAuthCredentials,
  GoogleAuthenticatedClient,
} from "./interfaces/google-auth.types";

/**
 * Central Google authentication for every Google product service.
 *
 * ---------------------------------------------------------------------------
 * DEPENDENCY RULE
 * ---------------------------------------------------------------------------
 * GoogleSheetsService and GoogleDriveService (and future Gmail / Calendar)
 * MUST inject this service. They must never load credentials or mint tokens
 * themselves — that keeps rotation, scopes, and secret handling in one place.
 *
 * ---------------------------------------------------------------------------
 * FUTURE WIRING
 * ---------------------------------------------------------------------------
 * 1. Add env vars (e.g. GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY).
 * 2. Implement token minting with google-auth-library.
 * 3. Keep this public API stable so product services need no changes.
 */
@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);

  /**
   * Reports whether Google credentials are configured.
   * Architecture-only: always returns unconfigured until secrets are wired.
   */
  getCredentialsStatus(): GoogleAuthCredentials {
    return {
      clientEmail: null,
      configured: false,
    };
  }

  /**
   * Returns an authenticated Google client for Sheets / Drive / etc.
   * Not implemented yet — throws a clear error so callers fail loudly
   * instead of silently talking to Google without credentials.
   */
  async getAuthenticatedClient(
    _scopes: readonly string[]
  ): Promise<GoogleAuthenticatedClient> {
    this.logger.warn(
      "GoogleAuthService.getAuthenticatedClient() called before credentials were configured."
    );
    throw new Error(
      "Google authentication is not configured. Wire credentials in GoogleAuthService before calling Google APIs."
    );
  }

  /**
   * Convenience helper for product services that only need a bearer token.
   */
  async getAccessToken(scopes: readonly string[]): Promise<string> {
    const client = await this.getAuthenticatedClient(scopes);
    return client.accessToken;
  }
}
