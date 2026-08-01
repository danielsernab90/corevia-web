import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

/**
 * Shared SQLite connection for the COREVIA API.
 * Path: COREVIA_API_DB_PATH env, or server/data/corevia-api.sqlite by default.
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private db!: Database.Database;

  get connection(): Database.Database {
    return this.db;
  }

  onModuleInit(): void {
    const dbPath = resolveDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("foreign_keys = ON");
    this.ensureSchema();
    this.logger.log(`SQLite ready at ${dbPath}`);
  }

  onModuleDestroy(): void {
    this.db?.close();
  }

  private ensureSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        business_name TEXT,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        project_description TEXT,
        lead_source TEXT,
        business_card_advisor TEXT,
        language TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
      CREATE INDEX IF NOT EXISTS idx_leads_language ON leads (language);
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
    `);
  }
}

function resolveDbPath(): string {
  const override = process.env.COREVIA_API_DB_PATH?.trim();
  if (override) return path.resolve(override);
  return path.resolve(__dirname, "../../data/corevia-api.sqlite");
}
