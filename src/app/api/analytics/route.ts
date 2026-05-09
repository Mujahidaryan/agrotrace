// src/app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import { isDatabaseAvailable } from '@/db/client';
import { getDashboardSummary, getVolumeData, getDelayAnalytics, getRegionInsights, getExportTrends } from '@/db/queries';
import { DASHBOARD_SUMMARY, VOLUME_DATA, DELAY_ANALYTICS, REGION_INSIGHTS, EXPORT_TRENDS } from '@/lib/data';

export async function GET() {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ success: true, summary: DASHBOARD_SUMMARY, volume: VOLUME_DATA, delays: DELAY_ANALYTICS, regions: REGION_INSIGHTS, exports: EXPORT_TRENDS });
  }
  try {
    const [summary, volume, delays, regions, exports] = await Promise.all([getDashboardSummary(), getVolumeData(), getDelayAnalytics(), getRegionInsights(), getExportTrends()]);
    return NextResponse.json({ success: true, summary, volume, delays, regions, exports }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } });
  } catch (err) {
    console.error('[GET /api/analytics]', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ success: false, error: { code: 'QUERY_FAILED', message: 'Failed to retrieve analytics' } }, { status: 500 });
  }
}
