/**
 * src/lib/utils.ts — AgroTrace shared utilities
 * Every helper function referenced by any component lives here.
 */

export function formatNumber(n: number | undefined | null, decimals = 0): string {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

export function formatUSD(n: number | undefined | null): string {
  if (n == null || isNaN(n)) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function formatTonnes(n: number | undefined | null): string {
  if (n == null || isNaN(n)) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M t`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K t`;
  return `${n.toFixed(0)} t`;
}

export function formatPct(n: number | undefined | null, decimals = 1): string {
  if (n == null || isNaN(n)) return '—';
  return `${n.toFixed(decimals)}%`;
}

export function timeAgo(iso: string | undefined | null): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function statusBg(status: string): string {
  switch (status) {
    case 'in_transit':   return 'badge-blue';
    case 'delivered':    return 'badge-green';
    case 'delayed':      return 'badge-danger';
    case 'customs_hold': return 'badge-amber';
    case 'pending':      return 'badge-ghost';
    case 'cancelled':    return 'badge-ghost';
    default:             return 'badge-ghost';
  }
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'in_transit':   return 'In Transit';
    case 'delivered':    return 'Delivered';
    case 'delayed':      return 'Delayed';
    case 'customs_hold': return 'Customs Hold';
    case 'pending':      return 'Pending';
    case 'cancelled':    return 'Cancelled';
    default:             return status;
  }
}

export function priorityBg(priority: string): string {
  switch (priority) {
    case 'critical': return 'badge-danger';
    case 'high':     return 'badge-amber';
    case 'medium':   return 'badge-blue';
    case 'low':      return 'badge-ghost';
    default:         return 'badge-ghost';
  }
}

export function transportIcon(mode: string): string {
  switch (mode) {
    case 'truck': return '🚛';
    case 'ship':  return '🚢';
    case 'air':   return '✈️';
    case 'rail':  return '🚂';
    default:      return '🚛';
  }
}

export function nodeTypeIcon(type: string): string {
  switch (type) {
    case 'farm':                return '🌾';
    case 'warehouse':           return '🏭';
    case 'distribution_center': return '🏬';
    case 'port':                return '⚓';
    case 'airport':             return '✈️';
    case 'retailer':            return '🛒';
    case 'export_hub':          return '🌍';
    default:                    return '📦';
  }
}

export function freshnessColor(score: number): string {
  if (score >= 85) return 'text-[#4ade80]';
  if (score >= 65) return 'text-[#fbbf24]';
  return 'text-[#f87171]';
}

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
