# News Distribution Center v1 — План реализации

## Аудит текущей реализации

### Существующие файлы:
- `server/routes/news-api.ts` — 10 endpoints (ingest, list, get, publish, RSS, sitemap, distribution/*)
- `server/repositories/news-repository.ts` — FileNewsRepository с JSON storage
- `content/news_store.json` — хранилище статей + distributionJobs
- `client/src/pages/NewsArticle.tsx` — страница статьи с базовым share

### Существующая функциональность Distribution:
- `POST /api/news/distribution/enqueue` — создание jobs вручную
- `POST /api/news/distribution/callback` — n8n callback
- `GET /api/news/distribution/jobs` — список jobs
- Модель `NewsDistributionJob` с полями: id, postId, platform, status, attempts, remoteUrl, backlinkUrl

### Что нужно добавить:
1. Реестр 15 платформ (`shared/newsPlatforms.ts`)
2. Settings storage (`content/news_distribution_settings.json`)
3. API управления настройками (GET/PUT /api/news/platforms)
4. Автогенерация outbox при publish (ensureOutboxForPost)
5. n8n endpoints dispatch/mark
6. UI блок 15 платформ на странице новости
7. Админ UI для настроек платформ

## Точки интеграции

### Backend:
- `server/routes/news-api.ts`:
  - Добавить: GET/PUT /api/news/platforms
  - Добавить: POST /api/news/outbox/dispatch, /api/news/outbox/mark
  - Модифицировать: POST /:id/publish → вызов ensureOutboxForPost

- `server/repositories/news-repository.ts`:
  - Добавить: ensureOutboxForPost(postId) — идемпотентная генерация 15 jobs
  - Добавить: getOutboxByPlatformStatus() — для dispatch
  - Добавить: markOutboxBatch() — для mark

- Новый файл: `server/services/distribution-settings.ts`
  - getPlatformSettings()
  - updatePlatformSettings()
  - getAggregatedStatus()

- Новый файл: `shared/newsPlatforms.ts`
  - Реестр 15 платформ

### Frontend:
- `client/src/pages/NewsArticle.tsx`:
  - Добавить секцию "Мы публикуем также здесь"
  - 15 иконок с логикой enabled/disabled

- Новый файл: `client/src/pages/admin/NewsDistribution.tsx`
  - Таблица настроек 15 платформ
  - Toggle, profileUrl, status, lastAttemptAt

- Новый файл: `client/src/components/PlatformShareBlock.tsx`
  - Компонент блока 15 иконок

## Файловая структура изменений

```
shared/
└── newsPlatforms.ts          # NEW: Реестр 15 платформ

content/
└── news_distribution_settings.json  # NEW: Настройки платформ

server/
├── routes/news-api.ts        # MOD: +platforms API, +outbox dispatch/mark
├── repositories/news-repository.ts  # MOD: +ensureOutboxForPost
└── services/
    └── distribution-settings.ts  # NEW: Settings service

client/src/
├── pages/
│   ├── NewsArticle.tsx       # MOD: +PlatformShareBlock
│   └── admin/
│       └── NewsDistribution.tsx  # NEW: Админ UI
└── components/
    └── PlatformShareBlock.tsx    # NEW: Блок иконок

docs/
└── news-distribution.md      # NEW: Архитектура

reports/
├── news-distribution-plan.md     # NEW: Этот план
└── news-distribution-report.md   # NEW: Отчёт
```

## API Контракт

### GET /api/news/platforms
Ответ:
```json
{
  "ok": true,
  "platforms": [
    { "id": "telegram", "title": "Telegram", ... }
  ],
  "settings": {
    "telegram": { "enabled": true, "profileUrl": "https://t.me/mspro", ... }
  },
  "aggregated": {
    "telegram": { "lastStatus": "published", "lastAttemptAt": "2025-..." }
  }
}
```

### PUT /api/news/platforms
Security: x-mspro-news-secret
```json
{ "platformId": "telegram", "enabled": true, "profileUrl": "https://t.me/mspro" }
```

### POST /api/news/outbox/dispatch
Security: x-mspro-news-secret
```json
{ "limit": 10, "platforms": ["telegram", "vk"] }
```
Ответ:
```json
{ "ok": true, "items": [{ "id": "...", "postId": "...", "platform": "telegram", "payload": {...} }] }
```

### POST /api/news/outbox/mark
Security: x-mspro-news-secret
```json
{
  "results": [
    { "id": "job-id", "status": "published", "remoteUrl": "https://t.me/...", "error": null }
  ]
}
```

## CHECKPOINT #1 ГОТОВ

Дата: 2025-12-29
Статус: Audit & Plan завершён
