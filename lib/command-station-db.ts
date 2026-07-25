import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Shared Command Station SQLite path — same as daniel-command-station
 * `app/lib/local-db/db.ts` getUserDataPath() + data.db.
 */
export function getCommandStationDbPath(): string {
  const override = process.env.COMMAND_STATION_DB_PATH?.trim();
  if (override) return override;

  return path.join(
    os.homedir(),
    "Library/Application Support/cesar-property-management",
    "data.db"
  );
}

/**
 * Matches Command Station's CoreVia owner id so rows align with that app's
 * user-scoped queries if/when an inquiries UI is added there.
 */
export const COMMAND_STATION_USER_ID =
  "ce14af6b-869e-4dff-921a-ede620d8eb34";

export type CoreviaInquiryInsert = {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  referredBy: string;
  industry: string;
  role: string;
  companySize: string;
  services: string[];
  otherService: string;
  challenge: string;
  source?: string;
};

/**
 * NEW TABLE — no existing CoreVia website-lead table was found.
 * `referral_clients` is for paid/referral clients (no email/phone columns,
 * requires deal_type). `deals` is real-estate underwriting.
 *
 * Created here with CREATE TABLE IF NOT EXISTS so first inquiry migrates
 * the shared Command Station DB safely.
 */
const ENSURE_COREVIA_INQUIRIES_SQL = `
CREATE TABLE IF NOT EXISTS corevia_inquiries (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  full_name TEXT NOT NULL,
  business_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  referred_by TEXT,
  industry TEXT,
  role TEXT,
  company_size TEXT,
  services TEXT,
  other_service TEXT,
  challenge TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_corevia_inquiries_created
  ON corevia_inquiries (created_at DESC);
`;

function ensureReferredByColumn(db: Database.Database): void {
  const columns = db
    .prepare(`PRAGMA table_info(corevia_inquiries)`)
    .all() as Array<{ name: string }>;
  if (!columns.some((column) => column.name === "referred_by")) {
    db.exec(`ALTER TABLE corevia_inquiries ADD COLUMN referred_by TEXT`);
  }
}

let dbInstance: Database.Database | null = null;

export function getCommandStationDb(): Database.Database {
  if (dbInstance) return dbInstance;

  const dbPath = getCommandStationDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    throw new Error(
      `Command Station data directory not found at ${dir}. Is Command Station installed?`
    );
  }
  if (!fs.existsSync(dbPath)) {
    throw new Error(
      `Command Station database not found at ${dbPath}. Open Command Station once to initialize it.`
    );
  }

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(ENSURE_COREVIA_INQUIRIES_SQL);
  ensureReferredByColumn(db);
  dbInstance = db;
  return db;
}

export function insertCoreviaInquiry(data: CoreviaInquiryInsert): void {
  const db = getCommandStationDb();

  db.prepare(
    `INSERT INTO corevia_inquiries (
      id,
      user_id,
      full_name,
      business_name,
      email,
      phone,
      referred_by,
      industry,
      role,
      company_size,
      services,
      other_service,
      challenge,
      source,
      status
    ) VALUES (
      @id,
      @userId,
      @fullName,
      @businessName,
      @email,
      @phone,
      @referredBy,
      @industry,
      @role,
      @companySize,
      @services,
      @otherService,
      @challenge,
      @source,
      'new'
    )`
  ).run({
    id: data.id,
    userId: COMMAND_STATION_USER_ID,
    fullName: data.fullName,
    businessName: data.businessName.trim() ? data.businessName.trim() : null,
    email: data.email,
    phone: data.phone,
    referredBy: data.referredBy.trim() ? data.referredBy.trim() : null,
    industry: data.industry || null,
    role: data.role || null,
    companySize: data.companySize || null,
    services: JSON.stringify(data.services),
    otherService: data.otherService.trim() ? data.otherService.trim() : null,
    challenge: data.challenge,
    source: data.source ?? "website",
  });
}
