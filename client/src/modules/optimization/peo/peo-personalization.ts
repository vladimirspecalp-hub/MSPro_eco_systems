import { createDefaultProfile, type UserProfile } from './peo-engine';
import { loadProfile, saveProfile } from './peo-storage';

export interface PersonalizedPage {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaVariant: 'primary' | 'secondary';
  showOffer: boolean;
  offerText?: string;
}

export function initPersonalization(): UserProfile {
  let profile = loadProfile();
  
  if (!profile) {
    profile = createDefaultProfile();
    saveProfile(profile);
  } else {
    profile.visitCount += 1;
    profile.lastVisit = Date.now();
    saveProfile(profile);
  }
  
  return profile;
}

export function getPersonalizedPage(profile: UserProfile, baseContent: {
  headline: string;
  subheadline: string;
  ctaText: string;
}): PersonalizedPage {
  const result: PersonalizedPage = {
    ...baseContent,
    ctaVariant: 'primary',
    showOffer: false,
  };

  if (profile.visitCount === 1) {
    result.headline = baseContent.headline;
    result.subheadline = 'Узнайте стоимость работ за 30 секунд';
    result.ctaText = 'Рассчитать стоимость';
  }

  if (profile.visitCount === 2) {
    result.subheadline = 'Рады видеть вас снова! Готовы обсудить детали?';
    result.ctaText = 'Получить консультацию';
  }

  if (profile.visitCount >= 3) {
    result.showOffer = true;
    result.offerText = 'Специальное предложение: бесплатный выезд специалиста';
    result.ctaText = 'Заказать бесплатный выезд';
    result.ctaVariant = 'primary';
  }

  if (profile.region && profile.region !== 'Москва') {
    result.subheadline = `Работаем в ${profile.region}. ${result.subheadline}`;
  }

  if (profile.viewedServices.length > 0) {
    const lastViewed = profile.viewedServices[profile.viewedServices.length - 1];
    result.headline = `${baseContent.headline} — ${lastViewed}`;
  }

  return result;
}

export function shouldShowExitIntent(profile: UserProfile): boolean {
  return profile.visitCount <= 2 && profile.viewedServices.length > 0;
}

export function getExitIntentOffer(profile: UserProfile): {
  title: string;
  description: string;
  ctaText: string;
} {
  if (profile.viewedServices.length > 0) {
    return {
      title: 'Не уходите!',
      description: 'Получите бесплатный расчёт стоимости прямо сейчас',
      ctaText: 'Получить расчёт',
    };
  }

  return {
    title: 'Остались вопросы?',
    description: 'Наш специалист перезвонит вам в течение 5 минут',
    ctaText: 'Заказать звонок',
  };
}
