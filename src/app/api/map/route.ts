// src/app/api/map/route.ts
import { NextResponse } from 'next/server';
import { getMapRoutes, getSupplyNodes } from '@/db/queries';
import type { MapRoute, SupplyNode } from '@/types';

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

const MOCK_ROUTES: MapRoute[] = [
  {
    id: 'r1',
    from: { lat: 31.5204, lng: 74.3587, label: 'Lahore Farm Hub' },
    to:   { lat: 24.8607, lng: 67.0011, label: 'Karachi Port Terminal' },
    type: 'truck',
    transport_mode: 'truck',
    status: 'in_transit',
    product: 'Wheat',
    volume_tonnes: 24.5,
    is_export: false,
  },
  {
    id: 'r2',
    from: { lat: 30.1575, lng: 71.5249, label: 'Multan Orchard Hub' },
    to:   { lat: 33.6844, lng: 73.0479, label: 'Islamabad Distribution Centre' },
    type: 'truck',
    transport_mode: 'truck',
    status: 'delayed',
    product: 'Mangoes',
    volume_tonnes: 8.2,
    is_export: false,
  },
  {
    id: 'r3',
    from: { lat: 24.8607, lng: 67.0011, label: 'Karachi Port Terminal' },
    to:   { lat: 25.2048, lng: 55.2708, label: 'Dubai Export Hub' },
    type: 'ship',
    transport_mode: 'ship',
    status: 'in_transit',
    product: 'Basmati Rice',
    volume_tonnes: 15.0,
    is_export: true,
  },
  {
    id: 'r4',
    from: { lat: 27.7052, lng: 68.8574, label: 'Sukkur Cotton Warehouse' },
    to:   { lat: 31.5204, lng: 74.3587, label: 'Lahore Farm Hub' },
    type: 'rail',
    transport_mode: 'rail',
    status: 'pending',
    product: 'Cotton',
    volume_tonnes: 30.0,
    is_export: false,
  },
];

export async function GET() {
  try {
    const [routes, nodes] = await Promise.all([getMapRoutes(), getSupplyNodes()]);
    return NextResponse.json(
      { success: true, routes, nodes },
      { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' } }
    );
  } catch (err) {
    console.error('[GET /api/map] DB unavailable, falling back to mock data', err instanceof Error ? err.message : String(err));
    return NextResponse.json({
      success: true,
      routes: MOCK_ROUTES,
      nodes: MOCK_NODES,
    });
  }
}
