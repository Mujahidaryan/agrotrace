'use client';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend, RadarChart,
  Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import type { VolumeDataPoint, ExportTrend } from '@/types';

interface Props { volumeData: VolumeDataPoint[]; exportTrends: ExportTrend[]; }

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="font-semibold mb-1 text-white text-[12px]">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color }} className="flex items-center gap-2 text-[11px]">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsCharts({ volumeData, exportTrends }: Props) {
  const sindhData  = volumeData.filter(d => d.region === 'Sindh');
  const punjabData = volumeData.filter(d => d.region === 'Punjab');
  const mergedFull = sindhData.map((d, i) => ({
    date: d.date,
    'Sindh Supply':  d.supply_tonnes,
    'Punjab Supply': punjabData[i]?.supply_tonnes ?? 0,
    'Sindh Demand':  d.demand_tonnes,
  }));

  const months = [...new Set(exportTrends.map(t => t.month))].slice(0, 3);
  const monthlyExport = months.map(m => {
    const rows = exportTrends.filter(t => t.month === m);
    const get = (c: string) => rows.find(r => r.destination_country === c)?.volume_tonnes ?? 0;
    return {
      month: m.split(' ')[0],
      UAE: get('UAE'), 'Saudi Arabia': get('Saudi Arabia'),
      UK: get('UK'),   Germany: get('Germany'), China: get('China'),
    };
  });

  return (
    <div className="space-y-4">
      {/* 30-day area chart */}
      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="mb-3">
          <div className="text-[13px] font-semibold text-white">30-Day Supply Volume</div>
          <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Metric tonnes · Sindh & Punjab</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={mergedFull} margin={{ top: 4, right: 8, left: -12, bottom: 4 }}>
            <defs>
              <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
            <Tooltip content={<Tip />} />
            <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', paddingTop: 8 }} />
            <Area type="monotone" dataKey="Sindh Supply"  stroke="#4ade80" strokeWidth={2} fill="url(#gs)" />
            <Area type="monotone" dataKey="Punjab Supply" stroke="#60a5fa" strokeWidth={2} fill="url(#gp)" />
            <Area type="monotone" dataKey="Sindh Demand"  stroke="#fbbf24" strokeWidth={1.2} strokeDasharray="5 3" fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Export + Radar — stack on mobile, side by side on md+ */}
      <div className="chart-grid-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-4 sm:p-5">
          <div className="mb-3">
            <div className="text-[13px] font-semibold text-white">Monthly Export Volume</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyExport} margin={{ top: 0, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', paddingTop: 8 }} />
              <Bar dataKey="China"        stackId="a" fill="#60a5fa" fillOpacity={0.8} />
              <Bar dataKey="UAE"          stackId="a" fill="#4ade80" fillOpacity={0.8} />
              <Bar dataKey="Saudi Arabia" stackId="a" fill="#fbbf24" fillOpacity={0.8} />
              <Bar dataKey="UK"           stackId="a" fill="#a78bfa" fillOpacity={0.8} />
              <Bar dataKey="Germany"      stackId="a" fill="#f472b6" fillOpacity={0.8} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-4 sm:p-5">
          <div className="mb-3">
            <div className="text-[13px] font-semibold text-white">Sindh Export Product Mix</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={[
              { product: 'Basmati Rice', pct: 45 }, { product: 'Mangoes', pct: 28 },
              { product: 'Vegetables',   pct: 15 }, { product: 'Meat',    pct: 12 },
              { product: 'Dates',        pct: 8  }, { product: 'Cotton',  pct: 6  },
            ]}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="product" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 9 }} />
              <Radar dataKey="pct" stroke="#4ade80" fill="#4ade80" fillOpacity={0.15} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
