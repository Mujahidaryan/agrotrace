-- scripts/001_initial_schema.sql
-- AgroTrace — Initial Database Schema
-- Run via: psql $DATABASE_URL -f scripts/001_initial_schema.sql
-- Or: node scripts/migrate.js
--
-- Zero-downtime strategy: this is a greenfield migration.
-- Future changes use expand/contract pattern (see docs/adr/002-migration-strategy.md).

-- ── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- text search on product names

-- ── ENUMS ───────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE province_type AS ENUM ('Sindh', 'Punjab', 'KPK', 'Balochistan');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE transport_mode AS ENUM ('truck', 'ship', 'air', 'rail');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE node_type AS ENUM (
    'farm', 'warehouse', 'distribution_center', 'port', 'airport', 'retailer', 'export_hub'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE shipment_status AS ENUM (
    'pending', 'in_transit', 'delayed', 'delivered', 'cancelled', 'customs_hold'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE priority_type AS ENUM ('critical', 'high', 'medium', 'low');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE product_category AS ENUM (
    'grains', 'fruits', 'vegetables', 'livestock', 'dairy', 'processed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE alert_type AS ENUM (
    'delay', 'temperature_breach', 'route_disruption', 'customs_hold', 'capacity_critical'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE severity_type AS ENUM ('critical', 'high', 'medium', 'low');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── LOCATIONS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS locations (
  id          TEXT PRIMARY KEY DEFAULT 'loc_' || gen_random_uuid()::text,
  name        TEXT NOT NULL,
  city        TEXT NOT NULL,
  province    province_type,         -- NULL for international locations
  country     TEXT NOT NULL,
  lat         NUMERIC(9, 6) NOT NULL,
  lng         NUMERIC(9, 6) NOT NULL,
  timezone    TEXT NOT NULL DEFAULT 'Asia/Karachi',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Spatial index for map queries (geo bounding box filtering)
CREATE INDEX IF NOT EXISTS idx_locations_coords ON locations (lat, lng);
CREATE INDEX IF NOT EXISTS idx_locations_province ON locations (province);

-- ── SUPPLY NODES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS supply_nodes (
  id                   TEXT PRIMARY KEY DEFAULT 'node_' || gen_random_uuid()::text,
  name                 TEXT NOT NULL,
  type                 node_type NOT NULL,
  location_id          TEXT NOT NULL REFERENCES locations(id),
  capacity_tonnes      NUMERIC(12, 2) NOT NULL CHECK (capacity_tonnes > 0),
  current_load_tonnes  NUMERIC(12, 2) NOT NULL DEFAULT 0
                         CHECK (current_load_tonnes >= 0),
  utilization_pct      NUMERIC(5, 2) GENERATED ALWAYS AS
                         (ROUND(current_load_tonnes / NULLIF(capacity_tonnes, 0) * 100, 2))
                         STORED,
  certifications       TEXT[] NOT NULL DEFAULT '{}',
  contact              TEXT,
  is_active            BOOLEAN NOT NULL DEFAULT true,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_load_le_capacity CHECK (current_load_tonnes <= capacity_tonnes)
);

CREATE INDEX IF NOT EXISTS idx_supply_nodes_type       ON supply_nodes (type);
CREATE INDEX IF NOT EXISTS idx_supply_nodes_location   ON supply_nodes (location_id);
CREATE INDEX IF NOT EXISTS idx_supply_nodes_is_active  ON supply_nodes (is_active);

-- ── PRODUCTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                       TEXT PRIMARY KEY DEFAULT 'prod_' || gen_random_uuid()::text,
  name                     TEXT NOT NULL UNIQUE,
  category                 product_category NOT NULL,
  hs_code                  TEXT NOT NULL,             -- Pakistan Customs HS code
  shelf_life_days          INT NOT NULL CHECK (shelf_life_days > 0),
  requires_cold_chain      BOOLEAN NOT NULL DEFAULT false,
  unit                     TEXT NOT NULL DEFAULT 'tonne',
  avg_price_usd_per_tonne  NUMERIC(10, 2) NOT NULL CHECK (avg_price_usd_per_tonne >= 0),
  season_months            INT[] NOT NULL DEFAULT '{}',  -- 1-12
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
-- Trigram index for ILIKE search in getShipments
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin (name gin_trgm_ops);

-- ── SHIPMENTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shipments (
  id               TEXT PRIMARY KEY DEFAULT 'shp_' || gen_random_uuid()::text,
  tracking_code    TEXT NOT NULL UNIQUE,
  product_id       TEXT NOT NULL REFERENCES products(id),
  quantity_tonnes  NUMERIC(12, 2) NOT NULL CHECK (quantity_tonnes > 0),
  origin_id        TEXT NOT NULL REFERENCES supply_nodes(id),
  destination_id   TEXT NOT NULL REFERENCES supply_nodes(id),
  transport_mode   transport_mode NOT NULL,
  carrier          TEXT NOT NULL,
  status           shipment_status NOT NULL DEFAULT 'pending',
  priority         priority_type NOT NULL DEFAULT 'medium',
  freshness_score  INT NOT NULL DEFAULT 100
                     CHECK (freshness_score BETWEEN 0 AND 100),
  temperature_c    NUMERIC(5, 1),   -- NULL = no temperature requirement
  departure_at     TIMESTAMPTZ NOT NULL,
  eta_at           TIMESTAMPTZ NOT NULL,
  delivered_at     TIMESTAMPTZ,
  delay_hours      NUMERIC(6, 1),
  delay_reason     TEXT,
  route_waypoints  JSONB,           -- [{lat, lng}] for map rendering
  value_usd        NUMERIC(14, 2) NOT NULL CHECK (value_usd >= 0),
  is_export        BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_destination_ne_origin CHECK (destination_id != origin_id),
  CONSTRAINT chk_eta_after_departure   CHECK (eta_at > departure_at)
);

-- Indexes serving the filter patterns in getShipments()
CREATE INDEX IF NOT EXISTS idx_shipments_status         ON shipments (status);
CREATE INDEX IF NOT EXISTS idx_shipments_is_export      ON shipments (is_export);
CREATE INDEX IF NOT EXISTS idx_shipments_transport_mode ON shipments (transport_mode);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at     ON shipments (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shipments_product_id     ON shipments (product_id);
CREATE INDEX IF NOT EXISTS idx_shipments_origin         ON shipments (origin_id);
CREATE INDEX IF NOT EXISTS idx_shipments_destination    ON shipments (destination_id);

-- ── ALERTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  id           TEXT PRIMARY KEY DEFAULT 'alt_' || gen_random_uuid()::text,
  type         alert_type NOT NULL,
  severity     severity_type NOT NULL,
  shipment_id  TEXT REFERENCES shipments(id) ON DELETE SET NULL,
  node_id      TEXT REFERENCES supply_nodes(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  resolved     BOOLEAN NOT NULL DEFAULT false,
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_resolved_has_timestamp
    CHECK (NOT resolved OR resolved_at IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_alerts_resolved  ON alerts (resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_severity  ON alerts (severity);
CREATE INDEX IF NOT EXISTS idx_alerts_created   ON alerts (created_at DESC);

-- ── VOLUME SNAPSHOTS (for 30-day trend chart) ────────────────
-- Populated by a daily job (or backfilled from shipment data).
CREATE TABLE IF NOT EXISTS volume_snapshots (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  day             DATE NOT NULL,
  region          TEXT NOT NULL,
  supply_tonnes   NUMERIC(14, 2) NOT NULL DEFAULT 0,
  demand_tonnes   NUMERIC(14, 2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (day, region)
);

CREATE INDEX IF NOT EXISTS idx_volume_snapshots_day ON volume_snapshots (day DESC);

-- ── REGION INSIGHTS (materialized summary, refreshed daily) ─
CREATE TABLE IF NOT EXISTS region_insights (
  province              province_type PRIMARY KEY,
  total_volume_tonnes   NUMERIC(14, 2) NOT NULL DEFAULT 0,
  active_shipments      INT NOT NULL DEFAULT 0,
  export_value_usd      NUMERIC(14, 2) NOT NULL DEFAULT 0,
  top_products          JSONB NOT NULL DEFAULT '[]',
  yoy_growth_pct        NUMERIC(5, 2) NOT NULL DEFAULT 0,
  refreshed_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── EXPORT TRENDS (TDAP-aligned monthly summaries) ──────────
CREATE TABLE IF NOT EXISTS export_trends (
  id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  destination_country  TEXT NOT NULL,
  month                DATE NOT NULL,          -- first day of month
  volume_tonnes        NUMERIC(14, 2) NOT NULL DEFAULT 0,
  value_usd            NUMERIC(14, 2) NOT NULL DEFAULT 0,
  product_breakdown    JSONB NOT NULL DEFAULT '[]',

  UNIQUE (destination_country, month)
);

CREATE INDEX IF NOT EXISTS idx_export_trends_month ON export_trends (month DESC);

-- ── MAP ROUTES (denormalized for fast map renders) ───────────
CREATE TABLE IF NOT EXISTS map_routes (
  id              TEXT PRIMARY KEY DEFAULT 'rt_' || gen_random_uuid()::text,
  from_lat        NUMERIC(9, 6) NOT NULL,
  from_lng        NUMERIC(9, 6) NOT NULL,
  from_label      TEXT NOT NULL,
  to_lat          NUMERIC(9, 6) NOT NULL,
  to_lng          NUMERIC(9, 6) NOT NULL,
  to_label        TEXT NOT NULL,
  transport_mode  transport_mode NOT NULL,
  status          shipment_status NOT NULL,
  product         TEXT NOT NULL,
  volume_tonnes   NUMERIC(12, 2) NOT NULL DEFAULT 0,
  is_export       BOOLEAN NOT NULL DEFAULT false,
  shipment_id     TEXT REFERENCES shipments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_map_routes_status ON map_routes (status);

-- ── DELAY ANALYTICS VIEW ─────────────────────────────────────
-- Computed from shipments table so always current.
-- The query in queries.ts reads from this view.
CREATE OR REPLACE VIEW delay_analytics_view AS
SELECT
  CASE
    WHEN ol.province IS NULL THEN 'International Export'
    WHEN ol.province = dl.province THEN ol.province::text
    ELSE 'Inter-provincial'
  END AS region,
  count(*)                                                     AS total_shipments,
  count(*) FILTER (WHERE s.status = 'delayed')                 AS delayed_count,
  COALESCE(avg(s.delay_hours) FILTER (WHERE s.delay_hours > 0), 0) AS avg_delay_hours,
  -- Top reasons aggregated as JSON
  (
    SELECT jsonb_agg(jsonb_build_object('reason', reason, 'count', cnt))
    FROM (
      SELECT s2.delay_reason AS reason, count(*) AS cnt
      FROM shipments s2
      JOIN supply_nodes on2 ON on2.id = s2.origin_id
      JOIN locations ol2 ON ol2.id = on2.location_id
      WHERE s2.delay_reason IS NOT NULL
        AND (
          CASE
            WHEN ol.province IS NULL THEN 'International Export'
            WHEN ol.province = dl.province THEN ol.province::text
            ELSE 'Inter-provincial'
          END
        ) = (
          CASE
            WHEN ol2.province IS NULL THEN 'International Export'
            WHEN ol2.province = dl2.province THEN ol2.province::text
            ELSE 'Inter-provincial'
          END
        )
      GROUP BY s2.delay_reason
      ORDER BY cnt DESC
      LIMIT 4
    ) sub
    JOIN locations dl2 ON dl2.id = (
      SELECT location_id FROM supply_nodes WHERE id = (
        SELECT destination_id FROM shipments WHERE id = s.id
      )
    )
  ) AS top_reasons
FROM shipments s
JOIN supply_nodes on_ ON on_.id = s.origin_id
JOIN locations ol     ON ol.id = on_.location_id
JOIN supply_nodes dn  ON dn.id = s.destination_id
JOIN locations dl     ON dl.id = dn.location_id
GROUP BY region;

-- ── UPDATED_AT TRIGGER ───────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER trg_shipments_updated_at
    BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_supply_nodes_updated_at
    BEFORE UPDATE ON supply_nodes
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
