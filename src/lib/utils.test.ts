import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('joins class names and ignores falsy values', () => {
    expect(cn('a', 'b')).toBe('a b');
    expect(cn('a', false, undefined, null, '', 'b')).toBe('a b');
  });

  it('merges tailwind class conflicts keeping the last value', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  
  it('supports the conditional object syntax', () => {
    expect(cn({ 'font-bold': true, hidden: false })).toBe('font-bold');
  });
});