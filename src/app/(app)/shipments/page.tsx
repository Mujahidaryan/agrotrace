export const dynamic = 'force-dynamic';
import noSSR from 'next/dynamic';

const ShipmentsClient = noSSR(() => import('./ShipmentsClient'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 p-6">
      <div className="glass rounded-2xl h-96 animate-pulse" />
    </div>
  ),
});

export default function ShipmentsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <ShipmentsClient />
    </div>
  );
}
