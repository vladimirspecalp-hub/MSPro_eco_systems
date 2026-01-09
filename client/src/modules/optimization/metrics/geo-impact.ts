import { PRIORITY_REGIONS } from '../geo/geo-regions';
import { getVerifiedListings } from '../leo/leo-directory';

export interface GeoImpactData {
  regions: number;
  activeRegions: number;
  clicks: number;
  geoTrafficIndex: number;
  localListings: number;
  verifiedListings: number;
  regionalCoverage: number;
  topRegions: Array<{ name: string; traffic: number }>;
}

export async function collectGeoImpact(): Promise<GeoImpactData> {
  const regions = PRIORITY_REGIONS.length;
  const activeRegions = PRIORITY_REGIONS.filter(r => r.priority === 'high' || r.priority === 'medium').length;
  const verifiedListings = getVerifiedListings().length;
  
  const topRegions = PRIORITY_REGIONS
    .slice(0, 5)
    .map(r => ({
      name: r.name,
      traffic: Math.round(r.industrialIndex * 10),
    }));

  const regionalCoverage = (activeRegions / regions) * 100;
  const geoTrafficIndex = calculateGeoTrafficIndex(PRIORITY_REGIONS);

  return {
    regions,
    activeRegions,
    clicks: 0,
    geoTrafficIndex,
    localListings: 5,
    verifiedListings,
    regionalCoverage: Math.round(regionalCoverage),
    topRegions,
  };
}

function calculateGeoTrafficIndex(regions: typeof PRIORITY_REGIONS): number {
  const totalIndustrial = regions.reduce((sum, r) => sum + r.industrialIndex, 0);
  const avgIndustrial = totalIndustrial / regions.length;
  return Math.round(avgIndustrial);
}

export function getGeoHealthStatus(data: GeoImpactData): 'healthy' | 'warning' | 'critical' {
  if (data.verifiedListings >= 3 && data.regionalCoverage >= 80) return 'healthy';
  if (data.verifiedListings >= 2 && data.regionalCoverage >= 50) return 'warning';
  return 'critical';
}
