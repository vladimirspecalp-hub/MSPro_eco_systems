# Analytics Scaffold v1 — Отчёт о реализации

## Статус: ЗАВЕРШЕНО

## Что сделано

### CHECKPOINT #1 — Audit & Plan
- [x] Изучен App.tsx и wouter роутинг
- [x] Изучен существующий CRO модуль
- [x] Определены точки интеграции
- [x] Создан `/reports/analytics-plan.md`

### CHECKPOINT #2 — Analytics Module
- [x] Создан `client/src/modules/analytics/config.ts`
- [x] Создан `client/src/modules/analytics/consent.ts`
- [x] Создан `client/src/modules/analytics/loader.ts`
- [x] Создан `client/src/modules/analytics/events.ts`
- [x] Создан `client/src/modules/analytics/track.ts`
- [x] Создан `client/src/modules/analytics/index.ts`

### CHECKPOINT #3 — SPA page_view
- [x] Создан `client/src/modules/analytics/spa.ts`
- [x] Интегрирован `useSpaPageView` в App.tsx
- [x] page_view отправляется при каждой смене маршрута

### CHECKPOINT #4 — Базовые события
- [x] CTA клики — CTABlock.tsx
- [x] Формы — leads/form.tsx (form_start, form_submit)
- [x] Калькулятор — calculator/CalculatorForm.tsx (calc_start, calc_submit)
- [x] Новости — NewsArticle.tsx (news_open, share_click)
- [x] Event delegation — delegation.ts (data-track атрибуты)
- [x] Телефон/мессенджеры — через event delegation

### CHECKPOINT #5 — Документация
- [x] Создан `/docs/analytics-scaffold.md`
- [x] Создан `/reports/analytics-scaffold-report.md`
- [x] Добавлены env vars в `.env.example`

## Environment Variables

```env
# Analytics Configuration
VITE_ANALYTICS_ENABLED=0     # Master switch (0/1)
VITE_ANALYTICS_DEBUG=1       # Debug mode - console logging (0/1)
VITE_GTM_ID=                 # Google Tag Manager ID
VITE_GA_TAG_ID=              # Google Analytics 4 Tag ID
VITE_YM_TAG_ID=              # Yandex Metrika Tag ID
VITE_HOTJAR_ID=              # Hotjar Site ID
VITE_CALLTRACKING_KEY=       # Call tracking key (placeholder)
VITE_AB_TEST_KEY=            # A/B testing key (placeholder)
```

## Как проверить

### 1. В браузере

Откройте DevTools → Console:

```javascript
// Проверить dataLayer
window.dataLayer

// Последнее событие
window.dataLayer[window.dataLayer.length - 1]

// Все page_view события
window.dataLayer.filter(e => e.event === 'page_view')
```

### 2. С debug режимом

Установите `VITE_ANALYTICS_DEBUG=1` и перезапустите.

В консоли будут цветные логи:
```
[Analytics] page_view { event: 'page_view', ts: 1703..., page: {...} }
[Analytics] cta_click { event: 'cta_click', ts: 1703..., meta: {...} }
```

### 3. Проверка событий

| Действие | Ожидаемое событие |
|----------|-------------------|
| Переход на /contacts | `page_view` |
| Клик на CTA кнопку | `cta_click` |
| Фокус на форме | `form_start` |
| Отправка формы | `form_submit` |
| Переход в калькулятор | `page_view` |
| Взаимодействие с калькулятором | `calc_start` |
| Расчёт калькулятора | `calc_submit` |
| Открытие новости | `news_open` |
| Клик "Поделиться" | `share_click` |

## Приватность (PII)

Проверено: никакие персональные данные не отправляются.

- ❌ Номера телефонов
- ❌ Email адреса
- ❌ Имена пользователей
- ❌ Тексты сообщений
- ✅ Только идентификаторы (formId, ctaId, slug, placement)

## TODO (на будущее)

1. [ ] Баннер cookie consent (UI)
2. [ ] Интеграция с реальными GTM/YM/GA
3. [ ] Scroll depth tracking
4. [ ] Video play tracking (если будет видео)
5. [ ] Интеграция с реальным коллтрекингом
6. [ ] Интеграция с Varioqub A/B

## Архитектура

```
App.tsx
  └── useEffect: initAnalytics(), initEventDelegation()
  └── AnalyticsWrapper
        └── useSpaPageView() → track('page_view')
        └── Router
              └── Pages with track() calls
                    └── Forms: trackFormStart/Submit
                    └── CTA: trackCTAClick
                    └── Calculator: trackCalcStart/Submit
                    └── News: trackNewsOpen/ShareClick
```

## Файлы изменены

```
client/src/
├── App.tsx                              # initAnalytics, useSpaPageView
├── modules/analytics/                   # NEW MODULE
│   ├── config.ts
│   ├── consent.ts
│   ├── events.ts
│   ├── loader.ts
│   ├── track.ts
│   ├── spa.ts
│   ├── delegation.ts
│   └── index.ts
├── modules/leads/form.tsx               # trackFormStart/Submit
├── modules/calculator/CalculatorForm.tsx # trackCalcStart/Submit
├── components/widgets/CTABlock.tsx      # trackCTAClick
└── pages/NewsArticle.tsx                # trackNewsOpen/ShareClick

docs/
└── analytics-scaffold.md                # NEW

reports/
├── analytics-plan.md                    # NEW
└── analytics-scaffold-report.md         # NEW
```
