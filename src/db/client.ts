// src/db/client.ts
// Singleton Postgres client with graceful mock-data fallback.
// If DATABASE_URL is not set, the app runs on realistic mock data
// from src/lib/data.ts — no database required for demo/preview deploys.

import postgres from 'postgres';

const g = globalThis as typeof globalThis & { __pg?: postgres.Sql };

export function getSql(): postgres.Sql {
  if (g.__pg) return g.__pg;
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Signal to callers that DB is unavailable — they should use mock fallback
    throw new Error('NO_DATABASE_URL');
  }
  g.__pg = postgres(url, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    onnotice: () => {},
  });
  return g.__pg;
}

export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

export default getSql;
