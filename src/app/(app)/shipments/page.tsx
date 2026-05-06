'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Topbar from '@/components/layout/Topbar';
import ShipmentsFilters from '@/components/dashboard/ShipmentsFilters';
import ShipmentsTableClient from '@/components/dashboard/ShipmentsTableClient';
import { usePolling } from '@/hooks/usePolling';

interface MetaResponse { success: boolean; meta: { total: number; returned: number }; }

function ShipmentsContent() {
  const searchParams = useSearchParams();
  const filters: Record<string, string> = {};
  for (const [k, v] of searchParams.entries()) { if (v) filters[k] = v; }

  const params = new URLSearchParams({ limit: '5', ...filters });
  const { data } = usePolling<MetaResponse>(`/api/shipments?${params}`, 30_000);

  const active = {
    status:    searchParams.get('status')    ?? undefined,
    province:  searchParams.get('province')  ?? undefined,
    mode:      searchParams.get('mode')      ?? undefined,
    is_export: searchParams.get('is_export') ?? undefined,
  };

  return (
    <>
      <Topbar
        title="Shipment Tracking"
        subtitle={data ? `${data.meta.returned} of ${data.meta.total} results` : 'Loading...'}
      />
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
        <ShipmentsFilters active={active} />
        <div className="glass rounded-2xl overflow-hidden">
          <div
            className="px-4 sm:px-5 py-3.5 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {data ? `${data.meta.returned} of ${data.meta.total} shipments` : 'Loading...'}
            </div>
          </div>
          <ShipmentsTableClient filters={filters} limit={100} />
        </div>
      </div>
    </>
  );
}

export default function ShipmentsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Suspense fallback={
        <div className="flex-1 p-6">
          <div className="glass rounded-2xl h-96 animate-pulse" />
        </div>
      }>
        <ShipmentsContent />
      </Suspense>
    </div>
  );
}
