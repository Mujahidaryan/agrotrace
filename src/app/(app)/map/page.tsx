export const dynamic = 'force-dynamic';
import noSSR from 'next/dynamic';

const MapClient = noSSR(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="glass rounded-2xl px-6 py-4 text-white/50 text-sm">Loading map...</div>
    </div>
  ),
});

export default function MapPage() {
  return <MapClient />;
}
