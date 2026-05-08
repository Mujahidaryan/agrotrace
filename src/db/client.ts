// src/db/client.ts
// Singleton Postgres client. Uses the `postgres` npm package.
// getSql() is lazy — it only creates the client on first call,
// so Next.js can import this module at build time without DATABASE_URL set.

import postgres from 'postgres';

const g = globalThis as typeof globalThis & { __pg?: postgres.Sql };

export function getSql(): postgres.Sql {
  if (g.__pg) return g.__pg;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Add it to .env.local (dev) or Vercel / Railway environment variables.'
    );
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

// Keep default export as a convenience alias
export default getSql;
