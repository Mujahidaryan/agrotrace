'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const NAV = [
  { href: '/dashboard', label: 'Dashboard',  icon: <IconGrid /> },
  { href: '/shipments', label: 'Shipments',  icon: <IconShipment /> },
  { href: '/map',       label: 'Live Map',   icon: <IconMap /> },
  { href: '/analytics', label: 'Analytics',  icon: <IconChart /> },
  { href: '/',          label: 'Home',       icon: <IconHome /> },
];

interface Props { isOpen: boolean; onClose: () => void; }

export default function Sidebar({ isOpen, onClose }: Props) {
  const path = usePathname();

  // Close drawer on route change
  useEffect(() => { onClose(); }, [path, onClose]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-mobile-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      />

      <aside
        className={`sidebar-drawer flex flex-col flex-shrink-0 h-screen sticky top-0 ${isOpen ? 'open' : ''}`}
        style={{
          width: 220,
          background: 'rgba(3,10,5,0.98)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 px-5 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="flex items-center justify-center rounded-[10px] w-8 h-8 flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg,#1a5c30,#0d3d1f)',
              border: '1px solid rgba(74,222,128,0.3)',
              boxShadow: '0 0 16px rgba(74,222,128,0.2)',
            }}
          >
            <svg viewBox="0 0 18 18" fill="none" width="14" height="14">
              <circle cx="9" cy="9" r="6" stroke="#4ade80" strokeWidth="1.4"/>
              <path d="M9 5.5v3.5l2 2" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="9" cy="9" r="1.5" fill="#4ade80"/>
            </svg>
          </div>
          <span className="font-heading italic text-white text-[18px] leading-none">AgroTrace</span>
        </div>

        {/* Section label */}
        <div className="px-5 pt-5 pb-2">
          <div
            className="text-[9px] font-semibold tracking-[0.12em] uppercase"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            Navigation
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map(item => {
            const active = item.href === '/'
              ? path === '/'
              : path.startsWith(item.href.split('#')[0]);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${active ? 'active' : ''}`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5 px-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg,#1a5c30,#0d3d1f)',
                border: '1px solid rgba(74,222,128,0.2)',
                color: '#4ade80',
              }}
            >
              JD
            </div>
            <div>
              <div className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>Jane Doe</div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Logistics Director</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 px-2">
            <span className="pulse-dot" style={{ width: 6, height: 6 }}></span>
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Live · Karachi, PKT</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function IconGrid()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>; }
function IconShipment() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3"/><rect x="8" y="10" width="13" height="10" rx="2"/><path d="M8 14h13" strokeLinecap="round"/></svg>; }
function IconMap()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>; }
function IconChart()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function IconHome()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
