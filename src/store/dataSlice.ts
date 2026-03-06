import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchMeta, fetchVehicles } from '../api';
import { addStreamEntries, resetStream } from './vehicleStream';
import type { Nation, Vehicle, VehicleType, LoadStatus } from '../types';

interface DataState {
  vehicles: Record<string, Vehicle>;
  nations: Nation[];
  vehicleTypes: Record<string, VehicleType>;
  mediaPath: string;
  metaStatus: LoadStatus;
  vehiclesStatus: LoadStatus;
  vehiclesProgress: number;
  metaError: string | null;
  vehiclesError: string | null;
}

type ThunkConfig = {
  state: { data: DataState };
  rejectValue: string;
};

const initialState: DataState = {
  vehicles: {},
  nations: [],
  vehicleTypes: {},
  mediaPath: '',
  metaStatus: 'idle',
  vehiclesStatus: 'idle',
  vehiclesProgress: 0,
  metaError: null,
  vehiclesError: null,
};

export const loadMeta = createAsyncThunk<
  Awaited<ReturnType<typeof fetchMeta>>,
  void,
  ThunkConfig
>(
  'data/loadMeta',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMeta();
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Failed to load metadata');
    }
  },
  {
    condition: (_, { getState }) => {
      const { metaStatus } = getState().data;
      return metaStatus === 'idle' || metaStatus === 'failed';
    },
  }
);

export const loadVehicles = createAsyncThunk<
  Record<string, Vehicle>,
  void,
  ThunkConfig
>(
  'data/loadVehicles',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      resetStream();
      return await fetchVehicles(
        (progress) => { dispatch(setVehiclesProgress(progress)); },
        (entries) => { addStreamEntries(entries); },
      );
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Failed to load ships');
    }
  },
  {
    condition: (_, { getState }) => {
      const { vehiclesStatus } = getState().data;
      return vehiclesStatus === 'idle' || vehiclesStatus === 'failed';
    },
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setVehiclesProgress(state, action: PayloadAction<number>) {
      state.vehiclesProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMeta.pending, (state) => {
        state.metaStatus = 'loading';
        state.metaError = null;
      })
      .addCase(loadMeta.fulfilled, (state, action) => {
        state.metaStatus = 'succeeded';
        state.nations = action.payload.nations;
        state.vehicleTypes = action.payload.vehicleTypes;
        state.mediaPath = action.payload.mediaPath;
      })
      .addCase(loadMeta.rejected, (state, action) => {
        state.metaStatus = 'failed';
        state.metaError = action.payload ?? action.error.message ?? 'Failed to load metadata';
      })
      .addCase(loadVehicles.pending, (state) => {
        state.vehiclesStatus = 'loading';
        state.vehiclesProgress = 0;
        state.vehiclesError = null;
      })
      .addCase(loadVehicles.fulfilled, (state, action) => {
        state.vehiclesStatus = 'succeeded';
        state.vehiclesProgress = 1;
        state.vehicles = action.payload;
      })
      .addCase(loadVehicles.rejected, (state, action) => {
        state.vehiclesStatus = 'failed';
        state.vehiclesError = action.payload ?? action.error.message ?? 'Failed to load ships';
      });
  },
});

export const { setVehiclesProgress } = dataSlice.actions;
export default dataSlice.reducer;
