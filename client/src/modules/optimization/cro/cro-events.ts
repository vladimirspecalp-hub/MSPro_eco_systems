export interface CTAConfig {
  id: string;
  text: string;
  variant: 'primary' | 'secondary' | 'outline';
  position: 'header' | 'hero' | 'content' | 'footer' | 'sticky';
  trackingEnabled: boolean;
}

export interface FormConfig {
  id: string;
  name: string;
  fields: string[];
  submitText: string;
  successMessage: string;
  trackingEnabled: boolean;
}

export const CTA_CONFIGS: CTAConfig[] = [
  {
    id: 'hero-cta',
    text: 'Рассчитать стоимость',
    variant: 'primary',
    position: 'hero',
    trackingEnabled: true,
  },
  {
    id: 'header-cta',
    text: 'Оставить заявку',
    variant: 'primary',
    position: 'header',
    trackingEnabled: true,
  },
  {
    id: 'sticky-cta',
    text: 'Получить консультацию',
    variant: 'primary',
    position: 'sticky',
    trackingEnabled: true,
  },
  {
    id: 'content-cta',
    text: 'Узнать подробнее',
    variant: 'secondary',
    position: 'content',
    trackingEnabled: true,
  },
];

export const FORM_CONFIGS: FormConfig[] = [
  {
    id: 'contact-form',
    name: 'Форма обратной связи',
    fields: ['name', 'phone', 'email', 'message'],
    submitText: 'Отправить заявку',
    successMessage: 'Спасибо! Мы свяжемся с вами в течение 30 минут.',
    trackingEnabled: true,
  },
  {
    id: 'calculator-form',
    name: 'Форма калькулятора',
    fields: ['height', 'diameter', 'surface', 'coating'],
    submitText: 'Рассчитать',
    successMessage: 'Расчёт готов! Оставьте контакты для получения коммерческого предложения.',
    trackingEnabled: true,
  },
  {
    id: 'callback-form',
    name: 'Форма обратного звонка',
    fields: ['phone'],
    submitText: 'Перезвоните мне',
    successMessage: 'Мы перезвоним вам в течение 5 минут.',
    trackingEnabled: true,
  },
];

export function getCTAById(id: string): CTAConfig | undefined {
  return CTA_CONFIGS.find(cta => cta.id === id);
}

export function getFormById(id: string): FormConfig | undefined {
  return FORM_CONFIGS.find(form => form.id === id);
}

export function getCTAsByPosition(position: CTAConfig['position']): CTAConfig[] {
  return CTA_CONFIGS.filter(cta => cta.position === position);
}
