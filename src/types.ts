export interface VehicleIcons {
  small: string;
  medium: string;
  large: string;
  default: string;
  contour: string;
  contour_alive: string;
  contour_dead: string;
}

export interface Vehicle {
  id: string;
  level: number;
  name: string;
  nation: string;
  icons: VehicleIcons;
  tags: string[];
  localization: {
    shortmark: Record<string, string>;
    description: Record<string, string>;
  };
}

export interface NationIcons {
  large: string;
  small: string;
  tiny: string;
  default: string;
}

export interface Nation {
  name: string;
  icons: NationIcons;
  color: number;
  tags: string[];
  localization: {
    mark: Record<string, string>;
  };
}

export interface VehicleTypeIcons {
  default: string;
  elite: string;
  premium: string;
  special: string;
  normal: string;
}

export interface VehicleType {
  icons: VehicleTypeIcons;
  sort_order: number;
  localization: {
    mark: Record<string, string>;
    shortmark: Record<string, string>;
  };
}

export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type ShipTypeKey = 'Destroyer' | 'Cruiser' | 'Battleship' | 'AirCarrier' | 'Submarine';

export const SHIP_TYPES: ShipTypeKey[] = [
  'Destroyer',
  'Cruiser',
  'Battleship',
  'AirCarrier',
  'Submarine',
];

export const TIERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
