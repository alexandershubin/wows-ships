import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ShipModal from '../components/ShipModal/ShipModal';
import dataReducer from '../store/dataSlice';
import filtersReducer from '../store/filtersSlice';
import type { Vehicle } from '../types';

const mockShip: Vehicle = {
  id: '1',
  level: 8,
  name: 'PJSB009_Amagi',
  nation: 'japan',
  icons: { small: '', medium: '', large: '', default: '', contour: '', contour_alive: '', contour_dead: '' },
  tags: ['Battleship'],
  localization: {
    shortmark: { en: 'Amagi' },
    description: { en: 'A powerful Japanese battlecruiser.' },
  },
};

const mockNations = [
  {
    name: 'japan',
    icons: { large: '', small: '', tiny: '', default: '' },
    color: 0,
    tags: ['inTree'],
    localization: { mark: { en: 'Japan' } },
  },
];

const mockVehicleTypes = {
  Battleship: {
    icons: { default: '', elite: '', premium: '', special: '', normal: '' },
    sort_order: 2,
    localization: { mark: { en: 'Battleship' }, shortmark: {} },
  },
};

function renderModal(onClose = vi.fn()) {
  const store = configureStore({
    reducer: { data: dataReducer, filters: filtersReducer },
    preloadedState: {
      data: {
        vehicles: {},
        nations: mockNations,
        vehicleTypes: mockVehicleTypes,
        mediaPath: '',
        metaStatus: 'succeeded' as const,
        vehiclesStatus: 'succeeded' as const,
        vehiclesProgress: 1,
        metaError: null,
        vehiclesError: null,
      },
    },
  });
  return {
    onClose,
    ...render(
      <Provider store={store}>
        <ShipModal ship={mockShip} onClose={onClose} />
      </Provider>
    ),
  };
}

describe('ShipModal', () => {
  it('renders ship name', () => {
    renderModal();
    expect(screen.getByRole('heading', { name: 'Amagi' })).toBeInTheDocument();
  });

  it('renders tier as Roman numeral', () => {
    renderModal();
    expect(screen.getByText('VIII')).toBeInTheDocument();
  });

  it('renders nation name', () => {
    renderModal();
    expect(screen.getByText('Japan')).toBeInTheDocument();
  });

  it('renders ship type', () => {
    renderModal();
    expect(screen.getByText('Battleship')).toBeInTheDocument();
  });

  it('renders description', () => {
    renderModal();
    expect(screen.getByText('A powerful Japanese battlecruiser.')).toBeInTheDocument();
  });

  it('has dialog role on panel', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('dialog is labelled by ship name', () => {
    renderModal();
    const dialog = screen.getByRole('dialog');
    const labelId = dialog.getAttribute('aria-labelledby');
    expect(labelId).toBe('ship-modal-name');
    expect(document.getElementById(labelId!)).toHaveTextContent('Amagi');
  });

  it('calls onClose when close button is clicked', () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop is clicked', () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose when panel is clicked', () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Escape key', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });
});
