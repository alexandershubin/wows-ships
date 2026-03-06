import type { Vehicle } from './types';

function buildUrl(mediaPath: string, iconPath: string | undefined): string {
  return iconPath ? `${mediaPath}${iconPath}` : '';
}

export function getShipImageUrl(
  mediaPath: string,
  icons: Pick<Vehicle['icons'], 'medium' | 'default'>
): string {
  return buildUrl(mediaPath, icons.medium || icons.default);
}

export function getShipLargeImageUrl(
  mediaPath: string,
  icons: Pick<Vehicle['icons'], 'large' | 'medium' | 'default'>
): string {
  return buildUrl(mediaPath, icons.large || icons.medium || icons.default);
}

export function getNationFlagUrl(
  mediaPath: string,
  iconPath: string | undefined
): string {
  return buildUrl(mediaPath, iconPath);
}

export function getTypeIconUrl(
  mediaPath: string,
  iconPath: string | undefined
): string {
  return buildUrl(mediaPath, iconPath);
}
