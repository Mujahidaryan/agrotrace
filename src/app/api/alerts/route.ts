// src/app/api/alerts/route.ts
import { NextResponse } from 'next/server';
import { getAlerts } from '@/db/queries';
import type { Alert } from '@/types';

const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    type: 'temperature_breach',
    severity: 'critical',
    shipment_id: 'mock-2',
    node_id: 'n3',
    title: 'Cold Chain Breach — AGT-0002',
    description: 'Temperature exceeded 6°C threshold for Mango shipment AGT-0002. Freshness score dropping.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    resolved: false,
    resolved_at: undefined,
  },
  {
    id: 'a2',
    type: 'delay',
    severity: 'high',
    shipment_id: 'mock-2',
    node_id: undefined,
    title: 'Shipment Delayed — AGT-0002',
    description: 'AGT-0002 delayed by 5.5 hours due to adverse weather conditions on N-55 highway.',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    resolved: false,
    resolved_at: undefined,
  },
  {
    id: 'a3',
    type: 'capacity_critical',
    severity: 'medium',
    shipment_id: undefined,
    node_id: 'n7',
    title: 'High Capacity — Sukkur Cotton Warehouse',
    description: 'Sukkur Cotton Warehouse is at 60% capacity. Plan redistribution before next cotton harvest.',
    created_at: new Date(Date.now() - 14400000).toISOString(),
    resolved: false,
    resolved_at: undefined,
  },
  {
    id: 'a4',
    type: 'customs_hold',
    severity: 'high',
    shipment_id: undefined,
    node_id: 'n2',
    title: 'Customs Inspection Backlog — Karachi Port',
    description: 'Export clearance at Karachi Port experiencing 12-hour delays due to increased inspection volumes.',
    created_at: new Date(Date.now() - 21600000).toISOString(),
    resolved: false,
    resolved_at: undefined,
  },
  {
    id: 'a5',
    type: 'route_disruption',
    severity: 'low',
    shipment_id: undefined,
    node_id: undefined,
    title: 'Route Advisory — N-5 National Highway',
    description: 'Minor road works on N-5 between Lahore and Rawalpindi. Expect 1-2 hour delays for truck shipments.',
    created_at: new Date(Date.now() - 43200000).toISOString(),
    resolved: false,
    resolved_at: undefined,
  },
];

const MOCK_RESOLVED: Alert[] = [
  {
    id: 'a6',
    type: 'delay',
    severity: 'medium',
    shipment_id: 'mock-4',
    node_id: undefined,
    title: 'Delay Resolved — AGT-0004',
    description: 'AGT-0004 delivery delay has been resolved. Shipment delivered successfully.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    resolved: true,
    resolved_at: new Date(Date.now() - 82800000).toISOString(),
  },
];

export async function GET() {
  try {
    const { active, resolved } = await getAlerts();
    return NextResponse.json({
      success: true,
      active,
      resolved,
      counts: {
        critical: active.filter(a => a.severity === 'critical').length,
        high:     active.filter(a => a.severity === 'high').length,
        medium:   active.filter(a => a.severity === 'medium').length,
        low:      active.filter(a => a.severity === 'low').length,
      },
    });
  } catch (err) {
    console.error('[GET /api/alerts] DB unavailable, falling back to mock data', err instanceof Error ? err.message : String(err));
    return NextResponse.json({
      success: true,
      active: MOCK_ALERTS,
      resolved: MOCK_RESOLVED,
      counts: {
        critical: MOCK_ALERTS.filter(a => a.severity === 'critical').length,
        high:     MOCK_ALERTS.filter(a => a.severity === 'high').length,
        medium:   MOCK_ALERTS.filter(a => a.severity === 'medium').length,
        low:      MOCK_ALERTS.filter(a => a.severity === 'low').length,
      },
    });
  }
}
