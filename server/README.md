# COREVIA API (`server/`)

Shared NestJS REST API for the COREVIA ecosystem.

**Clients (HTTP only — no shared internals):**

- COREVIA Website
- Daniel Command Center
- Future: Mobile App, AI Assistant, CRM, Admin Portal

## Architecture

```text
Controller → Service → Repository → SQLite
   DTOs        rules      SQL only
```

Feature modules live under `src/modules/`. Controllers stay thin. Business logic belongs in services. Persistence is isolated behind repositories so SQLite can be replaced later without touching HTTP contracts.

### Modules

| Module | Status |
|--------|--------|
| `leads` | Implemented |
| `integrations` | Architecture shell (Google Auth / Sheets / Drive) |
| `consultations` | Placeholder shell |
| `analytics` | Placeholder shell |
| `projects` | Placeholder shell |
| `tasks` | Placeholder shell |
| `dashboard` | Placeholder shell |
| `notifications` | Placeholder shell |

Third-party providers live under `src/modules/integrations/` — see that folder’s README. Domain modules must never call vendor SDKs directly.

## Getting started

```bash
cd server
npm install
npm run start:dev
```

Default URL: [http://localhost:4000](http://localhost:4000)

Optional env:

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port (default `4000`) |
| `COREVIA_API_DB_PATH` | Absolute path to SQLite file (default `server/data/corevia-api.sqlite`) |

## Leads API

Base path: `/api/v1/leads`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/leads` | Create lead (`status` forced to `New`) |
| `GET` | `/api/v1/leads` | List leads (`status`, `language`, `page`, `limit`) |
| `GET` | `/api/v1/leads/:id` | Get one lead |
| `PATCH` | `/api/v1/leads/:id` | Partial update (not status) |
| `PATCH` | `/api/v1/leads/:id/status` | Update pipeline status |

### Lead statuses

`New` · `Contacted` · `Qualified` · `Proposal Sent` · `Won` · `Lost` · `Archive`

### Example — create

```bash
curl -sS -X POST http://localhost:4000/api/v1/leads \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Maria",
    "lastName": "Delgado",
    "businessName": "Delgado Dental",
    "email": "maria@delgadodental.com",
    "phone": "+13055558842",
    "projectDescription": "Automate insurance follow-ups",
    "leadSource": "businessCard",
    "businessCardAdvisor": "Daniel Serna",
    "language": "en"
  }'
```

Responses are wrapped as `{ "data": ... }` (list endpoints also include `meta` for pagination).

## How to add the next module

1. Copy `src/modules/leads/` as a template.
2. Add `entity` / `enums` / `dto` / `repository` / `service` / `controller`.
3. Register the module in `src/app.module.ts`.
4. Keep SQL inside the repository; keep HTTP-only code in the controller.
5. Document endpoints in this README.

## Out of scope (for now)

- Auth / API keys
- Dashboard aggregations
- Website form wiring (existing Next.js `/api/inquiry` remains unchanged)
- Writing into Command Station’s `corevia_inquiries` table
