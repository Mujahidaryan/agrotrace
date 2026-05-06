# ADR 002 — Real-time Updates: 30-Second Polling over WebSockets

**Date:** 2025-05  
**Status:** Accepted  
**Decider:** Engineering  

## Context

Shipment statuses and alerts change frequently enough that stale data is
misleading. The user accepted 30-second polling as sufficient.

## Decision

Implement client-side polling with `useInterval` inside a custom `usePolling`
hook. Each data-heavy page fetches its required API endpoint every 30 seconds.
Polling pauses when the browser tab is hidden (via `visibilitychange` event).

## Consequences

**Accepted:**
- 30-second maximum staleness in all views
- Each open tab generates ~120 API requests/hour (4 endpoints × 30s interval)
  — negligible at current scale (Railway Postgres can handle 500+ concurrent connections)
- No infrastructure changes required (no WebSocket server, no Pub/Sub)

**Advantages:**
- Zero additional dependencies or services
- Works with Vercel's serverless function model (no persistent connections)
- Resilient to network interruptions (next poll cycle recovers automatically)
- Straightforward to reason about and test

## Rejected Alternatives

- **Supabase Realtime / WebSockets:** Requires either Supabase or a stateful
  server (not compatible with Vercel's serverless model without significant
  infrastructure addition). Chosen DB is Railway Postgres, which has no built-in
  Realtime channel.
- **Server-Sent Events (SSE):** Would require a long-lived connection, which
  Vercel function timeout (10s on Pro, 60s on Enterprise) makes unreliable.
- **WebSocket via Ably/Pusher:** Adds a third-party cost and dependency for
  a latency improvement (30s → <1s) that is not required by internal users.

## Migration Path

If sub-30s latency becomes a requirement: add Ably or Pusher. The `usePolling`
hook can be replaced with a `useChannel` hook from their SDKs without touching
any component or API route code.
