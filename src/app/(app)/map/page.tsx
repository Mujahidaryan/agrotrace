'use client';
import Topbar from '@/components/layout/Topbar';
import LiveMapCanvas from '@/components/map/LiveMapCanvas';
import { usePolling } from '@/hooks/usePolling';
import type { MapRoute, SupplyNode } from '@/types';

interface MapDataResponse { success: boolean; routes: MapRoute[]; nodes: SupplyNode[]; }

export default function MapPage() {
  const { data, loading, error, refetch } = usePolling<MapDataResponse>('/api/map', 30_000);
  const routes = data?.routes ?? [];
  const nodes  = data?.nodes  ?? [];

  return (
    <>
      <Topbar title="Live Supply Flow Map" subtitle="Pakistan ↔ International · 30s refresh">
        {/* Legend chips — hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          {[
            { color: '#4ade80', label: 'Domestic' },
            { color: '#60a5fa', label: 'Transit' },
            { color: '#fbbf24', label: 'Warehouse' },
            { color: '#f87171', label: 'Delayed' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </Topbar>

      <div className="flex-1 relative overflow-hidden" style={{ minHeight: 300 }}>
        {loading && !data && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass rounded-2xl px-6 py-4 text-white/50 text-sm">Loading map data...</div>
          </div>
        )}
        {error && !data && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-white/50 text-sm mb-3">Failed to load map</div>
              <button onClick={refetch} className="btn btn-ghost btn-sm">Retry</button>
            </div>
          </div>
        )}
        {(data || routes.length > 0) && (
          <LiveMapCanvas routes={routes} nodes={nodes} />
        )}
      </div>
    </>
  );
}
