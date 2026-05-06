'use client';

import { usePolling } from '@/hooks/usePolling';
import StatCard from '@/components/ui/StatCard';
import AlertCard from '@/components/ui/AlertCard';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import ShipmentsTableClient from '@/components/dashboard/ShipmentsTableClient';
import NodeGridClient from '@/components/dashboard/NodeGridClient';
import { formatNumber, formatUSD, formatTonnes } from '@/lib/utils';
import type { DashboardSummary, Alert, VolumeDataPoint, DelayAnalytics } from '@/types';

interface AnalyticsResponse {
  success: boolean;
  summary: DashboardSummary;
  volume: VolumeDataPoint[];
  delays: DelayAnalytics[];
  regions: unknown[];
  exports: unknown[];
}

interface AlertsResponse {
  success: boolean;
  active: Alert[];
  resolved: Alert[];
  counts: Record<string, number>;
}

export default function DashboardClient() {
  const analytics = usePolling<AnalyticsResponse>('/api/analytics', 30_000);
  const alerts    = usePolling<AlertsResponse>('/api/alerts', 30_000);

  const summary      = analytics.data?.summary;
  const activeAlerts = alerts.data?.active ?? [];

  // ── LOADING ──────────────────────────────────────────────────
  if (analytics.loading && !analytics.data) {
    return (
      <div className="page-pad p-4 sm:p-6 space-y-4">
        <div className="stat-grid-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="data-card animate-pulse">
              <div className="w-9 h-9 rounded-[10px] bg-white/5 mb-3" />
              <div className="h-7 bg-white/5 rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
        <div className="chart-grid-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 glass rounded-2xl h-56 animate-pulse" />
          <div className="glass rounded-2xl h-56 animate-pulse" />
        </div>
        <div className="h-32 glass rounded-2xl animate-pulse" />
      </div>
    );
  }

  // ── ERROR ────────────────────────────────────────────────────
  if (analytics.error && !analytics.data) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="glass rounded-2xl p-8 text-center max-w-sm w-full mx-4">
          <div className="text-[#f87171] text-2xl mb-3">⚠</div>
          <div className="text-white font-semibold mb-2">Could not load dashboard</div>
          <div className="text-white/50 text-sm mb-4 break-words">{analytics.error}</div>
          <button onClick={analytics.refetch} className="btn btn-primary btn-sm">Retry</button>
        </div>
      </div>
    );
  }

  // ── EMPTY ────────────────────────────────────────────────────
  if (!summary) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-white/30 mb-2">No data available</div>
          <div className="text-white/20 text-sm">Run the seed script to populate the database.</div>
        </div>
      </div>
    );
  }

  // ── POPULATED ────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="page-pad p-4 sm:p-6 space-y-4 sm:space-y-5">

        {/* Stale data banner */}
        {analytics.error && analytics.data && (
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-2 flex-wrap">
            <span className="text-[#fbbf24] text-xs">⚠ Showing cached data · {analytics.error}</span>
            <button onClick={analytics.refetch} className="text-[11px] text-white/50 hover:text-white ml-auto">Retry</button>
          </div>
        )}

        {/* ── ROW 1 — 4 primary stats ── */}
        <div className="stat-grid-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Total Shipments" value={formatNumber(summary.total_shipments)}
            change="↑ 12.4% this week" changeType="up"
            iconBg="rgba(74,222,128,0.1)"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8"><path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/><rect x="8" y="10" width="13" height="10" rx="2"/></svg>}
          />
          <StatCard
            label="Active Routes" value={formatNumber(summary.active_routes)}
            change="↑ 8.1% vs last month" changeType="up"
            iconBg="rgba(96,165,250,0.1)"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8"><path d="M3 12h18M12 3l9 9-9 9" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          />
          <StatCard
            label="Delayed" value={String(summary.delayed_shipments)}
            change={summary.delayed_shipments > 0 ? `${summary.delayed_shipments} active` : 'None'}
            changeType={summary.delayed_shipments > 0 ? 'down' : 'neutral'}
            iconBg="rgba(248,113,113,0.1)"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
          />
          <StatCard
            label="Export Value (30d)" value={formatUSD(summary.export_value_usd)}
            change="↑ 7.4% YoY" changeType="up"
            iconBg="rgba(251,191,36,0.1)" highlight
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
        </div>

        {/* ── ROW 2 — 4 secondary stats ── */}
        <div className="stat-grid-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="On-Time Rate" value={`${summary.on_time_rate_pct}%`} change="↑ 0.3%" changeType="up"
            iconBg="rgba(74,222,128,0.08)"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          />
          <StatCard label="Volume in Transit" value={formatTonnes(summary.total_volume_tonnes)}
            iconBg="rgba(96,165,250,0.08)"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8"><path d="M5 8h14M5 8a2 2 0 1 0 0-4h14a2 2 0 1 0 0 4M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4"/></svg>}
          />
          <StatCard label="Delivered Today" value={String(summary.delivered_today)} change="Live count" changeType="up"
            iconBg="rgba(74,222,128,0.08)"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
          />
          <StatCard label="Active Alerts" value={String(summary.active_alerts)}
            change={alerts.data?.counts?.critical ? `${alerts.data.counts.critical} critical` : 'No critical'}
            changeType={alerts.data?.counts?.critical ? 'down' : 'neutral'}
            iconBg="rgba(248,113,113,0.08)"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>}
          />
        </div>

        {/* ── CHARTS ── */}
        {analytics.data && (
          <DashboardCharts volumeData={analytics.data.volume} delayData={analytics.data.delays} />
        )}

        {/* ── BOTTOM GRID ── */}
        <div className="dash-bottom-grid grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 sm:px-5 py-3.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div>
                <div className="text-[13px] font-semibold text-white">Recent Shipments</div>
                <div className="text-[10px] mt-0.5 hidden sm:block" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Sindh, Punjab & International
                </div>
              </div>
              <a href="/shipments" className="btn btn-ghost btn-sm text-[11px]">View All →</a>
            </div>
            <div className="table-scroll">
              <ShipmentsTableClient compact limit={10} />
            </div>
          </div>

          <div className="flex flex-col glass rounded-2xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="text-[13px] font-semibold text-white">Active Alerts</div>
              {activeAlerts.length > 0 && (
                <span className="badge badge-danger">{activeAlerts.length}</span>
              )}
            </div>
            {alerts.loading && !alerts.data ? (
              <div className="flex-1 p-3 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-2xl p-4 border border-white/5 animate-pulse h-20" />
                ))}
              </div>
            ) : activeAlerts.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-white/30 text-sm p-4 text-center">
                No active alerts
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-96 lg:max-h-none">
                {activeAlerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── NODE GRID ── */}
        <NodeGridClient />

        {analytics.lastUpdated && (
          <div className="text-center text-[10px] text-white/20 pb-2">
            Last updated {analytics.lastUpdated.toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT
            · auto-refreshes every 30s
          </div>
        )}
      </div>
    </div>
  );
}
