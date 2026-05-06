// src/components/dashboard/ShipmentsTableClient.tsx
'use client';

import { usePolling } from '@/hooks/usePolling';
import ShipmentsTable from '@/components/dashboard/ShipmentsTable';
import type { Shipment } from '@/types';

interface Props {
  compact?: boolean;
  limit?: number;
  filters?: Record<string, string>;
}

interface ShipmentsResponse {
  success: boolean;
  data: Shipment[];
  meta: { total: number; returned: number };
}

export default function ShipmentsTableClient({ compact, limit = 50, filters = {} }: Props) {
  const params = new URLSearchParams({ limit: String(limit), ...filters });
  const { data, loading, error, refetch } = usePolling<ShipmentsResponse>(
    `/api/shipments?${params}`,
    30_000
  );

  if (loading && !data) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-white/[0.03] rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-8 text-center">
        <div className="text-white/40 mb-3 text-sm">Failed to load shipments</div>
        <button onClick={refetch} className="btn btn-ghost btn-sm">Retry</button>
      </div>
    );
  }

  const shipments = data?.data ?? [];

  if (shipments.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-white/30 text-sm">No shipments match the selected filters</div>
        <div className="text-white/20 text-xs mt-1">Try clearing filters or check back later</div>
      </div>
    );
  }

  return <ShipmentsTable shipments={shipments} compact={compact} />;
}
