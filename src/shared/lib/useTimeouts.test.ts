import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTimeouts } from './useTimeouts';

describe('useTimeouts', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('runs the callback once the delay elapses', () => {
    const { result } = renderHook(() => useTimeouts());
    const callback = vi.fn();

    act(() => {
      result.current.setSafeTimeout(callback, 2000);
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  // This is the point of the hook: a snackbar auto-close scheduled just before the
  // user navigates away must not fire on an unmounted component.
  it('cancels pending timeouts when the component unmounts', () => {
    const { result, unmount } = renderHook(() => useTimeouts());
    const callback = vi.fn();

    act(() => {
      result.current.setSafeTimeout(callback, 2000);
    });
    unmount();

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it('keeps several pending timeouts independent', () => {
    const { result } = renderHook(() => useTimeouts());
    const first = vi.fn();
    const second = vi.fn();

    act(() => {
      result.current.setSafeTimeout(first, 1000);
      result.current.setSafeTimeout(second, 3000);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('keeps the same setSafeTimeout reference across renders so effects do not re-run', () => {
    const { result, rerender } = renderHook(() => useTimeouts());
    const first = result.current.setSafeTimeout;

    rerender();

    expect(result.current.setSafeTimeout).toBe(first);
  });
});
