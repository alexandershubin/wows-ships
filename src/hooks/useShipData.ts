import type { Vehicle } from '../types';
import { useAppSelector } from './useAppDispatch';
import { getNationFlagUrl, getTypeIconUrl } from '../images';
import { getShipType, isPremium, isSpecial, SHIP_TYPE_COLORS } from '../utils';

export interface ShipData {
  name: string;
  shipType: string;
  premium: boolean;
  special: boolean;
  typeColor: string;
  nationName: string;
  nationFlagUrl: string;
  typeIconUrl: string;
  typeName: string;
  mediaPath: string;
}

export function useShipData(ship: Vehicle): ShipData {
  const { nations, vehicleTypes, mediaPath } = useAppSelector((s) => s.data);

  const name = ship.localization.shortmark?.en ?? ship.name;
  const shipType = getShipType(ship.tags);
  const premium = isPremium(ship.tags);
  const special = isSpecial(ship.tags);
  const typeColor = SHIP_TYPE_COLORS[shipType] ?? 'var(--color-text-muted)';

  const nation = nations.find((n) => n.name === ship.nation);
  const nationName = nation?.localization?.mark?.en ?? ship.nation;
  const nationFlagUrl = getNationFlagUrl(mediaPath, nation?.icons?.tiny);
  const typeIconUrl = getTypeIconUrl(mediaPath, vehicleTypes[shipType]?.icons?.default);
  const typeName = vehicleTypes[shipType]?.localization?.mark?.en ?? shipType;

  return { name, shipType, premium, special, typeColor, nationName, nationFlagUrl, typeIconUrl, typeName, mediaPath };
}
