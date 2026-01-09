# MSPRO Optimization Core v3.0 — План внедрения

**Дата аудита:** 2025-12-29
**Автор:** Replit Agent

---

## 🔍 Результаты аудита репозитория

### Существующая инфраструктура

| Компонент | Статус | Файлы |
|-----------|--------|-------|
| **SEO Core** | ✅ Работает | `content/seo_core*.json` (5 файлов, 2449 страниц) |
| **SEO API** | ⚠️ Только AI-генерация | `server/routes.ts` → `/api/ai_seo` |
| **AEO Generator** | ✅ Есть схемы | `client/src/modules/optimization/aeo/` |
| **GEO Regions** | ✅ 10 регионов | `client/src/modules/optimization/geo/geo-regions.ts` |
| **PEO Engine** | ✅ Персонализация | `client/src/modules/optimization/peo/` |
| **AI Service** | ✅ OpenAI gpt-4o-mini | `server/services/ai_seo.ts` |
| **Metrics** | ✅ 9 коллекторов | `client/src/modules/optimization/metrics/` |

### Текущие API-эндпоинты

```
POST /api/leads           — создание лида
GET  /api/leads           — список лидов
GET  /api/leads/:id       — лид по ID
POST /api/calculations    — создание расчёта
GET  /api/calculations/:id — расчёт по ID
GET  /api/ai_seo?slug=    — AI-генерация контента
```

### Схема данных (`shared/schema.ts`)

- `leads` — контактные данные клиентов
- `calculations` — расчёты стоимости

---

## 📋 План внедрения v3.0

### Чекпоинт 1: SEO API Live (не заглушка)

**Цель:** Создать полноценное SEO API на базе JSON-файлов

**Задачи:**
1. Создать `/api/seo/pages` — список всех страниц с пагинацией
2. Создать `/api/seo/page/:slug` — данные конкретной страницы
3. Создать `/api/seo/search?q=` — поиск по keywords/title
4. Добавить кеширование в памяти
5. JSDoc для всех функций

**Файлы:**
- `server/routes/seo-api.ts` (новый)
- `server/services/seo-service.ts` (новый)

---

### Чекпоинт 2: AEO Smart Generator

**Цель:** AI-генерация FAQ + JSON-LD Schema Builder + Quality Gates

**Задачи:**
1. Создать `/api/aeo/generate-faq` — AI-генерация FAQ по теме
2. Создать `/api/aeo/schema/:type` — генерация JSON-LD (Service/FAQ/Org)
3. Quality Gates: валидация schema.org, минимальные требования к FAQ
4. Сохранение в seo_dynamic.json

**Файлы:**
- `server/routes/aeo-api.ts` (новый)
- `server/services/aeo-service.ts` (новый)
- `client/src/modules/optimization/aeo/aeo-quality-gates.ts` (новый)

---

### Чекпоинт 3: GEO Layer 2.0

**Цель:** Автоматический GEO-контекст

**Задачи:**
1. Middleware для определения региона (header/query/subdomain-ready)
2. Расширить PRIORITY_REGIONS до 18 регионов
3. Создать `/api/geo/context` — текущий GEO-контекст
4. Подготовка к поддоменам: `{region}.mspro.ru`
5. GEO-специфичные CTA и контент

**Файлы:**
- `server/middleware/geo-context.ts` (новый)
- `server/routes/geo-api.ts` (новый)
- `client/src/modules/optimization/geo/geo-context.ts` (обновить)

---

### Чекпоинт 4: UX-Personalization Engine

**Цель:** Клиентский провайдер + сбор UX-событий

**Задачи:**
1. React Context Provider для персонализации
2. Создать `/api/ux/events` — приём UX-событий с клиента
3. Хранение событий в памяти (готовность к БД)
4. Хуки: `usePersonalization()`, `useUXTracker()`
5. Интеграция с существующим PEO

**Файлы:**
- `client/src/providers/PersonalizationProvider.tsx` (новый)
- `client/src/hooks/use-personalization.ts` (новый)
- `client/src/hooks/use-ux-tracker.ts` (новый)
- `server/routes/ux-api.ts` (новый)

---

### Чекпоинт 5: Интеграция и тесты

**Цель:** Связать все модули, добавить проверки

**Задачи:**
1. Typecheck: `npm run check` без ошибок
2. Интеграционные тесты API
3. Обновить `scripts/validate-core.ts`
4. Проверка совместимости со страницами

---

### Чекпоинт 6: Документация

**Цель:** Полная документация v3.0

**Задачи:**
1. `/docs/optimization-core-v3.md` — архитектура
2. `/reports/optimization-core-v3-report.md` — отчёт
3. Обновить `replit.md`

---

### Чекпоинт 7: Git workflow + PR

**Цель:** Создать ветку, коммиты, подготовить PR

**Задачи:**
1. Создать ветку `feature/optimization-core-v3`
2. Коммиты после каждого чекпоинта
3. `/reports/replit-checkpoint.md` с комментариями
4. Инструкции для создания PR

---

## ⚙️ Технические ограничения

1. **OpenAI API Key** — только через `process.env.OPENAI_API_KEY`
2. **Совместимость** — не ломать существующие роуты `/api/leads`, `/api/calculations`
3. **TypeScript** — JSDoc/TSDoc для всех публичных функций
4. **Нет .env в репо** — все секреты через Replit Secrets

---

## 📊 Ожидаемый результат

После внедрения v3.0:

| API | Endpoint | Описание |
|-----|----------|----------|
| SEO | `GET /api/seo/pages` | Список страниц с пагинацией |
| SEO | `GET /api/seo/page/:slug` | Данные страницы |
| SEO | `GET /api/seo/search` | Поиск по контенту |
| AEO | `POST /api/aeo/generate-faq` | AI-генерация FAQ |
| AEO | `GET /api/aeo/schema/:type` | JSON-LD схемы |
| GEO | `GET /api/geo/context` | Текущий GEO-контекст |
| UX | `POST /api/ux/events` | Приём UX-событий |

---

## 🚀 Готов к старту

Подтвердите план для начала реализации.
