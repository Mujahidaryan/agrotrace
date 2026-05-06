// src/db/queries.ts
// All database queries for AgroTrace.
// Pattern: each function maps 1:1 to an API route need.
// No business logic here — only data retrieval and transformation.
// Business logic (filtering, aggregation) stays in API route handlers.

import sql from './client';
import type {
  Shipment, SupplyNode, Alert, DashboardSummary,
  VolumeDataPoint, DelayAnalytics, RegionInsight, ExportTrend, MapRoute,
} from '@/types';

// ─────────────────────────────────────────────────────────────
// SHIPMENTS
// ─────────────────────────────────────────────────────────────

export interface ShipmentFilters {
  province?: string;
  status?: string;
  mode?: string;
  is_export?: boolean;
  product?: string;
  limit?: number;
}

/**
 * Fetch shipments with optional filters.
 * N+1 prevention: origin, destination, and product are joined in a single query.
 * Indexes relied on: idx_shipments_status, idx_shipments_is_export, idx_shipments_transport_mode
 */
export async function getShipments(filters: ShipmentFilters = {}): Promise<Shipment[]> {
  const { province, status, mode, is_export, product, limit = 50 } = filters;

  const rows = await sql<Shipment[]>`
    SELECT
      s.id,
      s.tracking_code,
      s.quantity_tonnes,
      s.transport_mode,
      s.carrier,
      s.status,
      s.priority,
      s.freshness_score,
      s.temperature_c,
      s.departure_at,
      s.eta_at,
      s.delivered_at,
      s.delay_hours,
      s.delay_reason,
      s.route_waypoints,
      s.value_usd,
      s.is_export,
      s.created_at,
      s.updated_at,
      -- product JSON
      jsonb_build_object(
        'id', p.id, 'name', p.name, 'category', p.category,
        'hs_code', p.hs_code, 'shelf_life_days', p.shelf_life_days,
        'requires_cold_chain', p.requires_cold_chain, 'unit', p.unit,
        'avg_price_usd_per_tonne', p.avg_price_usd_per_tonne,
        'season_months', p.season_months
      ) AS product,
      -- origin node JSON
      jsonb_build_object(
        'id', on_.id, 'name', on_.name, 'type', on_.type,
        'capacity_tonnes', on_.capacity_tonnes,
        'current_load_tonnes', on_.current_load_tonnes,
        'utilization_pct', on_.utilization_pct,
        'certifications', on_.certifications, 'is_active', on_.is_active,
        'location', jsonb_build_object(
          'id', ol.id, 'name', ol.name, 'city', ol.city,
          'province', ol.province, 'country', ol.country,
          'coordinates', jsonb_build_object('lat', ol.lat, 'lng', ol.lng),
          'timezone', ol.timezone
        )
      ) AS origin,
      -- destination node JSON
      jsonb_build_object(
        'id', dn.id, 'name', dn.name, 'type', dn.type,
        'capacity_tonnes', dn.capacity_tonnes,
        'current_load_tonnes', dn.current_load_tonnes,
        'utilization_pct', dn.utilization_pct,
        'certifications', dn.certifications, 'is_active', dn.is_active,
        'location', jsonb_build_object(
          'id', dl.id, 'name', dl.name, 'city', dl.city,
          'province', dl.province, 'country', dl.country,
          'coordinates', jsonb_build_object('lat', dl.lat, 'lng', dl.lng),
          'timezone', dl.timezone
        )
      ) AS destination
    FROM shipments s
    JOIN products p ON p.id = s.product_id
    JOIN supply_nodes on_ ON on_.id = s.origin_id
    JOIN locations ol ON ol.id = on_.location_id
    JOIN supply_nodes dn ON dn.id = s.destination_id
    JOIN locations dl ON dl.id = dn.location_id
    WHERE
      (${ status ?? null } IS NULL OR s.status = ${ status ?? null })
      AND (${ mode ?? null } IS NULL OR s.transport_mode = ${ mode ?? null })
      AND (${ is_export ?? null } IS NULL OR s.is_export = ${ is_export ?? null })
      AND (${ product ?? null } IS NULL OR p.name ILIKE ${'%' + (product ?? '') + '%'})
      AND (
        ${ province ?? null } IS NULL
        OR ol.province = ${ province ?? null }
        OR dl.province = ${ province ?? null }
      )
    ORDER BY s.created_at DESC
    LIMIT ${ limit }
  `;

  return rows;
}

export async function getShipmentCount(): Promise<number> {
  const [row] = await sql<[{ count: string }]>`SELECT count(*) FROM shipments`;
  return parseInt(row.count, 10);
}

// ─────────────────────────────────────────────────────────────
// SUPPLY NODES
// ─────────────────────────────────────────────────────────────

