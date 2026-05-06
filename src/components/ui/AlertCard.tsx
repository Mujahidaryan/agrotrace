import type { Alert } from '@/types';
import { timeAgo } from '@/lib/utils';

const severityStyles: Record<string, { card: string; icon: string; dot: string }> = {
  critical: { card: 'border-[rgba(248,113,113,0.2)] bg-[rgba(248,113,113,0.04)]', icon: '#f87171', dot: 'bg-[#f87171]' },
  high:     { card: 'border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.03)]',  icon: '#fbbf24', dot: 'bg-[#fbbf24]' },
  medium:   { card: 'border-[rgba(96,165,250,0.18)] bg-[rgba(96,165,250,0.03)]', icon: '#60a5fa', dot: 'bg-[#60a5fa]' },
  low:      { card: 'border-white/10 bg-white/[0.03]',                              icon: 'rgba(255,255,255,0.4)', dot: 'bg-white/30' },
};

export default function AlertCard({ alert }: { alert: Alert }) {
  const s = severityStyles[alert.severity] ?? severityStyles.low;
  return (
    <div className={`rounded-2xl p-4 border ${s.card} transition-all duration-200 hover:translate-y-[-2px]`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: `${s.icon}14`, border: `1px solid ${s.icon}30` }}>
          <AlertTypeIcon type={alert.type} color={s.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot} ${!alert.resolved ? 'animate-pulse' : ''}`}></span>
            <span className="text-[12px] font-semibold text-white leading-tight truncate">{alert.title}</span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{alert.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{timeAgo(alert.created_at)}</span>
            {alert.shipment_id && (
              <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>{alert.shipment_id.replace('shp_', 'AGT-').toUpperCase()}</span>
            )}
            {alert.resolved && (
              <span className="badge badge-green">Resolved</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertTypeIcon({ type, color }: { type: Alert['type']; color: string }) {
  if (type === 'delay') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" strokeLinecap="round"/></svg>;
  if (type === 'temperature_breach') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>;
  if (type === 'route_disruption') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>;
  if (type === 'customs_hold') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>;
}
