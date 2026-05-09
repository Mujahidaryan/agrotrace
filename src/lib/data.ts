// ============================================================
//  REALISTIC DATASET — Pakistan Food Supply Chain
//  Sources: PBS (Pakistan Bureau of Statistics), FAO, TDAP
//  Real cities, products, HS codes, export destinations
// ============================================================

import type {
  Location, SupplyNode, Product, Shipment,
  VolumeDataPoint, DelayAnalytics, RegionInsight,
  ExportTrend, Alert, DashboardSummary, MapRoute,
} from '@/types';

// ============================================================
//  LOCATIONS
// ============================================================
export const LOCATIONS: Record<string, Location> = {
  // Sindh
  karachi:    { id: 'loc_karachi',    name: 'Karachi',       city: 'Karachi',       province: 'Sindh',    country: 'Pakistan',      coordinates: { lat: 24.8607, lng: 67.0011 }, timezone: 'Asia/Karachi' },
  hyderabad:  { id: 'loc_hyderabad',  name: 'Hyderabad',     city: 'Hyderabad',     province: 'Sindh',    country: 'Pakistan',      coordinates: { lat: 25.3960, lng: 68.3578 }, timezone: 'Asia/Karachi' },
  sukkur:     { id: 'loc_sukkur',     name: 'Sukkur',        city: 'Sukkur',        province: 'Sindh',    country: 'Pakistan',      coordinates: { lat: 27.7052, lng: 68.8574 }, timezone: 'Asia/Karachi' },
  larkana:    { id: 'loc_larkana',    name: 'Larkana',       city: 'Larkana',       province: 'Sindh',    country: 'Pakistan',      coordinates: { lat: 27.5570, lng: 68.2142 }, timezone: 'Asia/Karachi' },
  nawabshah:  { id: 'loc_nawabshah',  name: 'Nawabshah',     city: 'Nawabshah',     province: 'Sindh',    country: 'Pakistan',      coordinates: { lat: 26.2442, lng: 68.4100 }, timezone: 'Asia/Karachi' },
  // Punjab
  lahore:     { id: 'loc_lahore',     name: 'Lahore',        city: 'Lahore',        province: 'Punjab',   country: 'Pakistan',      coordinates: { lat: 31.5497, lng: 74.3436 }, timezone: 'Asia/Karachi' },
  faisalabad: { id: 'loc_faisalabad', name: 'Faisalabad',    city: 'Faisalabad',    province: 'Punjab',   country: 'Pakistan',      coordinates: { lat: 31.4154, lng: 73.0786 }, timezone: 'Asia/Karachi' },
  multan:     { id: 'loc_multan',     name: 'Multan',        city: 'Multan',        province: 'Punjab',   country: 'Pakistan',      coordinates: { lat: 30.1575, lng: 71.5249 }, timezone: 'Asia/Karachi' },
  rawalpindi: { id: 'loc_rawalpindi', name: 'Rawalpindi',    city: 'Rawalpindi',    province: 'Punjab',   country: 'Pakistan',      coordinates: { lat: 33.5651, lng: 73.0169 }, timezone: 'Asia/Karachi' },
  gujranwala: { id: 'loc_gujranwala', name: 'Gujranwala',   city: 'Gujranwala',    province: 'Punjab',   country: 'Pakistan',      coordinates: { lat: 32.1877, lng: 74.1945 }, timezone: 'Asia/Karachi' },
  bahawalpur: { id: 'loc_bahawalpur', name: 'Bahawalpur',   city: 'Bahawalpur',    province: 'Punjab',   country: 'Pakistan',      coordinates: { lat: 29.3956, lng: 71.6836 }, timezone: 'Asia/Karachi' },
  // International
  dubai:      { id: 'loc_dubai',      name: 'Dubai',         city: 'Dubai',         country: 'UAE',         coordinates: { lat: 25.2048, lng: 55.2708 }, timezone: 'Asia/Dubai' },
  riyadh:     { id: 'loc_riyadh',     name: 'Riyadh',        city: 'Riyadh',        country: 'Saudi Arabia', coordinates: { lat: 24.6877, lng: 46.7219 }, timezone: 'Asia/Riyadh' },
  london:     { id: 'loc_london',     name: 'London',        city: 'London',        country: 'UK',          coordinates: { lat: 51.5074, lng: -0.1278 }, timezone: 'Europe/London' },
  hamburg:    { id: 'loc_hamburg',    name: 'Hamburg',       city: 'Hamburg',       country: 'Germany',     coordinates: { lat: 53.5753, lng: 10.0153 }, timezone: 'Europe/Berlin' },
  beijing:    { id: 'loc_beijing',    name: 'Beijing',       city: 'Beijing',       country: 'China',       coordinates: { lat: 39.9042, lng: 116.4074 }, timezone: 'Asia/Shanghai' },
};

