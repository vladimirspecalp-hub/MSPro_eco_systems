# Analytics Scaffold v1 — План внедрения

## Аудит репозитория

### Текущая архитектура
- **Роутинг**: wouter (Switch/Route) в `client/src/App.tsx`
- **Точка входа**: App → QueryClientProvider → ThemeProvider → TooltipProvider
- **Страницы**: Home, Contacts, Calculator, MSPROQuad, News, NewsArticle, ServicePage, SEOPage

### Существующий трекинг (CRO модуль)
Файлы: `client/src/modules/optimization/cro/`
- `cro-tracker.ts` — trackConversion, trackFormSubmit, trackCTAClick, trackPhoneClick
- `cro-events.ts` — конфиги CTA и форм
- `cro-analytics.ts` — аналитика конверсий

**Проблемы текущего решения:**
1. Нет window.dataLayer
2. Нет consent-логики
3. Нет lazy-load внешних скриптов (GTM/YM/GA/Hotjar)
4. Нет SPA page_view трекинга
5. trackPhoneClick отправляет PII (номер телефона)

### Ключевые точки интеграции

| Компонент | Файл | События |
|-----------|------|---------|
| CTA кнопки | CTABlock.tsx, Hero.tsx | cta_click |
| Форма контактов | leads/form.tsx | form_start, form_submit |
| Калькулятор | calculator/CalculatorForm.tsx | calc_start, calc_submit |
| Телефон | Header.tsx, Footer.tsx | phone_click |
| Мессенджеры | Header.tsx, Footer.tsx | messenger_click |
| Новости | NewsArticle.tsx | news_open, share_click |
| Файлы | (если есть) | file_download |

## План внедрения

### ЭТАП 0 — Audit & Plan ✓
- [x] Изучить App.tsx и роутинг
- [x] Изучить существующий CRO модуль
- [x] Определить точки интеграции
- [x] Создать reports/analytics-plan.md

### ЭТАП 1 — Analytics module
Создать `client/src/modules/analytics/`:
- `config.ts` — env конфигурация
- `consent.ts` — заглушка consent
- `loader.ts` — lazy-load скриптов
- `events.ts` — типы событий
- `track.ts` — единая функция track()
- `index.ts` — экспорты

### ЭТАП 2 — SPA page_view
- Создать `spa.ts` с хуком для wouter
- Интегрировать в App.tsx
- События: page_view с path, title, referrer

### ЭТАП 3 — Базовые события
Инструментировать:
- CTA клики (без переписывания UI — через event delegation)
- Формы (form_start на первое взаимодействие, form_submit на успех)
- Телефон (без PII!)
- Мессенджеры
- Калькулятор
- Новости

### ЭТАП 4 — Документация
- docs/analytics-scaffold.md
- reports/analytics-scaffold-report.md
- .env.example

## Архитектура решения

```
┌─────────────────────────────────────────────────────────┐
│                     App.tsx                              │
│   ┌─────────────────────────────────────────────────┐   │
│   │           AnalyticsProvider                      │   │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐           │   │
│   │  │ config  │ │ consent │ │ loader  │           │   │
│   │  └────┬────┘ └────┬────┘ └────┬────┘           │   │
│   │       │           │           │                 │   │
│   │       ▼           ▼           ▼                 │   │
│   │  ┌─────────────────────────────────────────┐   │   │
│   │  │           track(event, props)           │   │   │
│   │  └─────────────────┬───────────────────────┘   │   │
│   │                    │                           │   │
│   │      ┌─────────────┼─────────────┐             │   │
│   │      ▼             ▼             ▼             │   │
│   │ dataLayer    console.log   /api/ux/track      │   │
│   │ (GTM/GA)      (debug)      (backend)          │   │
│   └─────────────────────────────────────────────────┘   │
│                                                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │           useSpaPageView (wouter)               │   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Стандарт событий (dataLayer contract)

```typescript
interface AnalyticsEvent {
  event: string;
  ts: number;
  page: {
    path: string;
    title?: string;
    referrer?: string;
  };
  session: {
    id: string;
  };
  geo?: {
    region?: string;
    regionCode?: string;
  };
  ab?: {
    experimentKey?: string;
    variant?: string;
  };
  meta?: Record<string, unknown>;  // БЕЗ PII!
}
```

## Список событий

| Событие | Когда | meta параметры |
|---------|-------|----------------|
| page_view | Смена маршрута | — |
| cta_click | Клик на CTA | ctaId, placement |
| form_start | Первое взаимодействие с формой | formId, formType |
| form_submit | Успешная отправка | formId, formType |
| phone_click | Клик на tel: | placement (БЕЗ номера!) |
| messenger_click | Клик на tg/wa | platform, placement |
| file_download | Клик на файл | fileType, fileName |
| calc_start | Начало расчёта | — |
| calc_submit | Отправка расчёта | — |
| news_open | Открытие новости | slug, category |
| share_click | Клик на шаринг | platform, slug |

## Environment Variables

```env
# Analytics (all optional)
VITE_ANALYTICS_ENABLED=0
VITE_ANALYTICS_DEBUG=1
VITE_GTM_ID=
VITE_GA_TAG_ID=
VITE_YM_TAG_ID=
VITE_HOTJAR_ID=
VITE_CALLTRACKING_KEY=
VITE_AB_TEST_KEY=
```

## Приёмочные критерии

1. ✓ `window.dataLayer` существует и получает события
2. ✓ В dev можно включить debug mode (console.log)
3. ✓ SPA page_view при смене маршрутов
4. ✓ События CTA/форм/калькулятора/телефона/мессенджеров
5. ✓ Никакой PII в событиях
6. ✓ Внешние скрипты грузятся только при наличии ID и consent
