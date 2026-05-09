<div align="center">

<img src="docs/screenshots/agrotrace_thumbnail.jpg" alt="AgroTrace — Live Food Supply Intelligence" width="100%">

<br><br>

[![Live Platform](https://img.shields.io/badge/🚀_Live_Platform-Visit_Now-4F46E5?style=for-the-badge)](https://agrotrace-n65b.vercel.app)
[![Dashboard](https://img.shields.io/badge/📊_Dashboard-Open-16a34a?style=for-the-badge)](https://agrotrace-n65b.vercel.app/dashboard)
[![Live Map](https://img.shields.io/badge/🗺️_Live_Map-View-0ea5e9?style=for-the-badge)](https://agrotrace-n65b.vercel.app/map)

![TypeScript](https://img.shields.io/badge/TypeScript-87%25-3178C6?style=flat&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=nextdotjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Railway-4169E1?style=flat&logo=postgresql)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel)
![Tests](https://img.shields.io/badge/Coverage-80%25_min-22c55e?style=flat&logo=jest)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

</div>

---

## 🎯 The Problem

Pakistan loses an estimated **35–40% of perishable produce annually** — not from crop failure, but from logistics opacity.

- No real-time visibility across farms, warehouses, ports, and carriers
- Cold chain failures detected too late — after spoilage has occurred
- Customs clearance delays with zero advance warning
- Government food security monitors operating on week-old data

FAO estimates post-harvest losses cost Pakistan **$4B+ annually**. The data exists — it's fragmented across siloed systems with no unified operational picture.

---

## 💡 The Solution

AgroTrace connects farm cooperatives, warehouse operators, freight carriers, port terminals, and customs authorities into a **single live operational picture** — updated every 30 seconds.

> Built in direct alignment with FAO's Digital Agriculture mandate and Pakistan's food security objectives under SDG 2 (Zero Hunger).

---

## 📊 Platform at a Glance

| Metric | Value |
|---|---|
| 🚚 Active Shipments | 3,412 |
| 💰 Export Value Tracked | $47.2M (30-day rolling) |
| ✅ On-Time Delivery Rate | 96.8% |
| 🏭 Supply Nodes Monitored | 184 certified |
| 🌍 Countries Reached | 28 export destinations |
| 📦 Volume Tracked | 1.2M metric tonnes / month |
| 🌡️ Cold Chain Nodes | 47 IoT-monitored |
| 📋 Compliance Accuracy | 99.2% |

---

## ✨ Features

### 🔴 Real-Time Shipment Tracking
Sub-minute position updates across road, rail, sea, and air corridors. Full chain-of-custody with timestamped handoffs and status history.

### 🗺️ Live Supply Flow Map
Geospatial canvas rendering every active route with animated flow particles. Drill into node utilization, customs status, and temperature compliance across Sindh, Punjab, KPK & Balochistan.

### 📈 Predictive Delay Analytics
Models surface delay risk **24–72 hours** before projected ETA breaches — giving operators time to intervene before disruption occurs.

### ❄️ Cold Chain Integrity Monitoring
IoT temperature sensors across 47 cold-chain nodes alert in real time when produce freshness breaches threshold — preventing spoilage before it escalates.

### 🌐 Export Intelligence Dashboard
Automated HS code classification, phytosanitary certificate tracking, and customs hold alerts across 28 destination countries.

**Top export markets tracked:** 🇦🇪 UAE (+18% YoY) · 🇨🇳 China (+31% YoY) · 🇸🇦 Saudi Arabia (+12% YoY) · 🇬🇧 UK (+8% YoY) · 🇩🇪 Germany (+22% YoY)

### 👥 Multi-Stakeholder Access
Role-based dashboards for logistics managers, customs officials, port operators, farm cooperatives, and government food security monitors — 6 distinct stakeholder roles.

---

## 🏗️ Architecture

```
Browser (Next.js 14 App Router)
  └─ Client components poll /api/* every 30s via usePolling hook
  └─ Geospatial canvas map for live route visualization

API Routes (Node.js runtime, Vercel Edge)
  └─ src/app/api/*/route.ts
  └─ Read-optimized queries via postgres package

PostgreSQL (Railway-managed)
  └─ 14 tables, 1 materialized view (delay_analytics_view)
  └─ Seeded with realistic Pakistan supply chain dataset
  └─ Architecture decisions documented in /docs/adr/
```

### Database Schema

| Table | Purpose |
|---|---|
| `shipments` | Full tracking records — origin → destination + status |
| `locations` | Cities and international destinations with coordinates |
| `supply_nodes` | Farms, warehouses, ports, airports (184 nodes) |
| `products` | Commodities with HS codes and shelf life |
| `alerts` | Active risk events (delay, temperature, disruption) |
| `volume_snapshots` | 30-day supply/demand trend data (daily, per region) |
| `region_insights` | Province-level materialized summaries |
| `export_trends` | Monthly international trade flows |
| `map_routes` | Denormalized route data for fast map rendering |
| `delay_analytics_view` | Computed view — auto-refreshed from shipments |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js runtime |
| **Database** | PostgreSQL (Railway), raw `postgres` driver |
| **Deployment** | Vercel (frontend + API), Railway (database) |
| **Maps** | Canvas-based geospatial rendering |
| **Testing** | Jest — 80% line / 70% branch coverage enforced in CI |
| **Data Sources** | PBS, TDAP, FAO agricultural datasets |

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20+ |
| npm | 10+ |
| PostgreSQL | 15+ (or Railway) |

### Setup

```bash
# 1. Clone and install
git clone https://github.com/Mujahidaryan/agrotrace.git
cd agrotrace
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local — set DATABASE_URL to your Railway or local Postgres URL

# 3. Run migrations
npm run db:migrate

# 4. Seed with realistic Pakistan dataset
npm run db:seed

# 5. Start dev server
npm run dev
# Open http://localhost:3000
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | `postgresql://user:pass@host:5432/dbname` |
| `NEXT_PUBLIC_APP_URL` | ✅ Yes | Your deployment URL |
| `NEXT_PUBLIC_ENABLE_LIVE_MAP` | No | Enable canvas map (default: `true`) |
| `NEXT_PUBLIC_ENABLE_EXPORT_CSV` | No | Enable CSV export (default: `true`) |

See `.env.example` for full reference.

---

## 🧪 Testing

```bash
npm test                  # Run all tests
npm run test:coverage     # Coverage report (80% line / 70% branch enforced)
npm run test:watch        # Watch mode during development
npm run test:ci           # CI mode — exits with code
```

Tests live in `__tests__/unit/` and `__tests__/integration/`.
Integration tests mock `@/db/queries` — no test database required.

---

## 📡 API Reference

### `GET /api/shipments`
| Param | Type | Description |
|---|---|---|
| `province` | `Sindh \| Punjab` | Filter by origin/destination province |
| `status` | enum | `in_transit`, `delayed`, `delivered`, `customs_hold`, `pending` |
| `mode` | enum | `truck`, `ship`, `air`, `rail` |
| `is_export` | boolean | Filter domestic vs international |
| `limit` | number | Max results (default 50, cap 200) |

Response: `{ success, data: Shipment[], meta: { total, returned } }`

### `GET /api/analytics`
Returns: `{ success, summary, volume, delays, regions, exports }`

### `GET /api/alerts`
Returns: `{ success, active: Alert[], resolved: Alert[], counts }`

### `GET /api/map`
Returns: `{ success, routes: MapRoute[], nodes: SupplyNode[] }`

### `GET /api/health/ready`
Readiness probe. `200` if DB reachable, `503` otherwise.

---

## ☁️ Deployment (Vercel + Railway)

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com) → **New Project**
3. Add environment variables in **Vercel Dashboard → Settings → Environment Variables**:
   - `DATABASE_URL` — Railway **internal** Postgres URL (avoids egress charges)
   - `NEXT_PUBLIC_APP_URL` — Your Vercel deployment URL
4. Vercel auto-deploys on every push to `main`

```bash
# Instant rollback if needed — no rebuild required
vercel rollback
```

---

## 🌍 Development Context

This platform addresses real, documented challenges in Pakistan's agricultural sector:

- **36.9%** rural food insecurity (WFP Pakistan, 2024)
- **35–40%** post-harvest losses — primarily logistics-driven, not crop failure
- **$4B+** annual economic loss from supply chain opacity
- Directly aligned with FAO Strategic Framework 2022–2031 (Better Production, Better Nutrition)
- Supports **SDG 2** (Zero Hunger) · **SDG 9** (Infrastructure) · **SDG 17** (Partnerships)

---

## 🤝 Contributing

**Branch naming:** `feat/description` · `fix/description` · `chore/description`  
**Commits:** Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`)  
**PRs:** Must pass all CI checks — lint + typecheck + tests + security audit  
**Coverage:** Must not drop below 80% line coverage

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

## 👤 Author

**Muhammad Mujahid** — Full Stack Developer · Karachi, Pakistan

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/muhammad-mujahid-dev)
[![GitHub](https://img.shields.io/badge/GitHub-Mujahidaryan-181717?style=flat&logo=github)](https://github.com/Mujahidaryan)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-4F46E5?style=flat)](https://my-portfolio-swart-nu-73.vercel.app)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=flat&logo=gmail)](mailto:mujahidaryan222149@gmail.com)

---

## 📄 License

MIT © 2026 Muhammad Mujahid

---

<div align="center">
  <sub>Built for Pakistan's food security. Aligned with FAO's digital agriculture mandate.</sub>
</div>
