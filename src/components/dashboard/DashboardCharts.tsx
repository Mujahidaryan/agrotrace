'use client';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend, Cell,
} from 'recharts';
import type { VolumeDataPoint, DelayAnalytics } from '@/types';

interface Props { volumeData: VolumeDataPoint[]; delayData: DelayAnalytics[]; }

const exportData = [
  { country: 'UAE', value: 14.2, color: '#4ade80' },
  { country: 'China', value: 17.6, color: '#60a5fa' },
  { country: 'KSA', value: 9.1, color: '#fbbf24' },
  { country: 'UK', value: 9.2, color: '#a78bfa' },
  { country: 'DE', value: 6.8, color: '#f472b6' },
];

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="font-semibold mb-1 text-white text-[12px]">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-[11px]" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function DashboardCharts({ volumeData, delayData }: Props) {
  const sindhData  = volumeData.filter(d => d.region === 'Sindh');
  const punjabData = volumeData.filter(d => d.region === 'Punjab');
  const merged = sindhData
    .map((d, i) => ({
      date: d.date,
      'Sindh': d.supply_tonnes,
      'Punjab': punjabData[i]?.supply_tonnes ?? 0,
      'Demand': d.demand_tonnes,
    }))
    .filter((_, i) => i % 2 === 0);

  const delayChart = delayData.map(d => ({
    name: d.region.replace('Inter-provincial', 'Inter').replace('International Export', "Intl"),
    rate: parseFloat(d.delay_rate_pct.toFixed(2)),
    hrs:  parseFloat(d.avg_delay_hours.toFixed(1)),
  }));

  return (
    <div className="chart-grid-3 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Volume trend — spans 2 of 3 cols on md+ */}
      <div className="md:col-span-2 glass rounded-2xl p-4 sm:p-5">
        <div className="mb-3">
          <div className="text-[13px] font-semibold text-white">Supply vs Demand — 30 Day</div>
          <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Metric tonnes</div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={merged} margin={{ top: 4, right: 8, left: -22, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
            <Tooltip content={<Tip />} />
            <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', paddingTop: 6 }} />
            <Line type="monotone" dataKey="Sindh"  stroke="#4ade80" strokeWidth={1.8} dot={false} />
            <Line type="monotone" dataKey="Punjab" stroke="#60a5fa" strokeWidth={1.8} dot={false} />
            <Line type="monotone" dataKey="Demand" stroke="rgba(251,191,36,0.7)" strokeWidth={1.2} strokeDasharray="4 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Export destinations */}
      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="mb-3">
          <div className="text-[13px] font-semibold text-white">Export Value</div>
          <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>USD Millions</div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={exportData} layout="vertical" margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
            <YAxis type="category" dataKey="country" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={14}>
              {exportData.map(e => <Cell key={e.country} fill={e.color} fillOpacity={0.8} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Delay analytics — full width */}
      <div className="md:col-span-3 glass rounded-2xl p-4 sm:p-5">
        <div className="mb-3">
          <div className="text-[13px] font-semibold text-white">Delay Rate by Region</div>
          <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>% delayed · avg hours</div>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={delayChart} margin={{ top: 0, right: 8, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="rate" name="Delay %" fill="#f87171" fillOpacity={0.75} radius={[4,4,0,0]} maxBarSize={36} />
            <Bar dataKey="hrs"  name="Avg hrs"   fill="#fbbf24" fillOpacity={0.6}  radius={[4,4,0,0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
