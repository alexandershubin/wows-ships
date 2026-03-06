import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import FilterPanel from '../components/FilterPanel/FilterPanel';
import dataReducer from '../store/dataSlice';
import filtersReducer from '../store/filtersSlice';
import type { Vehicle } from '../types';

const mockNations = [
  {
    name: 'japan',
    icons: { large: '', small: '', tiny: '', default: '' },
    color: 0,
    tags: ['inTree'],
    localization: { mark: { en: 'Japan' } },
  },
  {
    name: 'usa',
    icons: { large: '', small: '', tiny: '', default: '' },
    color: 0,
    tags: ['inTree'],
    localization: { mark: { en: 'USA' } },
  },
  {
    name: 'commonwealth',
    icons: { large: '', small: '', tiny: '', default: '' },
    color: 0,
    tags: [],
    localization: { mark: { en: 'Commonwealth' } },
  },
];

const mockVehicleTypes = {
  Battleship: {
    icons: { default: '', elite: '', premium: '', special: '', normal: '' },
    sort_order: 2,
    localization: { mark: { en: 'Battleship' }, shortmark: {} },
  },
  Destroyer: {
    icons: { default: '', elite: '', premium: '', special: '', normal: '' },
    sort_order: 0,
    localization: { mark: { en: 'Destroyer' }, shortmark: {} },
  },
};

const mockVehicle: Vehicle = {
  id: '1',
  level: 10,
  name: 'Yamato',
  nation: 'japan',
  icons: { small: '', medium: '', large: '', default: '', contour: '', contour_alive: '', contour_dead: '' },
  tags: ['Battleship'],
  localization: { shortmark: { en: 'Yamato' }, description: { en: '' } },
};

function makeStore(activeFilters: { nations?: string[]; types?: string[]; levels?: number[] } = {}) {
  return configureStore({
    reducer: { data: dataReducer, filters: filtersReducer },
    preloadedState: {
      data: {
        vehicles: { '1': mockVehicle },
        nations: mockNations,
        vehicleTypes: mockVehicleTypes,
        mediaPath: '',
        metaStatus: 'succeeded' as const,
        vehiclesStatus: 'succeeded' as const,
        vehiclesProgress: 1,
        metaError: null,
        vehiclesError: null,
      },
      filters: {
        search: '',
        nations: activeFilters.nations ?? [],
        types: activeFilters.types ?? [],
        levels: activeFilters.levels ?? [],
      },
    },
  });
}

function renderPanel(activeFilters = {}) {
  const store = makeStore(activeFilters);
  return render(
    <Provider store={store}>
      <FilterPanel />
    </Provider>
  );
}

describe('FilterPanel', () => {
  it('renders only inTree nations', () => {
    renderPanel();
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.queryByText('Commonwealth')).not.toBeInTheDocument();
  });

  it('renders all ship types', () => {
    renderPanel();
    expect(screen.getByText('Battleship')).toBeInTheDocument();
    expect(screen.getByText('Destroyer')).toBeInTheDocument();
  });

  it('renders tier I through ★', () => {
    renderPanel();
    expect(screen.getByRole('button', { name: 'Tier 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tier 10' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tier 11' })).toBeInTheDocument();
  });

  it('shows total ship count', () => {
    renderPanel();
    expect(screen.getByText('1 ships')).toBeInTheDocument();
  });

  it('does not show clear button when no filters active', () => {
    renderPanel();
    expect(screen.queryByRole('button', { name: 'Clear all filters' })).not.toBeInTheDocument();
  });

  it('shows clear button when nation filter is active', () => {
    renderPanel({ nations: ['japan'] });
    expect(screen.getByRole('button', { name: 'Clear all filters' })).toBeInTheDocument();
  });

  it('shows clear button when type filter is active', () => {
    renderPanel({ types: ['Battleship'] });
    expect(screen.getByRole('button', { name: 'Clear all filters' })).toBeInTheDocument();
  });

  it('shows clear button when level filter is active', () => {
    renderPanel({ levels: [10] });
    expect(screen.getByRole('button', { name: 'Clear all filters' })).toBeInTheDocument();
  });

  it('nation buttons have aria-pressed', () => {
    renderPanel({ nations: ['japan'] });
    const japanBtn = screen.getByTitle('Japan');
    expect(japanBtn).toHaveAttribute('aria-pressed', 'true');
    const usaBtn = screen.getByTitle('USA');
    expect(usaBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('dispatches toggleNation on nation button click', () => {
    const store = makeStore();
    render(<Provider store={store}><FilterPanel /></Provider>);
    fireEvent.click(screen.getByTitle('Japan'));
    expect(store.getState().filters.nations).toContain('japan');
  });
});
