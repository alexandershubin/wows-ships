import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { filterVehicles } from '../utils/filters';

export const selectTotalShipCount = (state: RootState) =>
  Object.keys(state.data.vehicles).length;

const selectVehicles = (state: RootState) => state.data.vehicles;
const selectSearch = (state: RootState) => state.filters.search;
const selectNations = (state: RootState) => state.filters.nations;
const selectTypes = (state: RootState) => state.filters.types;
const selectLevels = (state: RootState) => state.filters.levels;

export const selectFilteredShips = createSelector(
  [selectVehicles, selectSearch, selectNations, selectTypes, selectLevels],
  (vehicles, search, nations, types, levels) =>
    filterVehicles(Object.values(vehicles), search, nations, types, levels),
);
