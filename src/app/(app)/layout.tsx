// BUG 2+5 FIX: (app)/layout.tsx must be a SERVER component.
// Mobile sidebar state extracted into SidebarShell client component.
import SidebarShell from '@/components/layout/SidebarShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#030c06' }}>
      <SidebarShell>{children}</SidebarShell>
    </div>
  );
}
