export interface UserProfile {
  id: string;
  region?: string;
  industry?: string;
  visitCount: number;
  lastVisit: number;
  interests: string[];
  viewedServices: string[];
  preferredCTA?: string;
}

export interface PersonalizationRule {
  id: string;
  name: string;
  condition: (profile: UserProfile) => boolean;
  action: PersonalizationAction;
}

export interface PersonalizationAction {
  type: 'show_content' | 'highlight_cta' | 'change_copy' | 'show_offer';
  payload: Record<string, unknown>;
}

export const PERSONALIZATION_RULES: PersonalizationRule[] = [
  {
    id: 'returning-visitor',
    name: 'Возвращающийся посетитель',
    condition: (profile) => profile.visitCount > 1,
    action: {
      type: 'show_content',
      payload: {
        message: 'С возвращением! Готовы обсудить ваш проект?',
        ctaText: 'Продолжить расчёт',
      },
    },
  },
  {
    id: 'interested-in-tec',
    name: 'Интерес к ТЭЦ',
    condition: (profile) => profile.viewedServices.some(s => s.includes('тэц') || s.includes('котельн')),
    action: {
      type: 'highlight_cta',
      payload: {
        emphasis: 'Специальные условия для энергетических объектов',
      },
    },
  },
  {
    id: 'regional-visitor',
    name: 'Региональный посетитель',
    condition: (profile) => !!profile.region && profile.region !== 'Москва',
    action: {
      type: 'change_copy',
      payload: {
        regionalize: true,
      },
    },
  },
  {
    id: 'high-intent',
    name: 'Высокий интент',
    condition: (profile) => profile.visitCount >= 3 && profile.viewedServices.length >= 2,
    action: {
      type: 'show_offer',
      payload: {
        offer: 'Бесплатный выезд специалиста',
        discount: '10%',
      },
    },
  },
];

export function evaluateRules(profile: UserProfile): PersonalizationAction[] {
  return PERSONALIZATION_RULES
    .filter(rule => rule.condition(profile))
    .map(rule => rule.action);
}

export function getPersonalizedContent(profile: UserProfile): Record<string, unknown> {
  const actions = evaluateRules(profile);
  const content: Record<string, unknown> = {};

  for (const action of actions) {
    switch (action.type) {
      case 'show_content':
        content.welcomeMessage = action.payload.message;
        content.ctaText = action.payload.ctaText;
        break;
      case 'highlight_cta':
        content.ctaEmphasis = action.payload.emphasis;
        break;
      case 'change_copy':
        content.regionalize = action.payload.regionalize;
        break;
      case 'show_offer':
        content.specialOffer = action.payload;
        break;
    }
  }

  return content;
}

export function createDefaultProfile(): UserProfile {
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    visitCount: 1,
    lastVisit: Date.now(),
    interests: [],
    viewedServices: [],
  };
}
