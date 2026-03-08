import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import type { ReactElement } from 'react';
import ShipCard from '../components/ShipCard/ShipCard';
import dataReducer from '../store/dataSlice';
import filtersReducer from '../store/filtersSlice';
import type { Vehicle } from '../types';

const mockShip: Vehicle = {
  id: '123',
  level: 10,
  name: 'PJSB110_Yamato',
  nation: 'japan',
  icons: {
    small: '',
    medium: '',
    large: '',
    default: '',
    contour: '',
    contour_alive: '',
    contour_dead: '',
  },
  tags: ['Battleship'],
  localization: {
    shortmark: { en: 'Yamato' },
    description: { en: 'The mighty Yamato' },
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

const noop = () => {};

function renderWithStore(ui: ReactElement) {
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
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('ShipCard', () => {
  it('renders ship name', () => {
    renderWithStore(<ShipCard ship={mockShip} onClick={noop} />);
    expect(screen.getByText('Yamato')).toBeInTheDocument();
  });

  it('renders tier as Roman numeral', () => {
    renderWithStore(<ShipCard ship={mockShip} onClick={noop} />);
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('renders nation name', () => {
    renderWithStore(<ShipCard ship={mockShip} onClick={noop} />);
    expect(screen.getByText('Japan')).toBeInTheDocument();
  });

  it('renders ship type', () => {
    renderWithStore(<ShipCard ship={mockShip} onClick={noop} />);
    expect(screen.getByText('Battleship')).toBeInTheDocument();
  });

  it('renders premium badge for premium ships', () => {
    const premiumShip = { ...mockShip, tags: ['Battleship', 'uiPremium'] };
    renderWithStore(<ShipCard ship={premiumShip} onClick={noop} />);
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('renders special badge for special ships', () => {
    const specialShip = { ...mockShip, tags: ['Battleship', 'special'] };
    renderWithStore(<ShipCard ship={specialShip} onClick={noop} />);
    expect(screen.getByText('Special')).toBeInTheDocument();
  });

  it('renders star for tier 11 ships', () => {
    const tier11Ship = { ...mockShip, level: 11 };
    renderWithStore(<ShipCard ship={tier11Ship} onClick={noop} />);
    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('has accessible role via data-testid', () => {
    renderWithStore(<ShipCard ship={mockShip} onClick={noop} />);
    expect(screen.getByTestId('ship-card')).toBeInTheDocument();
  });
});
