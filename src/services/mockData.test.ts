import { describe, expect, it } from 'vitest';
import {
  mockAlerts,
  mockCommands,
  mockDeviceLogs,
  mockDeviceMetrics,
  mockDevices,
  mockNotifications,
  mockPermissions,
  mockReports,
  mockRoles,
  mockTeams,
  mockTenants,
  mockUsers,
  paginate,
} from './mockData';

describe('paginate', () => {
  const items = Array.from({ length: 25 }, (_, i) => i);

  it('returns the requested page slice', () => {
    const result = paginate(items, 1, 10);
    expect(result.content).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });

  it('computes pagination metadata', () => {
    const result = paginate(items, 0, 10);
    expect(result.totalElements).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.size).toBe(10);
    expect(result.number).toBe(0);
    expect(result.first).toBe(true);
    expect(result.last).toBe(false);
  });

  it('marks the last page', () => {
    const result = paginate(items, 2, 10);
    expect(result.first).toBe(false);
    expect(result.last).toBe(true);
    expect(result.content).toHaveLength(5);
  });

  it('handles empty data', () => {
    const result = paginate([], 0, 10);
    expect(result.content).toEqual([]);
    expect(result.totalPages).toBe(0);
    expect(result.first).toBe(true);
    expect(result.last).toBe(true);
  });

  it('is safe for out-of-range pages', () => {
    const result = paginate(items, 99, 10);
    expect(result.content).toEqual([]);
    expect(result.last).toBe(true);
  });
});

describe('mock data integrity', () => {
  const uniqueIds = (arr: { id: string }[]) =>
    new Set(arr.map((x) => x.id)).size === arr.length;

  it('provides non-empty collections', () => {
    expect(mockUsers.length).toBeGreaterThan(0);
    expect(mockRoles.length).toBeGreaterThan(0);
    expect(mockPermissions.length).toBeGreaterThan(0);
    expect(mockTeams.length).toBeGreaterThan(0);
    expect(mockDevices.length).toBeGreaterThan(0);
    expect(mockAlerts.length).toBeGreaterThan(0);
    expect(mockCommands.length).toBeGreaterThan(0);
    expect(mockDeviceLogs.length).toBeGreaterThan(0);
    expect(mockDeviceMetrics.length).toBeGreaterThan(0);
    expect(mockReports.length).toBeGreaterThan(0);
  });

  it('keeps tenant mock data empty (feature not yet mocked)', () => {
    expect(mockTenants).toEqual([]);
  });

  it('has unique ids across entity collections', () => {
    expect(uniqueIds(mockUsers)).toBe(true);
    expect(uniqueIds(mockRoles)).toBe(true);
    expect(uniqueIds(mockPermissions)).toBe(true);
    expect(uniqueIds(mockTeams)).toBe(true);
    expect(uniqueIds(mockTenants)).toBe(true);
    expect(uniqueIds(mockDevices)).toBe(true);
    expect(uniqueIds(mockReports)).toBe(true);
  });

  it('ships an empty notifications inbox', () => {
    expect(mockNotifications).toEqual([]);
  });
});