import { describe, expect, it } from 'vitest';
import { getShipType, isPremium, isSpecial, toRoman } from '../utils/helpers';

describe('toRoman', () => {
  it('converts tiers 1-10 to Roman numerals', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(5)).toBe('V');
    expect(toRoman(10)).toBe('X');
  });

  it('converts tier 11 to star symbol', () => {
    expect(toRoman(11)).toBe('★');
  });

  it('falls back to string for unknown tiers', () => {
    expect(toRoman(0)).toBe('0');
    expect(toRoman(12)).toBe('12');
  });
});

describe('getShipType', () => {
  it('extracts known ship types from tags', () => {
    expect(getShipType(['Destroyer', 'premium'])).toBe('Destroyer');
    expect(getShipType(['Cruiser', 'elite'])).toBe('Cruiser');
    expect(getShipType(['Battleship'])).toBe('Battleship');
    expect(getShipType(['AirCarrier', 'special'])).toBe('AirCarrier');
    expect(getShipType(['Submarine'])).toBe('Submarine');
  });

  it('returns Unknown for tags with no known ship type', () => {
    expect(getShipType(['premium', 'sellable'])).toBe('Unknown');
    expect(getShipType([])).toBe('Unknown');
  });
});

describe('isPremium', () => {
  it('returns true for premium and uiPremium tags', () => {
    expect(isPremium(['premium'])).toBe(true);
    expect(isPremium(['uiPremium'])).toBe(true);
    expect(isPremium(['Destroyer', 'uiPremium'])).toBe(true);
  });

  it('returns false when no premium tag', () => {
    expect(isPremium(['Destroyer', 'sellable'])).toBe(false);
    expect(isPremium([])).toBe(false);
  });
});

describe('isSpecial', () => {
  it('returns true for special tag', () => {
    expect(isSpecial(['special'])).toBe(true);
    expect(isSpecial(['Destroyer', 'special'])).toBe(true);
  });

  it('returns false when no special tag', () => {
    expect(isSpecial(['premium'])).toBe(false);
    expect(isSpecial([])).toBe(false);
  });
});
