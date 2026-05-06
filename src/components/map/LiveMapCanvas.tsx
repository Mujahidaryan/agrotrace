'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { MapRoute, SupplyNode } from '@/types';
import { statusLabel, transportIcon, freshnessColor } from '@/lib/utils';

// Geographic bounds for the map viewport
// Pakistan-centric, extended to show international routes
const GEO = {
  minLat: 18, maxLat: 58,   // Extended to cover Europe
  minLng: 55, maxLng: 130,  // Extended to cover China
};

function geoToCanvas(lat: number, lng: number, W: number, H: number): [number, number] {
  const x = ((lng - GEO.minLng) / (GEO.maxLng - GEO.minLng)) * W;
  const y = H - ((lat - GEO.minLat) / (GEO.maxLat - GEO.minLat)) * H;
  return [x, y];
}

const STATUS_COLOR: Record<string, string> = {
  in_transit: '#60a5fa',
  delivered: '#4ade80',
  delayed: '#f87171',
  customs_hold: '#fbbf24',
  pending: 'rgba(255,255,255,0.3)',
  cancelled: 'rgba(255,255,255,0.15)',
};

const MODE_DASH: Record<string, number[]> = {
  truck: [6, 4],
  ship: [12, 6],
  air: [3, 5],
  rail: [10, 2],
};

const NODE_COLOR: Record<string, string> = {
  farm: '#4ade80',
  warehouse: '#fbbf24',
  distribution_center: '#fbbf24',
  port: '#f472b6',
  airport: '#a78bfa',
  retailer: '#60a5fa',
  export_hub: '#f472b6',
};

const CITIES: { name: string; lat: number; lng: number; label: string }[] = [
  { name: 'Karachi', lat: 24.86, lng: 67.0, label: 'Karachi' },
  { name: 'Lahore', lat: 31.55, lng: 74.34, label: 'Lahore' },
  { name: 'Faisalabad', lat: 31.42, lng: 73.08, label: 'Faisalabad' },
  { name: 'Multan', lat: 30.16, lng: 71.52, label: 'Multan' },
  { name: 'Hyderabad', lat: 25.40, lng: 68.36, label: 'Hyderabad' },
  { name: 'Sukkur', lat: 27.71, lng: 68.86, label: 'Sukkur' },
  { name: 'Larkana', lat: 27.56, lng: 68.21, label: 'Larkana' },
  { name: 'Gujranwala', lat: 32.19, lng: 74.19, label: 'Gujranwala' },
  { name: 'Bahawalpur', lat: 29.40, lng: 71.68, label: 'Bahawalpur' },
  { name: 'Dubai', lat: 25.20, lng: 55.27, label: 'Dubai 🇦🇪' },
  { name: 'Riyadh', lat: 24.69, lng: 46.72, label: 'Riyadh 🇸🇦' },
  { name: 'London', lat: 51.51, lng: -0.13, label: 'London 🇬🇧' },
  { name: 'Hamburg', lat: 53.58, lng: 10.02, label: 'Hamburg 🇩🇪' },
  { name: 'Beijing', lat: 39.90, lng: 116.41, label: 'Beijing 🇨🇳' },
];

interface FlowParticle {
  routeIdx: number;
  t: number;
  speed: number;
}

interface Props {
  routes: MapRoute[];
  nodes: SupplyNode[];
}

