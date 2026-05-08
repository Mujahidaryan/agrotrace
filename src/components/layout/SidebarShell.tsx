'use client';
// SidebarShell.tsx — CLIENT component that owns mobile sidebar state.
// Keeps (app)/layout.tsx as a server component (fixes BUG 2 & 5).
'use client';
import { useState, useCallback } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function SidebarShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const close = useCallback(() => setSidebarOpen(false), []);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={close} />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile hamburger — only visible below lg breakpoint */}
        <div
          className="sidebar-mobile-btn fixed top-4 left-4 z-30 lg:hidden"
          onClick={() => setSidebarOpen(o => !o)}
          role="button"
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
    </>
  );
}
