import { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react';
import type { Vehicle } from '../../types';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { useFilteredShips } from '../../hooks/useFilteredShips';
import { useContainerSize } from '../../hooks/useContainerSize';
import { useVirtualGrid } from '../../hooks/useVirtualGrid';
import ShipCard from '../ShipCard/ShipCard';
import styles from './ShipGrid.module.css';

const ShipModal = lazy(() => import('../ShipModal/ShipModal'));

const CARD_MIN_WIDTH = 210;
const CARD_HEIGHT = 250;
const GAP = 12;

export default function ShipGrid() {
  const ships = useFilteredShips();
  const [selectedShip, setSelectedShip] = useState<Vehicle | null>(null);
  const handleSelectShip = useCallback((ship: Vehicle) => setSelectedShip(ship), []);
  const handleCloseModal = useCallback(() => setSelectedShip(null), []);
  const [scrollTop, setScrollTop] = useState(0);
  const scrollTopRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const [containerRef, { width: containerWidth, height: containerHeight }] =
    useContainerSize<HTMLDivElement>();

  const columns = Math.max(1, Math.floor((containerWidth + GAP) / (CARD_MIN_WIDTH + GAP)));

  const { startIndex, endIndex, totalHeight, offsetY } = useVirtualGrid({
    itemCount: ships.length,
    columns,
    rowHeight: CARD_HEIGHT,
    gap: GAP,
    containerHeight,
    scrollTop,
    overscan: 3,
  });

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
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

  const visibleShips = ships.slice(startIndex, endIndex);
  const cardWidth = columns > 1 ? `calc((100% - ${GAP * (columns - 1)}px) / ${columns})` : '100%';

  const vehiclesStatus = useAppSelector((s) => s.data.vehiclesStatus);

  if (ships.length === 0) {
    return (
      <div className={styles.empty}>
        {vehiclesStatus === 'loading' ? (
          <p>Loading ships…</p>
        ) : (
          <>
            <p>No ships match your filters.</p>
            <p className={styles.emptyHint}>Try adjusting search or filter criteria.</p>
          </>
        )}
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
            {visibleShips.map((ship) => (
              <ShipCard
                key={ship.id}
                ship={ship}
                onClick={handleSelectShip}
              />
            ))}
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
