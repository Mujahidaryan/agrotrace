'use client';

import { useState, useCallback } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleClose = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#030c06' }}>
      <Sidebar isOpen={sidebarOpen} onClose={handleClose} />
      <main className="flex flex-col flex-1 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
