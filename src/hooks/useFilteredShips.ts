import { useMemo, useSyncExternalStore } from 'react';
import { useAppSelector } from './useAppDispatch';
import { getStreamVehicles, subscribeStream, getStreamSnapshot } from '../store/vehicleStream';
import { getShipType } from '../utils';
import type { Vehicle } from '../types';

/**
 * Returns the filtered + sorted ship list.
 *
 * While vehiclesStatus is 'loading', reads from the external mutable stream
 * store (zero Redux/Immer overhead). Once 'succeeded', reads from Redux.
 *
 * The stream store version counter triggers re-renders at a throttled rate
 * (~200 ms), so even 400+ chunks produce only a handful of React updates.
 */
export function useFilteredShips(): Vehicle[] {
  // Subscribe to the stream store — the version counter drives re-renders
  const streamVersion = useSyncExternalStore(subscribeStream, getStreamSnapshot);

  const reduxVehicles = useAppSelector((s) => s.data.vehicles);
  const vehiclesStatus = useAppSelector((s) => s.data.vehiclesStatus);
  const search = useAppSelector((s) => s.filters.search);
  const nations = useAppSelector((s) => s.filters.nations);
  const types = useAppSelector((s) => s.filters.types);
  const levels = useAppSelector((s) => s.filters.levels);

  const source: Vehicle[] = vehiclesStatus !== 'succeeded'
    ? getStreamVehicles()
    : Object.values(reduxVehicles);

  return useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    const filtered = source.filter((ship) => {
      if (searchLower) {
        const name = (ship.localization.shortmark?.en ?? ship.name).toLowerCase();
        if (!name.includes(searchLower)) return false;
      }
      if (nations.length > 0 && !nations.includes(ship.nation)) return false;
      if (types.length > 0 && !types.includes(getShipType(ship.tags))) return false;
      if (levels.length > 0 && !levels.includes(ship.level)) return false;
      return true;
    });

    return filtered;
    // streamVersion forces recomputation when the mutable store changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, search, nations, types, levels, streamVersion]);
}
