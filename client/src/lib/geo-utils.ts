export interface GeoRegionCtx {
    code: string;
    name: string;
    nameGenitive: string;
}

export const GEO_REGIONS_MAP: Record<string, GeoRegionCtx> = {
    msk: { code: 'msk', name: 'Москва', nameGenitive: 'Москве' },
    moscow: { code: 'msk', name: 'Москва', nameGenitive: 'Москве' },
    spb: { code: 'spb', name: 'Санкт-Петербург', nameGenitive: 'Санкт-Петербурге' },
    ekb: { code: 'ekb', name: 'Екатеринбург', nameGenitive: 'Екатеринбурге' },
    nsk: { code: 'nsk', name: 'Новосибирск', nameGenitive: 'Новосибирске' },
    kazan: { code: 'kazan', name: 'Казань', nameGenitive: 'Казани' },
    chelyabinsk: { code: 'chelyabinsk', name: 'Челябинск', nameGenitive: 'Челябинске' },
    samara: { code: 'samara', name: 'Самара', nameGenitive: 'Самаре' },
    nn: { code: 'nn', name: 'Нижний Новгород', nameGenitive: 'Нижнем Новгороде' },
    krasnoyarsk: { code: 'krasnoyarsk', name: 'Красноярск', nameGenitive: 'Красноярске' },
    omsk: { code: 'omsk', name: 'Омск', nameGenitive: 'Омске' },
};

export function getRegionBySlug(slug: string): GeoRegionCtx | null {
    return GEO_REGIONS_MAP[slug.toLowerCase()] || null;
}
