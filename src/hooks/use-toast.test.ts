import { describe, expect, it } from 'vitest';
import { reducer } from './use-toast';

type State = ReturnType<typeof reducer>;
type Action = Parameters<typeof reducer>[1];

const emptyState: State = { toasts: [] };

// Build an action with a loose payload (ToasterToast type is intentionally not exported).
const action = (type: string, extra: Record<string, unknown> = {}): Action =>
  ({ type, ...extra } as unknown as Action);

const toastItem = (id: string) => ({ id, open: true });

describe('useToast reducer', () => {
  it('adds a toast to an empty state', () => {
    const next = reducer(emptyState, action('ADD_TOAST', { toast: toastItem('1') }));
    expect(next.toasts).toEqual([expect.objectContaining({ id: '1', open: true })]);
  });

  it('keeps only the most recent toast within the limit', () => {
    const first = reducer(emptyState, action('ADD_TOAST', { toast: toastItem('1') }));
    const second = reducer(first, action('ADD_TOAST', { toast: toastItem('2') }));
    expect(second.toasts.map((t) => t.id)).toEqual(['2']);
  });

  it('updates an existing toast', () => {
    const state = reducer(emptyState, action('ADD_TOAST', { toast: toastItem('1') }));
    const next = reducer(state, action('UPDATE_TOAST', { toast: { id: '1', description: 'updated' } }));
    expect(next.toasts[0]).toMatchObject({ id: '1', description: 'updated' });
  });

  it('dismisses a specific toast', () => {
    const state = reducer(emptyState, action('ADD_TOAST', { toast: toastItem('1') }));
    const next = reducer(state, action('DISMISS_TOAST', { toastId: '1' }));
    expect(next.toasts[0].open).toBe(false);
  });

  it('dismisses all toasts when no id is given', () => {
    let state = reducer(emptyState, action('ADD_TOAST', { toast: toastItem('1') }));
    state = reducer(state, action('ADD_TOAST', { toast: toastItem('2') }));
    const next = reducer(state, action('DISMISS_TOAST'));
    expect(next.toasts.every((t) => t.open === false)).toBe(true);
  });

  it('removes a specific toast', () => {
    const state = reducer(emptyState, action('ADD_TOAST', { toast: toastItem('1') }));
    const next = reducer(state, action('REMOVE_TOAST', { toastId: '1' }));
    expect(next.toasts).toEqual([]);
  });

  it('removes all toasts without an id', () => {
    let state = reducer(emptyState, action('ADD_TOAST', { toast: toastItem('1') }));
    state = reducer(state, action('ADD_TOAST', { toast: toastItem('2') }));
    const next = reducer(state, action('REMOVE_TOAST'));
    expect(next.toasts).toEqual([]);
  });
});