// src/app/api/map/route.ts
import { NextResponse } from 'next/server';
import { isDatabaseAvailable } from '@/db/client';
import { getMapRoutes, getSupplyNodes } from '@/db/queries';
import { MAP_ROUTES, SUPPLY_NODES } from '@/lib/data';

export async function GET() {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ success: true, routes: MAP_ROUTES, nodes: SUPPLY_NODES });
  }
  try {
    const [routes, nodes] = await Promise.all([getMapRoutes(), getSupplyNodes()]);
    return NextResponse.json({ success: true, routes, nodes }, { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' } });
  } catch (err) {
    console.error('[GET /api/map]', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ success: false, error: { code: 'QUERY_FAILED', message: 'Failed to retrieve map data' } }, { status: 500 });
  }
}
