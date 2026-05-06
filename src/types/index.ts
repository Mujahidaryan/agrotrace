// ============================================================
//  CORE TYPES — AgroTrace Supply Chain Platform
// ============================================================

export type Province = 'Sindh' | 'Punjab' | 'KPK' | 'Balochistan';
export type Country = 'Pakistan' | 'UAE' | 'Saudi Arabia' | 'UK' | 'Germany' | 'China' | 'USA';
export type TransportMode = 'truck' | 'ship' | 'air' | 'rail';
export type NodeType = 'farm' | 'warehouse' | 'distribution_center' | 'port' | 'airport' | 'retailer' | 'export_hub';
export type ShipmentStatus = 'pending' | 'in_transit' | 'delayed' | 'delivered' | 'cancelled' | 'customs_hold';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type ProductCategory = 'grains' | 'fruits' | 'vegetables' | 'livestock' | 'dairy' | 'processed';

// --- LOCATION ---
export interface Location {
  id: string;
  name: string;
  city: string;
  province?: Province;
  country: Country;
  coordinates: { lat: number; lng: number };
  timezone: string;
}

// --- SUPPLY NODE ---
export interface SupplyNode {
  id: string;
  name: string;
  type: NodeType;
  location: Location;
  capacity_tonnes: number;
  current_load_tonnes: number;
  utilization_pct: number;
  certifications: string[];
  contact?: string;
  is_active: boolean;
}

// --- PRODUCT ---
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  hs_code: string;           // Pakistan customs HS code
  shelf_life_days: number;
  requires_cold_chain: boolean;
  unit: 'kg' | 'tonne' | 'box' | 'litre';
  avg_price_usd_per_tonne: number;
  season_months: number[];   // 1-12
}

// --- SHIPMENT ---
export interface Shipment {
  id: string;
  tracking_code: string;
  product: Product;
  quantity_tonnes: number;
  origin: SupplyNode;
  destination: SupplyNode;
  transport_mode: TransportMode;
  carrier: string;
  status: ShipmentStatus;
  priority: Priority;
  freshness_score: number;    // 0-100
  temperature_c?: number;
  departure_at: string;       // ISO
  eta_at: string;             // ISO
  delivered_at?: string;
  delay_hours?: number;
  delay_reason?: string;
  route_waypoints?: { lat: number; lng: number }[];
  value_usd: number;
  is_export: boolean;
  created_at: string;
  updated_at: string;
}

// --- ANALYTICS ---
export interface VolumeDataPoint {
  date: string;
  supply_tonnes: number;
  demand_tonnes: number;
  region: string;
}

export interface DelayAnalytics {
  region: string;
  total_shipments: number;
  delayed_count: number;
  avg_delay_hours: number;
  delay_rate_pct: number;
  top_reasons: { reason: string; count: number }[];
}

export interface RegionInsight {
  province: Province;
  total_volume_tonnes: number;
  active_shipments: number;
  export_value_usd: number;
  top_products: { product: string; volume: number }[];
  yoy_growth_pct: number;
}

export interface ExportTrend {
  destination_country: Country;
  month: string;
  volume_tonnes: number;
  value_usd: number;
  product_breakdown: { product: string; pct: number }[];
}

// --- ALERT ---
export interface Alert {
  id: string;
  type: 'delay' | 'temperature_breach' | 'route_disruption' | 'customs_hold' | 'capacity_critical';
  severity: 'critical' | 'high' | 'medium' | 'low';
  shipment_id?: string;
  node_id?: string;
  title: string;
  description: string;
  created_at: string;
  resolved: boolean;
  resolved_at?: string;
}

// --- DASHBOARD SUMMARY ---
export interface DashboardSummary {
  total_shipments: number;
  active_shipments: number;
  delayed_shipments: number;
  delivered_today: number;
  on_time_rate_pct: number;
  total_volume_tonnes: number;
  export_value_usd: number;
  active_alerts: number;
  active_routes: number;
}

// --- MAP DATA ---
export interface MapRoute {
  id: string;
  from: { lat: number; lng: number; label: string };
  to: { lat: number; lng: number; label: string };
  type: TransportMode;
  transport_mode: TransportMode;
  status: ShipmentStatus;
  product: string;
  volume_tonnes: number;
  is_export: boolean;
}