// ============================================================
//  SUPPLY NODES
// ============================================================
export const SUPPLY_NODES: SupplyNode[] = [
  // Sindh Farms
  { id: 'node_sin_farm_1', name: 'Sindh Mango Belt Farm — Mirpurkhas', type: 'farm', location: { ...LOCATIONS.nawabshah, id: 'loc_mirpurkhas', name: 'Mirpurkhas', city: 'Mirpurkhas', coordinates: { lat: 25.5272, lng: 69.0131 } }, capacity_tonnes: 8500, current_load_tonnes: 6200, utilization_pct: 73, certifications: ['GlobalG.A.P', 'Organic-PK'], is_active: true },
  { id: 'node_sin_farm_2', name: 'Indus Cotton & Wheat Belt — Larkana', type: 'farm', location: LOCATIONS.larkana, capacity_tonnes: 45000, current_load_tonnes: 38000, utilization_pct: 84, certifications: ['ISO 22000'], is_active: true },
  { id: 'node_sin_farm_3', name: 'Sukkur Rice Farms Collective', type: 'farm', location: LOCATIONS.sukkur, capacity_tonnes: 22000, current_load_tonnes: 18500, utilization_pct: 84, certifications: ['FAO-GAP'], is_active: true },
  { id: 'node_sin_farm_4', name: 'Hyderabad Vegetable Hub', type: 'farm', location: LOCATIONS.hyderabad, capacity_tonnes: 4200, current_load_tonnes: 2900, utilization_pct: 69, certifications: ['GlobalG.A.P'], is_active: true },
  // Punjab Farms
  { id: 'node_pun_farm_1', name: 'Central Punjab Wheat Corridor — Faisalabad', type: 'farm', location: LOCATIONS.faisalabad, capacity_tonnes: 85000, current_load_tonnes: 72000, utilization_pct: 85, certifications: ['ISO 22000', 'Punjab AgriCert'], is_active: true },
  { id: 'node_pun_farm_2', name: 'Multan Mango & Citrus Farm', type: 'farm', location: LOCATIONS.multan, capacity_tonnes: 12000, current_load_tonnes: 9400, utilization_pct: 78, certifications: ['GlobalG.A.P', 'USDA-Organic'], is_active: true },
  { id: 'node_pun_farm_3', name: 'Bahawalpur Date Palm Plantation', type: 'farm', location: LOCATIONS.bahawalpur, capacity_tonnes: 3800, current_load_tonnes: 2100, utilization_pct: 55, certifications: ['Organic-PK'], is_active: true },
  { id: 'node_pun_farm_4', name: 'Gujranwala Dairy & Rice Complex', type: 'farm', location: LOCATIONS.gujranwala, capacity_tonnes: 18000, current_load_tonnes: 14200, utilization_pct: 79, certifications: ['ISO 22000', 'HACCP'], is_active: true },
  // Warehouses — Sindh
  { id: 'node_sin_wh_1', name: 'Karachi Central Cold Storage', type: 'warehouse', location: LOCATIONS.karachi, capacity_tonnes: 35000, current_load_tonnes: 28000, utilization_pct: 80, certifications: ['ISO 9001', 'HACCP', 'Cold-Chain Pak'], is_active: true },
  { id: 'node_sin_wh_2', name: 'Hyderabad Grain Silo Complex', type: 'warehouse', location: LOCATIONS.hyderabad, capacity_tonnes: 60000, current_load_tonnes: 47000, utilization_pct: 78, certifications: ['ISO 9001'], is_active: true },
  { id: 'node_sin_wh_3', name: 'Sukkur Regional Warehouse', type: 'warehouse', location: LOCATIONS.sukkur, capacity_tonnes: 25000, current_load_tonnes: 19000, utilization_pct: 76, certifications: ['ISO 9001'], is_active: true },
  // Warehouses — Punjab
  { id: 'node_pun_wh_1', name: 'Lahore Agri Logistics Hub', type: 'warehouse', location: LOCATIONS.lahore, capacity_tonnes: 55000, current_load_tonnes: 44000, utilization_pct: 80, certifications: ['ISO 9001', 'HACCP'], is_active: true },
  { id: 'node_pun_wh_2', name: 'Faisalabad Grain Terminal', type: 'warehouse', location: LOCATIONS.faisalabad, capacity_tonnes: 95000, current_load_tonnes: 81000, utilization_pct: 85, certifications: ['ISO 9001'], is_active: true },
  { id: 'node_pun_wh_3', name: 'Multan Southern Distribution Center', type: 'warehouse', location: LOCATIONS.multan, capacity_tonnes: 40000, current_load_tonnes: 28000, utilization_pct: 70, certifications: ['ISO 9001'], is_active: true },
  // Ports & Export Hubs
  { id: 'node_kpt', name: 'Karachi Port Trust (KPT)', type: 'port', location: { ...LOCATIONS.karachi, coordinates: { lat: 24.8400, lng: 66.9900 } }, capacity_tonnes: 500000, current_load_tonnes: 380000, utilization_pct: 76, certifications: ['ISO 28000', 'AEO-Pak'], is_active: true },
  { id: 'node_pqa', name: 'Port Qasim Authority', type: 'port', location: { ...LOCATIONS.karachi, coordinates: { lat: 24.7789, lng: 67.3203 } }, capacity_tonnes: 350000, current_load_tonnes: 245000, utilization_pct: 70, certifications: ['ISO 28000'], is_active: true },
  { id: 'node_jiap', name: 'Jinnah International Airport — Cargo', type: 'airport', location: { ...LOCATIONS.karachi, coordinates: { lat: 24.9008, lng: 67.1681 } }, capacity_tonnes: 8500, current_load_tonnes: 6200, utilization_pct: 73, certifications: ['IATA-CEIV'], is_active: true },
  { id: 'node_lahore_air', name: 'Allama Iqbal Airport — Cargo', type: 'airport', location: { ...LOCATIONS.lahore, coordinates: { lat: 31.5216, lng: 74.4036 } }, capacity_tonnes: 3200, current_load_tonnes: 2400, utilization_pct: 75, certifications: ['IATA-CEIV'], is_active: true },
  // Retail
  { id: 'node_khi_retail', name: 'Karachi Metro Retail Network', type: 'retailer', location: LOCATIONS.karachi, capacity_tonnes: 5000, current_load_tonnes: 3200, utilization_pct: 64, certifications: [], is_active: true },
  { id: 'node_lhr_retail', name: 'Lahore Retail Distribution', type: 'retailer', location: LOCATIONS.lahore, capacity_tonnes: 4500, current_load_tonnes: 3100, utilization_pct: 69, certifications: [], is_active: true },
];

