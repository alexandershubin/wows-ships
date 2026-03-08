import { describe, expect, it } from 'vitest';
import { selectFilteredShips } from '../store/selectors';
import type { RootState } from '../store';
import type { Vehicle } from '../types';

function makeShip(id: string, overrides: Partial<Omit<Vehicle, 'id'>> = {}): Vehicle {
  return {
    id,
    level: 10,
    name: `SHIP_${id}`,
    nation: 'japan',
    icons: {} as Vehicle['icons'],
    tags: ['Battleship'],
    localization: {
      shortmark: { en: id },
      description: { en: '' },
    },
    ...overrides,
  };
}

function makeState(
  vehicles: Record<string, Vehicle>,
  filters: Partial<RootState['filters']> = {}
): RootState {
  return {
    data: {
      vehicles,
      nations: [],
      vehicleTypes: {},
      mediaPath: '',
      metaStatus: 'succeeded',
      vehiclesStatus: 'succeeded',
      vehiclesProgress: 1,
      metaError: null,
      vehiclesError: null,
    },
    filters: {
      search: '',
      nations: [],
      types: [],
      levels: [],
      ...filters,
    },
  };
}

describe('selectFilteredShips', () => {
  const ships = {
    '1': makeShip('Yamato', { nation: 'japan', level: 10, tags: ['Battleship'] }),
    '2': makeShip('Iowa', { nation: 'usa', level: 9, tags: ['Battleship'] }),
    '3': makeShip('Shimakaze', { nation: 'japan', level: 10, tags: ['Destroyer'] }),
  };

  it('returns all ships with no filters', () => {
    const result = selectFilteredShips(makeState(ships));
    expect(result).toHaveLength(3);
  });

  it('filters by search (case-insensitive)', () => {
    const result = selectFilteredShips(makeState(ships, { search: 'yam' }));
    expect(result).toHaveLength(1);
    expect(result[0].localization.shortmark.en).toBe('Yamato');
  });

  it('filters by nation', () => {
    const result = selectFilteredShips(makeState(ships, { nations: ['usa'] }));
    expect(result).toHaveLength(1);
    expect(result[0].nation).toBe('usa');
  });

  it('filters by ship type', () => {
    const result = selectFilteredShips(makeState(ships, { types: ['Destroyer'] }));
    expect(result).toHaveLength(1);
    expect(result[0].localization.shortmark.en).toBe('Shimakaze');
  });

  it('filters by level', () => {
    const result = selectFilteredShips(makeState(ships, { levels: [9] }));
    expect(result).toHaveLength(1);
    expect(result[0].level).toBe(9);
  });

  it('combines multiple filters', () => {
    const result = selectFilteredShips(
      makeState(ships, { nations: ['japan'], types: ['Destroyer'] })
    );
    expect(result).toHaveLength(1);
    expect(result[0].localization.shortmark.en).toBe('Shimakaze');
  });

  it('returns empty array when nothing matches', () => {
    const result = selectFilteredShips(makeState(ships, { search: 'XYZ_NO_MATCH' }));
    expect(result).toHaveLength(0);
  });
});
