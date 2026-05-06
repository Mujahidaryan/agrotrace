'use client';

import { useCallback } from 'react';
import { usePolling } from '@/hooks/usePolling';
import Topbar from '@/components/layout/Topbar';
import LiveMapCanvas from '@/components/map/LiveMapCanvas';
import type { MapRoute, SupplyNode } from '@/types';

interface MapResponse {
  success: boolean;
  routes: MapRoute[];
  nodes: SupplyNode[];
}

export default function MapClient() {
  const { data, loading, error, refetch } = usePolling<MapResponse>('/api/map', 30_000);

  const subtitle = loading && !data
    ? 'Loading…'
    : error
    ? 'Error'
    : 'Pakistan ↔ International · 30s refresh';

  if (error && !data) {
    return (
      <>
        <Topbar title="Live Supply Flow Map" subtitle="Error" />
        <div className="flex-1 flex items-center justify-center">
          <div className="glass rounded-2xl p-10 text-center max-w-sm w-full mx-4">
            <div className="text-2xl mb-3">⚠</div>
            <div className="text-white font-semibold mb-2">Failed to load map</div>
            <div className="text-white/40 text-sm mb-5 break-all">{error}</div>
            <button
              onClick={refetch}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: '#4ade80', color: '#041a0a' }}
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  const routes = data?.routes ?? [];
  const nodes  = data?.nodes  ?? [];

  return (
    <>
      <Topbar
        title="Live Supply Flow Map"
        subtitle={subtitle}
      >
        <div className="flex items-center gap-4 text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {[
            { color: '#4ade80', label: 'Domestic' },
            { color: '#60a5fa', label: 'Transit' },
            { color: '#fbbf24', label: 'Warehouse' },
            { color: '#f87171', label: 'Delayed' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </Topbar>

      <div className="flex-1 relative overflow-hidden">
        {loading && !data && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="glass rounded-2xl p-6 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Loading map data…
            </div>
          </div>
        )}
        {data && (
          <LiveMapCanvas routes={routes} nodes={nodes} />
        )}
      </div>
    </>
  );
}