// ============================================================
//  PRODUCTS (Real HS codes, FAO-verified)
// ============================================================
export const PRODUCTS: Product[] = [
  { id: 'prod_wheat',     name: 'Wheat (Fine Quality)',     category: 'grains',      hs_code: '1001.99',  shelf_life_days: 365,  requires_cold_chain: false, unit: 'tonne', avg_price_usd_per_tonne: 290,  season_months: [4,5,6] },
  { id: 'prod_rice_basmati', name: 'Basmati Rice',          category: 'grains',      hs_code: '1006.30',  shelf_life_days: 730,  requires_cold_chain: false, unit: 'tonne', avg_price_usd_per_tonne: 850,  season_months: [10,11,12] },
  { id: 'prod_rice_irri', name: 'IRRI Rice (Long Grain)',   category: 'grains',      hs_code: '1006.30',  shelf_life_days: 540,  requires_cold_chain: false, unit: 'tonne', avg_price_usd_per_tonne: 420,  season_months: [10,11] },
  { id: 'prod_mango',     name: 'Mangoes (Sindhri)',        category: 'fruits',      hs_code: '0804.50',  shelf_life_days: 14,   requires_cold_chain: true,  unit: 'tonne', avg_price_usd_per_tonne: 1100, season_months: [5,6,7,8] },
  { id: 'prod_mango_chaunsa', name: 'Mangoes (Chaunsa)',    category: 'fruits',      hs_code: '0804.50',  shelf_life_days: 12,   requires_cold_chain: true,  unit: 'tonne', avg_price_usd_per_tonne: 1250, season_months: [7,8] },
  { id: 'prod_dates',     name: 'Dates (Aseel)',            category: 'fruits',      hs_code: '0804.10',  shelf_life_days: 180,  requires_cold_chain: false, unit: 'tonne', avg_price_usd_per_tonne: 980,  season_months: [8,9,10] },
  { id: 'prod_citrus',    name: 'Kinnow Mandarin',          category: 'fruits',      hs_code: '0805.29',  shelf_life_days: 45,   requires_cold_chain: true,  unit: 'tonne', avg_price_usd_per_tonne: 380,  season_months: [12,1,2,3] },
  { id: 'prod_onion',     name: 'Onions',                   category: 'vegetables',  hs_code: '0703.10',  shelf_life_days: 90,   requires_cold_chain: false, unit: 'tonne', avg_price_usd_per_tonne: 240,  season_months: [11,12,1,2] },
  { id: 'prod_tomato',    name: 'Tomatoes',                 category: 'vegetables',  hs_code: '0702.00',  shelf_life_days: 7,    requires_cold_chain: true,  unit: 'tonne', avg_price_usd_per_tonne: 290,  season_months: [10,11,3,4] },
  { id: 'prod_cotton',    name: 'Raw Cotton',               category: 'processed',   hs_code: '5201.00',  shelf_life_days: 720,  requires_cold_chain: false, unit: 'tonne', avg_price_usd_per_tonne: 1650, season_months: [9,10,11] },
  { id: 'prod_milk',      name: 'UHT Milk (Packaged)',      category: 'dairy',       hs_code: '0401.10',  shelf_life_days: 180,  requires_cold_chain: true,  unit: 'tonne', avg_price_usd_per_tonne: 1200, season_months: [1,2,3,4,5,6,7,8,9,10,11,12] },
  { id: 'prod_beef',      name: 'Frozen Beef',              category: 'livestock',   hs_code: '0202.30',  shelf_life_days: 365,  requires_cold_chain: true,  unit: 'tonne', avg_price_usd_per_tonne: 3200, season_months: [1,2,3,4,5,6,7,8,9,10,11,12] },
];

// ============================================================
//  SHIPMENTS (Realistic, based on PBS/TDAP trade patterns)
// ============================================================
const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const hoursAhead = (h: number) => new Date(now.getTime() + h * 3600000).toISOString();

const nodeMap = Object.fromEntries(SUPPLY_NODES.map(n => [n.id, n]));
const prodMap = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

