export interface DirectoryListing {
  platform: 'yandex' | 'google' | '2gis' | 'zoon' | 'flamp';
  name: string;
  url: string;
  profileUrl?: string;
  isVerified: boolean;
  lastUpdated?: string;
}

export const DIRECTORY_LISTINGS: DirectoryListing[] = [
  {
    platform: 'yandex',
    name: 'Яндекс.Справочник',
    url: 'https://yandex.ru/sprav',
    profileUrl: 'https://yandex.ru/maps/org/mspro/123456789',
    isVerified: true,
    lastUpdated: '2024-01-15',
  },
  {
    platform: 'google',
    name: 'Google My Business',
    url: 'https://business.google.com',
    profileUrl: 'https://g.page/mspro-russia',
    isVerified: true,
    lastUpdated: '2024-01-10',
  },
  {
    platform: '2gis',
    name: '2ГИС',
    url: 'https://2gis.ru',
    profileUrl: 'https://2gis.ru/moscow/firm/123456789',
    isVerified: true,
    lastUpdated: '2024-01-12',
  },
  {
    platform: 'zoon',
    name: 'Zoon',
    url: 'https://zoon.ru',
    isVerified: false,
  },
  {
    platform: 'flamp',
    name: 'Flamp',
    url: 'https://flamp.ru',
    isVerified: false,
  },
];

export function getVerifiedListings(): DirectoryListing[] {
  return DIRECTORY_LISTINGS.filter(l => l.isVerified);
}

export function getUnverifiedListings(): DirectoryListing[] {
  return DIRECTORY_LISTINGS.filter(l => !l.isVerified);
}

export function getListingsByPlatform(platform: DirectoryListing['platform']): DirectoryListing | undefined {
  return DIRECTORY_LISTINGS.find(l => l.platform === platform);
}

export function calculateLocalPresenceScore(): number {
  const verified = getVerifiedListings().length;
  const total = DIRECTORY_LISTINGS.length;
  return Math.round((verified / total) * 100);
}

export interface NAPConsistency {
  name: string;
  address: string;
  phone: string;
  isConsistent: boolean;
}

export function checkNAPConsistency(listings: NAPConsistency[]): boolean {
  if (listings.length === 0) return true;
  
  const reference = listings[0];
  return listings.every(
    l => l.name === reference.name && 
         l.address === reference.address && 
         l.phone === reference.phone
  );
}
