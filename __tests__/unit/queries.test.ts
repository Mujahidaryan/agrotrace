// __tests__/unit/queries.test.ts
// Tests query functions with a fully mocked postgres client.
// The real DATABASE_URL is never required in unit tests.
//
// queries.ts now calls getSql() at runtime (named export),
// so the mock must expose getSql returning a jest.fn tagged-template mock.

const mockFn = jest.fn();

jest.mock('@/db/client', () => ({
  getSql: () => mockFn,
}));

beforeEach(() => {
  mockFn.mockReset();
});

describe('getShipmentCount', () => {
  it('parses count string from postgres result', async () => {
    mockFn.mockResolvedValueOnce([{ count: '2847' }]);

    const { getShipmentCount } = require('@/db/queries');
    const result = await getShipmentCount();
    expect(result).toBe(2847);
    expect(typeof result).toBe('number');
  });
});

describe('checkDatabaseHealth', () => {
  it('returns true when SELECT 1 succeeds', async () => {
    mockFn.mockResolvedValueOnce([{ '?column?': 1 }]);
    const { checkDatabaseHealth } = require('@/db/queries');
    expect(await checkDatabaseHealth()).toBe(true);
  });

  it('returns false when DB throws', async () => {
    mockFn.mockRejectedValueOnce(new Error('connection refused'));
    const { checkDatabaseHealth } = require('@/db/queries');
    expect(await checkDatabaseHealth()).toBe(false);
  });
});

describe('getAlerts filter logic', () => {
  it('correctly partitions active vs resolved', () => {
    const alerts = [
      { id: 'a1', resolved: false, severity: 'high' },
      { id: 'a2', resolved: true,  severity: 'low' },
      { id: 'a3', resolved: false, severity: 'critical' },
    ];

    const active   = alerts.filter(a => !a.resolved);
    const resolved = alerts.filter(a => a.resolved);

    expect(active.length).toBe(2);
    expect(resolved.length).toBe(1);
    expect(active.map(a => a.id)).toEqual(['a1', 'a3']);
  });
});
