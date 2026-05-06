export const dynamic = 'force-dynamic';
import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="glass rounded-2xl p-8 text-center">
        <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading map…</div>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <MapClient />
    </div>
  );
}
