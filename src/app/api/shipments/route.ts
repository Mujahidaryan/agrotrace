// src/app/api/shipments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isDatabaseAvailable } from '@/db/client';
import { getShipments, getShipmentCount } from '@/db/queries';
import { SHIPMENTS } from '@/lib/data';
import type { ShipmentStatus, TransportMode } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const province    = searchParams.get('province') ?? undefined;
  const status      = searchParams.get('status') as ShipmentStatus | null ?? undefined;
  const mode        = searchParams.get('mode') as TransportMode | null ?? undefined;
  const is_export_p = searchParams.get('is_export');
  const product     = searchParams.get('product') ?? undefined;
  const limit       = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);
  const is_export   = is_export_p === null ? undefined : is_export_p === 'true';

  // ── MOCK FALLBACK (no DATABASE_URL set) ───────────────────
  if (!isDatabaseAvailable()) {
    let results = [...SHIPMENTS];
    if (province)    results = results.filter(s => s.origin.location.province === province || s.destination.location.province === province);
    if (status)      results = results.filter(s => s.status === status);
    if (mode)        results = results.filter(s => s.transport_mode === mode);
    if (is_export !== undefined) results = results.filter(s => s.is_export === is_export);
    if (product)     results = results.filter(s => s.product.name.toLowerCase().includes(product.toLowerCase()));
    results = results.slice(0, limit);
    return NextResponse.json(
      { success: true, data: results, meta: { total: SHIPMENTS.length, returned: results.length }, source: 'mock' },
      { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' } }
    );
  }

  // ── LIVE DATABASE ─────────────────────────────────────────
  try {
    const [shipments, total] = await Promise.all([
      getShipments({ province, status, mode, is_export, product, limit }),
      getShipmentCount(),
    ]);
    return NextResponse.json(
      { success: true, data: shipments, meta: { total, returned: shipments.length }, source: 'db' },
      { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' } }
    );
  } catch (err) {
    console.error('[GET /api/shipments]', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { success: false, error: { code: 'QUERY_FAILED', message: 'Failed to retrieve shipments' } },
      { status: 500 }
    );
  }
}