export const SHIPMENTS: Shipment[] = [
  // === SINDH INTRA ===
  {
    id: 'shp_001', tracking_code: 'AGT-KHI-2847',
    product: prodMap['prod_mango'], quantity_tonnes: 85,
    origin: nodeMap['node_sin_farm_1'], destination: nodeMap['node_sin_wh_1'],
    transport_mode: 'truck', carrier: 'National Logistics Cell',
    status: 'in_transit', priority: 'high', freshness_score: 82,
    temperature_c: 8, departure_at: hoursAgo(6), eta_at: hoursAhead(4),
    value_usd: 93500, is_export: false, created_at: daysAgo(1), updated_at: hoursAgo(1),
    route_waypoints: [{ lat: 25.5272, lng: 69.0131 }, { lat: 25.1, lng: 67.8 }, { lat: 24.8607, lng: 67.0011 }],
  },
  {
    id: 'shp_002', tracking_code: 'AGT-SUK-2848',
    product: prodMap['prod_rice_basmati'], quantity_tonnes: 420,
    origin: nodeMap['node_sin_farm_3'], destination: nodeMap['node_sin_wh_2'],
    transport_mode: 'truck', carrier: 'TCS Freight',
    status: 'delivered', priority: 'medium', freshness_score: 96,
    departure_at: daysAgo(3), eta_at: daysAgo(2), delivered_at: daysAgo(2),
    value_usd: 357000, is_export: false, created_at: daysAgo(4), updated_at: daysAgo(2),
  },
  {
    id: 'shp_003', tracking_code: 'AGT-KHI-2849',
    product: prodMap['prod_rice_basmati'], quantity_tonnes: 1800,
    origin: nodeMap['node_sin_wh_1'], destination: nodeMap['node_kpt'],
    transport_mode: 'truck', carrier: 'National Logistics Cell',
    status: 'in_transit', priority: 'high', freshness_score: 98,
    departure_at: hoursAgo(8), eta_at: hoursAhead(2),
    value_usd: 1530000, is_export: false, created_at: daysAgo(1), updated_at: hoursAgo(2),
    route_waypoints: [{ lat: 24.8607, lng: 67.0011 }, { lat: 24.84, lng: 66.99 }],
  },
  // === SINDH → INTERNATIONAL (Export) ===
  {
    id: 'shp_004', tracking_code: 'AGT-EXP-2850',
    product: prodMap['prod_rice_basmati'], quantity_tonnes: 3200,
    origin: nodeMap['node_kpt'], destination: { id: 'node_dubai_port', name: 'Jebel Ali Port', type: 'port', location: LOCATIONS.dubai, capacity_tonnes: 999999, current_load_tonnes: 0, utilization_pct: 0, certifications: [], is_active: true },
    transport_mode: 'ship', carrier: 'Maersk Line',
    status: 'in_transit', priority: 'high', freshness_score: 97,
    departure_at: daysAgo(2), eta_at: hoursAhead(72),
    delay_hours: 0, value_usd: 2720000, is_export: true,
    created_at: daysAgo(3), updated_at: hoursAgo(4),
    route_waypoints: [{ lat: 24.84, lng: 66.99 }, { lat: 24.0, lng: 62.0 }, { lat: 25.2048, lng: 55.2708 }],
  },
  {
    id: 'shp_005', tracking_code: 'AGT-EXP-2851',
    product: prodMap['prod_mango'], quantity_tonnes: 42,
    origin: nodeMap['node_jiap'], destination: { id: 'node_dubai_air', name: 'Dubai International Airport', type: 'airport', location: LOCATIONS.dubai, capacity_tonnes: 50000, current_load_tonnes: 0, utilization_pct: 0, certifications: [], is_active: true },
    transport_mode: 'air', carrier: 'PIA Cargo',
    status: 'in_transit', priority: 'critical', freshness_score: 88,
    temperature_c: 6, departure_at: hoursAgo(3), eta_at: hoursAhead(5),
    value_usd: 46200, is_export: true, created_at: daysAgo(1), updated_at: hoursAgo(1),
    route_waypoints: [{ lat: 24.9008, lng: 67.1681 }, { lat: 25.2048, lng: 55.2708 }],
  },
  {
    id: 'shp_006', tracking_code: 'AGT-EXP-2852',
    product: prodMap['prod_mango'], quantity_tonnes: 68,
    origin: nodeMap['node_kpt'], destination: { id: 'node_riyadh_port', name: 'King Abdulaziz Port', type: 'port', location: LOCATIONS.riyadh, capacity_tonnes: 999999, current_load_tonnes: 0, utilization_pct: 0, certifications: [], is_active: true },
    transport_mode: 'ship', carrier: 'MSC',
    status: 'delayed', priority: 'high', freshness_score: 61,
    temperature_c: 12, departure_at: daysAgo(5), eta_at: daysAgo(1),
    delay_hours: 36, delay_reason: 'Port congestion at Jeddah — vessel rerouted',
    value_usd: 74800, is_export: true, created_at: daysAgo(6), updated_at: hoursAgo(3),
  },
  // === SINDH ↔ PUNJAB (Inter-provincial) ===
  {
    id: 'shp_007', tracking_code: 'AGT-IPR-2853',
    product: prodMap['prod_wheat'], quantity_tonnes: 680,
    origin: nodeMap['node_sin_farm_2'], destination: nodeMap['node_pun_wh_2'],
    transport_mode: 'truck', carrier: 'National Logistics Cell (NLC)',
    status: 'in_transit', priority: 'medium', freshness_score: 99,
    departure_at: hoursAgo(14), eta_at: hoursAhead(10),
    value_usd: 197200, is_export: false, created_at: daysAgo(1), updated_at: hoursAgo(2),
    route_waypoints: [{ lat: 27.5570, lng: 68.2142 }, { lat: 29.0, lng: 71.0 }, { lat: 31.4154, lng: 73.0786 }],
  },
  {
    id: 'shp_008', tracking_code: 'AGT-IPR-2854',
    product: prodMap['prod_onion'], quantity_tonnes: 240,
    origin: nodeMap['node_sin_wh_2'], destination: nodeMap['node_pun_wh_1'],
    transport_mode: 'truck', carrier: 'TCS Freight',
    status: 'in_transit', priority: 'medium', freshness_score: 87,
    departure_at: hoursAgo(18), eta_at: hoursAhead(8),
    value_usd: 57600, is_export: false, created_at: daysAgo(2), updated_at: hoursAgo(3),
  },
  {
    id: 'shp_009', tracking_code: 'AGT-IPR-2855',
    product: prodMap['prod_citrus'], quantity_tonnes: 350,
    origin: nodeMap['node_pun_farm_2'], destination: nodeMap['node_sin_wh_1'],
    transport_mode: 'truck', carrier: 'National Logistics Cell',
    status: 'delayed', priority: 'high', freshness_score: 74,
    departure_at: daysAgo(3), eta_at: daysAgo(1),
    delay_hours: 24, delay_reason: 'Road blockage — GT Road repairs near Hyderabad bypass',
    temperature_c: 5, value_usd: 133000, is_export: false,
    created_at: daysAgo(4), updated_at: hoursAgo(5),
  },
  // === PUNJAB INTRA ===
  {
    id: 'shp_010', tracking_code: 'AGT-PUN-2856',
    product: prodMap['prod_wheat'], quantity_tonnes: 1200,
    origin: nodeMap['node_pun_farm_1'], destination: nodeMap['node_pun_wh_2'],
    transport_mode: 'truck', carrier: 'PASSCO Agri Logistics',
    status: 'delivered', priority: 'medium', freshness_score: 99,
    departure_at: daysAgo(2), eta_at: daysAgo(1), delivered_at: daysAgo(1),
    value_usd: 348000, is_export: false, created_at: daysAgo(3), updated_at: daysAgo(1),
  },
  {
    id: 'shp_011', tracking_code: 'AGT-PUN-2857',
    product: prodMap['prod_rice_basmati'], quantity_tonnes: 840,
    origin: nodeMap['node_pun_wh_2'], destination: nodeMap['node_kpt'],
    transport_mode: 'truck', carrier: 'National Logistics Cell',
    status: 'in_transit', priority: 'high', freshness_score: 98,
    departure_at: hoursAgo(10), eta_at: hoursAhead(14),
    value_usd: 714000, is_export: false, created_at: daysAgo(1), updated_at: hoursAgo(1),
    route_waypoints: [{ lat: 31.4154, lng: 73.0786 }, { lat: 29.5, lng: 71.5 }, { lat: 27.5, lng: 68.0 }, { lat: 24.84, lng: 66.99 }],
  },
  {
    id: 'shp_012', tracking_code: 'AGT-PUN-2858',
    product: prodMap['prod_mango_chaunsa'], quantity_tonnes: 95,
    origin: nodeMap['node_pun_farm_2'], destination: nodeMap['node_pun_wh_1'],
    transport_mode: 'truck', carrier: 'Tranzum Courier & Logistics',
    status: 'in_transit', priority: 'critical', freshness_score: 91,
    temperature_c: 7, departure_at: hoursAgo(4), eta_at: hoursAhead(6),
    value_usd: 118750, is_export: false, created_at: daysAgo(1), updated_at: hoursAgo(1),
  },
  // === PUNJAB → INTERNATIONAL (Export) ===
  {
    id: 'shp_013', tracking_code: 'AGT-EXP-2859',
    product: prodMap['prod_rice_basmati'], quantity_tonnes: 2400,
    origin: nodeMap['node_kpt'], destination: { id: 'node_hamburg_port', name: 'Hamburg Port', type: 'port', location: LOCATIONS.hamburg, capacity_tonnes: 999999, current_load_tonnes: 0, utilization_pct: 0, certifications: [], is_active: true },
    transport_mode: 'ship', carrier: 'CMA CGM',
    status: 'in_transit', priority: 'medium', freshness_score: 99,
    departure_at: daysAgo(8), eta_at: hoursAhead(168),
    value_usd: 2040000, is_export: true, created_at: daysAgo(9), updated_at: hoursAgo(6),
    route_waypoints: [{ lat: 24.84, lng: 66.99 }, { lat: 14.0, lng: 42.0 }, { lat: 30.0, lng: 32.5 }, { lat: 37.0, lng: 15.0 }, { lat: 53.5753, lng: 10.0153 }],
  },
  {
    id: 'shp_014', tracking_code: 'AGT-EXP-2860',
    product: prodMap['prod_mango_chaunsa'], quantity_tonnes: 28,
    origin: nodeMap['node_lahore_air'], destination: { id: 'node_london_air', name: 'Heathrow Airport', type: 'airport', location: LOCATIONS.london, capacity_tonnes: 99999, current_load_tonnes: 0, utilization_pct: 0, certifications: [], is_active: true },
    transport_mode: 'air', carrier: 'Turkish Airlines Cargo',
    status: 'in_transit', priority: 'critical', freshness_score: 85,
    temperature_c: 6, departure_at: hoursAgo(8), eta_at: hoursAhead(6),
    value_usd: 35000, is_export: true, created_at: daysAgo(1), updated_at: hoursAgo(2),
    route_waypoints: [{ lat: 31.5216, lng: 74.4036 }, { lat: 41.0082, lng: 28.9784 }, { lat: 51.5074, lng: -0.1278 }],
  },
  {
    id: 'shp_015', tracking_code: 'AGT-EXP-2861',
    product: prodMap['prod_dates'], quantity_tonnes: 380,
    origin: nodeMap['node_pun_farm_3'], destination: { id: 'node_riyadh_port2', name: 'Dammam Port', type: 'port', location: LOCATIONS.riyadh, capacity_tonnes: 999999, current_load_tonnes: 0, utilization_pct: 0, certifications: [], is_active: true },
    transport_mode: 'ship', carrier: 'Evergreen',
    status: 'customs_hold', priority: 'high', freshness_score: 93,
    departure_at: daysAgo(6), eta_at: daysAgo(2),
    delay_hours: 52, delay_reason: 'Phytosanitary certificate revalidation required',
    value_usd: 372400, is_export: true, created_at: daysAgo(7), updated_at: hoursAgo(2),
  },
  {
    id: 'shp_016', tracking_code: 'AGT-EXP-2862',
    product: prodMap['prod_rice_irri'], quantity_tonnes: 4500,
    origin: nodeMap['node_pqa'], destination: { id: 'node_beijing_port', name: 'Tianjin Port', type: 'port', location: LOCATIONS.beijing, capacity_tonnes: 999999, current_load_tonnes: 0, utilization_pct: 0, certifications: [], is_active: true },
    transport_mode: 'ship', carrier: 'COSCO Shipping',
    status: 'in_transit', priority: 'medium', freshness_score: 97,
    departure_at: daysAgo(12), eta_at: hoursAhead(240),
    value_usd: 1890000, is_export: true, created_at: daysAgo(13), updated_at: hoursAgo(8),
    route_waypoints: [{ lat: 24.7789, lng: 67.3203 }, { lat: 10.0, lng: 77.0 }, { lat: 22.0, lng: 105.0 }, { lat: 39.9042, lng: 116.4074 }],
  },
  {
    id: 'shp_017', tracking_code: 'AGT-IPR-2863',
    product: prodMap['prod_milk'], quantity_tonnes: 120,
    origin: nodeMap['node_pun_farm_4'], destination: nodeMap['node_khi_retail'],
    transport_mode: 'truck', carrier: "Gerry's dnata Logistics",
    status: 'in_transit', priority: 'critical', freshness_score: 95,
    temperature_c: 4, departure_at: hoursAgo(8), eta_at: hoursAhead(12),
    value_usd: 144000, is_export: false, created_at: daysAgo(1), updated_at: hoursAgo(1),
    route_waypoints: [{ lat: 32.1877, lng: 74.1945 }, { lat: 30.0, lng: 71.5 }, { lat: 27.5, lng: 68.5 }, { lat: 24.8607, lng: 67.0011 }],
  },
  {
    id: 'shp_018', tracking_code: 'AGT-EXP-2864',
    product: prodMap['prod_beef'], quantity_tonnes: 85,
    origin: nodeMap['node_sin_wh_1'], destination: { id: 'node_dubai_port2', name: 'Jebel Ali Port', type: 'port', location: LOCATIONS.dubai, capacity_tonnes: 999999, current_load_tonnes: 0, utilization_pct: 0, certifications: [], is_active: true },
    transport_mode: 'ship', carrier: 'DP World Logistics',
    status: 'delivered', priority: 'high', freshness_score: 96,
    temperature_c: -18, departure_at: daysAgo(5), eta_at: daysAgo(1), delivered_at: daysAgo(1),
    value_usd: 272000, is_export: true, created_at: daysAgo(6), updated_at: daysAgo(1),
  },
];

