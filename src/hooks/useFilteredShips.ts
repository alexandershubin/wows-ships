import { useMemo, useSyncExternalStore } from 'react';
import { useAppSelector } from './useAppDispatch';
import { getStreamVehicles, subscribeStream, getStreamSnapshot } from '../store/vehicleStream';
import { filterVehicles } from '../utils/filters';
import type { Vehicle } from '../types';

export function useFilteredShips(): Vehicle[] {
  const streamVersion = useSyncExternalStore(subscribeStream, getStreamSnapshot);

  const reduxVehicles = useAppSelector((item) => item.data.vehicles);
  const vehiclesStatus = useAppSelector((item) => item.data.vehiclesStatus);
  const search = useAppSelector((item) => item.filters.search);
  const nations = useAppSelector((item) => item.filters.nations);
  const types = useAppSelector((item) => item.filters.types);
  const levels = useAppSelector((item) => item.filters.levels);

  const source: Vehicle[] = vehiclesStatus !== 'succeeded'
    ? getStreamVehicles()
    : Object.values(reduxVehicles);

  return useMemo(
    () => filterVehicles(source, search, nations, types, levels),
    // streamVersion forces recomputation when the mutable stream store changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [source, search, nations, types, levels, streamVersion],
  );
}
