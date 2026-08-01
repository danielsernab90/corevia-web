/**
 * Stable Google resource identifiers for COREVIA.
 * Keep names/paths here so Sheets and Drive never hardcode product strings.
 */

/** Single spreadsheet that will hold every website / CRM lead row. */
export const GOOGLE_LEADS_SPREADSHEET_NAME = "COREVIA Leads";

/** Single JSON backup object path inside Drive (folder + file). */
export const GOOGLE_LEADS_BACKUP_FOLDER = "Backups";
export const GOOGLE_LEADS_BACKUP_FILENAME = "leads.json";
export const GOOGLE_LEADS_BACKUP_PATH = `${GOOGLE_LEADS_BACKUP_FOLDER}/${GOOGLE_LEADS_BACKUP_FILENAME}`;
