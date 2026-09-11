# Corevia Web

Public website foundation for the Corevia brand.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide Icons
- next-intl (EN / ES)
- next-themes
- Vercel-ready

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

### Local-only (this machine)

```bash
npm run dev:local
```

Open [http://localhost:3002](http://localhost:3002).

### LAN remote development (optional)

```bash
npm run dev:remote
# or: ./scripts/dev-remote.sh
```

Then from another device on the same LAN open `http://<this-machine-lan-ip>:3002`.

> **Historical:** Remote access previously used Tailscale mesh / MagicDNS. Tailscale is decommissioned on this MacBook.

Middleware redirects to `/en` or `/es` based on browser language (or the saved `NEXT_LOCALE` cookie).

## Multi-project ports

| App | Port | Bind | Start |
| --- | --- | --- | --- |
| Daniel Command Station | **3000** | `0.0.0.0` | `npm run dev:remote` in that repo |
| Corevia Website | **3002** | `0.0.0.0` | `npm run dev:remote` |
| Corevia API (`server/`) | **4000** | `0.0.0.0` | `cd server && npm run start:dev` |

Website and Command Station must use different ports. Do not run two apps on 3000.

Shared backend API docs: [`server/README.md`](server/README.md).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` / `dev:remote` | Turbopack on `0.0.0.0:3002` (LAN-ready) |
| `npm run dev:local` | Turbopack on `127.0.0.1:3002` only |
| `npm run build` | Production build |
| `npm run start` | Serve production build on `0.0.0.0:3002` |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |

## Remote development architecture (LAN)

```text
Client (browser on LAN)
        │
        │  http://<host-lan-ip>:3002
        ▼
Dev host  next dev --hostname 0.0.0.0 --port 3002
```

- **Why `0.0.0.0`:** Binding only to `localhost` accepts loopback traffic. Remote devices need the process listening on all interfaces.
- **Why `allowedDevOrigins`:** Next.js 15+ guards `/_next/*` in development. This repo auto-allowlists detected LAN IPv4 addresses (override with `ALLOWED_DEV_ORIGINS=host1,host2`).
- **API CORS:** `corevia-api` auto-allowlists localhost plus this machine’s LAN IPv4 origins on ports 3000/3002. Add extras with `ALLOWED_ORIGINS=http://host:port,...` (see [`server/README.md`](server/README.md)).
- **Avoid port conflicts:** Keep Corevia on **3002** and Daniel Command Station on **3000**. Check with `lsof -nP -iTCP:3000,3002 -sTCP:LISTEN`.
- **Best practices:** Use `dev:local` for day-to-day work; use `dev:remote` when another LAN device must hit this machine; never commit secrets in `.env.local`.

## Project structure

```text
app/[locale]/     Locale-aware routes
components/       layout / sections / shared / ui
hooks/            Client hooks
i18n/             Routing, navigation, request config
lib/              Shared helpers (site config, cn)
messages/         Translation JSON (en, es)
public/           images / logos / icons
server/           Shared NestJS REST API (Leads + future modules)
styles/           Global CSS
types/            Shared TypeScript types
utils/            Small pure helpers (as needed)
```

## Internationalization

- Locales are defined in `i18n/routing.ts`
- Messages live in `messages/{locale}.json`
- To add a language: append the locale code and add a matching messages file

## Deployment (Vercel)

1. Import this repository in Vercel
2. Set `NEXT_PUBLIC_SITE_URL` to the production domain
3. Deploy (framework preset: Next.js)

No custom `vercel.json` is required for the current setup.
