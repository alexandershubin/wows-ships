import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { getShipType } from '../utils';

export const selectTotalShipCount = (state: RootState) =>
  Object.keys(state.data.vehicles).length;

const selectVehicles = (state: RootState) => state.data.vehicles;
const selectSearch = (state: RootState) => state.filters.search;
const selectNations = (state: RootState) => state.filters.nations;
const selectTypes = (state: RootState) => state.filters.types;
const selectLevels = (state: RootState) => state.filters.levels;

export const selectFilteredShips = createSelector(
  [selectVehicles, selectSearch, selectNations, selectTypes, selectLevels],
  (vehicles, search, nations, types, levels) => {
    const searchLower = search.trim().toLowerCase();

    return Object.values(vehicles)
      .filter((ship) => {
        if (searchLower) {
          const name = (ship.localization.shortmark?.en ?? ship.name).toLowerCase();
          if (!name.includes(searchLower)) return false;
        }
        if (nations.length > 0 && !nations.includes(ship.nation)) return false;
        if (types.length > 0 && !types.includes(getShipType(ship.tags))) return false;
        if (levels.length > 0 && !levels.includes(ship.level)) return false;
        return true;
      });
  }
);
