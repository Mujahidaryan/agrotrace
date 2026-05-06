// src/db/client.ts
// Singleton Postgres client. Uses the `postgres` npm package.
// DATABASE_URL is validated lazily (inside createClient) so that
// Next.js can import this module during build without crashing.
// The validation only throws when an API route actually executes a query.

import postgres from 'postgres';

// In dev, store on global to survive Next.js hot reloads without
// exhausting the connection pool.
const g = globalThis as typeof globalThis & { __pg?: postgres.Sql };

function createClient(): postgres.Sql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Add it to .env.local (dev) or Vercel / Railway environment variables.'
    );
  }
  return postgres(url, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,



    onnotice: () => {},
  });
}

const sql: postgres.Sql =
  process.env.NODE_ENV === 'production'
    ? createClient()
    : (g.__pg ??= createClient());

export default sql;
