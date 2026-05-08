import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12"
      style={{ background: 'linear-gradient(135deg, #030c06 0%, #040f0a 50%, #030c06 100%)' }}
    >
      <div style={{ position: 'fixed', top: '20%', left: '10%', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(30,90,50,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '10%', width: 500, height: 350, background: 'radial-gradient(ellipse, rgba(5,25,60,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="relative text-center w-full max-w-2xl animate-fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#1a5c30,#0d3d1f)', border: '1px solid rgba(74,222,128,0.3)', boxShadow: '0 0 30px rgba(74,222,128,0.2)' }}>
            <svg viewBox="0 0 22 22" fill="none" width="18" height="18">
              <circle cx="11" cy="11" r="7.5" stroke="#4ade80" strokeWidth="1.5"/>
              <path d="M11 6.5v5l2.5 2.5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="11" cy="11" r="2" fill="#4ade80"/>
            </svg>
          </div>
          <span className="font-heading italic text-white text-2xl sm:text-3xl">AgroTrace</span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-5">
          <span className="text-[10px] font-bold bg-[#4ade80] text-[#052210] px-2 py-0.5 rounded-full uppercase tracking-wider">Live</span>
          <span className="text-[11px] sm:text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Global Logistics Network · 2,847 Active Shipments
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-heading italic text-white mb-4"
          style={{ fontSize: 'clamp(32px, 8vw, 72px)', lineHeight: 0.95, letterSpacing: -2 }}
        >
          Track Every <span style={{ color: '#4ade80' }}>Grain.</span><br />
          Deliver With Intelligence.
        </h1>

        <p
          className="text-[13px] sm:text-[15px] font-light mb-7 leading-relaxed mx-auto"
          style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 480 }}
        >
          Real-time food supply chain tracking for Sindh & Punjab.
          Monitor shipments from certified farms to global export destinations.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-10 flex-wrap">
          <Link href="/dashboard" className="btn btn-primary btn-md">View Dashboard →</Link>
          <Link href="/map" className="btn btn-glass btn-md">Live Supply Map</Link>
        </div>

        {/* Stats */}
        <div className="home-stats-grid grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
          {[
            { val: '2,847', label: 'Active Shipments' },
            { val: '142',   label: 'Regions Covered' },
            { val: '$42.8M',label: 'Export Value (30d)' },
            { val: '96.4%', label: 'On-Time Rate' },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl px-3 py-3 text-center">
              <div className="font-heading italic text-white text-[18px] sm:text-[22px] leading-none" style={{ letterSpacing: -0.5 }}>
                {s.val}
              </div>
              <div className="text-[9px] mt-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Nav links */}
        <div className="home-nav-links flex items-center justify-center gap-5 sm:gap-8 mt-8 flex-wrap">
          {[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/shipments', label: 'Shipments' },
            { href: '/map',       label: 'Live Map' },
            { href: '/analytics', label: 'Analytics' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="text-[13px] text-white/40 hover:text-white/90 transition-colors duration-150">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
