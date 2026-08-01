# Integrations module

Central third-party adapter layer for the COREVIA API.

## Dependency rules

```text
Domain modules (Leads, Notifications, …)
        │  inject services
        ▼
IntegrationsModule
        │
        ├── google/     GoogleAuthService ← Sheets + Drive
        ├── stripe/     (future)
        ├── slack/      (future)
        ├── twilio/     (future)
        ├── meta/       (future)
        ├── whatsapp/   (future)
        └── openai/     (future)
```

- UI clients talk only to NestJS HTTP APIs.
- Only integration services talk to vendor SDKs / REST APIs.
- Shared vendor auth stays in one service per provider (e.g. `GoogleAuthService`).

## Google (current)

| Service | Role |
|---------|------|
| `GoogleAuthService` | Single auth/token entry point |
| `GoogleSheetsService` | One spreadsheet: **COREVIA Leads** |
| `GoogleDriveService` | One JSON backup: **Backups/leads.json** |

No credentials, network calls, or synchronization are wired yet — method contracts only.

## Adding a provider

1. `mkdir src/modules/integrations/<name>`
2. Implement `<name>.module.ts` + services
3. Import/export from `integrations.module.ts`
4. Inject from domain modules via `IntegrationsModule`
