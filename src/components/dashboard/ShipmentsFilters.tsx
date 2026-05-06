'use client';
import { useRouter, usePathname } from 'next/navigation';

const STATUSES = ['in_transit','delayed','delivered','customs_hold','pending'];
const PROVINCES = ['Sindh','Punjab'];
const MODES = ['truck','ship','air','rail'];

function FilterChip({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] px-3 py-1.5 rounded-full border transition-all duration-150 flex-shrink-0 ${
        isActive
          ? 'bg-[rgba(74,222,128,0.12)] border-[rgba(74,222,128,0.3)] text-[#4ade80]'
          : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:text-white/80 hover:border-white/[0.15]'
      }`}
    >
      {label}
    </button>
  );
}

interface Props {
  active: { status?: string; province?: string; mode?: string; is_export?: string };
}

export default function ShipmentsFilters({ active }: Props) {
  const router   = useRouter();
  const pathname = usePathname();

  const set = (key: string, val: string) => {
    const params = new URLSearchParams(
      Object.entries(active).filter((e): e is [string, string] => e[1] !== undefined)
    );
    if (params.get(key) === val) params.delete(key);
    else params.set(key, val);
    router.push(`${pathname}?${params.toString()}`);
  };

  const isActive = (key: string, val: string) =>
    (active as Record<string, string | undefined>)[key] === val;

  return (
    <div className="glass rounded-2xl p-3 sm:p-4 space-y-2">
      {/* Row 1: Status */}
      <div className="filters-bar flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[10px] font-semibold tracking-widest uppercase flex-shrink-0 w-14"
          style={{ color: 'rgba(255,255,255,0.25)' }}>Status</span>
        {STATUSES.map(s => (
          <FilterChip key={s} label={s.replace(/_/g, ' ')} isActive={isActive('status', s)} onClick={() => set('status', s)} />
        ))}
      </div>
      {/* Row 2: Province + Mode + Export */}
      <div className="filters-bar flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[10px] font-semibold tracking-widest uppercase flex-shrink-0 w-14"
          style={{ color: 'rgba(255,255,255,0.25)' }}>Region</span>
        {PROVINCES.map(p => (
          <FilterChip key={p} label={p} isActive={isActive('province', p)} onClick={() => set('province', p)} />
        ))}
        <span className="w-px h-4 bg-white/10 mx-1 flex-shrink-0" />
        {MODES.map(m => (
          <FilterChip key={m} label={m} isActive={isActive('mode', m)} onClick={() => set('mode', m)} />
        ))}
        <span className="w-px h-4 bg-white/10 mx-1 flex-shrink-0" />
        <FilterChip label="🌍 Export" isActive={isActive('is_export', 'true')}  onClick={() => set('is_export', 'true')} />
        <FilterChip label="🏠 Domestic" isActive={isActive('is_export', 'false')} onClick={() => set('is_export', 'false')} />
        {Object.values(active).some(Boolean) && (
          <button onClick={() => router.push(pathname)}
            className="ml-auto text-[11px] text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}