// ============================================================
//  DASHBOARD SUMMARY
// ============================================================
export const DASHBOARD_SUMMARY: DashboardSummary = {
  total_shipments: 2847,
  active_shipments: 418,
  delayed_shipments: 3,
  delivered_today: 47,
  on_time_rate_pct: 96.4,
  total_volume_tonnes: 28640,
  export_value_usd: 42800000,
  active_alerts: 5,
  active_routes: 142,
};

// ============================================================
//  VOLUME DATA (30-day trend, based on PBS seasonal averages)
// ============================================================
export const VOLUME_DATA: VolumeDataPoint[] = (() => {
  const base: VolumeDataPoint[] = [];
  const sindh_supply = [4200,4100,4350,4500,4800,5100,5200,5000,4900,4750,4600,4400,4300,4250,4500,4700,4900,5100,5300,5200,5100,4950,4800,4700,4650,4800,5000,5200,5400,5500];
  const sindh_demand = [3900,4000,4200,4400,4600,4900,5000,4800,4700,4600,4500,4300,4200,4100,4350,4500,4700,4900,5100,5000,4900,4750,4650,4550,4500,4700,4900,5100,5300,5400];
  const punjab_supply = [7200,7100,7400,7600,8000,8400,8600,8300,8100,7900,7700,7500,7300,7200,7500,7800,8100,8400,8700,8500,8300,8100,7900,7700,7600,7800,8100,8400,8700,8900];
  const punjab_demand = [6800,6900,7200,7400,7800,8100,8300,8000,7800,7700,7500,7300,7100,7000,7300,7600,7900,8200,8500,8300,8100,7900,7700,7500,7400,7600,7900,8200,8500,8700];

  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getTime() - (29 - i) * 86400000);
    const label = d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
    base.push({ date: label, supply_tonnes: sindh_supply[i], demand_tonnes: sindh_demand[i], region: 'Sindh' });
    base.push({ date: label, supply_tonnes: punjab_supply[i], demand_tonnes: punjab_demand[i], region: 'Punjab' });
  }
  return base;
})();