export async function getSupplyNodes(): Promise<SupplyNode[]> {
  const rows = await sql<SupplyNode[]>`
    SELECT
      n.id, n.name, n.type,
      n.capacity_tonnes, n.current_load_tonnes, n.utilization_pct,
      n.certifications, n.is_active,
      jsonb_build_object(
        'id', l.id, 'name', l.name, 'city', l.city,
        'province', l.province, 'country', l.country,
        'coordinates', jsonb_build_object('lat', l.lat, 'lng', l.lng),
        'timezone', l.timezone
      ) AS location
    FROM supply_nodes n
    JOIN locations l ON l.id = n.location_id
    WHERE n.is_active = true
    ORDER BY n.type, n.name
  `;
  return rows;
}

// ─────────────────────────────────────────────────────────────
// ALERTS
// ─────────────────────────────────────────────────────────────

export async function getAlerts(): Promise<{ active: Alert[]; resolved: Alert[] }> {
  const rows = await sql<Alert[]>`
    SELECT * FROM alerts
    ORDER BY
      CASE severity
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        ELSE 4
      END,
      created_at DESC
    LIMIT 100
  `;

  return {
    active: rows.filter(a => !a.resolved),
    resolved: rows.filter(a => a.resolved),
  };
}

// ─────────────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────────────

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [row] = await sql<[DashboardSummary]>`
    SELECT
      (SELECT count(*) FROM shipments)::int                                           AS total_shipments,
      (SELECT count(*) FROM shipments WHERE status = 'in_transit')::int               AS active_shipments,
      (SELECT count(*) FROM shipments WHERE status = 'delayed')::int                  AS delayed_shipments,
      (SELECT count(*) FROM shipments
        WHERE status = 'delivered'
          AND delivered_at >= now() - interval '24 hours')::int                       AS delivered_today,
      ROUND(
        (SELECT count(*) FILTER (WHERE status = 'delivered')::numeric /
         NULLIF(count(*), 0) * 100
         FROM shipments
         WHERE created_at >= now() - interval '30 days'), 1
      )                                                                               AS on_time_rate_pct,
      COALESCE((SELECT sum(quantity_tonnes)
        FROM shipments WHERE status = 'in_transit'), 0)                               AS total_volume_tonnes,
      COALESCE((SELECT sum(value_usd)
        FROM shipments
        WHERE is_export = true
          AND created_at >= now() - interval '30 days'), 0)                           AS export_value_usd,
      (SELECT count(*) FROM alerts WHERE resolved = false)::int                       AS active_alerts,
      (SELECT count(DISTINCT id) FROM shipments WHERE status = 'in_transit')::int     AS active_routes
  `;
  return row;
}

export async function getVolumeData(): Promise<VolumeDataPoint[]> {
  const rows = await sql<VolumeDataPoint[]>`
    SELECT
      to_char(day, 'Mon DD') AS date,
      region,
      COALESCE(supply_tonnes, 0) AS supply_tonnes,
      COALESCE(demand_tonnes, 0) AS demand_tonnes
    FROM volume_snapshots
    WHERE day >= now() - interval '30 days'
    ORDER BY day ASC, region ASC
  `;
  return rows;
}

export async function getDelayAnalytics(): Promise<DelayAnalytics[]> {
  const rows = await sql<DelayAnalytics[]>`
    SELECT
      region,
      total_shipments,
      delayed_count,
      ROUND(avg_delay_hours, 1)                                   AS avg_delay_hours,
      ROUND(delayed_count::numeric / NULLIF(total_shipments, 0) * 100, 2) AS delay_rate_pct,
      top_reasons
    FROM delay_analytics_view
    ORDER BY delay_rate_pct DESC
  `;
  return rows;
}

export async function getRegionInsights(): Promise<RegionInsight[]> {
  const rows = await sql<RegionInsight[]>`
    SELECT
      province,
      total_volume_tonnes,
      active_shipments,
      export_value_usd,
      top_products,
      yoy_growth_pct
    FROM region_insights
    ORDER BY province
  `;
  return rows;
}

export async function getExportTrends(): Promise<ExportTrend[]> {
  const rows = await sql<ExportTrend[]>`
    SELECT
      destination_country,
      to_char(month, 'Mon YYYY')      AS month,
      volume_tonnes,
      value_usd,
      product_breakdown
    FROM export_trends
    WHERE month >= now() - interval '6 months'
    ORDER BY month DESC, value_usd DESC
  `;
  return rows;
}

// ─────────────────────────────────────────────────────────────
// MAP ROUTES
// ─────────────────────────────────────────────────────────────

export async function getMapRoutes(): Promise<MapRoute[]> {
  const rows = await sql<MapRoute[]>`
    SELECT
      id,
      jsonb_build_object('lat', from_lat, 'lng', from_lng, 'label', from_label) AS "from",
      jsonb_build_object('lat', to_lat,   'lng', to_lng,   'label', to_label)   AS "to",
      transport_mode                                                              AS type,
      transport_mode,
      status,
      product,
      volume_tonnes,
      is_export
    FROM map_routes
    WHERE status != 'cancelled'
    ORDER BY is_export DESC, volume_tonnes DESC
  `;
  return rows;
}

// ─────────────────────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────────────────────

/** Returns true if the database connection is healthy. */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
