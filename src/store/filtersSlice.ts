import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  search: string;
  nations: string[];
  types: string[];
  levels: number[];
}

const initialState: FiltersState = {
  search: '',
  nations: [],
  types: [],
  levels: [],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    toggleNation(state, action: PayloadAction<string>) {
      const idx = state.nations.indexOf(action.payload);
      if (idx === -1) state.nations.push(action.payload);
      else state.nations.splice(idx, 1);
    },
    toggleType(state, action: PayloadAction<string>) {
      const idx = state.types.indexOf(action.payload);
      if (idx === -1) state.types.push(action.payload);
      else state.types.splice(idx, 1);
    },
    toggleLevel(state, action: PayloadAction<number>) {
      const idx = state.levels.indexOf(action.payload);
      if (idx === -1) state.levels.push(action.payload);
      else state.levels.splice(idx, 1);
    },
    clearFilters() {
      return initialState;
    },
  },
});

export const { setSearch, toggleNation, toggleType, toggleLevel, clearFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
