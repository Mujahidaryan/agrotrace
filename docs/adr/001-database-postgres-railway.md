# ADR 001 — Database: Plain Postgres on Railway

**Date:** 2025-05  
**Status:** Accepted  
**Decider:** Engineering  

## Context

AgroTrace v0.1 used static mock data in `src/lib/data.ts`. The upgrade
requires a real persistent database. The original README suggested Supabase.
The user explicitly chose Railway + plain Postgres over Supabase.

## Decision

Use Railway-managed Postgres accessed directly via the `postgres` npm package.

## Consequences

**Accepted trade-offs:**
- No built-in Auth (consistent with the decision to skip auth entirely)
- No built-in Realtime (polling at 30s is accepted instead of WebSocket push)
- No automatic backups in the free tier — must configure Railway's backup add-on
- `postgres` package requires Node.js runtime; Vercel edge functions cannot use it

**Advantages over Supabase:**
- Lower cost at scale (Railway charges per GB stored + compute, not per seat)
- Full SQL control — no PostgREST abstraction leaking into queries
- No vendor lock-in to Supabase's API surface
- Simpler mental model for a team already comfortable with SQL

**Advantages over self-hosted:**
- Managed failover, SSL termination, connection pooler (PgBouncer) available
- Zero-downtime migrations via Railway's rolling restarts

## Rejected Alternatives

- **Supabase:** Adds Auth, Realtime, and Storage. Over-engineered for a
  no-auth internal tool. Cost model (per-project limits on free tier) would
  force a paid plan sooner.
- **PlanetScale / Neon:** Serverless Postgres is a better fit for Vercel's
  edge runtime. Since we need Node.js runtime anyway (for the `postgres` pkg),
  the serverless advantage disappears. Neon's branching feature is useful for
  preview environments but not needed at this stage.
- **SQLite via Turso:** Not appropriate for multi-region or multi-user access.
