// src/hooks/usePolling.ts
// Generic polling hook for the 30-second refresh cycle.
// Handles: loading state, error state, stale data during refetch,
// automatic cleanup on unmount, and visibility-aware polling
// (pauses when the tab is hidden to save bandwidth).

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface PollingState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  lastUpdated: Date | null;
  refetch: () => void;
}

/**
 * Poll a URL every `intervalMs` (default 30 000ms).
 * Pauses when the browser tab is hidden.
 * Exposes manual `refetch()` for the refresh button.
 */
export function usePolling<T>(
  url: string,
  intervalMs = 30_000
): PollingState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Cancel any in-flight request before starting a new one
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(url, { signal: abortRef.current.signal });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const json = await res.json();
      setData(json);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      if ((err as Error).name === 'AbortError') return; // intentional cancel
      setError(err instanceof Error ? err.message : 'Fetch failed');
    } finally {
      setLoading(false);
    }
  }, [url]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval, pause when tab hidden
    const startPolling = () => {
      intervalRef.current = setInterval(() => {
        if (!document.hidden) fetchData();
      }, intervalMs);
    };

    const stopPolling = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    startPolling();

    const handleVisibility = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchData(); // immediate refresh when tab becomes visible
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopPolling();
      abortRef.current?.abort();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchData, intervalMs]);

  return { data, error, loading, lastUpdated, refetch };
}
