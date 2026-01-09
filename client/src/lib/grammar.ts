export type Case = 'nominative' | 'genitive' | 'dative' | 'accusative' | 'instrumental' | 'prepositional';

export const SERVICE_DECLENSIONS: Record<string, string> = {
    // English slugs / Intents
    'fireproofing': 'огнезащиты',
    'fireproof': 'огнезащиты',
    'anticorrosion': 'АКЗ',
    'anticorr': 'АКЗ',
    'chimney-painting': 'покраски трубы',
    'painting': 'покраски',
    'rope-access': 'высотных работ',
    'high-altitude-works': 'высотных работ',
    'facade-repair': 'ремонта фасада',
    'mspro-quad': 'покрытия MSPRO Quad',
    'repair': 'ремонта',

    // Russian keywords (fallback)
    'огнезащита': 'огнезащиты',
    'покраска': 'покраски',
    'ремонт': 'ремонта',
    'акз': 'АКЗ',
    'монтаж': 'монтажа',
    'обследование': 'обследования',
};

export function getServiceGenitive(query: string): string {
    const normalize = query.toLowerCase().trim();
    return SERVICE_DECLENSIONS[normalize] || query; // Fallback to original if not found
}

export function getDirectorName(declensionCase: Case = 'nominative'): string {
    switch (declensionCase) {
        case 'genitive': return 'Бровякова Владимира Андреевича';
        case 'dative': return 'Бровякову Владимиру Андреевичу';
        case 'accusative': return 'Бровякова Владимира Андреевича';
        case 'instrumental': return 'Бровяковым Владимиром Андреевичем';
        case 'prepositional': return 'Бровякове Владимире Андреевиче';
        case 'nominative':
        default: return 'Бровяков Владимир Андреевич';
    }
}

/**
 * Pluralizes a word based on the count.
 * @param count - The number.
 * @param forms - Array of 3 forms: [1 pipe, 2 pipes, 5 pipes] -> ['труба', 'трубы', 'труб']
 */
export function pluralize(count: number, forms: [string, string, string]): string {
    const n = Math.abs(count) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) { return forms[2]; }
    if (n1 > 1 && n1 < 5) { return forms[1]; }
    if (n1 === 1) { return forms[0]; }
    return forms[2];
}
