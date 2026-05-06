import { type ClassValue, clsx } from 'clsx';
import type { ShipmentStatus, Priority, NodeType, TransportMode, ProductCategory } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(n: number, decimals = 0): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(decimals || 1)}K`;
  return n.toFixed(decimals);
}

export function formatUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

export function formatTonnes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K t`;
  return `${n} t`;
}

export function formatHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)}min`;
  if (h < 24) return `${h.toFixed(0)}h`;
  return `${(h / 24).toFixed(1)}d`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = diff / 3600000;
  if (h < 1) return `${Math.round(h * 60)}m ago`;
  if (h < 24) return `${Math.round(h)}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function statusColor(status: ShipmentStatus): string {
  const map: Record<ShipmentStatus, string> = {
    pending: 'text-white/50',
    in_transit: 'text-blue',
    delayed: 'text-danger',
    delivered: 'text-green',
    cancelled: 'text-white/30',
    customs_hold: 'text-amber',
  };
  return map[status] ?? 'text-white/50';
}

export function statusBg(status: ShipmentStatus): string {
  const map: Record<ShipmentStatus, string> = {
    pending:      'bg-white/5 border-white/10 text-white/50',
    in_transit:   'bg-blue-400/10 border-blue-400/20 text-blue-400',
    delayed:      'bg-red-400/10 border-red-400/20 text-red-400',
    delivered:    'bg-green-400/10 border-green-400/20 text-green-400',
    cancelled:    'bg-white/5 border-white/5 text-white/30',
    customs_hold: 'bg-amber-400/10 border-amber-400/20 text-amber-400',
  };
  return map[status] ?? 'bg-white/5 border-white/10 text-white/50';
}

export function statusLabel(status: ShipmentStatus): string {
  const map: Record<ShipmentStatus, string> = {
    pending: 'Pending',
    in_transit: 'In Transit',
    delayed: 'Delayed',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    customs_hold: 'Customs Hold',
  };
  return map[status] ?? status;
}

export function priorityColor(p: Priority): string {
  const map: Record<Priority, string> = {
    critical: 'text-danger',
    high: 'text-amber',
    medium: 'text-blue',
    low: 'text-white/40',
  };
  return map[p];
}

export function priorityBg(p: Priority): string {
  const map: Record<Priority, string> = {
    critical: 'bg-red-400/10 border-red-400/20 text-red-400',
    high:     'bg-amber-400/10 border-amber-400/20 text-amber-400',
    medium:   'bg-blue-400/10 border-blue-400/20 text-blue-400',
    low:      'bg-white/5 border-white/10 text-white/40',
  };
  return map[p] ?? 'bg-white/5 border-white/10 text-white/40';
}

export function nodeTypeIcon(type: NodeType): string {
  const map: Record<NodeType, string> = {
    farm: '🌾',
    warehouse: '🏭',
    distribution_center: '📦',
    port: '⚓',
    airport: '✈️',
    retailer: '🏪',
    export_hub: '🚢',
  };
  return map[type] ?? '📍';
}

export function transportIcon(mode: TransportMode): string {
  const map: Record<TransportMode, string> = {
    truck: '🚛',
    ship: '🚢',
    air: '✈️',
    rail: '🚂',
  };
  return map[mode];
}

export function freshnessColor(score: number): string {
  if (score >= 85) return 'text-green-400';
  if (score >= 65) return 'text-amber-400';
  return 'text-red-400';
}

export function freshnessLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  return 'Critical';
}

export function categoryLabel(cat: ProductCategory): string {
  const map: Record<ProductCategory, string> = {
    grains: 'Grains & Cereals',
    fruits: 'Fruits',
    vegetables: 'Vegetables',
    livestock: 'Livestock',
    dairy: 'Dairy',
    processed: 'Processed',
  };
  return map[cat];
}
