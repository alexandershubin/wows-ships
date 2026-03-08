import type { SyntheticEvent } from 'react';
import { SHIP_TYPES, type ShipTypeKey } from '../types';

export const ROMAN: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX',
  10: 'X',
  11: '★',
};

export function toRoman(tier: number): string {
  return ROMAN[tier] ?? String(tier);
}

export function getShipType(tags: string[]): string {
  return tags.find((t): t is ShipTypeKey => SHIP_TYPES.includes(t as ShipTypeKey)) ?? 'Unknown';
}

export function isPremium(tags: string[]): boolean {
  return tags.includes('premium') || tags.includes('uiPremium');
}

export function isSpecial(tags: string[]): boolean {
  return tags.includes('special');
}

export const SHIP_TYPE_COLORS: Record<string, string> = {
  Destroyer:  'var(--color-type-destroyer)',
  Cruiser:    'var(--color-type-cruiser)',
  Battleship: 'var(--color-type-battleship)',
  AirCarrier: 'var(--color-type-carrier)',
  Submarine:  'var(--color-type-submarine)',
};

export function hideImageOnError(e: SyntheticEvent<HTMLImageElement>): void {
  e.currentTarget.style.display = 'none';
}

