// src/app/api/shipments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getShipments, getShipmentCount } from '@/db/queries';
import type { ShipmentStatus, TransportMode } from '@/types';

// Remove edge runtime — postgres package requires Node.js runtime.
// Vercel automatically handles this; function runs in Node.js lambda.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const province    = searchParams.get('province') ?? undefined;
  const status      = searchParams.get('status') as ShipmentStatus | null ?? undefined;
  const mode        = searchParams.get('mode') as TransportMode | null ?? undefined;
  const is_export_p = searchParams.get('is_export');
  const product     = searchParams.get('product') ?? undefined;
  const limit       = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);

  const is_export = is_export_p === null
    ? undefined
    : is_export_p === 'true';

  try {
    const [shipments, total] = await Promise.all([
      getShipments({ province, status, mode, is_export, product, limit }),
      getShipmentCount(),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: shipments,
        meta: { total, returned: shipments.length },
      },
      {
        headers: {
          'Cache-Control': 's-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (err) {
    // Log server-side with enough context to debug. Never expose raw DB errors.
    console.error('[GET /api/shipments]', {
      error: err instanceof Error ? err.message : String(err),
      filters: { province, status, mode, is_export, product, limit },
    });
    return NextResponse.json(
      {
        success: false,
        error: { code: 'QUERY_FAILED', message: 'Failed to retrieve shipments' },
      },
      { status: 500 }
    );
  }
}
