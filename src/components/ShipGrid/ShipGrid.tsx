import { useCallback, useEffect, useRef, useState, lazy, Suspense, type UIEvent } from 'react';
import type { Vehicle } from '../../types';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { useFilteredShips } from '../../hooks/useFilteredShips';
import { useContainerSize } from '../../hooks/useContainerSize';
import { useVirtualGrid } from '../../hooks/useVirtualGrid';
import ShipCard from '../ShipCard/ShipCard';
import SkeletonCard from '../ShipCard/SkeletonCard';
import styles from './ShipGrid.module.css';

const ShipModal = lazy(() => import('../ShipModal/ShipModal'));

const CARD_MIN_WIDTH = 210;
const CARD_HEIGHT = 250;
const GAP = 12;

export default function ShipGrid() {
  const ships = useFilteredShips();
  const vehiclesStatus = useAppSelector((status) => status.data.vehiclesStatus);
  const [selectedShip, setSelectedShip] = useState<Vehicle | null>(null);
  const handleSelectShip = useCallback((ship: Vehicle) => setSelectedShip(ship), []);
  const handleCloseModal = useCallback(() => setSelectedShip(null), []);
  const [scrollTop, setScrollTop] = useState(0);
  const scrollTopRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const [containerRef, { width: containerWidth, height: containerHeight }] =
    useContainerSize<HTMLDivElement>();

  const columns = Math.max(1, Math.floor((containerWidth + GAP) / (CARD_MIN_WIDTH + GAP)));
  const isLoading = vehiclesStatus === 'loading';
  const skeletonCount = isLoading ? columns : 0;

  const { startIndex, endIndex, totalHeight, offsetY } = useVirtualGrid({
    itemCount: ships.length + skeletonCount,
    columns,
    rowHeight: CARD_HEIGHT,
    gap: GAP,
    containerHeight,
    scrollTop,
    overscan: 3,
  });

  const onScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    scrollTopRef.current = e.currentTarget.scrollTop;
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        setScrollTop(scrollTopRef.current);
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const cardWidth = columns > 1 ? `calc((100% - ${GAP * (columns - 1)}px) / ${columns})` : '100%';

  if (ships.length === 0 && !isLoading) {
    return (
      <div className={styles.empty}>
        <p>No ships match your filters.</p>
        <p className={styles.emptyHint}>Try adjusting search or filter criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className={styles.scroller} onScroll={onScroll}>
        <div className={styles.inner} style={{ height: totalHeight }}>
          <div
            className={styles.grid}
            style={{
              transform: `translateY(${offsetY}px)`,
              gridTemplateColumns: `repeat(${columns}, ${cardWidth})`,
              gridAutoRows: CARD_HEIGHT,
              gap: GAP,
            }}
          >
            {Array.from({ length: endIndex - startIndex }, (_, i) => {
              const idx = startIndex + i;
              if (idx < ships.length) {
                const ship = ships[idx];
                return <ShipCard key={ship.id} ship={ship} onClick={handleSelectShip} />;
              }
              return <SkeletonCard key={`skeleton-${idx}`} />;
            })}
          </div>
        </div>
      </div>

      {selectedShip && (
        <Suspense fallback={null}>
          <ShipModal ship={selectedShip} onClose={handleCloseModal} />
        </Suspense>
      )}
    </>
  );
}
