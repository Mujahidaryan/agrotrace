'use client';

import { useCallback } from 'react';
import Topbar from '@/components/layout/Topbar';
import AnalyticsCharts from '@/components/charts/AnalyticsCharts';
import { usePolling } from '@/hooks/usePolling';
import type { DashboardSummary, VolumeDataPoint, ExportTrend, DelayAnalytics, RegionInsight } from '@/types';

interface AnalyticsResponse {
  success: boolean;
  summary: DashboardSummary;
  volume: VolumeDataPoint[];
  delays: DelayAnalytics[];
  regions: RegionInsight[];
  exports: ExportTrend[];
  error?: { message: string };
}

function StatPill({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
      <span className="text-2xl font-heading italic" style={{ color: color ?? '#4ade80' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  );
}

export default function AnalyticsClient() {
  const { data, loading, error, refetch } = usePolling<AnalyticsResponse>('/api/analytics', 60_000);

  const handleRetry = useCallback(() => refetch(), [refetch]);

  const subtitle = loading ? 'Loading…' : error ? 'Error' : 'Live intelligence · 60s refresh';
  const dotColor = error ? '#f87171' : loading ? '#fbbf24' : '#4ade80';

  return (
    <>
      <Topbar
        title="Analytics & Intelligence"
        subtitle={subtitle}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Error state */}
        {error && !loading && (
          <div className="glass rounded-2xl p-10 flex flex-col items-center justify-center gap-4">
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
              Failed to load: {error}
            </p>
            <button
              onClick={handleRetry}
              className="px-5 py-2 rounded-xl text-sm font-semibold"
              style={{ background: '#4ade80', color: '#041a0a' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        )}

        {/* Summary pills */}
        {data?.success && data.summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatPill label="Total Shipments"    value={data.summary.total_shipments}                                  color="#4ade80" />
            <StatPill label="Active"             value={data.summary.active_shipments}                                 color="#60a5fa" />
            <StatPill label="Delayed"            value={data.summary.delayed_shipments}                                color="#f87171" />
            <StatPill label="On-Time Rate"       value={`${data.summary.on_time_rate_pct ?? 0}%`}                     color="#4ade80" />
            <StatPill label="Export Value"       value={`$${(data.summary.export_value_usd / 1_000_000).toFixed(1)}M`} color="#fbbf24" />
          </div>
        )}

        {/* Charts */}
        {data?.success && (
          <AnalyticsCharts
            volumeData={data.volume ?? []}
            exportTrends={data.exports ?? []}
          />
        )}

        {/* Region table */}
        {data?.success && data.regions && data.regions.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Regional Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    <th className="text-left pb-3">Province</th>
                    <th className="text-right pb-3">Volume (t)</th>
                    <th className="text-right pb-3">Active Shipments</th>
                    <th className="text-right pb-3">Export Value</th>
                  </tr>
                </thead>
                <tbody>
                  {data.regions.map(r => (
                    <tr key={r.province} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="py-2.5" style={{ color: 'rgba(255,255,255,0.75)' }}>{r.province}</td>
                      <td className="py-2.5 text-right" style={{ color: '#4ade80' }}>
                        {r.total_volume_tonnes.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right" style={{ color: '#60a5fa' }}>
                        {r.active_shipments}
                      </td>
                      <td className="py-2.5 text-right" style={{ color: '#fbbf24' }}>
                        ${(r.export_value_usd / 1000).toFixed(0)}K
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delay analytics */}
        {data?.success && data.delays && data.delays.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Delay Analysis by Region
            </h3>
            <div className="space-y-3">
              {data.delays.map(d => (
                <div key={d.region} className="flex items-center gap-4">
                  <span className="w-24 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{d.region}</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(d.delay_rate_pct, 100)}%`,
                        background: d.delay_rate_pct > 30 ? '#f87171' : d.delay_rate_pct > 15 ? '#fbbf24' : '#4ade80',
                      }}
                    />
                  </div>
                  <span className="text-xs w-12 text-right" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {d.delay_rate_pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
