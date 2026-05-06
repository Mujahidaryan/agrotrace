// src/app/(app)/layout.tsx
// Manages the mobile sidebar open/close state and passes it to both
// Sidebar (which renders the drawer) and Topbar (which renders the toggle button).
'use client';
import { useState, useCallback } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const close = useCallback(() => setSidebarOpen(false), []);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#030c06' }}
    >
      <Sidebar isOpen={sidebarOpen} onClose={close} />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Pass toggle to children via a wrapper element — children render their own Topbar */}
        <div
          className="sidebar-mobile-btn fixed top-4 left-4 z-30 lg:hidden"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Open navigation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </div>
        {children}
      </main>
    </div>
  );
}
