// src/app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import {
  getDashboardSummary, getVolumeData, getDelayAnalytics,
  getRegionInsights, getExportTrends,
} from '@/db/queries';
import type { DashboardSummary, VolumeDataPoint, DelayAnalytics, RegionInsight, ExportTrend } from '@/types';

const MOCK_SUMMARY: DashboardSummary = {
  total_shipments: 142,
  active_shipments: 38,
  delayed_shipments: 7,
  delivered_today: 12,
  on_time_rate_pct: 91.2,
  total_volume_tonnes: 4820,
  export_value_usd: 2150000,
  active_alerts: 4,
  active_routes: 22,
};

const MOCK_VOLUME: VolumeDataPoint[] = [
  { date: 'Nov 01', supply_tonnes: 380, demand_tonnes: 360, region: 'Punjab' },
  { date: 'Nov 08', supply_tonnes: 420, demand_tonnes: 400, region: 'Punjab' },
  { date: 'Nov 15', supply_tonnes: 510, demand_tonnes: 480, region: 'Punjab' },
  { date: 'Nov 22', supply_tonnes: 470, demand_tonnes: 490, region: 'Punjab' },
  { date: 'Nov 29', supply_tonnes: 530, demand_tonnes: 510, region: 'Punjab' },
  { date: 'Dec 06', supply_tonnes: 490, demand_tonnes: 470, region: 'Punjab' },
  { date: 'Nov 01', supply_tonnes: 210, demand_tonnes: 230, region: 'Sindh' },
  { date: 'Nov 08', supply_tonnes: 240, demand_tonnes: 220, region: 'Sindh' },
  { date: 'Nov 15', supply_tonnes: 280, demand_tonnes: 260, region: 'Sindh' },
  { date: 'Nov 22', supply_tonnes: 260, demand_tonnes: 270, region: 'Sindh' },
  { date: 'Nov 29', supply_tonnes: 300, demand_tonnes: 290, region: 'Sindh' },
  { date: 'Dec 06', supply_tonnes: 270, demand_tonnes: 280, region: 'Sindh' },
];

const MOCK_DELAYS: DelayAnalytics[] = [
  {
    region: 'Punjab',
    total_shipments: 62,
    delayed_count: 4,
    avg_delay_hours: 3.8,
    delay_rate_pct: 6.5,
    top_reasons: [
      { reason: 'weather', count: 2 },
      { reason: 'mechanical', count: 1 },
      { reason: 'traffic', count: 1 },
    ],
  },
  {
    region: 'Sindh',
    total_shipments: 45,
    delayed_count: 2,
    avg_delay_hours: 5.2,
    delay_rate_pct: 4.4,
    top_reasons: [
      { reason: 'customs', count: 2 },
    ],
  },
  {
    region: 'KPK',
    total_shipments: 23,
    delayed_count: 1,
    avg_delay_hours: 2.1,
    delay_rate_pct: 4.3,
    top_reasons: [
      { reason: 'weather', count: 1 },
    ],
  },
  {
    region: 'Balochistan',
    total_shipments: 12,
    delayed_count: 0,
    avg_delay_hours: 0,
    delay_rate_pct: 0,
    top_reasons: [],
  },
];

const MOCK_REGIONS: RegionInsight[] = [
  {
    province: 'Punjab',
    total_volume_tonnes: 2100,
    active_shipments: 20,
    export_value_usd: 980000,
    top_products: [
      { product: 'Wheat', volume: 850 },
      { product: 'Cotton', volume: 620 },
      { product: 'Mangoes', volume: 430 },
    ],
    yoy_growth_pct: 8.4,
  },
  {
    province: 'Sindh',
    total_volume_tonnes: 1580,
    active_shipments: 12,
    export_value_usd: 740000,
    top_products: [
      { product: 'Basmati Rice', volume: 680 },
      { product: 'Cotton', volume: 520 },
      { product: 'Onions', volume: 280 },
    ],
    yoy_growth_pct: 5.1,
  },
  {
    province: 'KPK',
    total_volume_tonnes: 780,
    active_shipments: 5,
    export_value_usd: 310000,
    top_products: [
      { product: 'Potatoes', volume: 340 },
      { product: 'Fruits', volume: 280 },
      { product: 'Vegetables', volume: 160 },
    ],
    yoy_growth_pct: 12.3,
  },
  {
    province: 'Balochistan',
    total_volume_tonnes: 360,
    active_shipments: 1,
    export_value_usd: 120000,
    top_products: [
      { product: 'Dates', volume: 180 },
      { product: 'Apples', volume: 120 },
      { product: 'Pomegranates', volume: 60 },
    ],
    yoy_growth_pct: 3.7,
  },
];

const MOCK_EXPORTS: ExportTrend[] = [
  {
    destination_country: 'UAE',
    month: 'Oct 2025',
    volume_tonnes: 420,
    value_usd: 310000,
    product_breakdown: [
      { product: 'Basmati Rice', pct: 45 },
      { product: 'Mangoes', pct: 30 },
      { product: 'Cotton', pct: 25 },
    ],
  },
  {
    destination_country: 'UAE',
    month: 'Nov 2025',
    volume_tonnes: 480,
    value_usd: 360000,
    product_breakdown: [
      { product: 'Basmati Rice', pct: 48 },
      { product: 'Mangoes', pct: 28 },
      { product: 'Cotton', pct: 24 },
    ],
  },
  {
    destination_country: 'Saudi Arabia',
    month: 'Oct 2025',
    volume_tonnes: 310,
    value_usd: 220000,
    product_breakdown: [
      { product: 'Basmati Rice', pct: 60 },
      { product: 'Wheat', pct: 25 },
      { product: 'Dates', pct: 15 },
    ],
  },
  {
    destination_country: 'Saudi Arabia',
    month: 'Nov 2025',
    volume_tonnes: 340,
    value_usd: 250000,
    product_breakdown: [
      { product: 'Basmati Rice', pct: 58 },
      { product: 'Wheat', pct: 27 },
      { product: 'Dates', pct: 15 },
    ],
  },
  {
    destination_country: 'UK',
    month: 'Oct 2025',
    volume_tonnes: 180,
    value_usd: 195000,
    product_breakdown: [
      { product: 'Basmati Rice', pct: 70 },
      { product: 'Processed', pct: 30 },
    ],
  },
  {
    destination_country: 'UK',
    month: 'Nov 2025',
    volume_tonnes: 200,
    value_usd: 215000,
    product_breakdown: [
      { product: 'Basmati Rice', pct: 68 },
      { product: 'Processed', pct: 32 },
    ],
  },
];

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
    console.error('[GET /api/analytics] DB unavailable, falling back to mock data', err instanceof Error ? err.message : String(err));
    return NextResponse.json({
      success: true,
      summary: MOCK_SUMMARY,
      volume: MOCK_VOLUME,
      delays: MOCK_DELAYS,
      regions: MOCK_REGIONS,
      exports: MOCK_EXPORTS,
    });
  }
}
