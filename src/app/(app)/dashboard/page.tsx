export const dynamic = 'force-dynamic';
import noSSR from 'next/dynamic';
import Topbar from '@/components/layout/Topbar';

const DashboardClient = noSSR(
  () => import('@/components/dashboard/DashboardClient'),
  {
    ssr: false,
    loading: () => (
      <div className="page-pad p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="data-card animate-pulse">
              <div className="w-9 h-9 rounded-[10px] bg-white/5 mb-3" />
              <div className="h-7 bg-white/5 rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 glass rounded-2xl h-56 animate-pulse" />
          <div className="glass rounded-2xl h-56 animate-pulse" />
        </div>
      </div>
    ),
  }
);

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Topbar title="Operations Overview" subtitle="Live · Sindh & Punjab · Real-time">
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm hidden sm:inline-flex">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button className="btn btn-primary btn-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className="hidden sm:inline">Add Shipment</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </Topbar>
      <DashboardClient />
    </div>
  );
}
