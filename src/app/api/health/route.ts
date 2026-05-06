// src/app/api/health/route.ts
// GET /api/health  — liveness probe (is the process alive?)
// GET /api/health/ready — readiness probe (can it serve traffic?)
//
// Vercel doesn't natively use these, but Railway health checks and
// external uptime monitors (Better Uptime, UptimeRobot) rely on them.

import { NextResponse } from 'next/server';

const START_TIME = Date.now();
const VERSION = process.env.npm_package_version ?? '0.2.0';

/** Liveness: is the process running? Always 200 if the process is alive. */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: VERSION,
    uptime: Math.floor((Date.now() - START_TIME) / 1000),
  });
}
