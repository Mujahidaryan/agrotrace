// src/app/api/alerts/route.ts
import { NextResponse } from 'next/server';
import { getAlerts } from '@/db/queries';

export async function GET() {
  try {
    const { active, resolved } = await getAlerts();
    return NextResponse.json({
      success: true,
      active,
      resolved,
      counts: {
        critical: active.filter(a => a.severity === 'critical').length,
        high:     active.filter(a => a.severity === 'high').length,
        medium:   active.filter(a => a.severity === 'medium').length,
        low:      active.filter(a => a.severity === 'low').length,
      },
    });
  } catch (err) {
    console.error('[GET /api/alerts]', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { success: false, error: { code: 'QUERY_FAILED', message: 'Failed to retrieve alerts' } },
      { status: 500 }
    );
  }
}
