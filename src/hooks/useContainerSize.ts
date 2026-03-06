import { useCallback, useLayoutEffect, useRef, useState, type RefCallback } from 'react';

interface Size {
  width: number;
  height: number;
}

export function useContainerSize<T extends HTMLElement>(): [
  RefCallback<T>,
  Size,
] {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(node);
    observerRef.current = observer;
    setSize({ width: node.clientWidth, height: node.clientHeight });
  }, []);

  useLayoutEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return [ref, size];
}
