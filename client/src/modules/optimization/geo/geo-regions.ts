import { RegionData, PRIORITY_REGIONS } from '@shared/data/geo-data';

export type { RegionData };
export { PRIORITY_REGIONS };

export function getRegionBySlug(slug: string): RegionData | undefined {
  return PRIORITY_REGIONS.find(r => r.slug === slug);
}

export function getHighPriorityRegions(): RegionData[] {
  return PRIORITY_REGIONS.filter(r => r.priority === 'high');
}

export function sortRegionsByIndustrialIndex(regions: RegionData[]): RegionData[] {
  return [...regions].sort((a, b) => b.industrialIndex - a.industrialIndex);
}

export function getRegionPriority(region: string): 'high' | 'medium' | 'low' {
  const found = PRIORITY_REGIONS.find(r => r.name === region);
  return found?.priority || 'low';
}
