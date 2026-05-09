// src/db/client.ts
import postgres from 'postgres';

const g = globalThis as typeof globalThis & { __pg?: postgres.Sql };

export function getSql(): postgres.Sql {
  if (g.__pg) return g.__pg;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('NO_DATABASE_URL');

  // Strip unsupported params that break the postgres npm package
  // (channel_binding=require is a Neon-specific param not supported by this driver)
  const cleanUrl = url
    .replace(/[?&]channel_binding=[^&]*/g, '')
    .replace(/\?&/, '?')
    .replace(/\?$/, '');

  g.__pg = postgres(cleanUrl, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
    ssl: { rejectUnauthorized: false },
    onnotice: () => {},
  });
  return g.__pg;
}

export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

export default getSql;
