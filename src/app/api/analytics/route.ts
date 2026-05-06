// src/app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import {
  getDashboardSummary, getVolumeData, getDelayAnalytics,
  getRegionInsights, getExportTrends,
} from '@/db/queries';

export async function GET() {
  try {
    // Parallelise all five queries — they have no dependencies on each other.
    const [summary, volume, delays, regions, exports] = await Promise.all([
      getDashboardSummary(),
      getVolumeData(),
      getDelayAnalytics(),
      getRegionInsights(),
      getExportTrends(),
    ]);

    return NextResponse.json(
      { success: true, summary, volume, delays, regions, exports },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err) {
    console.error('[GET /api/analytics]', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { success: false, error: { code: 'QUERY_FAILED', message: 'Failed to retrieve analytics' } },
      { status: 500 }
    );
  }
}
