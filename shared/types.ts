// Типы экспортируются из shared/schema.ts (Drizzle ORM)
// Здесь только дополнительные типы для бизнес-логики

export interface Partner {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  type: 'client' | 'supplier' | 'contractor';
  region?: string;
  createdAt: Date;
}

export interface ProjectObject {
  id: string;
  name: string;
  description?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  type: 'residential' | 'commercial' | 'industrial' | 'infrastructure';
  status: 'planned' | 'in_progress' | 'completed';
  services: string[];
  images?: string[];
  startDate?: Date;
  endDate?: Date;
}

export interface SEOPage {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  region: string;
  cta: string;
  content?: string;
}

export interface TelegramNotification {
  chatId: string;
  message: string;
  parseMode?: 'HTML' | 'Markdown';
  leadId?: string;
}
