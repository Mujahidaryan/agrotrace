export const dynamic = 'force-dynamic';
import dynamic from 'next/dynamic';

const AnalyticsClient = dynamic(() => import('./AnalyticsClient'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 p-6">
      <div className="glass rounded-2xl h-96 animate-pulse" />
    </div>
  ),
});

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AnalyticsClient />
    </div>
  );
}
