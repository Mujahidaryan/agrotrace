'use client';
import type { Shipment } from '@/types';
import { statusBg, statusLabel, priorityBg, transportIcon, freshnessColor, timeAgo, formatTonnes, formatUSD } from '@/lib/utils';

interface Props { shipments: Shipment[]; compact?: boolean; }

export default function ShipmentsTable({ shipments, compact }: Props) {
  return (
    <div className="table-scroll overflow-x-auto -webkit-overflow-scrolling-touch">
      <table className="data-table" style={{ minWidth: compact ? 540 : 800 }}>
        <thead>
          <tr>
            <th>Tracking ID</th>
            <th>Product</th>
            <th className="table-hide-xs">Route</th>
            <th>Status</th>
            <th className="table-hide-xs">Priority</th>
            {!compact && <th className="table-hide-xs">Volume</th>}
            {!compact && <th className="table-hide-xs">Value</th>}
            <th>Fresh.</th>
            <th className="table-hide-xs">ETA</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map(s => (
            <tr key={s.id}>
              <td>
                <span className="font-condensed font-semibold text-white text-[12px] tracking-wide whitespace-nowrap">
                  {s.tracking_code}
                </span>
                {s.is_export && (
                  <span className="ml-1.5 badge badge-amber hidden sm:inline-flex" style={{ fontSize: 9, padding: '1px 5px' }}>EXP</span>
                )}
              </td>
              <td>
                <div className="text-[12px] text-white/80 whitespace-nowrap">{s.product.name}</div>
                <div className="text-[10px] text-white/30 capitalize hidden sm:block">{s.product.category}</div>
              </td>
              <td className="table-hide-xs">
                <div className="text-[11px] text-white/70" style={{ maxWidth: 130 }}>
                  <span className="truncate block">{s.origin.location.city}</span>
                  <span className="text-white/30">↓</span>
                  <span className="truncate block">{s.destination.location.city}</span>
                </div>
              </td>
              <td>
                <span className={`badge ${statusBg(s.status)}`}>
                  {s.status === 'in_transit' && <span className="pulse-dot" style={{ width: 5, height: 5 }} />}
                  <span className="hidden sm:inline">{statusLabel(s.status)}</span>
                  <span className="sm:hidden">{transportIcon(s.transport_mode)}</span>
                </span>
              </td>
              <td className="table-hide-xs">
                <span className={`badge ${priorityBg(s.priority)}`} style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {s.priority}
                </span>
              </td>
              {!compact && <td className="text-white/60 text-[12px] table-hide-xs">{formatTonnes(s.quantity_tonnes)}</td>}
              {!compact && <td className="text-white/60 text-[12px] table-hide-xs">{formatUSD(s.value_usd)}</td>}
              <td>
                <div className="flex items-center gap-1.5">
                  <div className="freshness-bar w-10 sm:w-14">
                    <div className="freshness-fill" style={{
                      width: `${s.freshness_score}%`,
                      background: s.freshness_score >= 85 ? '#4ade80' : s.freshness_score >= 65 ? '#fbbf24' : '#f87171',
                    }} />
                  </div>
                  <span className={`text-[11px] font-medium ${freshnessColor(s.freshness_score)}`}>{s.freshness_score}</span>
                </div>
              </td>
              <td className="table-hide-xs">
                <div className="text-[11px] text-white/50 whitespace-nowrap">
                  {s.status === 'delivered'
                    ? <span className="text-[#4ade80]">✓ {timeAgo(s.delivered_at!)}</span>
                    : new Date(s.eta_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                  {s.delay_hours ? <div className="text-[#f87171] text-[10px]">+{s.delay_hours}h</div> : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
