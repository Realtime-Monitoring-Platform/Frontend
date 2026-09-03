import { describe, expect, it } from 'vitest';
import type { Metrics } from '@/types';
import {
  buildDistributionOption,
  buildGaugeOption,
  buildStatsOption,
  buildTrendOption,
  formatTime,
  levelColor,
} from './index';

describe('formatTime', () => {
  it('formats epoch millis as HH:MM:SS', () => {
    expect(formatTime(0)).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
  
});

describe('levelColor', () => {
  it('maps each log level to its color', () => {
    expect(levelColor('ERROR')).toBe('#f87171');
    expect(levelColor('WARN')).toBe('#facc15');
    expect(levelColor('INFO')).toBe('#5eead4');
  });

  it('falls back to the muted color for unknown levels', () => {
    expect(levelColor('DEBUG')).toBe('#9fb3ae');
    expect(levelColor('TRACE')).toBe('#9fb3ae');
  });
});

describe('buildStatsOption', () => {
  const metrics: Metrics[] = [
    { timestamp: '2026-01-01T00:00:00Z', cpu: 10, ram: 20 },
    { timestamp: '2026-01-01T00:00:01Z', cpu: 30, ram: 60 },
    { timestamp: '2026-01-01T00:00:02Z', cpu: 20, ram: 40 },
  ];

  it('computes min, average and max for CPU and RAM', () => {
    const option = buildStatsOption(metrics);
    const cpuData = option.series[0].data as number[];
    const ramData = option.series[1].data as number[];

    expect(cpuData).toEqual([10, 20, 30]);
    expect(ramData).toEqual([20, 40, 60]);
  });
});

describe('buildTrendOption', () => {
  const metrics: Metrics[] = [
    { timestamp: '2026-01-01T00:00:00Z', cpu: 51.567, ram: 33.333 },
    { timestamp: '2026-01-01T00:00:01Z', cpu: 55.129, ram: 35.001 },
  ];

  it('builds a line series with rounded CPU/RAM values', () => {
    const option = buildTrendOption(metrics);
    const cpuData = option.series[0].data as number[];
    const ramData = option.series[1].data as number[];

    expect(cpuData).toEqual([51.57, 55.13]);
    expect(ramData).toEqual([33.33, 35]);
    expect(option.series).toHaveLength(2);
  });
});

describe('buildGaugeOption', () => {
  it('builds a two-series gauge for CPU and RAM', () => {
    const option = buildGaugeOption(42, 66);
    expect(option.series).toHaveLength(2);

    const cpuData = option.series[0].data as { value: number }[];
    const ramData = option.series[1].data as { value: number }[];

    expect(cpuData[0].value).toBe(42);
    expect(ramData[0].value).toBe(66);
  });
});

describe('buildDistributionOption', () => {
  const metrics: Metrics[] = [
    { timestamp: '2026-01-01T00:00:00Z', cpu: 5, ram: 1 },
    { timestamp: '2026-01-01T00:00:01Z', cpu: 25, ram: 1 },
    { timestamp: '2026-01-01T00:00:02Z', cpu: 45, ram: 1 },
    { timestamp: '2026-01-01T00:00:03Z', cpu: 65, ram: 1 },
    { timestamp: '2026-01-01T00:00:04Z', cpu: 85, ram: 1 },
    { timestamp: '2026-01-01T00:00:05Z', cpu: 95, ram: 1 },
  ];

  it('buckets CPU readings into usage ranges', () => {
    const option = buildDistributionOption(metrics);
    const data = option.series[0].data as { name: string; value: number }[];

    expect(data.map((d) => d.name)).toEqual([
      '0-20%',
      '20-40%',
      '40-60%',
      '60-80%',
      '80-100%',
    ]);
    expect(data.map((d) => d.value)).toEqual([1, 1, 1, 1, 2]);
  });
});