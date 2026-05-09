// src/app/api/shipments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getShipments, getShipmentCount } from '@/db/queries';
import type { ShipmentStatus, TransportMode, Shipment } from '@/types';

// Remove edge runtime — postgres package requires Node.js runtime.
// Vercel automatically handles this; function runs in Node.js lambda.

const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'mock-1',
    tracking_code: 'AGT-0001',
    quantity_tonnes: 24.5,
    transport_mode: 'truck',
    carrier: 'PakLogistics Ltd',
    status: 'in_transit',
    priority: 'high',
    freshness_score: 88,
    temperature_c: 4,
    departure_at: new Date(Date.now() - 86400000).toISOString(),
    eta_at: new Date(Date.now() + 86400000).toISOString(),
    delivered_at: undefined,
    delay_hours: 0,
    delay_reason: undefined,
    route_waypoints: [],
    value_usd: 18500,
    is_export: false,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
    product: {
      id: 'p1', name: 'Wheat', category: 'grains', hs_code: '1001',
      shelf_life_days: 365, requires_cold_chain: false, unit: 'tonne',
      avg_price_usd_per_tonne: 280, season_months: [3, 4, 5],
    },
    origin: {
      id: 'n1', name: 'Lahore Farm Hub', type: 'farm',
      capacity_tonnes: 500, current_load_tonnes: 200, utilization_pct: 40,
      certifications: ['ISO-9001'], is_active: true,
      location: {
        id: 'l1', name: 'Lahore', city: 'Lahore', province: 'Punjab',
        country: 'Pakistan', coordinates: { lat: 31.5204, lng: 74.3587 },
        timezone: 'Asia/Karachi',
      },
    },
    destination: {
      id: 'n2', name: 'Karachi Port Terminal', type: 'port',
      capacity_tonnes: 5000, current_load_tonnes: 2100, utilization_pct: 42,
      certifications: ['ISO-9001', 'HACCP'], is_active: true,
      location: {
        id: 'l2', name: 'Karachi', city: 'Karachi', province: 'Sindh',
        country: 'Pakistan', coordinates: { lat: 24.8607, lng: 67.0011 },
        timezone: 'Asia/Karachi',
      },
    },
  },
  {
    id: 'mock-2',
    tracking_code: 'AGT-0002',
    quantity_tonnes: 8.2,
    transport_mode: 'truck',
    carrier: 'FastFreight PK',
    status: 'delayed',
    priority: 'critical',
    freshness_score: 62,
    temperature_c: 7,
    departure_at: new Date(Date.now() - 172800000).toISOString(),
    eta_at: new Date(Date.now() + 3600000).toISOString(),
    delivered_at: undefined,
    delay_hours: 5.5,
    delay_reason: 'weather',
    route_waypoints: [],
    value_usd: 9200,
    is_export: false,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date().toISOString(),
    product: {
      id: 'p2', name: 'Mangoes', category: 'fruits', hs_code: '0804',
      shelf_life_days: 14, requires_cold_chain: true, unit: 'tonne',
      avg_price_usd_per_tonne: 950, season_months: [5, 6, 7, 8],
    },
    origin: {
      id: 'n3', name: 'Multan Orchard Hub', type: 'farm',
      capacity_tonnes: 300, current_load_tonnes: 180, utilization_pct: 60,
      certifications: ['GlobalGAP'], is_active: true,
      location: {
        id: 'l3', name: 'Multan', city: 'Multan', province: 'Punjab',
        country: 'Pakistan', coordinates: { lat: 30.1575, lng: 71.5249 },
        timezone: 'Asia/Karachi',
      },
    },
    destination: {
      id: 'n4', name: 'Islamabad Distribution Centre', type: 'distribution_center',
      capacity_tonnes: 800, current_load_tonnes: 320, utilization_pct: 40,
      certifications: ['ISO-9001'], is_active: true,
      location: {
        id: 'l4', name: 'Islamabad', city: 'Islamabad', province: 'KPK',
        country: 'Pakistan', coordinates: { lat: 33.6844, lng: 73.0479 },
        timezone: 'Asia/Karachi',
      },
    },
  },
  {
    id: 'mock-3',
    tracking_code: 'AGT-0003',
    quantity_tonnes: 15.0,
    transport_mode: 'ship',
    carrier: 'PakShipping Co',
    status: 'in_transit',
    priority: 'medium',
    freshness_score: 91,
    temperature_c: undefined,
    departure_at: new Date(Date.now() - 43200000).toISOString(),
    eta_at: new Date(Date.now() + 432000000).toISOString(),
    delivered_at: undefined,
    delay_hours: 0,
    delay_reason: undefined,
    route_waypoints: [],
    value_usd: 42000,
    is_export: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    product: {
      id: 'p3', name: 'Basmati Rice', category: 'grains', hs_code: '1006',
      shelf_life_days: 730, requires_cold_chain: false, unit: 'tonne',
      avg_price_usd_per_tonne: 700, season_months: [10, 11, 12],
    },
    origin: {
      id: 'n2', name: 'Karachi Port Terminal', type: 'port',
      capacity_tonnes: 5000, current_load_tonnes: 2100, utilization_pct: 42,
      certifications: ['ISO-9001', 'HACCP'], is_active: true,
      location: {
        id: 'l2', name: 'Karachi', city: 'Karachi', province: 'Sindh',
        country: 'Pakistan', coordinates: { lat: 24.8607, lng: 67.0011 },
        timezone: 'Asia/Karachi',
      },
    },
    destination: {
      id: 'n5', name: 'Dubai Export Hub', type: 'export_hub',
      capacity_tonnes: 10000, current_load_tonnes: 4000, utilization_pct: 40,
      certifications: ['ISO-9001'], is_active: true,
      location: {
        id: 'l5', name: 'Dubai', city: 'Dubai', province: undefined,
        country: 'UAE', coordinates: { lat: 25.2048, lng: 55.2708 },
        timezone: 'Asia/Dubai',
      },
    },
  },
  {
    id: 'mock-4',
    tracking_code: 'AGT-0004',
    quantity_tonnes: 5.8,
    transport_mode: 'truck',
    carrier: 'NorthernHaul',
    status: 'delivered',
    priority: 'low',
    freshness_score: 79,
    temperature_c: 3,
    departure_at: new Date(Date.now() - 259200000).toISOString(),
    eta_at: new Date(Date.now() - 86400000).toISOString(),
    delivered_at: new Date(Date.now() - 82800000).toISOString(),
    delay_hours: 0,
    delay_reason: undefined,
    route_waypoints: [],
    value_usd: 6400,
    is_export: false,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date(Date.now() - 82800000).toISOString(),
    product: {
      id: 'p4', name: 'Potatoes', category: 'vegetables', hs_code: '0701',
      shelf_life_days: 60, requires_cold_chain: true, unit: 'tonne',
      avg_price_usd_per_tonne: 180, season_months: [1, 2, 11, 12],
    },
    origin: {
      id: 'n6', name: 'Peshawar Farm Collective', type: 'farm',
      capacity_tonnes: 400, current_load_tonnes: 150, utilization_pct: 37,
      certifications: [], is_active: true,
      location: {
        id: 'l6', name: 'Peshawar', city: 'Peshawar', province: 'KPK',
        country: 'Pakistan', coordinates: { lat: 34.0151, lng: 71.5249 },
        timezone: 'Asia/Karachi',
      },
    },
    destination: {
      id: 'n4', name: 'Islamabad Distribution Centre', type: 'distribution_center',
      capacity_tonnes: 800, current_load_tonnes: 320, utilization_pct: 40,
      certifications: ['ISO-9001'], is_active: true,
      location: {
        id: 'l4', name: 'Islamabad', city: 'Islamabad', province: 'KPK',
        country: 'Pakistan', coordinates: { lat: 33.6844, lng: 73.0479 },
        timezone: 'Asia/Karachi',
      },
    },
  },
  {
    id: 'mock-5',
    tracking_code: 'AGT-0005',
    quantity_tonnes: 30.0,
    transport_mode: 'rail',
    carrier: 'Pakistan Railways Freight',
    status: 'pending',
    priority: 'medium',
    freshness_score: 95,
    temperature_c: undefined,
    departure_at: new Date(Date.now() + 86400000).toISOString(),
    eta_at: new Date(Date.now() + 259200000).toISOString(),
    delivered_at: undefined,
    delay_hours: 0,
    delay_reason: undefined,
    route_waypoints: [],
    value_usd: 27000,
    is_export: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product: {
      id: 'p5', name: 'Cotton', category: 'processed', hs_code: '5201',
      shelf_life_days: 1825, requires_cold_chain: false, unit: 'tonne',
      avg_price_usd_per_tonne: 900, season_months: [9, 10, 11],
    },
    origin: {
      id: 'n7', name: 'Sukkur Cotton Warehouse', type: 'warehouse',
      capacity_tonnes: 2000, current_load_tonnes: 1200, utilization_pct: 60,
      certifications: ['ISO-9001'], is_active: true,
      location: {
        id: 'l7', name: 'Sukkur', city: 'Sukkur', province: 'Sindh',
        country: 'Pakistan', coordinates: { lat: 27.7052, lng: 68.8574 },
        timezone: 'Asia/Karachi',
      },
    },
    destination: {
      id: 'n1', name: 'Lahore Farm Hub', type: 'farm',
      capacity_tonnes: 500, current_load_tonnes: 200, utilization_pct: 40,
      certifications: ['ISO-9001'], is_active: true,
      location: {
        id: 'l1', name: 'Lahore', city: 'Lahore', province: 'Punjab',
        country: 'Pakistan', coordinates: { lat: 31.5204, lng: 74.3587 },
        timezone: 'Asia/Karachi',
      },
    },
  },
];

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
    console.error('[GET /api/shipments] DB unavailable, falling back to mock data', {
      error: err instanceof Error ? err.message : String(err),
      filters: { province, status, mode, is_export, product, limit },
    });
    return NextResponse.json({
      success: true,
      data: MOCK_SHIPMENTS,
      meta: { total: MOCK_SHIPMENTS.length, returned: MOCK_SHIPMENTS.length },
    });
  }
}
