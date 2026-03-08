import { describe, expect, it } from 'vitest';
import { filterVehicles } from '../utils/filters';
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

const ships: Vehicle[] = [
  makeShip('Yamato', { nation: 'japan', level: 10, tags: ['Battleship'] }),
  makeShip('Iowa', { nation: 'usa', level: 9, tags: ['Battleship'] }),
  makeShip('Shimakaze', { nation: 'japan', level: 10, tags: ['Destroyer'] }),
  makeShip('Midway', { nation: 'usa', level: 10, tags: ['AirCarrier'] }),
];

describe('filterVehicles', () => {
  it('returns all ships when no filters applied', () => {
    expect(filterVehicles(ships, '', [], [], [])).toHaveLength(4);
  });

  it('filters by search (case-insensitive)', () => {
    const result = filterVehicles(ships, 'yam', [], [], []);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('Yamato');
  });

  it('filters by search with whitespace', () => {
    const result = filterVehicles(ships, '  iowa  ', [], [], []);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('Iowa');
  });

  it('filters by nation', () => {
    const result = filterVehicles(ships, '', ['usa'], [], []);
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.nation === 'usa')).toBe(true);
  });

  it('filters by multiple nations', () => {
    const result = filterVehicles(ships, '', ['japan', 'usa'], [], []);
    expect(result).toHaveLength(4);
  });

  it('filters by type', () => {
    const result = filterVehicles(ships, '', [], ['Destroyer'], []);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('Shimakaze');
  });

  it('filters by level', () => {
    const result = filterVehicles(ships, '', [], [], [9]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('Iowa');
  });

  it('combines all filters with AND logic', () => {
    const result = filterVehicles(ships, 'mid', ['usa'], ['AirCarrier'], [10]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('Midway');
  });

  it('returns empty when nothing matches', () => {
    expect(filterVehicles(ships, 'NOPE', [], [], [])).toHaveLength(0);
  });

  it('falls back to ship.name when shortmark missing', () => {
    const noLocale = makeShip('TestShip', {
      name: 'MyShipName',
      localization: { shortmark: {}, description: {} },
    });
    const result = filterVehicles([noLocale], 'myship', [], [], []);
    expect(result).toHaveLength(1);
  });

  it('handles empty vehicles array', () => {
    expect(filterVehicles([], 'test', ['us'], ['BB'], [10])).toHaveLength(0);
  });
});