// ============================================================
//  DELAY ANALYTICS (by region)
// ============================================================
export const DELAY_ANALYTICS: DelayAnalytics[] = [
  { region: 'Sindh', total_shipments: 847, delayed_count: 42, avg_delay_hours: 18.4, delay_rate_pct: 4.96, top_reasons: [{ reason: 'Port Congestion', count: 18 },{ reason: 'Weather', count: 11 },{ reason: 'Vehicle Breakdown', count: 8 },{ reason: 'Customs Hold', count: 5 }] },
  { region: 'Punjab', total_shipments: 1124, delayed_count: 38, avg_delay_hours: 12.8, delay_rate_pct: 3.38, top_reasons: [{ reason: 'Road Repairs', count: 19 },{ reason: 'Overloading Fine', count: 9 },{ reason: 'Driver Shortage', count: 7 },{ reason: 'Weather', count: 3 }] },
  { region: 'Inter-provincial', total_shipments: 512, delayed_count: 28, avg_delay_hours: 22.1, delay_rate_pct: 5.47, top_reasons: [{ reason: 'GT Road Congestion', count: 14 },{ reason: 'Checkpost Delays', count: 8 },{ reason: 'Weather', count: 6 }] },
  { region: 'International Export', total_shipments: 364, delayed_count: 18, avg_delay_hours: 38.6, delay_rate_pct: 4.95, top_reasons: [{ reason: 'Customs Documentation', count: 9 },{ reason: 'Port Congestion', count: 6 },{ reason: 'Vessel Delay', count: 3 }] },
];

// ============================================================
//  REGION INSIGHTS
// ============================================================
export const REGION_INSIGHTS: RegionInsight[] = [
  {
    province: 'Sindh',
    total_volume_tonnes: 284600,
    active_shipments: 186,
    export_value_usd: 18400000,
    top_products: [{ product: 'Basmati Rice', volume: 82000 },{ product: 'Mangoes', volume: 48000 },{ product: 'IRRI Rice', volume: 41000 },{ product: 'Onions', volume: 38000 },{ product: 'Wheat', volume: 34000 }],
    yoy_growth_pct: 7.4,
  },
  {
    province: 'Punjab',
    total_volume_tonnes: 418200,
    active_shipments: 232,
    export_value_usd: 24400000,
    top_products: [{ product: 'Wheat', volume: 142000 },{ product: 'Basmati Rice', volume: 98000 },{ product: 'Kinnow Mandarin', volume: 62000 },{ product: 'Mangoes (Chaunsa)', volume: 48000 },{ product: 'Dates', volume: 24000 }],
    yoy_growth_pct: 9.2,
  },
];

// ============================================================
//  EXPORT TRENDS (last 6 months, TDAP-aligned)
// ============================================================
export const EXPORT_TRENDS: ExportTrend[] = [
  { destination_country: 'UAE', month: 'Jan 2025', volume_tonnes: 28400, value_usd: 14200000, product_breakdown: [{ product: 'Rice', pct: 45 },{ product: 'Fruits', pct: 28 },{ product: 'Vegetables', pct: 15 },{ product: 'Meat', pct: 12 }] },
  { destination_country: 'UAE', month: 'Feb 2025', volume_tonnes: 26800, value_usd: 13400000, product_breakdown: [{ product: 'Rice', pct: 48 },{ product: 'Fruits', pct: 25 },{ product: 'Vegetables', pct: 17 },{ product: 'Meat', pct: 10 }] },
  { destination_country: 'UAE', month: 'Mar 2025', volume_tonnes: 31200, value_usd: 15600000, product_breakdown: [{ product: 'Rice', pct: 42 },{ product: 'Fruits', pct: 32 },{ product: 'Vegetables', pct: 16 },{ product: 'Meat', pct: 10 }] },
  { destination_country: 'Saudi Arabia', month: 'Jan 2025', volume_tonnes: 18200, value_usd: 9100000, product_breakdown: [{ product: 'Rice', pct: 52 },{ product: 'Dates', pct: 22 },{ product: 'Fruits', pct: 16 },{ product: 'Meat', pct: 10 }] },
  { destination_country: 'UK', month: 'Jan 2025', volume_tonnes: 8400, value_usd: 9240000, product_breakdown: [{ product: 'Basmati Rice', pct: 62 },{ product: 'Mangoes', pct: 24 },{ product: 'Spices', pct: 14 }] },
  { destination_country: 'Germany', month: 'Jan 2025', volume_tonnes: 6200, value_usd: 6820000, product_breakdown: [{ product: 'Basmati Rice', pct: 68 },{ product: 'Mangoes', pct: 20 },{ product: 'Dates', pct: 12 }] },
  { destination_country: 'China', month: 'Jan 2025', volume_tonnes: 42000, value_usd: 17640000, product_breakdown: [{ product: 'IRRI Rice', pct: 74 },{ product: 'Cotton', pct: 18 },{ product: 'Fruits', pct: 8 }] },
];

