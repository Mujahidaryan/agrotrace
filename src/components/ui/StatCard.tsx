interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  iconBg?: string;
  highlight?: boolean;
}

export default function StatCard({ label, value, change, changeType = 'neutral', icon, iconBg, highlight }: StatCardProps) {
  const changeColor = changeType === 'up' ? 'text-[#4ade80]' : changeType === 'down' ? 'text-[#f87171]' : 'text-white/40';
  const changeBg = changeType === 'up' ? 'rgba(74,222,128,0.08)' : changeType === 'down' ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.04)';
  return (
    <div className={`data-card ${highlight ? 'border-[rgba(74,222,128,0.15)]' : ''}`} style={highlight ? { boxShadow: '0 0 20px rgba(74,222,128,0.06)' } : {}}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg ?? 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {icon}
        </div>
        {change && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${changeColor}`} style={{ background: changeBg }}>
            {change}
          </span>
        )}
      </div>
      <div className="font-heading italic text-white leading-none mb-1.5" style={{ fontSize: '28px', letterSpacing: '-0.5px' }}>{value}</div>
      <div className="text-[11px] font-body" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </div>
  );
}
