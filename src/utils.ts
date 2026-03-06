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
  const types = ['Destroyer', 'Cruiser', 'Battleship', 'AirCarrier', 'Submarine'];
  return tags.find((t) => types.includes(t)) ?? 'Unknown';
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

export function hideImageOnError(e: React.SyntheticEvent<HTMLImageElement>): void {
  e.currentTarget.style.display = 'none';
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
