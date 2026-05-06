export const dynamic = 'force-dynamic';
import dynamic from 'next/dynamic';

const DashboardClient = dynamic(() => import('@/components/dashboard/DashboardClient'), {
  ssr: false,
  loading: () => (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass rounded-2xl h-20 animate-pulse" />
        ))}
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <DashboardClient />
    </div>
  );
}
