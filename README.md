# AgroTrace — Food Supply Intelligence Platform

Real-time food supply chain tracking for Sindh & Punjab, with global export monitoring. Shipment data stored in PostgreSQL (Railway), served via Next.js API routes, displayed with 30-second client-side polling.

**Data sources:** Pakistan Bureau of Statistics (PBS), TDAP, FAO agricultural datasets.

---

## Architecture

```
Browser (Next.js App Router)
  └─ Client components poll /api/* every 30s via usePolling hook
  
API Routes (Node.js runtime, Vercel)
  └─ src/app/api/*/route.ts
  └─ Read-only queries via postgres package
  
PostgreSQL (Railway)
  └─ 14 tables, 1 view (delay_analytics_view)
  └─ Seeded with realistic Pakistan supply chain dataset
```

Architecture decisions are documented in `/docs/adr/`.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| npm | 10+ |
| PostgreSQL | 15+ (or Railway-managed) |
| psql CLI | Any (for running migrations locally) |

---

## Local Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd agrotrace
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local — set DATABASE_URL to your Railway or local Postgres URL

# 3. Run migrations
npm run db:migrate

# 4. Seed the database (realistic Pakistan dataset)
npm run db:seed

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | **Yes** | Postgres connection string: `postgresql://user:pass@host:5432/dbname` |
| `NEXT_PUBLIC_APP_URL` | Yes | App URL (used in OG tags) |
| `NEXT_PUBLIC_APP_NAME` | No | Defaults to `AgroTrace` |
| `NEXT_PUBLIC_ENABLE_LIVE_MAP` | No | Enables the canvas map (default: `true`) |
| `NEXT_PUBLIC_ENABLE_EXPORT_CSV` | No | Enables CSV export button (default: `true`) |

See `.env.example` for full reference with type annotations.

---

## Database

### Railway Setup

1. Create a new Railway project
2. Add a Postgres database service
3. Copy the connection string from Railway → Postgres → Connect → Public URL
4. Add to `.env.local` as `DATABASE_URL`

### Migrations

```bash
# Run all migrations in scripts/ directory (ordered by filename)
npm run db:migrate

# Seed with realistic Pakistan dataset (truncates first — do not run in production)
npm run db:seed
```

### Schema Overview

| Table | Purpose |
|-------|---------|
| `locations` | Cities and international destinations with coordinates |
| `supply_nodes` | Farms, warehouses, ports, airports |
| `products` | Commodities with HS codes and shelf life |
| `shipments` | Full tracking records (origin → destination + status) |
| `alerts` | Active risk events (delay, temperature, disruption) |
| `volume_snapshots` | 30-day supply/demand trend data (daily, per region) |
| `region_insights` | Materialized province-level summaries |
| `export_trends` | Monthly international trade flows |
| `map_routes` | Denormalized route data for fast map rendering |
| `delay_analytics_view` | Computed from shipments — no manual refresh needed |

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage report (enforces 80% line / 70% branch minimums)
npm run test:coverage

# Run in watch mode during development
npm run test:watch

# CI mode (no interactive prompts, exits with code)
npm run test:ci
```

Tests live in `__tests__/` with `unit/` and `integration/` subdirectories.
Integration tests mock `@/db/queries` — no test database required.

---

## API Reference

### `GET /api/shipments`

| Param | Type | Description |
|-------|------|-------------|
| `province` | `Sindh \| Punjab` | Filter by origin or destination province |
| `status` | enum | `in_transit`, `delayed`, `delivered`, `customs_hold`, `pending` |
| `mode` | enum | `truck`, `ship`, `air`, `rail` |
| `is_export` | `true \| false` | Filter domestic vs international |
| `product` | string | Case-insensitive product name search |
| `limit` | number | Max results (default 50, cap 200) |

Response envelope: `{ success, data: Shipment[], meta: { total, returned } }`

### `GET /api/analytics`
Returns: `{ success, summary, volume, delays, regions, exports }`

### `GET /api/alerts`
Returns: `{ success, active: Alert[], resolved: Alert[], counts }`

### `GET /api/nodes`
Returns: `{ success, data: SupplyNode[] }`

### `GET /api/map`
Returns: `{ success, routes: MapRoute[], nodes: SupplyNode[] }`

### `GET /api/health`
Liveness probe. Always 200 if process is running.

### `GET /api/health/ready`
Readiness probe. 200 if DB is reachable, 503 otherwise.

---

## Deployment

### Vercel + Railway (recommended)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com) → New Project
3. Add environment variables in Vercel Dashboard → Settings → Environment Variables:
   - `DATABASE_URL` — Railway internal Postgres URL (not public URL, to avoid egress charges)
   - `NEXT_PUBLIC_APP_URL` — Your Vercel deployment URL
4. Vercel auto-deploys on every push to `main`

### Railway internal URL

In Railway: Postgres service → Connect → Internal URL (use this in Vercel for zero-egress billing). Format: `postgresql://postgres:PASSWORD@postgres.railway.internal:5432/railway`

---

## Rollback

If a deployment breaks production:

```bash
# Via Vercel CLI — instant, no rebuild
vercel rollback

# Via Vercel Dashboard → Deployments → select previous → Promote
```

Database rollbacks require the reverse migration script. For the initial schema, this means:
```bash
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# Then re-run migrate + seed
```

---

## Contributing

**Branch naming:** `feat/description`, `fix/description`, `chore/description`  
**Commits:** Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`)  
**PRs:** Must pass all CI checks (lint + typecheck + test + security audit)  
**Coverage:** Must not decrease below 80% line coverage  

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

---

## License

Private — internal use only.
