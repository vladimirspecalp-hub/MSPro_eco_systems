export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  validUntil: string;
  type: 'license' | 'certificate' | 'accreditation' | 'iso';
  imageUrl?: string;
}

export interface ExpertProfile {
  id: string;
  name: string;
  title: string;
  experience: number;
  specializations: string[];
  photoUrl?: string;
  bio: string;
}

export const COMPANY_CERTIFICATES: Certificate[] = [
  {
    id: 'rostechnadzor-2024',
    name: 'Допуск Ростехнадзора',
    issuer: 'Федеральная служба по экологическому, технологическому и атомному надзору',
    validUntil: '2026-12-31',
    type: 'license',
  },
  {
    id: 'iso-9001',
    name: 'ISO 9001:2015',
    issuer: 'TÜV Rheinland',
    validUntil: '2025-06-30',
    type: 'iso',
  },
  {
    id: 'mspro-quad-cert',
    name: 'Сертификат соответствия MSPRO Quad',
    issuer: 'ВНИИПО МЧС России',
    validUntil: '2027-03-15',
    type: 'certificate',
  },
  {
    id: 'sro-builder',
    name: 'Допуск СРО',
    issuer: 'Ассоциация строителей России',
    validUntil: '2025-12-31',
    type: 'accreditation',
  },
];

export const COMPANY_EXPERTS: ExpertProfile[] = [
  {
    id: 'expert-1',
    name: 'Иванов Алексей Петрович',
    title: 'Главный инженер',
    experience: 15,
    specializations: ['Промышленная покраска', 'Высотные работы', 'Антикоррозийная защита'],
    bio: 'Более 15 лет опыта в промышленной покраске. Руководил проектами на крупнейших ТЭЦ России.',
  },
  {
    id: 'expert-2',
    name: 'Смирнова Елена Владимировна',
    title: 'Технолог по покрытиям',
    experience: 12,
    specializations: ['Огнезащитные покрытия', 'MSPRO Quad', 'Контроль качества'],
    bio: 'Эксперт по огнезащитным покрытиям. Разработчик технологии нанесения MSPRO Quad.',
  },
];

export function getCertificatesByType(type: Certificate['type']): Certificate[] {
  return COMPANY_CERTIFICATES.filter(cert => cert.type === type);
}

export function getValidCertificates(): Certificate[] {
  const today = new Date().toISOString().split('T')[0];
  return COMPANY_CERTIFICATES.filter(cert => cert.validUntil >= today);
}

export function calculateTrustScore(): number {
  const validCerts = getValidCertificates().length;
  const expertsCount = COMPANY_EXPERTS.length;
  const avgExperience = COMPANY_EXPERTS.reduce((sum, e) => sum + e.experience, 0) / expertsCount;

  const certScore = Math.min(validCerts * 15, 40);
  const expertScore = Math.min(expertsCount * 10, 30);
  const experienceScore = Math.min(avgExperience * 2, 30);

  return Math.round(certScore + expertScore + experienceScore);
}
