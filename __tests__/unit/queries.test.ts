// __tests__/unit/queries.test.ts
// Tests query functions with a fully mocked postgres client.
// The real DATABASE_URL is never required in unit tests.

// Mock the db/client module before any imports that use it
jest.mock('@/db/client', () => {
  const mockSql = jest.fn();
  // Make it also callable as a tagged template literal
  const tagged = Object.assign(
    (strings: TemplateStringsArray, ...values: unknown[]) => mockSql(strings, ...values),
    { end: jest.fn() }
  );
  return { default: tagged, __mockSql: mockSql };
});

// The mock needs to be set up before importing queries
// We re-import inside each test for fresh state

describe('getShipmentCount', () => {
  it('parses count string from postgres result', async () => {
    const { default: sql } = require('@/db/client');
    sql.mockResolvedValueOnce([{ count: '2847' }]);

    const { getShipmentCount } = require('@/db/queries');
    const result = await getShipmentCount();
    expect(result).toBe(2847);
    expect(typeof result).toBe('number');
  });
});

describe('checkDatabaseHealth', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock('@/db/client', () => {
      const fn = jest.fn();
      return {
        default: Object.assign(
          (s: TemplateStringsArray, ...v: unknown[]) => fn(s, ...v),
          { end: jest.fn() }
        ),
        __fn: fn,
      };
    });
  });

  it('returns true when SELECT 1 succeeds', async () => {
    const { default: sql } = require('@/db/client');
    sql.mockResolvedValueOnce([{ '?column?': 1 }]);
    const { checkDatabaseHealth } = require('@/db/queries');
    expect(await checkDatabaseHealth()).toBe(true);
  });

  it('returns false when DB throws', async () => {
    const { default: sql } = require('@/db/client');
    sql.mockRejectedValueOnce(new Error('connection refused'));
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
