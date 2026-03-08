import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useVirtualGrid } from '../hooks/useVirtualGrid';

describe('useVirtualGrid', () => {
  const defaults = {
    itemCount: 100,
    columns: 4,
    rowHeight: 250,
    gap: 12,
    containerHeight: 600,
    scrollTop: 0,
    overscan: 2,
  };

  it('returns zeros for empty list', () => {
    const { result } = renderHook(() =>
      useVirtualGrid({ ...defaults, itemCount: 0 }),
    );
    expect(result.current).toEqual({
      startIndex: 0,
      endIndex: 0,
      totalHeight: 0,
      offsetY: 0,
    });
  });

  it('returns zeros for zero columns', () => {
    const { result } = renderHook(() =>
      useVirtualGrid({ ...defaults, columns: 0 }),
    );
    expect(result.current).toEqual({
      startIndex: 0,
      endIndex: 0,
      totalHeight: 0,
      offsetY: 0,
    });
  });

  it('calculates correct totalHeight', () => {
    // 100 items / 4 columns = 25 rows
    // totalHeight = 25 * (250 + 12) - 12 = 6538
    const { result } = renderHook(() => useVirtualGrid(defaults));
    expect(result.current.totalHeight).toBe(25 * 262 - 12);
  });

  it('starts at index 0 when scrollTop is 0', () => {
    const { result } = renderHook(() => useVirtualGrid(defaults));
    expect(result.current.startIndex).toBe(0);
    expect(result.current.offsetY).toBe(0);
  });

  it('renders more items than visible (overscan)', () => {
    const { result } = renderHook(() =>
      useVirtualGrid({ ...defaults, overscan: 0 }),
    );
    // visible rows: ceil(600 / 262) = 3, no overscan
    // endIndex = min(100, (0 + 3) * 4) = 12 — but formula adds 2*overscan=0
    // lastRow = min(24, 0 + 3) = 3 → endIndex = (3+1)*4 = 16... let me just check
    const itemCount = result.current.endIndex - result.current.startIndex;

    const withOverscan = renderHook(() => useVirtualGrid(defaults));
    const itemCountWithOverscan =
      withOverscan.result.current.endIndex - withOverscan.result.current.startIndex;

    expect(itemCountWithOverscan).toBeGreaterThan(itemCount);
  });

  it('shifts startIndex when scrolled down', () => {
    // scroll past 3 rows: 3 * 262 = 786
    const { result } = renderHook(() =>
      useVirtualGrid({ ...defaults, scrollTop: 786 }),
    );
    // firstRow = max(0, floor(786/262) - 2) = max(0, 3 - 2) = 1
    expect(result.current.startIndex).toBe(1 * 4);
    expect(result.current.offsetY).toBe(1 * 262);
  });

  it('clamps endIndex to itemCount', () => {
    const { result } = renderHook(() =>
      useVirtualGrid({ ...defaults, itemCount: 6 }),
    );
    // 6 items / 4 cols = 2 rows, endIndex can't exceed 6
    expect(result.current.endIndex).toBe(6);
  });

  it('handles single item', () => {
    const { result } = renderHook(() =>
      useVirtualGrid({ ...defaults, itemCount: 1 }),
    );
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(1);
    expect(result.current.totalHeight).toBe(250);
  });

  it('handles single column', () => {
    const { result } = renderHook(() =>
      useVirtualGrid({ ...defaults, columns: 1, itemCount: 10 }),
    );
    // 10 rows, totalHeight = 10 * 262-12 = 2608
    expect(result.current.totalHeight).toBe(2608);
  });
});
