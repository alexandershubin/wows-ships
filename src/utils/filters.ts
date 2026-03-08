import type { Vehicle } from '../types';
import { getShipType } from './helpers';

export function filterVehicles(
  vehicles: Vehicle[],
  search: string,
  nations: string[],
  types: string[],
  levels: number[],
): Vehicle[] {
  const searchLower = search.trim().toLowerCase();

  return vehicles.filter((ship) => {
    if (searchLower) {
      const name = (ship.localization.shortmark?.en ?? ship.name).toLowerCase();
      if (!name.includes(searchLower)) return false;
    }
    if (nations.length > 0 && !nations.includes(ship.nation)) return false;
    if (types.length > 0 && !types.includes(getShipType(ship.tags))) return false;
    if (levels.length > 0 && !levels.includes(ship.level)) return false;
    return true;
  });
}
