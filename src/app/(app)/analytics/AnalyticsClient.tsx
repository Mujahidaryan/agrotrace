'use client';
import Topbar from '@/components/layout/Topbar';
import AnalyticsCharts from '@/components/charts/AnalyticsCharts';
import { usePolling } from '@/hooks/usePolling';
import { formatUSD, formatTonnes, formatNumber } from '@/lib/utils';
import type { RegionInsight, ExportTrend, DelayAnalytics, VolumeDataPoint } from '@/types';

interface AnalyticsResponse {
  success: boolean;
  regions: RegionInsight[];
  exports: ExportTrend[];
  delays: DelayAnalytics[];
  volume: VolumeDataPoint[];
}

export default function AnalyticsClient() {
  const { data, loading, error, refetch } = usePolling<AnalyticsResponse>('/api/analytics', 30_000);

  if (loading && !data) {
    return (
      <>
        <Topbar title="Analytics & Intelligence" subtitle="Loading..." />
        <div className="flex-1 p-4 sm:p-6 space-y-4">
          <div className="region-grid grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-2xl h-64 animate-pulse" />
            <div className="glass rounded-2xl h-64 animate-pulse" />
          </div>
          <div className="glass rounded-2xl h-80 animate-pulse" />
        </div>
      </>
    );
  }

  if (error && !data) {
    return (
      <>
        <Topbar title="Analytics & Intelligence" subtitle="Error" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="glass rounded-2xl p-8 text-center max-w-sm w-full">
            <div className="text-white/40 text-sm mb-3 break-words">Failed to load: {error}</div>
            <button onClick={refetch} className="btn btn-primary btn-sm">Retry</button>
          </div>
        </div>
      </>
    );
  }

  const regions = data?.regions ?? [];
  const delays  = data?.delays  ?? [];
  const exports = data?.exports ?? [];
  const volume  = data?.volume  ?? [];

  return (
    <>
      <Topbar title="Analytics & Intelligence" subtitle="Regional · Export · Delay analysis" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

        {regions.length > 0 && (
          <div className="region-grid grid grid-cols-1 md:grid-cols-2 gap-4">
            {regions.map(r => (
              <div key={r.province} className="glass rounded-2xl p-4 sm:p-5">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <div className="kicker">{'// '}{r.province}</div>
                    <div className="font-heading italic text-white text-[22px] sm:text-[26px] leading-none" style={{ letterSpacing: -1 }}>
                      {r.province} Province
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[24px] sm:text-[28px] font-heading italic" style={{ color: '#4ade80' }}>
                      +{r.yoy_growth_pct}%
                    </div>
                    <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>YoY Growth</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: 'Volume',    val: formatTonnes(r.total_volume_tonnes) },
                    { label: 'Shipments', val: formatNumber(r.active_shipments) },
                    { label: 'Exports',   val: formatUSD(r.export_value_usd) },
                  ].map(m => (
                    <div key={m.label} className="rounded-xl px-2 py-2 text-center"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="text-[14px] sm:text-[16px] font-heading italic text-white">{m.val}</div>
                      <div className="text-[9px] sm:text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  {(r.top_products as { product: string; volume: number }[]).map((p, i) => {
                    const maxVol = (r.top_products as { product: string; volume: number }[])[0].volume;
                    const pct = Math.round((p.volume / maxVol) * 100);
                    const colors = ['#4ade80','#60a5fa','#fbbf24','#f472b6','#a78bfa'];
                    return (
                      <div key={p.product} className="flex items-center gap-2">
                        <div className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.6)', minWidth: 80, maxWidth: 120 }}>{p.product}</div>
                        <div className="flex-1 freshness-bar">
                          <div className="freshness-fill" style={{ width: `${pct}%`, background: colors[i] ?? '#4ade80' }} />
                        </div>
                        <div className="text-[10px] w-12 text-right flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {(p.volume / 1000).toFixed(0)}K t
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <AnalyticsCharts volumeData={volume} exportTrends={exports} />

        {delays.length > 0 && (
          <div className="glass rounded-2xl p-4 sm:p-5">
            <div className="kicker mb-3">{'// Delay Root Cause Analysis'}</div>
            <div className="delay-grid grid grid-cols-2 md:grid-cols-4 gap-3">
              {delays.map(d => (
                <div key={d.region} className="rounded-xl p-3 sm:p-4"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="text-[11px] font-semibold text-white mb-1 truncate">{d.region}</div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[20px] font-heading italic" style={{ color: '#f87171' }}>{d.delay_rate_pct}%</span>
                    <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>delayed</span>
                  </div>
                  <div className="space-y-1">
                    {(d.top_reasons as { reason: string; count: number }[])?.slice(0, 3).map(r => (
                      <div key={r.reason} className="flex items-center justify-between">
                        <span className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{r.reason}</span>
                        <span className="text-[10px] font-semibold ml-1 flex-shrink-0" style={{ color: '#f87171' }}>{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {exports.length > 0 && (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-4 sm:px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="kicker">{'// Export Trends'}</div>
              <div className="text-[13px] font-semibold text-white">International Trade Flows</div>
            </div>
            <div className="table-scroll overflow-x-auto">
              <table className="data-table" style={{ minWidth: 520 }}>
                <thead>
                  <tr>
                    <th>Destination</th>
                    <th>Volume</th>
                    <th>Value (USD)</th>
                    <th className="table-hide-xs">Top Product</th>
                  </tr>
                </thead>
                <tbody>
                  {exports.map((t, i) => {
                    const breakdown = t.product_breakdown as { product: string; pct: number }[];
                    return (
                      <tr key={`${t.destination_country}-${i}`}>
                        <td className="text-white font-medium">{t.destination_country}</td>
                        <td className="text-white/70">{Number(t.volume_tonnes).toLocaleString()} t</td>
                        <td className="text-white/70">{formatUSD(t.value_usd)}</td>
                        <td className="text-white/70 table-hide-xs">
                          {breakdown[0]?.product} ({breakdown[0]?.pct}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
