/**
 * src/lib/utils.ts
 * Shared formatting utilities for AgroTrace UI.
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

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
