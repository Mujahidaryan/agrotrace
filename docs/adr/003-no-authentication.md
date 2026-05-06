# ADR 003 — No Authentication Layer

**Date:** 2025-05  
**Status:** Accepted  
**Decider:** Product / Engineering  

## Context

The user confirmed AgroTrace is an internal tool protected at the network level
(VPN / IP allowlist / private Vercel deployment). Adding authentication would
slow down the initial upgrade without providing value.

## Decision

No authentication. No login screen. No session tokens. No middleware guards.
The Vercel deployment URL is the access control.

## Consequences

**Risk accepted:**
- Anyone with the deployment URL has full read access to supply chain data
- This is acceptable for an internal tool — the URL is not public
- If the URL leaks, the data exposure is supply chain logistics data (sensitive
  but not PII or payment data — no GDPR subject rights implications)

**Mitigation:**
- Vercel's password protection feature (one-click in dashboard, no code change)
  can be enabled immediately if the URL needs to be shared externally
- No data mutation endpoints exist in this build (all GET) — no write exposure

## Migration Path to Add Auth

When needed, add `next-auth` or `Auth.js`:
1. Install `next-auth`
2. Create `src/app/api/auth/[...nextauth]/route.ts`
3. Wrap `src/app/(app)/layout.tsx` with `SessionProvider`
4. Add `src/middleware.ts` that calls `getServerSession()` and redirects to `/login`
5. This change touches 3 files and zero query code

Estimated: 2-4 hours for Google OAuth. Role-based access requires additional
DB table (`user_roles`) and middleware additions.
