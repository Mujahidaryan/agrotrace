// src/app/api/nodes/route.ts
import { NextResponse } from 'next/server';
import { getSupplyNodes } from '@/db/queries';

export async function GET() {
  try {
    const nodes = await getSupplyNodes();
    return NextResponse.json(
      { success: true, data: nodes },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err) {
    console.error('[GET /api/nodes]', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { success: false, error: { code: 'QUERY_FAILED', message: 'Failed to retrieve nodes' } },
      { status: 500 }
    );
  }
}
