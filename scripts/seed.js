#!/usr/bin/env node
// scripts/seed.js
// Seeds the database with the realistic Pakistan supply chain dataset.
// This is production-equivalent data (real cities, products, HS codes).
// Usage: node scripts/seed.js
// WARNING: truncates all tables before inserting. Do not run against production.

require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { ssl: { rejectUnauthorized: false } });

async function seed() {
  console.log('Truncating tables...');
  await sql`TRUNCATE map_routes, alerts, shipments, supply_nodes, products, locations, volume_snapshots, region_insights, export_trends RESTART IDENTITY CASCADE`;

  // ── LOCATIONS ──────────────────────────────────────────────
  console.log('Seeding locations...');
  await sql`
    INSERT INTO locations (id, name, city, province, country, lat, lng, timezone) VALUES
      ('loc_karachi',    'Karachi',     'Karachi',     'Sindh',  'Pakistan',     24.8607, 67.0011, 'Asia/Karachi'),
      ('loc_hyderabad',  'Hyderabad',   'Hyderabad',   'Sindh',  'Pakistan',     25.3960, 68.3578, 'Asia/Karachi'),
      ('loc_sukkur',     'Sukkur',      'Sukkur',      'Sindh',  'Pakistan',     27.7052, 68.8574, 'Asia/Karachi'),
      ('loc_larkana',    'Larkana',     'Larkana',     'Sindh',  'Pakistan',     27.5570, 68.2142, 'Asia/Karachi'),
      ('loc_nawabshah',  'Nawabshah',   'Nawabshah',   'Sindh',  'Pakistan',     26.2442, 68.4100, 'Asia/Karachi'),
      ('loc_mirpurkhas', 'Mirpurkhas',  'Mirpurkhas',  'Sindh',  'Pakistan',     25.5272, 69.0131, 'Asia/Karachi'),
      ('loc_lahore',     'Lahore',      'Lahore',      'Punjab', 'Pakistan',     31.5497, 74.3436, 'Asia/Karachi'),
      ('loc_faisalabad', 'Faisalabad',  'Faisalabad',  'Punjab', 'Pakistan',     31.4154, 73.0786, 'Asia/Karachi'),
      ('loc_multan',     'Multan',      'Multan',      'Punjab', 'Pakistan',     30.1575, 71.5249, 'Asia/Karachi'),
      ('loc_rawalpindi', 'Rawalpindi',  'Rawalpindi',  'Punjab', 'Pakistan',     33.5651, 73.0169, 'Asia/Karachi'),
      ('loc_gujranwala', 'Gujranwala',  'Gujranwala',  'Punjab', 'Pakistan',     32.1877, 74.1945, 'Asia/Karachi'),
      ('loc_bahawalpur', 'Bahawalpur',  'Bahawalpur',  'Punjab', 'Pakistan',     29.3956, 71.6836, 'Asia/Karachi'),
      ('loc_kpt_port',   'KPT Port',    'Karachi',     'Sindh',  'Pakistan',     24.8400, 66.9900, 'Asia/Karachi'),
      ('loc_pqa_port',   'Port Qasim',  'Karachi',     'Sindh',  'Pakistan',     24.7789, 67.3203, 'Asia/Karachi'),
      ('loc_jiap',       'JIAP Cargo',  'Karachi',     'Sindh',  'Pakistan',     24.9008, 67.1681, 'Asia/Karachi'),
      ('loc_aiap',       'AIAP Cargo',  'Lahore',      'Punjab', 'Pakistan',     31.5216, 74.4036, 'Asia/Karachi'),
      ('loc_dubai',      'Dubai',       'Dubai',       NULL,     'UAE',          25.2048, 55.2708, 'Asia/Dubai'),
      ('loc_riyadh',     'Riyadh',      'Riyadh',      NULL,     'Saudi Arabia', 24.6877, 46.7219, 'Asia/Riyadh'),
      ('loc_london',     'London',      'London',      NULL,     'UK',           51.5074, -0.1278, 'Europe/London'),
      ('loc_hamburg',    'Hamburg',     'Hamburg',     NULL,     'Germany',      53.5753, 10.0153, 'Europe/Berlin'),
      ('loc_beijing',    'Beijing',     'Beijing',     NULL,     'China',        39.9042, 116.4074,'Asia/Shanghai')
  `;

  // ── SUPPLY NODES ────────────────────────────────────────────
  console.log('Seeding supply nodes...');
  await sql`
    INSERT INTO supply_nodes (id, name, type, location_id, capacity_tonnes, current_load_tonnes, certifications, is_active) VALUES
      ('node_sin_farm_1',  'Sindh Mango Belt Farm — Mirpurkhas', 'farm',      'loc_mirpurkhas', 8500,   6200,   ARRAY['GlobalG.A.P','Organic-PK'],       true),
      ('node_sin_farm_2',  'Indus Cotton & Wheat Belt — Larkana','farm',      'loc_larkana',    45000,  38000,  ARRAY['ISO 22000'],                      true),
      ('node_sin_farm_3',  'Sukkur Rice Farms Collective',        'farm',      'loc_sukkur',     22000,  18500,  ARRAY['FAO-GAP'],                        true),
      ('node_sin_farm_4',  'Hyderabad Vegetable Hub',             'farm',      'loc_hyderabad',  4200,   2900,   ARRAY['GlobalG.A.P'],                    true),
      ('node_pun_farm_1',  'Central Punjab Wheat Corridor',       'farm',      'loc_faisalabad', 85000,  72000,  ARRAY['ISO 22000','Punjab AgriCert'],     true),
      ('node_pun_farm_2',  'Multan Mango & Citrus Farm',          'farm',      'loc_multan',     12000,  9400,   ARRAY['GlobalG.A.P','USDA-Organic'],      true),
      ('node_pun_farm_3',  'Bahawalpur Date Palm Plantation',     'farm',      'loc_bahawalpur', 3800,   2100,   ARRAY['Organic-PK'],                     true),
      ('node_pun_farm_4',  'Gujranwala Dairy & Rice Complex',     'farm',      'loc_gujranwala', 18000,  14200,  ARRAY['ISO 22000','HACCP'],               true),
      ('node_sin_wh_1',    'Karachi Central Cold Storage',        'warehouse', 'loc_karachi',    35000,  28000,  ARRAY['ISO 9001','HACCP','Cold-Chain Pak'],true),
      ('node_sin_wh_2',    'Hyderabad Grain Silo Complex',        'warehouse', 'loc_hyderabad',  60000,  47000,  ARRAY['ISO 9001'],                       true),
      ('node_sin_wh_3',    'Sukkur Regional Warehouse',           'warehouse', 'loc_sukkur',     25000,  19000,  ARRAY['ISO 9001'],                       true),
      ('node_pun_wh_1',    'Lahore Agri Logistics Hub',           'warehouse', 'loc_lahore',     55000,  44000,  ARRAY['ISO 9001','HACCP'],                true),
      ('node_pun_wh_2',    'Faisalabad Grain Terminal',           'warehouse', 'loc_faisalabad', 95000,  81000,  ARRAY['ISO 9001'],                       true),
      ('node_pun_wh_3',    'Multan Southern Distribution Center', 'warehouse', 'loc_multan',     40000,  28000,  ARRAY['ISO 9001'],                       true),
      ('node_kpt',         'Karachi Port Trust (KPT)',            'port',      'loc_kpt_port',   500000, 380000, ARRAY['ISO 28000','AEO-Pak'],             true),
      ('node_pqa',         'Port Qasim Authority',                'port',      'loc_pqa_port',   350000, 245000, ARRAY['ISO 28000'],                      true),
      ('node_jiap',        'Jinnah International Airport — Cargo','airport',   'loc_jiap',       8500,   6200,   ARRAY['IATA-CEIV'],                      true),
      ('node_lahore_air',  'Allama Iqbal Airport — Cargo',        'airport',   'loc_aiap',       3200,   2400,   ARRAY['IATA-CEIV'],                      true),
      ('node_khi_retail',  'Karachi Metro Retail Network',        'retailer',  'loc_karachi',    5000,   3200,   ARRAY[]::text[],                         true),
      ('node_lhr_retail',  'Lahore Retail Distribution',          'retailer',  'loc_lahore',     4500,   3100,   ARRAY[]::text[],                         true),
      ('node_dubai_port',  'Jebel Ali Port',                      'port',      'loc_dubai',      999999, 0,      ARRAY[]::text[],                         true),
      ('node_riyadh_port', 'King Abdulaziz Port',                 'port',      'loc_riyadh',     999999, 0,      ARRAY[]::text[],                         true),
      ('node_london_air',  'Heathrow Airport',                    'airport',   'loc_london',     99999,  0,      ARRAY[]::text[],                         true),
      ('node_hamburg_port','Hamburg Port',                        'port',      'loc_hamburg',    999999, 0,      ARRAY[]::text[],                         true),
      ('node_beijing_port','Tianjin Port',                        'port',      'loc_beijing',    999999, 0,      ARRAY[]::text[],                         true)
  `;

  // ── PRODUCTS ────────────────────────────────────────────────
  console.log('Seeding products...');
  await sql`
    INSERT INTO products (id, name, category, hs_code, shelf_life_days, requires_cold_chain, unit, avg_price_usd_per_tonne, season_months) VALUES
      ('prod_wheat',         'Wheat (Fine Quality)',    'grains',     '1001.99', 365, false,'tonne', 290,  ARRAY[4,5,6]),
      ('prod_rice_basmati',  'Basmati Rice',            'grains',     '1006.30', 730, false,'tonne', 850,  ARRAY[10,11,12]),
      ('prod_rice_irri',     'IRRI Rice (Long Grain)',  'grains',     '1006.30', 540, false,'tonne', 420,  ARRAY[10,11]),
      ('prod_mango',         'Mangoes (Sindhri)',       'fruits',     '0804.50', 14,  true, 'tonne', 1100, ARRAY[5,6,7,8]),
      ('prod_mango_chaunsa', 'Mangoes (Chaunsa)',       'fruits',     '0804.50', 12,  true, 'tonne', 1250, ARRAY[7,8]),
      ('prod_dates',         'Dates (Aseel)',            'fruits',     '0804.10', 180, false,'tonne', 980,  ARRAY[8,9,10]),
      ('prod_citrus',        'Kinnow Mandarin',          'fruits',     '0805.29', 45,  true, 'tonne', 380,  ARRAY[12,1,2,3]),
      ('prod_onion',         'Onions',                  'vegetables', '0703.10', 90,  false,'tonne', 240,  ARRAY[11,12,1,2]),
      ('prod_tomato',        'Tomatoes',                'vegetables', '0702.00', 7,   true, 'tonne', 290,  ARRAY[10,11,3,4]),
      ('prod_cotton',        'Raw Cotton',              'processed',  '5201.00', 720, false,'tonne', 1650, ARRAY[9,10,11]),
      ('prod_milk',          'UHT Milk (Packaged)',     'dairy',      '0401.10', 180, true, 'tonne', 1200, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12]),
      ('prod_beef',          'Frozen Beef',             'livestock',  '0202.30', 365, true, 'tonne', 3200, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12])
  `;

  // ── SHIPMENTS ────────────────────────────────────────────────
  console.log('Seeding shipments...');
  const now = new Date();
  const ago = (h) => new Date(now - h * 3600000).toISOString();
  const ahead = (h) => new Date(now.getTime() + h * 3600000).toISOString();
  const dago = (d) => ago(d * 24);

  await sql`
    INSERT INTO shipments (id, tracking_code, product_id, quantity_tonnes, origin_id, destination_id, transport_mode, carrier, status, priority, freshness_score, temperature_c, departure_at, eta_at, delivered_at, delay_hours, delay_reason, route_waypoints, value_usd, is_export) VALUES
      ('shp_001','AGT-KHI-2847','prod_mango',         85,   'node_sin_farm_1', 'node_sin_wh_1',    'truck','National Logistics Cell',   'in_transit','high',    82, 8,   ${ago(6)},  ${ahead(4)},  NULL,       NULL,NULL, '[{"lat":25.5272,"lng":69.0131},{"lat":25.1,"lng":67.8},{"lat":24.8607,"lng":67.0011}]', 93500,  false),
      ('shp_002','AGT-SUK-2848','prod_rice_basmati',  420,  'node_sin_farm_3', 'node_sin_wh_2',    'truck','TCS Freight',               'delivered', 'medium',  96, NULL,${dago(3)}, ${dago(2)},   ${dago(2)}, NULL,NULL, NULL, 357000, false),
      ('shp_003','AGT-KHI-2849','prod_rice_basmati',  1800, 'node_sin_wh_1',  'node_kpt',         'truck','National Logistics Cell',   'in_transit','high',    98, NULL,${ago(8)},  ${ahead(2)},  NULL,       NULL,NULL, '[{"lat":24.8607,"lng":67.0011},{"lat":24.84,"lng":66.99}]', 1530000,false),
      ('shp_004','AGT-EXP-2850','prod_rice_basmati',  3200, 'node_kpt',        'node_dubai_port',  'ship', 'Maersk Line',               'in_transit','high',    97, NULL,${dago(2)}, ${ahead(72)}, NULL,       NULL,NULL, '[{"lat":24.84,"lng":66.99},{"lat":24.0,"lng":62.0},{"lat":25.2048,"lng":55.2708}]', 2720000,true),
      ('shp_005','AGT-EXP-2851','prod_mango',         42,   'node_jiap',       'node_dubai_port',  'air',  'PIA Cargo',                 'in_transit','critical',88, 6,   ${ago(3)},  ${ahead(5)},  NULL,       NULL,NULL, '[{"lat":24.9008,"lng":67.1681},{"lat":25.2048,"lng":55.2708}]', 46200,  true),
      ('shp_006','AGT-EXP-2852','prod_mango',         68,   'node_kpt',        'node_riyadh_port', 'ship', 'MSC',                       'delayed',   'high',    61, 12,  ${dago(5)}, ${dago(1)},   NULL,       36,  'Port congestion at Jeddah — vessel rerouted', NULL, 74800,  true),
      ('shp_007','AGT-IPR-2853','prod_wheat',         680,  'node_sin_farm_2', 'node_pun_wh_2',    'truck','Pak Motorway Logistics',    'in_transit','medium',  99, NULL,${ago(14)}, ${ahead(10)}, NULL,       NULL,NULL, '[{"lat":27.5570,"lng":68.2142},{"lat":29.0,"lng":71.0},{"lat":31.4154,"lng":73.0786}]', 197200,false),
      ('shp_008','AGT-IPR-2854','prod_onion',         240,  'node_sin_wh_2',  'node_pun_wh_1',    'truck','TCS Freight',               'in_transit','medium',  87, NULL,${ago(18)}, ${ahead(8)},  NULL,       NULL,NULL, NULL, 57600,  false),
      ('shp_009','AGT-IPR-2855','prod_citrus',        350,  'node_pun_farm_2','node_sin_wh_1',    'truck','National Logistics Cell',   'delayed',   'high',    74, 5,   ${dago(3)}, ${dago(1)},   NULL,       24,  'Road blockage — GT Road repairs near Hyderabad bypass', NULL, 133000, false),
      ('shp_010','AGT-PUN-2856','prod_wheat',         1200, 'node_pun_farm_1','node_pun_wh_2',    'truck','Fauji Fertilizer Agri Logistics','delivered','medium',99,NULL,${dago(2)},${dago(1)},${dago(1)},NULL,NULL, NULL, 348000, false),
      ('shp_011','AGT-PUN-2857','prod_rice_basmati',  840,  'node_pun_wh_2',  'node_kpt',         'truck','National Logistics Cell',   'in_transit','high',    98, NULL,${ago(10)}, ${ahead(14)}, NULL,       NULL,NULL, '[{"lat":31.4154,"lng":73.0786},{"lat":29.5,"lng":71.5},{"lat":24.84,"lng":66.99}]', 714000,false),
      ('shp_012','AGT-PUN-2858','prod_mango_chaunsa', 95,   'node_pun_farm_2','node_pun_wh_1',    'truck','Multan Cold Logistics',     'in_transit','critical',91, 7,   ${ago(4)},  ${ahead(6)},  NULL,       NULL,NULL, NULL, 118750, false),
      ('shp_013','AGT-EXP-2859','prod_rice_basmati',  2400, 'node_kpt',        'node_hamburg_port','ship', 'CMA CGM',                   'in_transit','medium',  99, NULL,${dago(8)}, ${ahead(168)},NULL,       NULL,NULL, '[{"lat":24.84,"lng":66.99},{"lat":14.0,"lng":42.0},{"lat":53.5753,"lng":10.0153}]', 2040000,true),
      ('shp_014','AGT-EXP-2860','prod_mango_chaunsa', 28,   'node_lahore_air', 'node_london_air',  'air',  'Turkish Airlines Cargo',    'in_transit','critical',85, 6,   ${ago(8)},  ${ahead(6)},  NULL,       NULL,NULL, '[{"lat":31.5216,"lng":74.4036},{"lat":41.0082,"lng":28.9784},{"lat":51.5074,"lng":-0.1278}]', 35000,true),
      ('shp_015','AGT-EXP-2861','prod_dates',         380,  'node_pun_farm_3','node_riyadh_port', 'ship', 'Evergreen',                 'customs_hold','high',  93, NULL,${dago(6)}, ${dago(2)},   NULL,       52,  'Phytosanitary certificate revalidation required', NULL, 372400, true),
      ('shp_016','AGT-EXP-2862','prod_rice_irri',     4500, 'node_pqa',        'node_beijing_port','ship', 'COSCO Shipping',            'in_transit','medium',  97, NULL,${dago(12)},${ahead(240)},NULL,       NULL,NULL, '[{"lat":24.7789,"lng":67.3203},{"lat":10.0,"lng":77.0},{"lat":39.9042,"lng":116.4074}]', 1890000,true),
      ('shp_017','AGT-IPR-2863','prod_milk',          120,  'node_pun_farm_4','node_khi_retail',  'truck','Nestle Pakistan Logistics', 'in_transit','critical',95, 4,   ${ago(8)},  ${ahead(12)}, NULL,       NULL,NULL, '[{"lat":32.1877,"lng":74.1945},{"lat":27.5,"lng":68.5},{"lat":24.8607,"lng":67.0011}]', 144000, false),
      ('shp_018','AGT-EXP-2864','prod_beef',          85,   'node_sin_wh_1',  'node_dubai_port',  'ship', 'DP World Logistics',        'delivered', 'high',    96, -18, ${dago(5)}, ${dago(1)},   ${dago(1)}, NULL,NULL, NULL, 272000, true)
  `;

  // ── ALERTS ──────────────────────────────────────────────────
  console.log('Seeding alerts...');
  await sql`
    INSERT INTO alerts (id, type, severity, shipment_id, node_id, title, description, resolved, resolved_at) VALUES
      ('alt_001','delay',             'high',    'shp_006', NULL,        'Mango Export Delayed — KPT → Riyadh',         'AGT-EXP-2852: 36hr delay. Port congestion at Jeddah. Freshness score dropping to 61.', false, NULL),
      ('alt_002','temperature_breach','critical','shp_009', NULL,        'Temperature Breach — Citrus Multan→Karachi',   'AGT-IPR-2855: Refrigeration unit failure. Current temp 12°C vs 5°C required.',          false, NULL),
      ('alt_003','customs_hold',      'high',    'shp_015', NULL,        'Customs Hold — Dates Export to Saudi Arabia',  'AGT-EXP-2861: Phytosanitary certificate pending revalidation.',                        false, NULL),
      ('alt_004','capacity_critical', 'medium',  NULL,      'node_pun_wh_2','Storage Near Capacity — Faisalabad Grain Terminal','Faisalabad Grain Terminal at 85% capacity. 3 incoming shipments scheduled.',   false, NULL),
      ('alt_005','route_disruption',  'medium',  NULL,      NULL,        'GT Road Disruption — Hyderabad Bypass',        'Road repair work causing 6–8hr delays. 4 active shipments affected. Use M9.',            false, NULL),
      ('alt_006','delay',             'low',     'shp_007', NULL,        'Minor Delay — Wheat Larkana→Faisalabad',       'AGT-IPR-2853: 2hr delay at Sukkur checkpoint. Expected delivery within SLA.',           true,  now() - interval '9 hours')
  `;

  // ── VOLUME SNAPSHOTS ─────────────────────────────────────────
  console.log('Seeding volume snapshots...');
  const sindhSupply = [4200,4100,4350,4500,4800,5100,5200,5000,4900,4750,4600,4400,4300,4250,4500,4700,4900,5100,5300,5200,5100,4950,4800,4700,4650,4800,5000,5200,5400,5500];
  const sindhDemand = [3900,4000,4200,4400,4600,4900,5000,4800,4700,4600,4500,4300,4200,4100,4350,4500,4700,4900,5100,5000,4900,4750,4650,4550,4500,4700,4900,5100,5300,5400];
  const punjabSupply= [7200,7100,7400,7600,8000,8400,8600,8300,8100,7900,7700,7500,7300,7200,7500,7800,8100,8400,8700,8500,8300,8100,7900,7700,7600,7800,8100,8400,8700,8900];
  const punjabDemand= [6800,6900,7200,7400,7800,8100,8300,8000,7800,7700,7500,7300,7100,7000,7300,7600,7900,8200,8500,8300,8100,7900,7700,7500,7400,7600,7900,8200,8500,8700];

  const rows = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getTime() - (29 - i) * 86400000);
    const day = d.toISOString().split('T')[0];
    rows.push({ day, region: 'Sindh',  supply: sindhSupply[i],  demand: sindhDemand[i] });
    rows.push({ day, region: 'Punjab', supply: punjabSupply[i], demand: punjabDemand[i] });
  }
  for (const r of rows) {
    await sql`INSERT INTO volume_snapshots (day, region, supply_tonnes, demand_tonnes) VALUES (${r.day}, ${r.region}, ${r.supply}, ${r.demand}) ON CONFLICT DO NOTHING`;
  }

  // ── REGION INSIGHTS ──────────────────────────────────────────
  console.log('Seeding region insights...');
  await sql`
    INSERT INTO region_insights (province, total_volume_tonnes, active_shipments, export_value_usd, top_products, yoy_growth_pct) VALUES
      ('Sindh',  284600, 186, 18400000, '[{"product":"Basmati Rice","volume":82000},{"product":"Mangoes","volume":48000},{"product":"IRRI Rice","volume":41000},{"product":"Onions","volume":38000},{"product":"Wheat","volume":34000}]', 7.4),
      ('Punjab', 418200, 232, 24400000, '[{"product":"Wheat","volume":142000},{"product":"Basmati Rice","volume":98000},{"product":"Kinnow Mandarin","volume":62000},{"product":"Mangoes (Chaunsa)","volume":48000},{"product":"Dates","volume":24000}]', 9.2)
  `;

  // ── EXPORT TRENDS ────────────────────────────────────────────
  console.log('Seeding export trends...');
  await sql`
    INSERT INTO export_trends (destination_country, month, volume_tonnes, value_usd, product_breakdown) VALUES
      ('UAE',          '2025-01-01', 28400, 14200000, '[{"product":"Rice","pct":45},{"product":"Fruits","pct":28},{"product":"Vegetables","pct":15},{"product":"Meat","pct":12}]'),
      ('UAE',          '2025-02-01', 26800, 13400000, '[{"product":"Rice","pct":48},{"product":"Fruits","pct":25},{"product":"Vegetables","pct":17},{"product":"Meat","pct":10}]'),
      ('UAE',          '2025-03-01', 31200, 15600000, '[{"product":"Rice","pct":42},{"product":"Fruits","pct":32},{"product":"Vegetables","pct":16},{"product":"Meat","pct":10}]'),
      ('Saudi Arabia', '2025-01-01', 18200,  9100000, '[{"product":"Rice","pct":52},{"product":"Dates","pct":22},{"product":"Fruits","pct":16},{"product":"Meat","pct":10}]'),
      ('UK',           '2025-01-01',  8400,  9240000, '[{"product":"Basmati Rice","pct":62},{"product":"Mangoes","pct":24},{"product":"Spices","pct":14}]'),
      ('Germany',      '2025-01-01',  6200,  6820000, '[{"product":"Basmati Rice","pct":68},{"product":"Mangoes","pct":20},{"product":"Dates","pct":12}]'),
      ('China',        '2025-01-01', 42000, 17640000, '[{"product":"IRRI Rice","pct":74},{"product":"Cotton","pct":18},{"product":"Fruits","pct":8}]')
  `;

  // ── MAP ROUTES ───────────────────────────────────────────────
  console.log('Seeding map routes...');
  await sql`
    INSERT INTO map_routes (id, from_lat, from_lng, from_label, to_lat, to_lng, to_label, transport_mode, status, product, volume_tonnes, is_export, shipment_id) VALUES
      ('rt_1',    25.5272, 69.0131,'Mirpurkhas Farm',        24.8607, 67.0011,'Karachi Cold Storage',   'truck','in_transit',  'Mangoes',       85,   false,'shp_001'),
      ('rt_2',    27.7052, 68.8574,'Sukkur Rice Farm',       25.3960, 68.3578,'Hyderabad Silo',         'truck','delivered',   'Basmati Rice',  420,  false,'shp_002'),
      ('rt_3',    31.4154, 73.0786,'Faisalabad Farm',        31.4154, 73.0786,'Faisalabad Grain Terminal','truck','delivered', 'Wheat',         1200, false,'shp_010'),
      ('rt_4',    30.1575, 71.5249,'Multan Mango Farm',      31.5497, 74.3436,'Lahore Agri Hub',        'truck','in_transit',  'Chaunsa Mangoes',95,  false,'shp_012'),
      ('rt_5',    27.5570, 68.2142,'Larkana',                31.4154, 73.0786,'Faisalabad',             'truck','in_transit',  'Wheat',         680,  false,'shp_007'),
      ('rt_6',    32.1877, 74.1945,'Gujranwala',             24.8607, 67.0011,'Karachi',                'truck','in_transit',  'UHT Milk',      120,  false,'shp_017'),
      ('rt_7',    30.1575, 71.5249,'Multan',                 24.8607, 67.0011,'Karachi',                'truck','delayed',     'Kinnow Mandarin',350, false,'shp_009'),
      ('rt_8',    31.4154, 73.0786,'Faisalabad',             24.8400, 66.9900,'KPT Port',               'truck','in_transit',  'Basmati Rice',  840,  false,'shp_011'),
      ('rt_exp1', 24.8400, 66.9900,'Karachi Port (KPT)',     25.2048, 55.2708,'Jebel Ali, Dubai',       'ship', 'in_transit',  'Basmati Rice',  3200, true, 'shp_004'),
      ('rt_exp2', 24.9008, 67.1681,'Karachi Airport',        25.2048, 55.2708,'Dubai Airport',          'air',  'in_transit',  'Mangoes',       42,   true, 'shp_005'),
      ('rt_exp3', 24.8400, 66.9900,'Karachi Port',           24.6877, 46.7219,'Riyadh',                 'ship', 'delayed',     'Mangoes',       68,   true, 'shp_006'),
      ('rt_exp4', 24.8400, 66.9900,'Karachi Port',           53.5753, 10.0153,'Hamburg, Germany',       'ship', 'in_transit',  'Basmati Rice',  2400, true, 'shp_013'),
      ('rt_exp5', 31.5216, 74.4036,'Lahore Airport',         51.5074, -0.1278,'London',                 'air',  'in_transit',  'Chaunsa Mangoes',28,  true, 'shp_014'),
      ('rt_exp6', 24.7789, 67.3203,'Port Qasim',             39.9042,116.4074,'Beijing, China',         'ship', 'in_transit',  'IRRI Rice',     4500, true, 'shp_016'),
      ('rt_exp7', 29.3956, 71.6836,'Bahawalpur',             24.6877, 46.7219,'Saudi Arabia',           'ship', 'customs_hold','Dates',         380,  true, 'shp_015')
  `;

  await sql.end();
  console.log('\n✓ Seed complete.');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
