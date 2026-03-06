import { useMemo } from 'react';

interface VirtualGridOptions {
  itemCount: number;
  columns: number;
  rowHeight: number;
  gap: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
}

export function useVirtualGrid({
  itemCount,
  columns,
  rowHeight,
  gap,
  containerHeight,
  scrollTop,
  overscan = 2,
}: VirtualGridOptions) {
  return useMemo(() => {
    if (itemCount === 0 || columns === 0) {
      return { startIndex: 0, endIndex: 0, totalHeight: 0, offsetY: 0 };
    }

    const rowCount = Math.ceil(itemCount / columns);
    const rowStep = rowHeight + gap;
    const totalHeight = rowCount * rowStep - gap;

    const firstRow = Math.max(0, Math.floor(scrollTop / rowStep) - overscan);
    const visibleRows = Math.ceil(containerHeight / rowStep) + 2 * overscan;
    const lastRow = Math.min(rowCount - 1, firstRow + visibleRows);

    const startIndex = firstRow * columns;
    const endIndex = Math.min(itemCount, (lastRow + 1) * columns);
    const offsetY = firstRow * rowStep;

    return { startIndex, endIndex, totalHeight, offsetY };
  }, [itemCount, columns, rowHeight, gap, containerHeight, scrollTop, overscan]);
}
