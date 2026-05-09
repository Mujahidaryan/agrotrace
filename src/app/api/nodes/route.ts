// src/app/api/nodes/route.ts
import { NextResponse } from 'next/server';
import { getSupplyNodes } from '@/db/queries';
import type { SupplyNode } from '@/types';

const MOCK_NODES: SupplyNode[] = [
  {
    id: 'n1', name: 'Lahore Farm Hub', type: 'farm',
    capacity_tonnes: 500, current_load_tonnes: 200, utilization_pct: 40,
    certifications: ['ISO-9001'], is_active: true,
    location: {
      id: 'l1', name: 'Lahore', city: 'Lahore', province: 'Punjab',
      country: 'Pakistan', coordinates: { lat: 31.5204, lng: 74.3587 },
      timezone: 'Asia/Karachi',
    },
  },
  {
    id: 'n2', name: 'Karachi Port Terminal', type: 'port',
    capacity_tonnes: 5000, current_load_tonnes: 2100, utilization_pct: 42,
    certifications: ['ISO-9001', 'HACCP'], is_active: true,
    location: {
      id: 'l2', name: 'Karachi', city: 'Karachi', province: 'Sindh',
      country: 'Pakistan', coordinates: { lat: 24.8607, lng: 67.0011 },
      timezone: 'Asia/Karachi',
    },
  },
  {
    id: 'n3', name: 'Multan Orchard Hub', type: 'farm',
    capacity_tonnes: 300, current_load_tonnes: 180, utilization_pct: 60,
    certifications: ['GlobalGAP'], is_active: true,
    location: {
      id: 'l3', name: 'Multan', city: 'Multan', province: 'Punjab',
      country: 'Pakistan', coordinates: { lat: 30.1575, lng: 71.5249 },
      timezone: 'Asia/Karachi',
    },
  },
  {
    id: 'n4', name: 'Islamabad Distribution Centre', type: 'distribution_center',
    capacity_tonnes: 800, current_load_tonnes: 320, utilization_pct: 40,
    certifications: ['ISO-9001'], is_active: true,
    location: {
      id: 'l4', name: 'Islamabad', city: 'Islamabad', province: 'KPK',
      country: 'Pakistan', coordinates: { lat: 33.6844, lng: 73.0479 },
      timezone: 'Asia/Karachi',
    },
  },
  {
    id: 'n5', name: 'Quetta Cold Store', type: 'warehouse',
    capacity_tonnes: 600, current_load_tonnes: 210, utilization_pct: 35,
    certifications: [], is_active: true,
    location: {
      id: 'l5', name: 'Quetta', city: 'Quetta', province: 'Balochistan',
      country: 'Pakistan', coordinates: { lat: 30.1798, lng: 66.9750 },
      timezone: 'Asia/Karachi',
    },
  },
  {
    id: 'n6', name: 'Peshawar Farm Collective', type: 'farm',
    capacity_tonnes: 400, current_load_tonnes: 150, utilization_pct: 37,
    certifications: [], is_active: true,
    location: {
      id: 'l6', name: 'Peshawar', city: 'Peshawar', province: 'KPK',
      country: 'Pakistan', coordinates: { lat: 34.0151, lng: 71.5249 },
      timezone: 'Asia/Karachi',
    },
  },
  {
    id: 'n7', name: 'Sukkur Cotton Warehouse', type: 'warehouse',
    capacity_tonnes: 2000, current_load_tonnes: 1200, utilization_pct: 60,
    certifications: ['ISO-9001'], is_active: true,
    location: {
      id: 'l7', name: 'Sukkur', city: 'Sukkur', province: 'Sindh',
      country: 'Pakistan', coordinates: { lat: 27.7052, lng: 68.8574 },
      timezone: 'Asia/Karachi',
    },
  },
  {
    id: 'n8', name: 'Faisalabad Agro Export Hub', type: 'export_hub',
    capacity_tonnes: 1500, current_load_tonnes: 900, utilization_pct: 60,
    certifications: ['ISO-9001', 'GlobalGAP'], is_active: true,
    location: {
      id: 'l8', name: 'Faisalabad', city: 'Faisalabad', province: 'Punjab',
      country: 'Pakistan', coordinates: { lat: 31.4504, lng: 73.1350 },
      timezone: 'Asia/Karachi',
    },
  },
];

export async function GET() {
  try {
    const nodes = await getSupplyNodes();
    return NextResponse.json(
      { success: true, data: nodes },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err) {
    console.error('[GET /api/nodes] DB unavailable, falling back to mock data', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ success: true, data: MOCK_NODES });
  }
}
