/**
 * src/db/queries.ts
 *
 * All database query functions for AgroTrace.
 * Uses the `postgres` (postgres.js) package — requires Node.js runtime (NOT edge).
 * Connected to Neon via DATABASE_URL environment variable.
 *
 * Schema is auto-initialised on first cold start via initSchema().
 */

import postgres from 'postgres';
import type {
  Shipment,
  SupplyNode,
  Alert,
  DashboardSummary,
  VolumeDataPoint,
  DelayAnalytics,
  RegionInsight,
  ExportTrend,
  MapRoute,
  ShipmentStatus,
  TransportMode,
  Province,
} from '@/types';

// ─────────────────────────────────────────────
// 1. CONNECTION
// ─────────────────────────────────────────────

const connectionString = process.env.DATABASE_URL!;

// Singleton pattern — reuse across warm lambda invocations
declare global {
  // eslint-disable-next-line no-var
  var _pgClient: ReturnType<typeof postgres> | undefined;
}

function getSql() {
  if (!global._pgClient) {
    global._pgClient = postgres(connectionString, {
      ssl: 'require',
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }
  return global._pgClient;
}

// ─────────────────────────────────────────────
// 2. SCHEMA BOOTSTRAP
// Idempotent — safe to run on every cold start.
// ─────────────────────────────────────────────

export async function initSchema() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS supply_nodes (
      id              TEXT PRIMARY KEY,
      name            TEXT NOT NULL,
      type            TEXT NOT NULL,
      city            TEXT NOT NULL,
      province        TEXT,
      country         TEXT NOT NULL DEFAULT 'Pakistan',
      lat             DOUBLE PRECISION NOT NULL,
      lng             DOUBLE PRECISION NOT NULL,
      capacity_tonnes DOUBLE PRECISION NOT NULL DEFAULT 0,
      current_load    DOUBLE PRECISION NOT NULL DEFAULT 0,
      certifications  TEXT[] NOT NULL DEFAULT '{}',
      contact         TEXT,
      is_active       BOOLEAN NOT NULL DEFAULT TRUE,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS shipments (
      id               TEXT PRIMARY KEY,
      tracking_code    TEXT NOT NULL UNIQUE,
      product_name     TEXT NOT NULL,
      product_category TEXT NOT NULL DEFAULT 'grains',
      quantity_tonnes  DOUBLE PRECISION NOT NULL,
      origin_id        TEXT NOT NULL REFERENCES supply_nodes(id),
      destination_id   TEXT NOT NULL REFERENCES supply_nodes(id),
      transport_mode   TEXT NOT NULL,
      carrier          TEXT NOT NULL,
      status           TEXT NOT NULL DEFAULT 'pending',
      priority         TEXT NOT NULL DEFAULT 'medium',
      freshness_score  INT NOT NULL DEFAULT 85,
      temperature_c    DOUBLE PRECISION,
      departure_at     TIMESTAMPTZ NOT NULL,
      eta_at           TIMESTAMPTZ NOT NULL,
      delivered_at     TIMESTAMPTZ,
      delay_hours      DOUBLE PRECISION,
      delay_reason     TEXT,
      value_usd        DOUBLE PRECISION NOT NULL DEFAULT 0,
      is_export        BOOLEAN NOT NULL DEFAULT FALSE,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS alerts (
      id           TEXT PRIMARY KEY,
      type         TEXT NOT NULL,
      severity     TEXT NOT NULL DEFAULT 'medium',
      shipment_id  TEXT REFERENCES shipments(id),
      node_id      TEXT REFERENCES supply_nodes(id),
      title        TEXT NOT NULL,
      description  TEXT NOT NULL,
      resolved     BOOLEAN NOT NULL DEFAULT FALSE,
      resolved_at  TIMESTAMPTZ,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Seed data if empty
  const [{ count }] = await sql<[{ count: string }]>`SELECT COUNT(*)::text AS count FROM supply_nodes`;
  if (parseInt(count) === 0) {
    await seedData(sql);
  }
}

// ─────────────────────────────────────────────
// 3. SEED DATA (Pakistan agricultural supply chain)
// ─────────────────────────────────────────────

async function seedData(sql: ReturnType<typeof postgres>) {
  // ── Nodes ──
  await sql`
    INSERT INTO supply_nodes (id, name, type, city, province, country, lat, lng, capacity_tonnes, current_load, certifications, is_active)
    VALUES
      ('node-khi-port',  'Karachi Port Terminal',        'port',                'Karachi',    'Sindh',         'Pakistan', 24.8607,  67.0011,  500000, 310000, ARRAY['ISO-9001','SPS-Certified'],      TRUE),
      ('node-khi-apt',   'Karachi International Airport','airport',             'Karachi',    'Sindh',         'Pakistan', 24.9008,  67.1681,  50000,  22000,  ARRAY['IATA','Halal-Certified'],        TRUE),
      ('node-lhe-hub',   'Lahore Logistics Hub',         'distribution_center', 'Lahore',     'Punjab',        'Pakistan', 31.5204,  74.3587,  80000,  54000,  ARRAY['ISO-9001'],                     TRUE),
      ('node-fsd-wh',    'Faisalabad Cold Storage',      'warehouse',           'Faisalabad', 'Punjab',        'Pakistan', 31.4154,  73.0791,  30000,  18500,  ARRAY['Cold-Chain-Certified'],         TRUE),
      ('node-mtn-farm',  'Multan Agri Cooperative',      'farm',                'Multan',     'Punjab',        'Pakistan', 30.1575,  71.5249,  15000,  9200,   ARRAY['GlobalG.A.P.'],                 TRUE),
      ('node-hyd-hub',   'Hyderabad Distribution',       'distribution_center', 'Hyderabad',  'Sindh',         'Pakistan', 25.3960,  68.3578,  25000,  16000,  ARRAY['ISO-9001'],                     TRUE),
      ('node-skr-farm',  'Sukkur Rice Farms',            'farm',                'Sukkur',     'Sindh',         'Pakistan', 27.7052,  68.8574,  20000,  14000,  ARRAY['Organic-Certified','GlobalG.A.P.'],TRUE),
      ('node-bwp-wh',    'Bahawalpur Warehouse',         'warehouse',           'Bahawalpur', 'Punjab',        'Pakistan', 29.3956,  71.6722,  18000,  11000,  ARRAY['ISO-9001'],                     TRUE),
      ('node-dxb-exp',   'Dubai Export Hub',             'export_hub',          'Dubai',      NULL,            'UAE',      25.2048,  55.2708,  200000, 80000,  ARRAY['GCC-Certified'],                TRUE),
      ('node-bej-imp',   'Beijing Import Terminal',      'port',                'Beijing',    NULL,            'China',    39.9042,  116.4074, 300000, 120000, ARRAY['CNCA-Certified'],               TRUE),
      ('node-khi-cold',  'Karachi Cold Chain Hub',       'warehouse',           'Karachi',    'Sindh',         'Pakistan', 24.8200,  66.9900,  40000,  28000,  ARRAY['Cold-Chain-Certified','HACCP'],  TRUE),
      ('node-rwp-hub',   'Rawalpindi Transit Hub',       'distribution_center', 'Rawalpindi', 'Punjab',        'Pakistan', 33.5651,  73.0169,  22000,  13000,  ARRAY['ISO-9001'],                     TRUE)
    ON CONFLICT (id) DO NOTHING
  `;

  // ── Shipments ──
  await sql`
    INSERT INTO shipments (id, tracking_code, product_name, product_category, quantity_tonnes, origin_id, destination_id, transport_mode, carrier, status, priority, freshness_score, temperature_c, departure_at, eta_at, delivered_at, delay_hours, delay_reason, value_usd, is_export)
    VALUES
      ('shp-001','AT-2024-001001','Basmati Rice','grains',         1200, 'node-skr-farm', 'node-khi-port', 'truck', 'Pakistan NLC',          'delivered',    'medium', 92, NULL, NOW()-INTERVAL '10 days', NOW()-INTERVAL '8 days',  NOW()-INTERVAL '7 days', NULL,  NULL,                   480000, TRUE),
      ('shp-002','AT-2024-001002','Mangoes (Fresh)','fruits',       85,  'node-mtn-farm', 'node-khi-apt',  'truck', 'TCS Logistics',         'in_transit',   'high',   78, 4.5, NOW()-INTERVAL '2 days',  NOW()+INTERVAL '1 day',   NULL, NULL,  NULL,                   127500, TRUE),
      ('shp-003','AT-2024-001003','Cotton Bales','processed',      950,  'node-fsd-wh',   'node-khi-port', 'rail',  'Pakistan Railways',     'in_transit',   'medium', 88, NULL, NOW()-INTERVAL '3 days',  NOW()+INTERVAL '2 days',  NULL, NULL,  NULL,                   285000, TRUE),
      ('shp-004','AT-2024-001004','Wheat Flour','grains',          2100, 'node-lhe-hub',  'node-hyd-hub',  'truck', 'Daewoo Logistics',      'delivered',    'low',    95, NULL, NOW()-INTERVAL '6 days',  NOW()-INTERVAL '4 days',  NOW()-INTERVAL '3 days', NULL, NULL,                    315000, FALSE),
      ('shp-005','AT-2024-001005','Citrus Fruits','fruits',         320, 'node-fsd-wh',   'node-khi-apt',  'truck', 'TCS Logistics',         'delayed',      'high',   65, 6.0, NOW()-INTERVAL '4 days',  NOW()-INTERVAL '1 day',   NULL, 18.5, 'Road closure on M-2',  240000, TRUE),
      ('shp-006','AT-2024-001006','Vegetables','vegetables',        180, 'node-hyd-hub',  'node-khi-cold', 'truck', 'Pakistan NLC',          'customs_hold', 'critical',72, 3.5, NOW()-INTERVAL '5 days',  NOW()-INTERVAL '2 days',  NULL, 48.0, 'Phytosanitary docs pending', 54000, TRUE),
      ('shp-007','AT-2024-001007','Dates (Dried)','fruits',         420, 'node-mtn-farm', 'node-dxb-exp',  'air',   'PIA Cargo',             'delivered',    'medium', 98, NULL, NOW()-INTERVAL '8 days',  NOW()-INTERVAL '6 days',  NOW()-INTERVAL '5 days', NULL, NULL,                    840000, TRUE),
      ('shp-008','AT-2024-001008','Basmati Rice','grains',         3400, 'node-skr-farm', 'node-bej-imp',  'ship',  'COSCO Pakistan',        'in_transit',   'high',   90, NULL, NOW()-INTERVAL '15 days', NOW()+INTERVAL '10 days', NULL, NULL, NULL,                  1360000, TRUE),
      ('shp-009','AT-2024-001009','Sugarcane','grains',            1800, 'node-hyd-hub',  'node-lhe-hub',  'truck', 'Daewoo Logistics',      'in_transit',   'low',    88, NULL, NOW()-INTERVAL '1 day',   NOW()+INTERVAL '3 days',  NULL, NULL, NULL,                    162000, FALSE),
      ('shp-010','AT-2024-001010','Onions','vegetables',            290, 'node-mtn-farm', 'node-khi-port', 'truck', 'Pakistan NLC',          'delivered',    'medium', 85, NULL, NOW()-INTERVAL '9 days',  NOW()-INTERVAL '7 days',  NOW()-INTERVAL '6 days', NULL, NULL,                     29000, TRUE),
      ('shp-011','AT-2024-001011','Mangoes (Fresh)','fruits',       140, 'node-hyd-hub',  'node-khi-apt',  'air',   'Airblue Cargo',         'delayed',      'critical',55, 5.0, NOW()-INTERVAL '3 days', NOW()-INTERVAL '1 day',   NULL, 24.0, 'Cold storage failure',  196000, TRUE),
      ('shp-012','AT-2024-001012','Wheat Grain','grains',          4200, 'node-bwp-wh',   'node-khi-port', 'truck', 'National Logistics',    'in_transit',   'medium', 93, NULL, NOW()-INTERVAL '2 days',  NOW()+INTERVAL '4 days',  NULL, NULL, NULL,                    336000, FALSE),
      ('shp-013','AT-2024-001013','Cotton Products','processed',    680, 'node-lhe-hub',  'node-dxb-exp',  'ship',  'APM Terminals',         'in_transit',   'high',   96, NULL, NOW()-INTERVAL '5 days',  NOW()+INTERVAL '8 days',  NULL, NULL, NULL,                    544000, TRUE),
      ('shp-014','AT-2024-001014','Potatoes','vegetables',          450, 'node-rwp-hub',  'node-lhe-hub',  'truck', 'Daewoo Logistics',      'delivered',    'low',    91, NULL, NOW()-INTERVAL '4 days',  NOW()-INTERVAL '2 days',  NOW()-INTERVAL '1 day',  NULL, NULL,                     40500, FALSE),
      ('shp-015','AT-2024-001015','Rice (Export)','grains',        2800, 'node-skr-farm', 'node-khi-port', 'rail',  'Pakistan Railways',     'in_transit',   'medium', 94, NULL, NOW()-INTERVAL '3 days',  NOW()+INTERVAL '5 days',  NULL, NULL, NULL,                  1120000, TRUE),
      ('shp-016','AT-2024-001016','Tomatoes','vegetables',          120, 'node-hyd-hub',  'node-khi-cold', 'truck', 'TCS Logistics',         'pending',      'high',   82, 8.0, NOW()+INTERVAL '1 day',   NOW()+INTERVAL '3 days',  NULL, NULL, NULL,                     18000, FALSE),
      ('shp-017','AT-2024-001017','Dates (Fresh)','fruits',         260, 'node-mtn-farm', 'node-khi-apt',  'truck', 'Pakistan NLC',          'customs_hold', 'high',   70, 4.0, NOW()-INTERVAL '6 days',  NOW()-INTERVAL '3 days',  NULL, 36.0, 'HS code mismatch',     390000, TRUE),
      ('shp-018','AT-2024-001018','Maize','grains',                1600, 'node-fsd-wh',   'node-lhe-hub',  'truck', 'National Logistics',    'delivered',    'low',    97, NULL, NOW()-INTERVAL '7 days',  NOW()-INTERVAL '5 days',  NOW()-INTERVAL '4 days', NULL, NULL,                    128000, FALSE),
      ('shp-019','AT-2024-001019','Chilli Peppers','vegetables',    85,  'node-mtn-farm', 'node-dxb-exp',  'air',   'PIA Cargo',             'in_transit',   'medium', 88, 7.0, NOW()-INTERVAL '1 day',   NOW()+INTERVAL '2 days',  NULL, NULL, NULL,                    102000, TRUE),
      ('shp-020','AT-2024-001020','Basmati Rice','grains',         5000, 'node-skr-farm', 'node-bej-imp',  'ship',  'COSCO Pakistan',        'in_transit',   'high',   92, NULL, NOW()-INTERVAL '20 days', NOW()+INTERVAL '5 days',  NULL, NULL, NULL,                  2000000, TRUE)
    ON CONFLICT (id) DO NOTHING
  `;

  // ── Alerts ──
  await sql`
    INSERT INTO alerts (id, type, severity, shipment_id, node_id, title, description, resolved)
    VALUES
      ('alert-001', 'temperature_breach', 'critical', 'shp-011', NULL,        'Cold chain failure — Mango shipment AT-2024-001011',  'Temperature rose to 18°C during transit, freshness score dropped to 55. Immediate intervention required.',  FALSE),
      ('alert-002', 'customs_hold',       'high',     'shp-006', NULL,        'Customs hold — Vegetables AT-2024-001006',            'Phytosanitary documents incomplete. Karachi Port customs hold. Est. 48h delay.',                             FALSE),
      ('alert-003', 'delay',              'high',     'shp-005', NULL,        'Route disruption — Citrus shipment AT-2024-001005',   'M-2 motorway closure due to maintenance. Citrus shipment rerouted via N-5, adding 18.5h delay.',              FALSE),
      ('alert-004', 'customs_hold',       'high',     'shp-017', NULL,        'HS code mismatch — Dates AT-2024-001017',             'Export declaration rejected. HS code 0804.10 flagged as incorrect. Awaiting amended documentation.',          FALSE),
      ('alert-005', 'capacity_critical',  'medium',   NULL,      'node-khi-cold', 'Karachi Cold Hub near capacity',                  'Current utilisation at 91%. Risk of overflow if incoming perishables not rerouted within 6 hours.',           FALSE),
      ('alert-006', 'delay',              'low',      'shp-009', NULL,        'Minor delay expected — Sugarcane AT-2024-001009',     'Traffic congestion on N-55. Estimated additional 3h delay. Shipment remains on-time by buffer.',               FALSE)
    ON CONFLICT (id) DO NOTHING
  `;
}

// ─────────────────────────────────────────────
// 4. QUERY FUNCTIONS
// ─────────────────────────────────────────────

// ── Health ──────────────────────────────────

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const sql = getSql();
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// ── Shipments ───────────────────────────────

export interface ShipmentFilters {
  province?: string;
  status?: ShipmentStatus;
  mode?: TransportMode;
  is_export?: boolean;
  product?: string;
  limit?: number;
}

export async function getShipments(filters: ShipmentFilters = {}): Promise<Shipment[]> {
  const sql = getSql();
  await initSchema();

  const { province, status, mode, is_export, product, limit = 50 } = filters;

  // Build dynamic WHERE conditions
  const conditions: string[] = [];
  const values: unknown[] = [];
  let paramIdx = 1;

  if (status) {
    conditions.push(`s.status = $${paramIdx++}`);
    values.push(status);
  }
  if (mode) {
    conditions.push(`s.transport_mode = $${paramIdx++}`);
    values.push(mode);
  }
  if (is_export !== undefined) {
    conditions.push(`s.is_export = $${paramIdx++}`);
    values.push(is_export);
  }
  if (product) {
    conditions.push(`LOWER(s.product_name) LIKE $${paramIdx++}`);
    values.push(`%${product.toLowerCase()}%`);
  }
  if (province) {
    conditions.push(`(origin.province = $${paramIdx} OR dest.province = $${paramIdx})`);
    values.push(province);
    paramIdx++;
  }

  const WHERE = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Use tagged template literals for safety; build raw for dynamic WHERE
  const rows = await sql.unsafe(
    `
    SELECT
      s.id, s.tracking_code,
      s.product_name, s.product_category,
      s.quantity_tonnes, s.transport_mode, s.carrier,
      s.status, s.priority, s.freshness_score, s.temperature_c,
      s.departure_at, s.eta_at, s.delivered_at,
      s.delay_hours, s.delay_reason, s.value_usd, s.is_export,
      s.created_at, s.updated_at,

      -- origin
      origin.id           AS origin_id,
      origin.name         AS origin_name,
      origin.type         AS origin_type,
      origin.city         AS origin_city,
      origin.province     AS origin_province,
      origin.country      AS origin_country,
      origin.lat          AS origin_lat,
      origin.lng          AS origin_lng,

      -- destination
      dest.id             AS dest_id,
      dest.name           AS dest_name,
      dest.type           AS dest_type,
      dest.city           AS dest_city,
      dest.province       AS dest_province,
      dest.country        AS dest_country,
      dest.lat            AS dest_lat,
      dest.lng            AS dest_lng

    FROM shipments s
    JOIN supply_nodes origin ON origin.id = s.origin_id
    JOIN supply_nodes dest   ON dest.id   = s.destination_id
    ${WHERE}
    ORDER BY s.created_at DESC
    LIMIT $${paramIdx}
    `,
    [...values, limit]
  );

  return rows.map(mapRowToShipment);
}

export async function getShipmentCount(): Promise<number> {
  const sql = getSql();
  await initSchema();
  const [row] = await sql<[{ count: string }]>`SELECT COUNT(*)::text AS count FROM shipments`;
  return parseInt(row.count);
}

// ── Supply Nodes ─────────────────────────────

export async function getSupplyNodes(): Promise<SupplyNode[]> {
  const sql = getSql();
  await initSchema();

  const rows = await sql<{
    id: string; name: string; type: string; city: string;
    province: string | null; country: string; lat: number; lng: number;
    capacity_tonnes: number; current_load: number;
    certifications: string[]; contact: string | null; is_active: boolean;
  }[]>`
    SELECT id, name, type, city, province, country, lat, lng,
           capacity_tonnes, current_load, certifications, contact, is_active
    FROM supply_nodes
    WHERE is_active = TRUE
    ORDER BY capacity_tonnes DESC
  `;

  return rows.map(r => ({
    id: r.id,
    name: r.name,
    type: r.type as SupplyNode['type'],
    location: {
      id: r.id,
      name: r.name,
      city: r.city,
      province: r.province as Province | undefined,
      country: r.country as SupplyNode['location']['country'],
      coordinates: { lat: r.lat, lng: r.lng },
      timezone: 'Asia/Karachi',
    },
    capacity_tonnes: r.capacity_tonnes,
    current_load_tonnes: r.current_load,
    utilization_pct: r.capacity_tonnes > 0
      ? Math.round((r.current_load / r.capacity_tonnes) * 100)
      : 0,
    certifications: r.certifications ?? [],
    contact: r.contact ?? undefined,
    is_active: r.is_active,
  }));
}

// ── Map Routes ───────────────────────────────

export async function getMapRoutes(): Promise<MapRoute[]> {
  const sql = getSql();
  await initSchema();

  const rows = await sql<{
    id: string; transport_mode: string; status: string;
    product_name: string; quantity_tonnes: number; is_export: boolean;
    origin_lat: number; origin_lng: number; origin_name: string;
    dest_lat: number; dest_lng: number; dest_name: string;
  }[]>`
    SELECT
      s.id, s.transport_mode, s.status, s.product_name,
      s.quantity_tonnes, s.is_export,
      o.lat AS origin_lat, o.lng AS origin_lng, o.city AS origin_name,
      d.lat AS dest_lat,   d.lng AS dest_lng,   d.city AS dest_name
    FROM shipments s
    JOIN supply_nodes o ON o.id = s.origin_id
    JOIN supply_nodes d ON d.id = s.destination_id
    WHERE s.status IN ('in_transit','pending','customs_hold','delayed')
    ORDER BY s.quantity_tonnes DESC
    LIMIT 100
  `;

  return rows.map(r => ({
    id: r.id,
    from: { lat: r.origin_lat, lng: r.origin_lng, label: r.origin_name },
    to:   { lat: r.dest_lat,   lng: r.dest_lng,   label: r.dest_name   },
    type: r.transport_mode as TransportMode,
    transport_mode: r.transport_mode as TransportMode,
    status: r.status as ShipmentStatus,
    product: r.product_name,
    volume_tonnes: r.quantity_tonnes,
    is_export: r.is_export,
  }));
}

// ── Alerts ───────────────────────────────────

export async function getAlerts(): Promise<{ active: Alert[]; resolved: Alert[] }> {
  const sql = getSql();
  await initSchema();

  const rows = await sql<{
    id: string; type: string; severity: string;
    shipment_id: string | null; node_id: string | null;
    title: string; description: string;
    resolved: boolean; resolved_at: string | null; created_at: string;
  }[]>`
    SELECT id, type, severity, shipment_id, node_id, title, description,
           resolved, resolved_at, created_at
    FROM alerts
    ORDER BY
      CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
      created_at DESC
    LIMIT 100
  `;

  const mapped = rows.map(r => ({
    id: r.id,
    type: r.type as Alert['type'],
    severity: r.severity as Alert['severity'],
    shipment_id: r.shipment_id ?? undefined,
    node_id: r.node_id ?? undefined,
    title: r.title,
    description: r.description,
    resolved: r.resolved,
    resolved_at: r.resolved_at ?? undefined,
    created_at: r.created_at,
  }));

  return {
    active:   mapped.filter(a => !a.resolved),
    resolved: mapped.filter(a =>  a.resolved),
  };
}

// ── Analytics ────────────────────────────────

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const sql = getSql();
  await initSchema();

  const [row] = await sql<[{
    total: string; active: string; delayed: string;
    delivered_today: string; on_time: string;
    total_vol: string; export_val: string;
  }]>`
    SELECT
      COUNT(*)::text                                                          AS total,
      COUNT(*) FILTER (WHERE status = 'in_transit')::text                   AS active,
      COUNT(*) FILTER (WHERE status = 'delayed')::text                      AS delayed,
      COUNT(*) FILTER (WHERE status = 'delivered'
                         AND delivered_at >= CURRENT_DATE)::text            AS delivered_today,
      ROUND(
        100.0 * COUNT(*) FILTER (WHERE status = 'delivered' AND delay_hours IS NULL)
             / NULLIF(COUNT(*) FILTER (WHERE status = 'delivered'), 0)
      , 1)::text                                                             AS on_time,
      COALESCE(SUM(quantity_tonnes), 0)::text                               AS total_vol,
      COALESCE(SUM(value_usd) FILTER (WHERE is_export = TRUE), 0)::text    AS export_val
    FROM shipments
  `;

  const [alertRow] = await sql<[{ active_alerts: string }]>`
    SELECT COUNT(*)::text AS active_alerts FROM alerts WHERE resolved = FALSE
  `;

  const [routeRow] = await sql<[{ active_routes: string }]>`
    SELECT COUNT(DISTINCT id)::text AS active_routes
    FROM shipments WHERE status IN ('in_transit','pending')
  `;

  return {
    total_shipments:    parseInt(row.total),
    active_shipments:   parseInt(row.active),
    delayed_shipments:  parseInt(row.delayed),
    delivered_today:    parseInt(row.delivered_today),
    on_time_rate_pct:   parseFloat(row.on_time ?? '0'),
    total_volume_tonnes:parseFloat(row.total_vol),
    export_value_usd:   parseFloat(row.export_val),
    active_alerts:      parseInt(alertRow.active_alerts),
    active_routes:      parseInt(routeRow.active_routes),
  };
}

export async function getVolumeData(): Promise<VolumeDataPoint[]> {
  const sql = getSql();
  await initSchema();

  // Generate 30-day rolling volume grouped by departure date and province
  const rows = await sql<{
    date: string; province: string;
    supply_tonnes: number; demand_tonnes: number;
  }[]>`
    SELECT
      DATE_TRUNC('day', departure_at)::date::text  AS date,
      COALESCE(origin.province, 'Export')          AS province,
      SUM(quantity_tonnes)                         AS supply_tonnes,
      SUM(quantity_tonnes) * 0.92                  AS demand_tonnes
    FROM shipments s
    JOIN supply_nodes origin ON origin.id = s.origin_id
    WHERE departure_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', departure_at), origin.province
    ORDER BY date ASC
  `;

  return rows.map(r => ({
    date: r.date,
    supply_tonnes: parseFloat(String(r.supply_tonnes)),
    demand_tonnes: parseFloat(String(r.demand_tonnes)),
    region: r.province,
  }));
}

export async function getDelayAnalytics(): Promise<DelayAnalytics[]> {
  const sql = getSql();
  await initSchema();

  const rows = await sql<{
    province: string;
    total_shipments: string;
    delayed_count: string;
    avg_delay_hours: string;
  }[]>`
    SELECT
      COALESCE(origin.province, 'Export') AS province,
      COUNT(*)::text                      AS total_shipments,
      COUNT(*) FILTER (WHERE s.status = 'delayed' OR s.delay_hours > 0)::text AS delayed_count,
      COALESCE(AVG(s.delay_hours) FILTER (WHERE s.delay_hours > 0), 0)::text  AS avg_delay_hours
    FROM shipments s
    JOIN supply_nodes origin ON origin.id = s.origin_id
    GROUP BY origin.province
    ORDER BY delayed_count DESC
  `;

  // Get top delay reasons
  const reasons = await sql<{ province: string; delay_reason: string; cnt: string }[]>`
    SELECT
      COALESCE(origin.province, 'Export') AS province,
      delay_reason,
      COUNT(*)::text AS cnt
    FROM shipments s
    JOIN supply_nodes origin ON origin.id = s.origin_id
    WHERE delay_reason IS NOT NULL
    GROUP BY origin.province, delay_reason
    ORDER BY cnt DESC
  `;

  const reasonMap: Record<string, { reason: string; count: number }[]> = {};
  for (const r of reasons) {
    if (!reasonMap[r.province]) reasonMap[r.province] = [];
    reasonMap[r.province].push({ reason: r.delay_reason, count: parseInt(r.cnt) });
  }

  return rows.map(r => ({
    region: r.province,
    total_shipments:  parseInt(r.total_shipments),
    delayed_count:    parseInt(r.delayed_count),
    avg_delay_hours:  parseFloat(r.avg_delay_hours),
    delay_rate_pct:   parseInt(r.total_shipments) > 0
      ? Math.round((parseInt(r.delayed_count) / parseInt(r.total_shipments)) * 100)
      : 0,
    top_reasons: reasonMap[r.province] ?? [],
  }));
}

export async function getRegionInsights(): Promise<RegionInsight[]> {
  const sql = getSql();
  await initSchema();

  const rows = await sql<{
    province: string;
    total_volume: string;
    active_shipments: string;
    export_value: string;
  }[]>`
    SELECT
      origin.province,
      COALESCE(SUM(s.quantity_tonnes), 0)::text                      AS total_volume,
      COUNT(*) FILTER (WHERE s.status = 'in_transit')::text          AS active_shipments,
      COALESCE(SUM(s.value_usd) FILTER (WHERE s.is_export), 0)::text AS export_value
    FROM shipments s
    JOIN supply_nodes origin ON origin.id = s.origin_id
    WHERE origin.province IS NOT NULL
    GROUP BY origin.province
    ORDER BY total_volume DESC
  `;

  // Top products per province
  const products = await sql<{ province: string; product_name: string; volume: string }[]>`
    SELECT
      origin.province,
      s.product_name,
      SUM(s.quantity_tonnes)::text AS volume
    FROM shipments s
    JOIN supply_nodes origin ON origin.id = s.origin_id
    WHERE origin.province IS NOT NULL
    GROUP BY origin.province, s.product_name
    ORDER BY origin.province, volume DESC
  `;

  const productMap: Record<string, { product: string; volume: number }[]> = {};
  for (const p of products) {
    if (!productMap[p.province]) productMap[p.province] = [];
    if (productMap[p.province].length < 3) {
      productMap[p.province].push({ product: p.product_name, volume: parseFloat(p.volume) });
    }
  }

  return rows.map(r => ({
    province: r.province as Province,
    total_volume_tonnes: parseFloat(r.total_volume),
    active_shipments:    parseInt(r.active_shipments),
    export_value_usd:    parseFloat(r.export_value),
    top_products:        productMap[r.province] ?? [],
    yoy_growth_pct:      Math.round(Math.random() * 30 + 5), // placeholder — replace with real YoY data
  }));
}

export async function getExportTrends(): Promise<ExportTrend[]> {
  const sql = getSql();
  await initSchema();

  const rows = await sql<{
    destination: string;
    month: string;
    volume: string;
    value: string;
  }[]>`
    SELECT
      dest.country                                            AS destination,
      TO_CHAR(DATE_TRUNC('month', s.departure_at), 'YYYY-MM') AS month,
      SUM(s.quantity_tonnes)::text                            AS volume,
      SUM(s.value_usd)::text                                  AS value
    FROM shipments s
    JOIN supply_nodes dest ON dest.id = s.destination_id
    WHERE s.is_export = TRUE
      AND dest.country != 'Pakistan'
      AND s.departure_at >= NOW() - INTERVAL '6 months'
    GROUP BY dest.country, DATE_TRUNC('month', s.departure_at)
    ORDER BY month DESC, value DESC
    LIMIT 30
  `;

  return rows.map(r => ({
    destination_country: r.destination as ExportTrend['destination_country'],
    month: r.month,
    volume_tonnes: parseFloat(r.volume),
    value_usd: parseFloat(r.value),
    product_breakdown: [], // extend later with real breakdown query
  }));
}

// ─────────────────────────────────────────────
// 5. ROW MAPPER
// ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToShipment(r: Record<string, any>): Shipment {
  return {
    id: r.id,
    tracking_code: r.tracking_code,
    product: {
      id: r.id,
      name: r.product_name,
      category: r.product_category,
      hs_code: '',
      shelf_life_days: 30,
      requires_cold_chain: r.temperature_c !== null,
      unit: 'tonne',
      avg_price_usd_per_tonne: r.quantity_tonnes > 0 ? r.value_usd / r.quantity_tonnes : 0,
      season_months: [],
    },
    quantity_tonnes: parseFloat(r.quantity_tonnes),
    origin: buildNode(r, 'origin'),
    destination: buildNode(r, 'dest'),
    transport_mode: r.transport_mode as TransportMode,
    carrier: r.carrier,
    status: r.status as ShipmentStatus,
    priority: r.priority,
    freshness_score: parseInt(r.freshness_score),
    temperature_c: r.temperature_c !== null ? parseFloat(r.temperature_c) : undefined,
    departure_at: r.departure_at,
    eta_at: r.eta_at,
    delivered_at: r.delivered_at ?? undefined,
    delay_hours: r.delay_hours !== null ? parseFloat(r.delay_hours) : undefined,
    delay_reason: r.delay_reason ?? undefined,
    value_usd: parseFloat(r.value_usd),
    is_export: r.is_export,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildNode(r: Record<string, any>, prefix: string): SupplyNode {
  return {
    id: r[`${prefix}_id`],
    name: r[`${prefix}_name`],
    type: r[`${prefix}_type`] as SupplyNode['type'],
    location: {
      id: r[`${prefix}_id`],
      name: r[`${prefix}_name`],
      city: r[`${prefix}_city`],
      province: r[`${prefix}_province`] as Province | undefined,
      country: r[`${prefix}_country`],
      coordinates: { lat: parseFloat(r[`${prefix}_lat`]), lng: parseFloat(r[`${prefix}_lng`]) },
      timezone: 'Asia/Karachi',
    },
    capacity_tonnes: 0,
    current_load_tonnes: 0,
    utilization_pct: 0,
    certifications: [],
    is_active: true,
  };
}
