import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: '#030c06', color: 'rgba(255,255,255,0.9)' }}
    >
      {/* ── AMBIENT BACKGROUND ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '65vw', height: '65vw', maxWidth: 900, maxHeight: 900, background: 'radial-gradient(ellipse, rgba(30,90,50,0.22) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '-10%', width: '55vw', height: '55vw', maxWidth: 800, maxHeight: 800, background: 'radial-gradient(ellipse, rgba(5,20,50,0.18) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '45%', left: '40%', width: '40vw', height: '40vw', maxWidth: 600, maxHeight: 600, background: 'radial-gradient(ellipse, rgba(74,222,128,0.04) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        {/* grid lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.025 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 clamp(20px,5vw,60px)', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(3,12,6,0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#1a5c30,#0d3d1f)', border: '1px solid rgba(74,222,128,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(74,222,128,0.2)' }}>
            <svg viewBox="0 0 18 18" fill="none" width="12" height="12"><circle cx="9" cy="9" r="6" stroke="#4ade80" strokeWidth="1.4"/><path d="M9 5.5v3.5l2 2" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round"/><circle cx="9" cy="9" r="1.5" fill="#4ade80"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 17, color: 'white' }}>AgroTrace</span>
        </div>
        <div style={{ display: 'flex', gap: 'clamp(16px,3vw,32px)', alignItems: 'center' }}>
          {['Platform','Data','Coverage','Intelligence'].map(l => (
            <span key={l} style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', cursor: 'default', display: 'none' }} className="nav-link">{l}</span>
          ))}
          <Link href="/dashboard" style={{ fontSize: 12, fontWeight: 600, padding: '7px 18px', borderRadius: 8, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.28)', color: '#4ade80', textDecoration: 'none', letterSpacing: '0.02em' }}>
            Open Platform →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 1, paddingTop: 'clamp(120px,15vw,180px)', paddingBottom: 'clamp(60px,8vw,120px)', paddingLeft: 'clamp(20px,8vw,100px)', paddingRight: 'clamp(20px,8vw,100px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Status badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '6px 14px 6px 8px', marginBottom: 36, animation: 'fadeUp 0.6s ease both' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.9)', display: 'inline-block', animation: 'pulse-anim 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>LIVE SYSTEM · OPERATIONAL · PKT {new Date().getFullYear()}</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', lineHeight: 0.9, letterSpacing: '-2px', marginBottom: 28, animation: 'fadeUp 0.7s 0.1s ease both', opacity: 0 }}>
            <span style={{ display: 'block', fontSize: 'clamp(52px,8.5vw,120px)', color: 'rgba(255,255,255,0.92)' }}>Pakistan&apos;s</span>
            <span style={{ display: 'block', fontSize: 'clamp(52px,8.5vw,120px)', color: '#4ade80' }}>Agricultural</span>
            <span style={{ display: 'block', fontSize: 'clamp(52px,8.5vw,120px)', color: 'rgba(255,255,255,0.92)' }}>Intelligence</span>
            <span style={{ display: 'block', fontSize: 'clamp(52px,8.5vw,120px)', color: 'rgba(255,255,255,0.28)' }}>Platform.</span>
          </h1>

          {/* Subheading + CTA row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-end', marginBottom: 80, animation: 'fadeUp 0.7s 0.25s ease both', opacity: 0 }}>
            <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 440, fontWeight: 300 }}>
              Real-time visibility across Sindh &amp; Punjab&apos;s food supply chains — from certified farms to international export terminals. Built for decision-makers who need truth, not approximations.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 10, background: '#4ade80', color: '#041a0a', fontWeight: 700, fontSize: 13, textDecoration: 'none', letterSpacing: '0.02em', boxShadow: '0 0 40px rgba(74,222,128,0.25)' }}>
                Access Dashboard
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/map" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', fontWeight: 500, fontSize: 13, textDecoration: 'none' }}>
                View Live Map
              </Link>
            </div>
          </div>

          {/* LIVE METRICS STRIP */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', animation: 'fadeUp 0.7s 0.35s ease both', opacity: 0 }}>
            {[
              { val: '3,412', label: 'Active Shipments', unit: 'routes', color: '#4ade80' },
              { val: '$47.2M', label: 'Export Value', unit: '30-day rolling', color: '#fbbf24' },
              { val: '96.8%', label: 'On-Time Rate', unit: 'last 30 days', color: '#4ade80' },
              { val: '184', label: 'Supply Nodes', unit: 'certified', color: '#60a5fa' },
              { val: '28', label: 'Countries Reached', unit: 'export destinations', color: '#f472b6' },
              { val: '1.2M t', label: 'Volume Tracked', unit: 'metric tonnes / month', color: '#4ade80' },
            ].map((m, i) => (
              <div key={m.label} style={{ padding: 'clamp(16px,2.5vw,28px)', background: 'rgba(3,12,6,0.85)', borderRight: i < 5 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 'clamp(22px,2.8vw,36px)', color: m.color, letterSpacing: '-0.5px', lineHeight: 1 }}>{m.val}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginTop: 6 }}>{m.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2, letterSpacing: '0.04em' }}>{m.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GEOGRAPHIC COVERAGE SECTION ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,8vw,120px) clamp(20px,8vw,100px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

            {/* Left — section title */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#4ade80', marginBottom: 14, textTransform: 'uppercase' }}>Geographic Coverage</div>
              <h2 style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 'clamp(32px,4vw,52px)', lineHeight: 1.05, letterSpacing: '-1px', color: 'white', marginBottom: 20 }}>
                End-to-end visibility across Pakistan&apos;s agricultural heartland
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: 380 }}>
                From farm-gate in Sindh to port terminals in Karachi, and from wheat fields in Punjab to international airports — every node, every route, every handoff is logged in real time.
              </p>

              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { province: 'Sindh', desc: 'Rice, mangoes, dates, sugarcane — 38% of national output', nodes: 94, color: '#4ade80' },
                  { province: 'Punjab', desc: 'Wheat, cotton, maize — Pakistan\'s breadbasket', nodes: 72, color: '#60a5fa' },
                  { province: 'KPK & Balochistan', desc: 'Fruits, livestock, cross-border trade corridors', nodes: 18, color: '#fbbf24' },
                ].map(p => (
                  <div key={p.province} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ width: 3, borderRadius: 2, background: p.color, alignSelf: 'stretch', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 3 }}>{p.province}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{p.desc}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 16, fontFamily: 'var(--font-instrument)', fontStyle: 'italic', color: p.color }}>{p.nodes}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>NODES</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual route diagram */}
            <div style={{ position: 'relative', minHeight: 420, borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Animated SVG map visualization */}
              <svg viewBox="0 0 500 420" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                {/* Background grid */}
                <defs>
                  <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
                  </pattern>
                  <radialGradient id="nodeGlow1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0"/>
                  </radialGradient>
                  <radialGradient id="nodeGlow2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0"/>
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <rect width="500" height="420" fill="url(#mapgrid)" />

                {/* Route lines with animation */}
                {/* Karachi → Dubai */}
                <path d="M 180 310 Q 80 250 30 220" stroke="rgba(74,222,128,0.25)" strokeWidth="1.5" fill="none" strokeDasharray="6 4"/>
                <circle r="4" fill="#4ade80" opacity="0.9" filter="url(#glow)">
                  <animateMotion dur="4s" repeatCount="indefinite" path="M 180 310 Q 80 250 30 220"/>
                </circle>

                {/* Lahore → Karachi */}
                <path d="M 260 160 Q 240 240 180 310" stroke="rgba(96,165,250,0.3)" strokeWidth="1.5" fill="none" strokeDasharray="6 4"/>
                <circle r="3" fill="#60a5fa" opacity="0.9" filter="url(#glow)">
                  <animateMotion dur="5s" repeatCount="indefinite" path="M 260 160 Q 240 240 180 310"/>
                </circle>

                {/* Faisalabad → Lahore */}
                <path d="M 210 140 L 260 160" stroke="rgba(251,191,36,0.35)" strokeWidth="1.5" fill="none" strokeDasharray="5 4"/>
                <circle r="3" fill="#fbbf24" opacity="0.8" filter="url(#glow)">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 210 140 L 260 160"/>
                </circle>

                {/* Multan → Lahore */}
                <path d="M 220 230 Q 245 195 260 160" stroke="rgba(74,222,128,0.2)" strokeWidth="1.2" fill="none" strokeDasharray="5 4"/>

                {/* Karachi → KSA */}
                <path d="M 180 310 Q 160 380 200 410" stroke="rgba(244,114,182,0.2)" strokeWidth="1" fill="none" strokeDasharray="4 5"/>
                <circle r="2.5" fill="#f472b6" opacity="0.7">
                  <animateMotion dur="6s" repeatCount="indefinite" path="M 180 310 Q 160 380 200 410"/>
                </circle>

                {/* Karachi → China (east) */}
                <path d="M 180 310 Q 350 280 460 180" stroke="rgba(96,165,250,0.15)" strokeWidth="1" fill="none" strokeDasharray="4 5"/>
                <circle r="2" fill="#60a5fa" opacity="0.6">
                  <animateMotion dur="8s" repeatCount="indefinite" path="M 180 310 Q 350 280 460 180"/>
                </circle>

                {/* City nodes */}
                {/* Karachi - main hub */}
                <circle cx="180" cy="310" r="28" fill="url(#nodeGlow1)" opacity="0.5"/>
                <circle cx="180" cy="310" r="8" fill="rgba(3,12,6,0.9)" stroke="#4ade80" strokeWidth="1.5" filter="url(#glow)"/>
                <circle cx="180" cy="310" r="3" fill="#4ade80"/>
                <circle cx="180" cy="310" r="8" fill="none" stroke="rgba(74,222,128,0.4)" strokeWidth="1">
                  <animate attributeName="r" values="8;18;8" dur="3s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite"/>
                </circle>
                <text x="180" y="330" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="var(--font-barlow-condensed)" letterSpacing="0.08em">KARACHI PORT</text>

                {/* Lahore */}
                <circle cx="260" cy="160" r="18" fill="url(#nodeGlow2)" opacity="0.4"/>
                <circle cx="260" cy="160" r="6" fill="rgba(3,12,6,0.9)" stroke="#60a5fa" strokeWidth="1.5" filter="url(#glow)"/>
                <circle cx="260" cy="160" r="2.5" fill="#60a5fa"/>
                <text x="260" y="177" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="var(--font-barlow-condensed)" letterSpacing="0.08em">LAHORE</text>

                {/* Faisalabad */}
                <circle cx="210" cy="140" r="5" fill="rgba(3,12,6,0.9)" stroke="#fbbf24" strokeWidth="1.2" filter="url(#glow)"/>
                <circle cx="210" cy="140" r="2" fill="#fbbf24"/>
                <text x="210" y="155" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7.5" fontFamily="var(--font-barlow-condensed)" letterSpacing="0.06em">FAISALABAD</text>

                {/* Multan */}
                <circle cx="220" cy="230" r="5" fill="rgba(3,12,6,0.9)" stroke="#4ade80" strokeWidth="1.2"/>
                <circle cx="220" cy="230" r="2" fill="#4ade80"/>
                <text x="220" y="245" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7.5" fontFamily="var(--font-barlow-condensed)" letterSpacing="0.06em">MULTAN</text>

                {/* Hyderabad */}
                <circle cx="200" cy="280" r="4" fill="rgba(3,12,6,0.9)" stroke="rgba(74,222,128,0.6)" strokeWidth="1"/>
                <circle cx="200" cy="280" r="1.5" fill="rgba(74,222,128,0.6)"/>

                {/* Sukkur */}
                <circle cx="230" cy="195" r="4" fill="rgba(3,12,6,0.9)" stroke="rgba(74,222,128,0.5)" strokeWidth="1"/>
                <circle cx="230" cy="195" r="1.5" fill="rgba(74,222,128,0.5)"/>

                {/* International: Dubai */}
                <circle cx="30" cy="220" r="5" fill="rgba(3,12,6,0.9)" stroke="#f472b6" strokeWidth="1.2"/>
                <circle cx="30" cy="220" r="2" fill="#f472b6"/>
                <text x="30" y="212" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="var(--font-barlow-condensed)" letterSpacing="0.06em">DUBAI</text>

                {/* International: China */}
                <circle cx="460" cy="180" r="5" fill="rgba(3,12,6,0.9)" stroke="#60a5fa" strokeWidth="1.2"/>
                <circle cx="460" cy="180" r="2" fill="#60a5fa"/>
                <text x="460" y="172" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="var(--font-barlow-condensed)" letterSpacing="0.06em">BEIJING</text>

                {/* Stats overlay */}
                <rect x="320" y="290" width="160" height="80" rx="8" fill="rgba(3,12,6,0.85)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                <text x="334" y="310" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="var(--font-barlow-condensed)" letterSpacing="0.1em">LIVE TRAFFIC</text>
                <text x="334" y="330" fill="#4ade80" fontSize="20" fontFamily="var(--font-instrument)" fontStyle="italic">3,412</text>
                <text x="334" y="345" fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="var(--font-barlow)">active shipments</text>
                <circle cx="464" cy="302" r="4" fill="rgba(74,222,128,0.15)"/>
                <circle cx="464" cy="302" r="2" fill="#4ade80">
                  <animate attributeName="r" values="2;5;2" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                </circle>

                {/* Legend */}
                <rect x="14" y="340" width="130" height="68" rx="7" fill="rgba(3,12,6,0.8)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                <circle cx="26" cy="355" r="3" fill="#4ade80"/>
                <text x="34" y="358" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="var(--font-barlow)">Domestic routes</text>
                <circle cx="26" cy="370" r="3" fill="#60a5fa"/>
                <text x="34" y="373" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="var(--font-barlow)">Inter-provincial</text>
                <circle cx="26" cy="385" r="3" fill="#f472b6"/>
                <text x="34" y="388" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="var(--font-barlow)">Export corridors</text>
                <circle cx="26" cy="400" r="3" fill="#fbbf24"/>
                <text x="34" y="403" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="var(--font-barlow)">Warehouse hubs</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM CAPABILITIES ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,8vw,120px) clamp(20px,8vw,100px)', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#4ade80', marginBottom: 14, textTransform: 'uppercase' }}>Platform Capabilities</div>
            <h2 style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 'clamp(28px,4vw,48px)', color: 'white', letterSpacing: '-0.5px' }}>
              Built for operational intelligence
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" strokeLinecap="round"/></svg>,
                color: '#4ade80',
                title: 'Real-Time Shipment Tracking',
                desc: 'Sub-minute position updates on all active shipments across road, rail, sea, and air corridors. Full chain-of-custody with timestamped handoffs.',
                stat: '< 60s', statLabel: 'update latency',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><path d="M3 3v18h18"/><path d="M18.4 7.8L13 13l-3-3-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                color: '#60a5fa',
                title: 'Predictive Delay Analytics',
                desc: 'Machine-learning models trained on 4 years of historical shipment data surface delay risk 24–72 hours ahead of projected ETA breaches.',
                stat: '72h', statLabel: 'advance warning',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
                color: '#fbbf24',
                title: 'Live Supply Flow Map',
                desc: 'Geospatial canvas rendering every active route with animated flow particles. Drill down into node utilization, customs status, and temperature compliance.',
                stat: '184', statLabel: 'tracked nodes',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                color: '#f472b6',
                title: 'Cold Chain Integrity',
                desc: 'IoT temperature sensors across 47 cold-chain nodes alert in real time when produce freshness scores breach threshold — preventing spoilage before it escalates.',
                stat: '47', statLabel: 'cold-chain nodes',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4" strokeLinecap="round"/></svg>,
                color: '#a78bfa',
                title: 'Export Compliance Dashboard',
                desc: 'Automated HS code classification, phytosanitary certificate tracking, and customs hold alerts across 28 destination countries with regulatory timelines.',
                stat: '28', statLabel: 'export markets',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                color: '#4ade80',
                title: 'Multi-Stakeholder Access',
                desc: 'Role-based access control for logistics managers, customs officials, port operators, farm cooperatives, and government food security monitors.',
                stat: '6', statLabel: 'stakeholder roles',
              },
            ].map(cap => (
              <div key={cap.title} style={{ padding: 'clamp(20px,2.5vw,28px)', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', transition: 'border-color 0.2s' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${cap.color}14`, border: `1px solid ${cap.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: cap.color }}>
                  {cap.icon}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 10, lineHeight: 1.3 }}>{cap.title}</div>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 18 }}>{cap.desc}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 22, color: cap.color }}>{cap.stat}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>{cap.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPORT INTELLIGENCE SECTION ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,8vw,120px) clamp(20px,8vw,100px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#fbbf24', marginBottom: 14, textTransform: 'uppercase' }}>Export Intelligence</div>
              <h2 style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 'clamp(28px,3.5vw,46px)', color: 'white', lineHeight: 1.1, letterSpacing: '-0.5px', marginBottom: 20 }}>
                Pakistan&apos;s agri-exports, tracked to the last kilogram
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 32 }}>
                AgroTrace monitors outbound shipment value, volume, and product composition across all major export corridors. Data refreshes every 30 seconds from live port manifests and carrier APIs.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { country: '🇦🇪 UAE', val: '$14.2M', growth: '+18%' },
                  { country: '🇨🇳 China', val: '$17.6M', growth: '+31%' },
                  { country: '🇸🇦 Saudi Arabia', val: '$9.1M', growth: '+12%' },
                  { country: '🇬🇧 United Kingdom', val: '$9.2M', growth: '+8%' },
                  { country: '🇩🇪 Germany', val: '$6.8M', growth: '+22%' },
                  { country: '🇺🇸 United States', val: '$4.9M', growth: '+15%' },
                ].map(c => (
                  <div key={c.country} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{c.country}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{c.val}</div>
                      <div style={{ fontSize: 10, color: '#4ade80' }}>{c.growth} YoY</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product breakdown visual */}
            <div style={{ padding: 'clamp(20px,3vw,36px)', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase', fontWeight: 600 }}>Top Export Commodities · 30-Day</div>
              {[
                { product: 'Basmati Rice', volume: '184,200 t', pct: 100, share: '38.4%', color: '#4ade80' },
                { product: 'Mangoes (Fresh)', volume: '92,100 t', pct: 50, share: '19.2%', color: '#fbbf24' },
                { product: 'Vegetables', volume: '71,600 t', pct: 39, share: '14.9%', color: '#60a5fa' },
                { product: 'Cotton Products', volume: '48,800 t', pct: 26, share: '10.2%', color: '#a78bfa' },
                { product: 'Citrus Fruits', volume: '38,400 t', pct: 21, share: '8.0%', color: '#f472b6' },
                { product: 'Dates & Dry Fruits', volume: '44,600 t', pct: 24, share: '9.3%', color: '#fb923c' },
              ].map(p => (
                <div key={p.product} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{p.product}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{p.volume}</span>
                      <span style={{ fontSize: 11, color: p.color, marginLeft: 8, fontWeight: 600 }}>{p.share}</span>
                    </div>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.pct}%`, background: p.color, borderRadius: 2, opacity: 0.75 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 28, color: '#4ade80' }}>479,700 t</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Total volume, last 30 days</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 28, color: '#fbbf24' }}>$47.2M</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Total export value</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OPERATIONS STRIP ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(40px,5vw,80px) clamp(20px,8vw,100px)', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { icon: '🚛', label: 'Truck Corridors', val: '1,847', sub: 'active vehicles' },
              { icon: '🚢', label: 'Maritime Routes', val: '312', sub: 'active consignments' },
              { icon: '✈️', label: 'Air Freight', val: '94', sub: 'active air shipments' },
              { icon: '🚂', label: 'Rail Freight', val: '156', sub: 'active wagons' },
              { icon: '🌡️', label: 'Cold Chain', val: '100%', sub: 'IoT monitored' },
              { icon: '📋', label: 'Compliance', val: '99.2%', sub: 'cert. accuracy' },
            ].map(op => (
              <div key={op.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 24, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, background: 'rgba(255,255,255,0.04)', flexShrink: 0 }}>{op.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 22, color: 'white', lineHeight: 1 }}>{op.val}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{op.label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{op.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM / BUILT BY ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,8vw,120px) clamp(20px,8vw,100px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'center' }}>
            {/* Left: platform info */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#4ade80', marginBottom: 14, textTransform: 'uppercase' }}>About This Platform</div>
              <h2 style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 'clamp(28px,3.5vw,44px)', color: 'white', lineHeight: 1.1, letterSpacing: '-0.5px', marginBottom: 20 }}>
                Engineered for Pakistan&apos;s food supply challenge
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 16 }}>
                AgroTrace was built to solve a specific problem: Pakistan loses an estimated 35–40% of perishable produce annually due to logistics opacity, delayed customs clearance, and cold chain failures.
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 32 }}>
                This platform brings end-to-end traceability to agricultural supply chains — connecting farm cooperatives, warehouse operators, freight carriers, port terminals, and customs authorities into a single live operational picture.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Next.js 14', 'PostgreSQL', 'Real-Time APIs', 'IoT Integration', 'Node.js', 'TypeScript', 'Vercel Edge'].map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Right: developer card */}
            <div style={{ padding: 'clamp(24px,3vw,36px)', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase', fontWeight: 600 }}>Platform Developer</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg,#1a5c30,#0d3d1f)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#4ade80', fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.04em', flexShrink: 0 }}>
                  MM
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.2px' }}>Muhammad Mujahid</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>Full-Stack Developer · Karachi, Pakistan</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, padding: '3px 10px', borderRadius: 6, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                    <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 600 }}>Open to Opportunities</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                {[
                  { label: 'University', val: 'Bahria University Karachi' },
                  { label: 'Degree', val: 'B.S. Software Engineering' },
                  { label: 'Experience', val: 'Next.js · Node.js · PostgreSQL' },
                  { label: 'Contact', val: 'mujahidaryan222149@gmail.com' },
                ].map(d => (
                  <div key={d.label} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{d.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{d.val}</div>
                  </div>
                ))}
              </div>
              <a href="https://my-portfolio-swart-nu-73.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 20px', borderRadius: 10, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                View Portfolio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,8vw,100px) clamp(20px,8vw,100px)', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#4ade80', marginBottom: 16, textTransform: 'uppercase' }}>Access the Platform</div>
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 'clamp(32px,5vw,64px)', color: 'white', lineHeight: 0.95, letterSpacing: '-1.5px', marginBottom: 24 }}>
            Real data.<br/>Real decisions.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            The platform is live and operational. Navigate to any section to explore shipment tracking, the live supply map, or regional analytics.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 10, background: '#4ade80', color: '#041a0a', fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 0 50px rgba(74,222,128,0.2)' }}>
              Open Dashboard →
            </Link>
            <Link href="/shipments" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 14, textDecoration: 'none' }}>
              Track Shipments
            </Link>
            <Link href="/map" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 14, textDecoration: 'none' }}>
              Live Map
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: 'relative', zIndex: 1, padding: 'clamp(24px,3vw,36px) clamp(20px,8vw,100px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#1a5c30,#0d3d1f)', border: '1px solid rgba(74,222,128,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 18 18" fill="none" width="10" height="10"><circle cx="9" cy="9" r="6" stroke="#4ade80" strokeWidth="1.4"/><path d="M9 5.5v3.5l2 2" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>AgroTrace</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginLeft: 4 }}>© {new Date().getFullYear()}</span>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/shipments', label: 'Shipments' },
            { href: '/map', label: 'Live Map' },
            { href: '/analytics', label: 'Analytics' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px rgba(74,222,128,0.8)', animation: 'pulse-anim 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>All systems operational</span>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-anim {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.55); }
        }
        h1 > span { animation: fadeUp 0.7s ease both; opacity: 0; }
        h1 > span:nth-child(1) { animation-delay: 0.1s; }
        h1 > span:nth-child(2) { animation-delay: 0.2s; }
        h1 > span:nth-child(3) { animation-delay: 0.3s; }
        h1 > span:nth-child(4) { animation-delay: 0.4s; }
        @media (min-width: 768px) {
          .nav-link { display: block !important; }
        }
      `}</style>
    </div>
  );
}
