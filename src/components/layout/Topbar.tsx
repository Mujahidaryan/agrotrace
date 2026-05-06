'use client';
import { useState, useEffect } from 'react';

interface TopbarProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function Topbar({ title, subtitle, children }: TopbarProps) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(
      new Date().toLocaleTimeString('en-PK', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: 'Asia/Karachi',
      })
    );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="topbar-inner flex items-center justify-between flex-shrink-0"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(3,12,6,0.7)',
        backdropFilter: 'blur(20px)',
        padding: '14px 24px',
        /* On mobile we add left padding to clear the hamburger button */
        paddingLeft: 'max(24px, env(safe-area-inset-left))',
      }}
    >
      {/* Title — on mobile, add left margin to clear hamburger */}
      <div className="min-w-0 flex-1" style={{ paddingLeft: 0 }}>
        <h1
          className="text-[15px] sm:text-[17px] font-semibold text-white leading-tight truncate"
          style={{ paddingLeft: 'clamp(0px, calc((100vw - 1024px) * -1), 44px)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span className="pulse-dot mr-1.5" style={{ width: 5, height: 5 }}></span>
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions + clock */}
      <div className="topbar-actions flex items-center gap-2 flex-shrink-0 ml-3">
        {children}
        <div className="topbar-clock glass rounded-full px-3 py-1.5 hidden sm:flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2" strokeLinecap="round"/>
          </svg>
          <span
            className="font-condensed text-[11px] font-medium"
            style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em' }}
          >
            {time || '00:00:00'} PKT
          </span>
        </div>
      </div>
    </header>
  );
}
