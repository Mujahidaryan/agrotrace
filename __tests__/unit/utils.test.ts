// __tests__/unit/utils.test.ts
import {
  formatNumber, formatUSD, formatTonnes, formatHours,
  timeAgo, statusBg, priorityBg, freshnessColor,
} from '@/lib/utils';

describe('formatNumber', () => {
  it('formats millions with 1 decimal', () => {
    expect(formatNumber(1_500_000)).toBe('1.5M');
  });
  it('formats thousands with 1 decimal by default', () => {
    expect(formatNumber(2847)).toBe('2.8K');
  });
  it('returns raw number below 1000', () => {
    expect(formatNumber(142)).toBe('142');
  });
  it('respects custom decimals', () => {
    expect(formatNumber(2847, 2)).toBe('2.85K');
  });
});

describe('formatUSD', () => {
  it('formats millions', () => {
    expect(formatUSD(42_800_000)).toBe('$42.80M');
  });
  it('formats thousands', () => {
    expect(formatUSD(93_500)).toBe('$93.5K');
  });
  it('formats small amounts', () => {
    expect(formatUSD(500)).toBe('$500');
  });
});

describe('formatTonnes', () => {
  it('formats thousands as K', () => {
    expect(formatTonnes(28640)).toBe('28.6K t');
  });
  it('formats sub-1000 directly', () => {
    expect(formatTonnes(85)).toBe('85 t');
  });
});

describe('formatHours', () => {
  it('returns minutes for sub-hour', () => {
    expect(formatHours(0.5)).toBe('30min');
  });
  it('returns hours for under 24h', () => {
    expect(formatHours(6)).toBe('6h');
  });
  it('returns days for 24h+', () => {
    expect(formatHours(48)).toBe('2.0d');
  });
});

describe('timeAgo', () => {
  it('returns minutes ago for recent', () => {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    expect(timeAgo(thirtyMinAgo)).toBe('30m ago');
  });
  it('returns hours ago for same-day', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
    expect(timeAgo(threeHoursAgo)).toBe('3h ago');
  });
  it('returns days ago for older', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400 * 1000).toISOString();
    expect(timeAgo(twoDaysAgo)).toBe('2d ago');
  });
});

describe('statusBg', () => {
  it('returns correct class for in_transit', () => {
    expect(statusBg('in_transit')).toContain('blue');
  });
  it('returns correct class for delayed', () => {
    expect(statusBg('delayed')).toContain('red');
  });
  it('returns correct class for delivered', () => {
    expect(statusBg('delivered')).toContain('green');
  });
  it('returns fallback for unknown status', () => {
    // @ts-expect-error testing unknown value
    expect(statusBg('unknown_status')).toContain('white');
  });
});

describe('priorityBg', () => {
  it('returns red for critical', () => {
    expect(priorityBg('critical')).toContain('red');
  });
  it('returns amber for high', () => {
    expect(priorityBg('high')).toContain('amber');
  });
});

describe('freshnessColor', () => {
  it('returns green for score >= 85', () => {
    expect(freshnessColor(90)).toContain('green');
  });
  it('returns amber for score 65-84', () => {
    expect(freshnessColor(75)).toContain('amber');
  });
  it('returns red for score < 65', () => {
    expect(freshnessColor(61)).toContain('red');
  });
});