export default function LiveMapCanvas({ routes, nodes }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<FlowParticle[]>([]);
  const tRef = useRef(0);
  const [hovered, setHovered] = useState<MapRoute | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    tRef.current += 0.012;
    const t = tRef.current;

    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#030c06');
    bg.addColorStop(0.5, '#040f09');
    bg.addColorStop(1, '#030c06');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(74,222,128,0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();

    // Pakistan region highlight — correct center point
    const [pkCx, pkCy] = geoToCanvas(30, 68.5, W, H);
    const pkGrad = ctx.createRadialGradient(pkCx, pkCy, 20, pkCx, pkCy, 200);
    pkGrad.addColorStop(0, 'rgba(74,222,128,0.05)');
    pkGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = pkGrad;
    ctx.fillRect(0, 0, W, H);

    // Province labels — Bug 2 fix: removed ctx.letterSpacing (not valid Canvas API)
    const [sindhX, sindhY] = geoToCanvas(26, 68, W, H);
    const [punjabX, punjabY] = geoToCanvas(30.5, 72.5, W, H);
    ctx.font = '600 11px Barlow, sans-serif';
    ctx.fillStyle = 'rgba(74,222,128,0.15)';
    ctx.textAlign = 'center';
    ctx.fillText('SINDH', sindhX, sindhY);
    ctx.fillText('PUNJAB', punjabX, punjabY);

    // Route lines
    routes.forEach((route, ri) => {
      const [x1, y1] = geoToCanvas(route.from.lat, route.from.lng, W, H);
      const [x2, y2] = geoToCanvas(route.to.lat, route.to.lng, W, H);
      const color = STATUS_COLOR[route.status] ?? 'rgba(255,255,255,0.3)';
      const isHov = hovered?.id === route.id;
      const opacity = isHov ? 1 : 0.55;

      // Curve control point
      const cx = (x1 + x2) / 2 + (y2 - y1) * 0.15;
      const cy = (y1 + y2) / 2 - (x2 - x1) * 0.12;

      ctx.save();
      ctx.globalAlpha = opacity;

      // Glow for active/hovered
      if (route.status === 'in_transit' || isHov) {
        ctx.shadowBlur = isHov ? 18 : 8;
        ctx.shadowColor = color;
      }

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cx, cy, x2, y2);
      const dash = MODE_DASH[route.transport_mode] ?? [6, 4];
      ctx.setLineDash(dash);
      const dashOffset = -(t * (route.transport_mode === 'air' ? 4 : route.transport_mode === 'ship' ? 1.2 : 2) * 20) % (dash[0] + dash[1]);
      ctx.lineDashOffset = dashOffset;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, color + 'bb');
      grad.addColorStop(1, color + '55');
      ctx.strokeStyle = grad;
      ctx.lineWidth = isHov ? 2.5 : route.is_export ? 1.8 : 1.2;
      ctx.stroke();
      ctx.restore();

      // Flow particle
      const particle = particlesRef.current.find(p => p.routeIdx === ri);
      if (particle) {
        const pt = particle.t % 1;
        const px = (1-pt)*(1-pt)*x1 + 2*(1-pt)*pt*cx + pt*pt*x2;
        const py = (1-pt)*(1-pt)*y1 + 2*(1-pt)*pt*cy + pt*pt*y2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, route.is_export ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.restore();
        particle.t += particle.speed;
      }
    });

    // City labels
    CITIES.forEach(city => {
      const [cx, cy] = geoToCanvas(city.lat, city.lng, W, H);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fill();
      ctx.font = '400 10px Barlow, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.textAlign = 'left';
      ctx.fillText(city.label, cx + 5, cy + 4);
      ctx.restore();
    });

    // Supply nodes
    nodes.slice(0, 12).forEach(node => {
      const [nx, ny] = geoToCanvas(node.location.coordinates.lat, node.location.coordinates.lng, W, H);
      const color = NODE_COLOR[node.type] ?? '#fff';
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.8 + nx * 0.01);
      const r = node.type === 'port' || node.type === 'warehouse' ? 7 : 5;

      ctx.save();
      // Glow ring
      const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 4 * (1 + pulse * 0.3));
      glow.addColorStop(0, color + '30');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(nx, ny, r * 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(nx, ny, r * (0.85 + pulse * 0.15), 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowBlur = 10 + pulse * 6;
      ctx.shadowColor = color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(nx, ny, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.85;
      ctx.shadowBlur = 0;
      ctx.fill();
      ctx.restore();
    });

    // Legend overlay
    const legendItems = [
      { label: '— — Truck', color: '#4ade80' },
      { label: '———— Ship', color: '#60a5fa' },
      { label: '· · · Air', color: '#a78bfa' },
    ];
    ctx.save();
    ctx.fillStyle = 'rgba(3,12,6,0.75)';
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    roundRect(ctx, W - 150, H - 80, 140, 70, 10);
    ctx.fill();
    ctx.stroke();
    legendItems.forEach((l, i) => {
      ctx.font = '11px Barlow, sans-serif';
      ctx.fillStyle = l.color;
      ctx.textAlign = 'left';
      ctx.fillText(l.label, W - 138, H - 58 + i * 18);
    });
    ctx.restore();

    animRef.current = requestAnimationFrame(draw);
  }, [routes, nodes, hovered]);

  useEffect(() => {
    // Init particles
    particlesRef.current = routes.map((_, i) => ({
      routeIdx: i,
      t: Math.random(),
      speed: 0.002 + Math.random() * 0.003,
    }));
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw, routes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const W = canvas.width, H = canvas.height;

    let found: MapRoute | null = null;
    for (const route of routes) {
      const [x1, y1] = geoToCanvas(route.from.lat, route.from.lng, W, H);
      const [x2, y2] = geoToCanvas(route.to.lat, route.to.lng, W, H);
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      if (Math.hypot(mx - midX, my - midY) < 30) { found = route; break; }
    }
    setHovered(found);
    if (found) setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    else setTooltip(null);
  }, [routes]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        style={{ cursor: hovered ? 'pointer' : 'default' }}
      />

      {/* Tooltip */}
      {hovered && tooltip && (
        <div
          className="map-overlay-card pointer-events-none"
          style={{ left: tooltip.x + 16, top: tooltip.y - 10, zIndex: 30 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[14px]">{transportIcon(hovered.type) ?? '🚛'}</span>
            <span className="text-[12px] font-semibold text-white">{hovered.product}</span>
            {hovered.is_export && <span className="badge badge-amber" style={{ fontSize: 9 }}>EXPORT</span>}
          </div>
          <div className="text-[11px] space-y-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <div>📍 {hovered.from.label}</div>
            <div>→ {hovered.to.label}</div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`badge ${hovered.status === 'delayed' ? 'badge-danger' : hovered.status === 'delivered' ? 'badge-green' : 'badge-blue'}`}>
                {statusLabel(hovered.status)}
              </span>
              <span>{hovered.volume_tonnes} t</span>
            </div>
          </div>
        </div>
      )}

      {/* Route summary panel */}
      <div className="map-overlay-card" style={{ top: 16, right: 16, width: 260 }}>
        <div className="text-[11px] font-semibold text-white mb-3">Active Routes</div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {routes.map(r => (
            <div
              key={r.id}
              className="flex items-start gap-2 p-2 rounded-xl cursor-pointer transition-all"
              style={{
                background: hovered?.id === r.id ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${hovered?.id === r.id ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.05)'}`,
              }}
              onMouseEnter={() => setHovered(r)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="text-[12px] mt-0.5">{transportIcon(r.type) ?? '🚛'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-white truncate">{r.product}</div>
                <div className="text-[9px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {r.from.label.split(',')[0]} → {r.to.label.split(',')[0]}
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className={`badge ${r.status === 'delayed' ? 'badge-danger' : r.status === 'delivered' ? 'badge-green' : r.status === 'customs_hold' ? 'badge-amber' : 'badge-blue'}`} style={{ fontSize: 9 }}>
                  {statusLabel(r.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
