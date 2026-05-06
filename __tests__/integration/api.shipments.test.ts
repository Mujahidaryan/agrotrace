// __tests__/integration/api.shipments.test.ts
// Integration tests for GET /api/shipments.
// These mock the db/queries layer, not the HTTP transport —
// that approach is faster than spinning up a full Next.js server
// and does not require a test database.

jest.mock('@/db/queries', () => ({
  getShipments: jest.fn(),
  getShipmentCount: jest.fn(),
}));

// Silence console.error in tests
beforeAll(() => { jest.spyOn(console, 'error').mockImplementation(() => {}); });
afterAll(() => { (console.error as jest.Mock).mockRestore(); });

import { getShipments, getShipmentCount } from '@/db/queries';
import { NextRequest } from 'next/server';

const mockGetShipments  = getShipments  as jest.Mock;
const mockGetCount      = getShipmentCount as jest.Mock;

// Minimal shipment fixture — only the fields the API reads
const shipmentFixture = {
  id: 'shp_001',
  tracking_code: 'AGT-KHI-2847',
  status: 'in_transit',
  is_export: false,
  value_usd: 93500,
};

describe('GET /api/shipments', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetShipments.mockResolvedValue([shipmentFixture]);
    mockGetCount.mockResolvedValue(18);
  });

  async function callRoute(url: string) {
    // Dynamically import to get fresh module per test (avoids caching issues)
    const { GET } = await import('@/app/api/shipments/route');
    const req = new NextRequest(url);
    return GET(req);
  }

  it('returns 200 with data and meta on happy path', async () => {
    const res = await callRoute('http://localhost/api/shipments');
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.meta.total).toBe(18);
    expect(body.meta.returned).toBe(1);
  });

  it('passes status filter to getShipments', async () => {
    await callRoute('http://localhost/api/shipments?status=delayed');
    expect(mockGetShipments).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'delayed' })
    );
  });

  it('passes is_export=true as boolean', async () => {
    await callRoute('http://localhost/api/shipments?is_export=true');
    expect(mockGetShipments).toHaveBeenCalledWith(
      expect.objectContaining({ is_export: true })
    );
  });

  it('caps limit at 200', async () => {
    await callRoute('http://localhost/api/shipments?limit=999');
    expect(mockGetShipments).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 200 })
    );
  });

  it('returns 500 and error envelope when DB throws', async () => {
    mockGetShipments.mockRejectedValueOnce(new Error('DB connection lost'));
    mockGetCount.mockRejectedValueOnce(new Error('DB connection lost'));

    const res = await callRoute('http://localhost/api/shipments');
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('QUERY_FAILED');
    // Must not expose raw DB error message to client
    expect(body.error.message).not.toContain('DB connection lost');
  });
});

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const { GET } = await import('@/app/api/health/route');
    const res = await GET();
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(typeof body.uptime).toBe('number');
  });
});
