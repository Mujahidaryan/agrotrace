# Changelog

All notable changes to AgroTrace follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.
Versions follow [Semantic Versioning](https://semver.org/).

---

## [0.2.0] — 2025-05

### Added
- **PostgreSQL database** (Railway-managed) replacing static `data.ts` mock
- `src/db/client.ts` — singleton Postgres connection with pool (max 10), dev hot-reload safe
- `src/db/queries.ts` — 10 typed query functions; all JOINs in single queries (no N+1)
- `scripts/001_initial_schema.sql` — full schema: 9 tables, 1 view, enums, indexes, triggers
- `scripts/migrate.js` — runs SQL migration files against `DATABASE_URL`
- `scripts/seed.js` — inserts realistic Pakistan supply chain dataset (18 shipments, 20 nodes, 12 products)
- `src/hooks/usePolling.ts` — 30-second polling hook with visibility-pause and stale-data fallback
- `GET /api/map` — new endpoint serving combined routes + nodes for LiveMapCanvas
- `GET /api/health` — liveness probe
- `GET /api/health/ready` — readiness probe (checks DB connectivity)
- `DashboardClient.tsx` — client component with all 4 states: loading skeleton, error+retry, empty, populated
- `ShipmentsTableClient.tsx` — polling-aware shipments table
- `NodeGridClient.tsx` — polling-aware node grid
- `__tests__/unit/utils.test.ts` — 16 unit tests for all utility functions
- `__tests__/unit/queries.test.ts` — DB query tests with mocked postgres client
- `__tests__/integration/api.shipments.test.ts` — API route happy-path and failure-path tests
- `.github/workflows/ci.yml` — 7-stage CI/CD pipeline
- `docs/adr/001-database-postgres-railway.md`
- `docs/adr/002-polling-over-websockets.md`
- `docs/adr/003-no-authentication.md`

### Changed
- All API routes: removed `runtime = 'edge'`; now use Node.js runtime (required by `postgres` package)
- `DashboardCharts` and `AnalyticsCharts` accept data as props instead of importing from `data.ts`
- All pages now fetch from `/api/*` instead of importing static data directly
- `next.config.mjs` adds security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- `package.json` adds `postgres` dependency and `test`, `typecheck`, `db:*` scripts

### Removed
- `src/lib/data.ts` — static mock data (replaced by real DB queries)
- Duplicate route structure: `src/app/dashboard/` and `src/app/shipments/` (consolidated to `src/app/(app)/`)
- `export const runtime = 'edge'` from all API routes

### Fixed
- Double route definitions for `/dashboard`, `/shipments`, `/map`, `/analytics`
- Charts now receive live data; no longer hardcoded to static arrays at module load time

---

## [0.1.0] — 2025-04

### Added
- Initial release: static mock data dashboard
- Next.js 14 App Router with Tailwind CSS design system
- Canvas-based animated supply flow map
- Recharts visualizations (line, bar, area, radar)
- API routes serving static `data.ts` (no database)
- Pakistan supply chain dataset (locations, nodes, products, shipments, alerts)