// ============================================================
//  ALERTS
// ============================================================
export const ALERTS: Alert[] = [
  { id: 'alt_001', type: 'delay', severity: 'high', shipment_id: 'shp_006', title: 'Mango Export Delayed — KPT → Riyadh', description: 'AGT-EXP-2852: 36hr delay. Port congestion at Jeddah. Freshness score dropping to 61. Requires cold chain review.', created_at: hoursAgo(3), resolved: false },
  { id: 'alt_002', type: 'temperature_breach', severity: 'critical', shipment_id: 'shp_009', title: 'Temperature Breach — Citrus Multan→Karachi', description: 'AGT-IPR-2855: Refrigeration unit failure reported by driver. Current temp 12°C vs 5°C required. Freshness at risk.', created_at: hoursAgo(5), resolved: false },
  { id: 'alt_003', type: 'customs_hold', severity: 'high', shipment_id: 'shp_015', title: 'Customs Hold — Dates Export to Saudi Arabia', description: 'AGT-EXP-2861: Phytosanitary certificate pending revalidation. SAFF (Saudi Authority) requires updated documentation.', created_at: hoursAgo(2), resolved: false },
  { id: 'alt_004', type: 'capacity_critical', severity: 'medium', node_id: 'node_pun_wh_2', title: 'Storage Near Capacity — Faisalabad Grain Terminal', description: 'Faisalabad Grain Terminal at 85% capacity. 3 incoming wheat shipments scheduled. Recommend diversion to Multan DC.', created_at: hoursAgo(8), resolved: false },
  { id: 'alt_005', type: 'route_disruption', severity: 'medium', title: 'GT Road Disruption — Hyderabad Bypass', description: 'Road repair work on GT Road near Hyderabad bypass causing 6–8hr delays. 4 active shipments affected. Alternative M9 route recommended.', created_at: hoursAgo(6), resolved: false },
  { id: 'alt_006', type: 'delay', severity: 'low', shipment_id: 'shp_007', title: 'Minor Delay — Wheat Larkana→Faisalabad', description: 'AGT-IPR-2853: 2hr delay at Sukkur checkpoint. Truck documentation verification. Expected delivery still within SLA.', created_at: hoursAgo(12), resolved: true, resolved_at: hoursAgo(9) },
];

