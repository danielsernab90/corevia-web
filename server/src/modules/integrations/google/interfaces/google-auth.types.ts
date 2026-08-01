/**
 * Auth contracts used by Google product services.
 * Concrete googleapis clients will be wired later behind these types.
 */

/** Opaque credential handle — never expose raw secrets to callers. */
export type GoogleAuthCredentials = {
  /** Service-account or OAuth client email when configured. */
  clientEmail: string | null;
  /** True when env credentials are present and usable. */
  configured: boolean;
};

/**
 * Minimal authenticated client surface Sheets/Drive will consume.
 * Implementation will wrap `google-auth-library` / `googleapis` later.
 */
export type GoogleAuthenticatedClient = {
  /** Bearer access token for Google REST APIs. */
  accessToken: string;
  /** ISO expiry when known. */
  expiresAt: string | null;
};
