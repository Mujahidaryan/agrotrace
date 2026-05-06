export const dynamic = 'force-dynamic';
import noSSR from 'next/dynamic';

const AnalyticsClient = noSSR(() => import('./AnalyticsClient'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 p-4 sm:p-6 space-y-4">
      <div className="region-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl h-64 animate-pulse" />
        <div className="glass rounded-2xl h-64 animate-pulse" />
      </div>
      <div className="glass rounded-2xl h-80 animate-pulse" />
    </div>
  ),
});

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
