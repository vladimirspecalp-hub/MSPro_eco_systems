// TODO: Реализовать модуль после подключения Supabase и API.

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface GeoObject {
  id: string;
  name: string;
  location: GeoLocation;
  type: 'project' | 'office' | 'partner';
}

export async function getGeoObjects(): Promise<GeoObject[]> {
  return [];
}

export async function getNearbyObjects(location: GeoLocation, radius: number): Promise<GeoObject[]> {
  return [];
}

export async function geocodeAddress(address: string): Promise<GeoLocation | null> {
  return null;
}
