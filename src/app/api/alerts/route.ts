// src/app/api/alerts/route.ts
import { NextResponse } from 'next/server';
import { isDatabaseAvailable } from '@/db/client';
import { getAlerts } from '@/db/queries';
import { ALERTS } from '@/lib/data';

export async function GET() {
  if (!isDatabaseAvailable()) {
    const active = ALERTS.filter(a => !a.resolved);
    const resolved = ALERTS.filter(a => a.resolved);
    return NextResponse.json({ success: true, active, resolved, counts: { critical: active.filter(a => a.severity === 'critical').length, high: active.filter(a => a.severity === 'high').length, medium: active.filter(a => a.severity === 'medium').length, low: active.filter(a => a.severity === 'low').length } });
  }
  try {
    const { active, resolved } = await getAlerts();
    return NextResponse.json({ success: true, active, resolved, counts: { critical: active.filter(a => a.severity === 'critical').length, high: active.filter(a => a.severity === 'high').length, medium: active.filter(a => a.severity === 'medium').length, low: active.filter(a => a.severity === 'low').length } });
  } catch (err) {
    console.error('[GET /api/alerts]', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ success: false, error: { code: 'QUERY_FAILED', message: 'Failed to retrieve alerts' } }, { status: 500 });
  }
}
