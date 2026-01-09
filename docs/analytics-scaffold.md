# Analytics Scaffold v1 — Архитектура

## Обзор

Analytics Scaffold — это унифицированный слой аналитики для MSPRO, который работает по принципу "одна шина событий → много получателей".

```
┌─────────────────────────────────────────────────────────┐
│                     track(event, meta)                   │
└───────────────────────────┬─────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   dataLayer          console.log        /api/ux/track
   (GTM/GA4)           (debug)            (backend)
```

## Как работает

1. **Единая функция track()** — все события проходят через неё
2. **dataLayer** — стандартный массив Google Tag Manager, доступен как `window.dataLayer`
3. **Consent** — внешние скрипты загружаются только при согласии пользователя
4. **Debug mode** — в режиме отладки события логируются в консоль

## Быстрый старт

### 1. Включить аналитику

Добавьте в `.env`:

```env
VITE_ANALYTICS_ENABLED=1
VITE_ANALYTICS_DEBUG=1
```

### 2. Проверить в браузере

Откройте консоль DevTools и проверьте:

```javascript
// dataLayer существует
window.dataLayer

// Последнее событие
window.dataLayer[window.dataLayer.length - 1]
```

При включённом debug-режиме все события логируются с цветным префиксом `[Analytics]`.

## Подключение внешних сервисов

### Google Tag Manager

```env
VITE_GTM_ID=GTM-XXXXXXX
```

### Google Analytics 4

```env
VITE_GA_TAG_ID=G-XXXXXXXXXX
```

### Яндекс.Метрика

```env
VITE_YM_TAG_ID=12345678
```

### Hotjar

```env
VITE_HOTJAR_ID=1234567
```

## Список событий

| Событие | Описание | meta параметры |
|---------|----------|----------------|
| `page_view` | Просмотр страницы | — |
| `cta_click` | Клик на CTA кнопку | `ctaId`, `placement` |
| `form_start` | Первое взаимодействие с формой | `formId`, `formType` |
| `form_submit` | Успешная отправка формы | `formId`, `formType` |
| `phone_click` | Клик на телефон | `placement` (без номера!) |
| `messenger_click` | Клик на мессенджер | `platform`, `placement` |
| `file_download` | Скачивание файла | `fileType`, `fileName` |
| `calc_start` | Начало расчёта | — |
| `calc_submit` | Отправка расчёта | — |
| `news_open` | Открытие новости | `slug`, `category` |
| `share_click` | Клик на "Поделиться" | `platform`, `slug` |

## Формат события

```typescript
interface AnalyticsEvent {
  event: string;          // Название события
  ts: number;             // Timestamp (Date.now())
  page: {
    path: string;         // Текущий путь
    title?: string;       // Заголовок страницы
    referrer?: string;    // Реферер
  };
  session: {
    id: string;           // ID сессии
  };
  geo?: {
    region?: string;      // Регион (если есть)
    regionCode?: string;
  };
  ab?: {
    experimentKey?: string;  // A/B эксперимент
    variant?: string;
  };
  meta?: object;          // Дополнительные данные (без PII!)
}
```

## Использование в коде

### Базовое использование

```typescript
import { track } from '@/modules/analytics';

// Простое событие
track('cta_click', { ctaId: 'hero-cta', placement: 'hero' });

// Событие формы
track('form_submit', { formId: 'contact-form' });
```

### Готовые хелперы

```typescript
import { 
  trackCTAClick,
  trackFormStart,
  trackFormSubmit,
  trackPhoneClick,
  trackMessengerClick,
  trackCalcStart,
  trackCalcSubmit,
  trackNewsOpen,
  trackShareClick
} from '@/modules/analytics';

// CTA
trackCTAClick('hero-cta', 'hero');

// Форма
trackFormStart('contact-form', 'contact');
trackFormSubmit('contact-form', 'contact');

// Телефон (без номера!)
trackPhoneClick('header');

// Мессенджер
trackMessengerClick('telegram', 'footer');

// Калькулятор
trackCalcStart();
trackCalcSubmit();

// Новости
trackNewsOpen('article-slug', 'technology');
trackShareClick('telegram', 'article-slug');
```

### Event Delegation (data-track атрибуты)

Можно трекать события без кода, добавив data-атрибуты:

```html
<button 
  data-track="cta_click" 
  data-track-meta='{"ctaId":"download-btn","placement":"sidebar"}'
>
  Скачать
</button>

<a 
  href="tel:+74951234567" 
  data-track="phone_click"
  data-track-placement="header"
>
  +7 (495) 123-45-67
</a>
```

## Приватность

**ВАЖНО:** Никакие персональные данные (PII) не должны попадать в аналитику!

НЕ отправляем:
- Номера телефонов
- Email адреса
- Имена пользователей
- Тексты сообщений
- Содержимое полей форм

Отправляем только:
- Идентификаторы форм/кнопок
- Типы услуг
- Slug страниц
- Placement (расположение элемента)

## Коллтрекинг (placeholder)

Для интеграции с коллтрекингом добавьте атрибут `data-phone-slot`:

```html
<a href="tel:+74951234567" data-phone-slot="primary">
  +7 (495) 123-45-67
</a>
```

Скрипт коллтрекинга заменит номер на подменный.

```env
VITE_CALLTRACKING_KEY=your-key
```

## A/B тестирование (placeholder)

UX персонализация уже поддерживает A/B тесты. Для интеграции с Varioqub:

```env
VITE_AB_TEST_KEY=your-key
```

При каждом `page_view` в dataLayer добавляется:
- `experimentKey` — ключ эксперимента
- `variant` — вариант (0..n-1)

## Consent (согласие)

По умолчанию consent = false. Внешние скрипты не загружаются без согласия.

```typescript
import { setConsent, getConsent } from '@/modules/analytics';

// Показать баннер cookie consent
if (!hasConsentChoice()) {
  showConsentBanner();
}

// При согласии
setConsent(true);  // Перезагрузит аналитику

// При отказе
setConsent(false);
```

## Отладка

1. Включите debug mode: `VITE_ANALYTICS_DEBUG=1`
2. Откройте консоль браузера
3. Все события будут логироваться с `[Analytics]` префиксом
4. Проверьте `window.dataLayer` для просмотра всех событий

## Файлы модуля

```
client/src/modules/analytics/
├── config.ts      # Конфигурация из env
├── consent.ts     # Управление согласием
├── events.ts      # Типы событий
├── loader.ts      # Загрузка внешних скриптов
├── track.ts       # Основная функция track()
├── spa.ts         # SPA page_view для wouter
├── delegation.ts  # Event delegation
└── index.ts       # Экспорты
```
