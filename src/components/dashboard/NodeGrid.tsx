import type { SupplyNode } from '@/types';
import { nodeTypeIcon } from '@/lib/utils';

export default function NodeGrid({ nodes }: { nodes: SupplyNode[] }) {
  return (
    <div className="node-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {nodes.map(node => {
        const utilColor =
          node.utilization_pct >= 90 ? '#f87171' :
          node.utilization_pct >= 75 ? '#fbbf24' : '#4ade80';
        return (
          <div key={node.id} className="data-card">
            <div className="flex items-start gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[15px] flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {nodeTypeIcon(node.type)}
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-white leading-tight truncate">{node.name}</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {node.location.city} · <span className="capitalize">{node.type.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Utilization</span>
                <span className="text-[11px] font-semibold" style={{ color: utilColor }}>{node.utilization_pct}%</span>
              </div>
              <div className="freshness-bar">
                <div className="freshness-fill" style={{ width: `${node.utilization_pct}%`, background: utilColor }} />
              </div>
              <div className="flex items-center justify-between text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <span>{node.current_load_tonnes.toLocaleString()}t</span>
                <span>{node.capacity_tonnes.toLocaleString()}t cap</span>
              </div>
            </div>
            {node.certifications.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {node.certifications.slice(0, 2).map(c => (
                  <span key={c} className="text-[9px] px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(74,222,128,0.07)', color: 'rgba(74,222,128,0.7)', border: '1px solid rgba(74,222,128,0.12)' }}>
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
