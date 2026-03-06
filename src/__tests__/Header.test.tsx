import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Header from '../components/Header/Header';
import dataReducer from '../store/dataSlice';
import filtersReducer from '../store/filtersSlice';

function makeStore(search = '') {
  return configureStore({
    reducer: { data: dataReducer, filters: filtersReducer },
    preloadedState: {
      data: {
        vehicles: {},
        nations: [],
        vehicleTypes: {},
        mediaPath: '',
        metaStatus: 'succeeded' as const,
        vehiclesStatus: 'succeeded' as const,
        vehiclesProgress: 1,
        metaError: null,
        vehiclesError: null,
      },
      filters: { search, nations: [], types: [], levels: [] },
    },
  });
}

function renderHeader(props: { sidebarOpen?: boolean; onToggleSidebar?: () => void; search?: string } = {}) {
  const { sidebarOpen = false, onToggleSidebar = () => {}, search = '' } = props;
  const store = makeStore(search);
  return render(
    <Provider store={store}>
      <Header onToggleSidebar={onToggleSidebar} sidebarOpen={sidebarOpen} />
    </Provider>
  );
}

describe('Header', () => {
  it('renders logo text', () => {
    renderHeader();
    expect(screen.getByText('World of Warships')).toBeInTheDocument();
    expect(screen.getByText('Ship Encyclopedia')).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderHeader();
    expect(screen.getByRole('searchbox', { name: 'Search ships' })).toBeInTheDocument();
  });

  it('calls onToggleSidebar when menu button clicked', () => {
    const onToggleSidebar = vi.fn();
    renderHeader({ onToggleSidebar });
    fireEvent.click(screen.getByRole('button', { name: 'Show filters' }));
    expect(onToggleSidebar).toHaveBeenCalledOnce();
  });

  it('shows aria-label "Hide filters" when sidebar is open', () => {
    renderHeader({ sidebarOpen: true });
    expect(screen.getByRole('button', { name: 'Hide filters' })).toBeInTheDocument();
  });

  it('sets aria-expanded="true" when sidebar is open', () => {
    renderHeader({ sidebarOpen: true });
    expect(screen.getByRole('button', { name: 'Hide filters' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-expanded="false" when sidebar is closed', () => {
    renderHeader({ sidebarOpen: false });
    expect(screen.getByRole('button', { name: 'Show filters' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows clear search button when initial search is set', () => {
    renderHeader({ search: 'Yamato' });
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('does not show clear search button when search is empty', () => {
    renderHeader({ search: '' });
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('populates search input with current store value', () => {
    renderHeader({ search: 'Iowa' });
    expect(screen.getByRole('searchbox')).toHaveValue('Iowa');
  });

  it('updates search input value on change', () => {
    renderHeader();
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'Yamato' } });
    expect(input).toHaveValue('Yamato');
  });
});