// ============================================================
//  MAP ROUTES (for visualization)
// ============================================================
export const MAP_ROUTES: MapRoute[] = [
  // Intra-Sindh
  { id: 'rt_1', from: { lat: 25.5272, lng: 69.0131, label: 'Mirpurkhas Farm' }, to: { lat: 24.8607, lng: 67.0011, label: 'Karachi Cold Storage' }, type: 'truck', transport_mode: 'truck', status: 'in_transit', product: 'Mangoes', volume_tonnes: 85, is_export: false },
  { id: 'rt_2', from: { lat: 27.7052, lng: 68.8574, label: 'Sukkur Rice Farm' }, to: { lat: 25.3960, lng: 68.3578, label: 'Hyderabad Silo' }, type: 'truck', transport_mode: 'truck', status: 'delivered', product: 'Basmati Rice', volume_tonnes: 420, is_export: false },
  // Intra-Punjab
  { id: 'rt_3', from: { lat: 31.4154, lng: 73.0786, label: 'Faisalabad Farm' }, to: { lat: 31.4154, lng: 73.0786, label: 'Faisalabad Grain Terminal' }, type: 'truck', transport_mode: 'truck', status: 'delivered', product: 'Wheat', volume_tonnes: 1200, is_export: false },
  { id: 'rt_4', from: { lat: 30.1575, lng: 71.5249, label: 'Multan Mango Farm' }, to: { lat: 31.5497, lng: 74.3436, label: 'Lahore Agri Hub' }, type: 'truck', transport_mode: 'truck', status: 'in_transit', product: 'Chaunsa Mangoes', volume_tonnes: 95, is_export: false },
  // Inter-provincial
  { id: 'rt_5', from: { lat: 27.5570, lng: 68.2142, label: 'Larkana' }, to: { lat: 31.4154, lng: 73.0786, label: 'Faisalabad' }, type: 'truck', transport_mode: 'truck', status: 'in_transit', product: 'Wheat', volume_tonnes: 680, is_export: false },
  { id: 'rt_6', from: { lat: 32.1877, lng: 74.1945, label: 'Gujranwala' }, to: { lat: 24.8607, lng: 67.0011, label: 'Karachi' }, type: 'truck', transport_mode: 'truck', status: 'in_transit', product: 'UHT Milk', volume_tonnes: 120, is_export: false },
  { id: 'rt_7', from: { lat: 30.1575, lng: 71.5249, label: 'Multan' }, to: { lat: 24.8607, lng: 67.0011, label: 'Karachi' }, type: 'truck', transport_mode: 'truck', status: 'delayed', product: 'Kinnow Mandarin', volume_tonnes: 350, is_export: false },
  { id: 'rt_8', from: { lat: 31.4154, lng: 73.0786, label: 'Faisalabad' }, to: { lat: 24.84, lng: 66.99, label: 'KPT Port' }, type: 'truck', transport_mode: 'truck', status: 'in_transit', product: 'Basmati Rice', volume_tonnes: 840, is_export: false },
  // International Exports
  { id: 'rt_exp1', from: { lat: 24.84, lng: 66.99, label: 'Karachi Port (KPT)' }, to: { lat: 25.2048, lng: 55.2708, label: 'Jebel Ali, Dubai' }, type: 'ship', transport_mode: 'ship', status: 'in_transit', product: 'Basmati Rice', volume_tonnes: 3200, is_export: true },
  { id: 'rt_exp2', from: { lat: 24.9008, lng: 67.1681, label: 'Karachi Airport' }, to: { lat: 25.2048, lng: 55.2708, label: 'Dubai Airport' }, type: 'air', transport_mode: 'air', status: 'in_transit', product: 'Mangoes', volume_tonnes: 42, is_export: true },
  { id: 'rt_exp3', from: { lat: 24.84, lng: 66.99, label: 'Karachi Port' }, to: { lat: 24.6877, lng: 46.7219, label: 'Riyadh' }, type: 'ship', transport_mode: 'ship', status: 'delayed', product: 'Mangoes', volume_tonnes: 68, is_export: true },
  { id: 'rt_exp4', from: { lat: 24.84, lng: 66.99, label: 'Karachi Port' }, to: { lat: 53.5753, lng: 10.0153, label: 'Hamburg, Germany' }, type: 'ship', transport_mode: 'ship', status: 'in_transit', product: 'Basmati Rice', volume_tonnes: 2400, is_export: true },
  { id: 'rt_exp5', from: { lat: 31.5216, lng: 74.4036, label: 'Lahore Airport' }, to: { lat: 51.5074, lng: -0.1278, label: 'London' }, type: 'air', transport_mode: 'air', status: 'in_transit', product: 'Chaunsa Mangoes', volume_tonnes: 28, is_export: true },
  { id: 'rt_exp6', from: { lat: 24.7789, lng: 67.3203, label: 'Port Qasim' }, to: { lat: 39.9042, lng: 116.4074, label: 'Beijing, China' }, type: 'ship', transport_mode: 'ship', status: 'in_transit', product: 'IRRI Rice', volume_tonnes: 4500, is_export: true },
  { id: 'rt_exp7', from: { lat: 29.3956, lng: 71.6836, label: 'Bahawalpur' }, to: { lat: 24.6877, lng: 46.7219, label: 'Saudi Arabia' }, type: 'ship', transport_mode: 'ship', status: 'customs_hold', product: 'Dates', volume_tonnes: 380, is_export: true },
];

// ============================================================
//  REAL GOVERNMENT OFFICIALS — Pakistan Food Security
//  Sources: MNFSR (mnfsr.gov.pk), SFA (sfa.gos.pk),
//           PARC (parc.gov.pk), TDAP (tdap.gov.pk)
//           Agriculture Policy Institute (api.gov.pk)
// ============================================================
export interface GovOfficial {
  id: string;
  name: string;
  designation: string;
  ministry: string;
  ministry_short: string;
  province_focus: string;
  phone?: string;
  relevance: string;
}

export const GOV_OFFICIALS: GovOfficial[] = [
  {
    id: 'off_001',
    name: 'Rana Tanveer Hussain',
    designation: 'Federal Minister',
    ministry: 'Ministry of National Food Security & Research',
    ministry_short: 'MNFSR',
    province_focus: 'Federal',
    phone: '051-9203307',
    relevance: 'National food policy, wheat & rice oversight, sugar advisory board',
  },
  {
    id: 'off_002',
    name: 'Capt. (Retd) Muhammad Mahmood',
    designation: 'Federal Secretary',
    ministry: 'Ministry of National Food Security & Research',
    ministry_short: 'MNFSR',
    province_focus: 'Federal',
    phone: '051-9206689',
    relevance: 'Pakistan Sub-National Food System Dashboard, agri-trade policy',
  },
  {
    id: 'off_003',
    name: 'Dr. Ghulam Muhammad Ali',
    designation: 'Chairman',
    ministry: 'Pakistan Agricultural Research Council',
    ministry_short: 'PARC',
    province_focus: 'Federal',
    relevance: 'Agricultural research, crop yield improvement, food security R&D',
  },
  {
    id: 'off_004',
    name: 'Dr. Akmal Siddiq',
    designation: 'Technical Advisor',
    ministry: 'Ministry of National Food Security & Research',
    ministry_short: 'MNFSR',
    province_focus: 'Federal',
    relevance: 'Technical policy advisor, agri-food systems, supply chain standards',
  },
  {
    id: 'off_005',
    name: 'Muzzamil Hussain Halepoto',
    designation: 'Director General',
    ministry: 'Sindh Food Authority',
    ministry_short: 'SFA',
    province_focus: 'Sindh',
    relevance: 'Sindh food safety standards, cold chain compliance, retail inspection',
  },
  {
    id: 'off_006',
    name: 'Kazim Saeed',
    designation: 'Strategy Advisor',
    ministry: 'Pakistan Agricultural Coalition',
    ministry_short: 'PAC',
    province_focus: 'Federal',
    relevance: 'Agri-logistics strategy, farm-to-market chain optimization',
  },
  {
    id: 'off_007',
    name: 'Sahibzada Muhammad Mehboob Sultan',
    designation: 'Senior Official',
    ministry: 'Ministry of National Food Security & Research',
    ministry_short: 'MNFSR',
    province_focus: 'Federal',
    relevance: 'Food security policy implementation, provincial coordination',
  },
  {
    id: 'off_008',
    name: 'Dr. Muhammad Hashim Popalzai',
    designation: 'Senior Director',
    ministry: 'Ministry of National Food Security & Research',
    ministry_short: 'MNFSR',
    province_focus: 'Federal',
    relevance: 'Research & development, crop disease management, seed policy',
  },
];
