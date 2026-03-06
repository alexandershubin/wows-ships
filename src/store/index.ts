import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import filtersReducer from './filtersSlice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
