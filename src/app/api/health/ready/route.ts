// src/app/api/health/ready/route.ts
// Readiness: can the process serve traffic? Checks DB connection.
// Returns 503 if the database is unreachable.

import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/db/queries';

const VERSION = process.env.npm_package_version ?? '0.2.0';
const START_TIME = Date.now();

export async function GET() {
  const dbHealthy = await checkDatabaseHealth();

  const body = {
    status: dbHealthy ? 'ready' : 'not_ready',
    version: VERSION,
    uptime: Math.floor((Date.now() - START_TIME) / 1000),
    checks: {
      database: dbHealthy ? 'ok' : 'unreachable',
    },
  };

  return NextResponse.json(body, { status: dbHealthy ? 200 : 503 });
}
