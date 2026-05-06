'use client';
import { usePolling } from '@/hooks/usePolling';
import NodeGrid from '@/components/dashboard/NodeGrid';
import type { SupplyNode } from '@/types';

interface NodesResponse { success: boolean; data: SupplyNode[]; }

export default function NodeGridClient() {
  const { data, loading, error, refetch } = usePolling<NodesResponse>('/api/nodes', 60_000);
  const nodes = data?.data ?? [];

  if (loading && !data) {
    return (
      <div>
        <div className="kicker">{'// Supply Nodes'}</div>
          {[...Array(8)].map((_, i) => <div key={i} className="data-card animate-pulse h-32" />)}
        </div>
      </div>
    );
  }
  if (error && !data) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <div className="text-white/40 text-sm mb-2">Could not load supply nodes</div>
        <button onClick={refetch} className="btn btn-ghost btn-sm">Retry</button>
      </div>
    );
  }
  if (nodes.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <div className="text-white/30 text-sm">No supply nodes in database</div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="kicker">{'// Supply Nodes'}</div>
        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{nodes.length} active</span>
      </div>
      <NodeGrid nodes={nodes.slice(0, 8)} />
    </div>
  );
}
