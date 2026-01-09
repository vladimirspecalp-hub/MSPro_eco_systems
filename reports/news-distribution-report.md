# News Distribution Center v1 — Отчёт о реализации

## Статус: ЗАВЕРШЕНО

Дата: 2025-12-29

## Что сделано

### CHECKPOINT #1 — Audit & Plan
- [x] Изучены существующие файлы News модуля
- [x] Создан `/reports/news-distribution-plan.md`

### CHECKPOINT #2 — Platforms Registry + Settings API
- [x] Создан `shared/newsPlatforms.ts` (15 платформ)
- [x] Создан `content/news_distribution_settings.json`
- [x] Создан `server/services/distribution-settings.ts`
- [x] Добавлен GET /api/news/platforms
- [x] Добавлен PUT /api/news/platforms (secret protected)

### CHECKPOINT #3 — Outbox Sync on Publish
- [x] Добавлен `ensureOutboxForPost()` в news-repository
- [x] POST /:id/publish автоматически создаёт 15 outbox jobs
- [x] Идемпотентность обеспечена (не плодит дубли)

### CHECKPOINT #4 — n8n Endpoints
- [x] POST /api/news/outbox/dispatch — выдача queued jobs
- [x] POST /api/news/outbox/mark — обновление статусов

### CHECKPOINT #5 — UI: Platform Share Block
- [x] Создан `client/src/components/PlatformShareBlock.tsx`
- [x] Интегрирован в NewsArticle.tsx
- [x] 15 иконок с логикой enabled/disabled
- [x] Share кнопки с UTM

### CHECKPOINT #6 — Admin UI + Docs
- [x] Создан `/admin/news-distribution` route
- [x] Создан `client/src/pages/admin/NewsDistribution.tsx`
- [x] Создана документация `/docs/news-distribution.md`
- [x] Обновлён `.env.example`

## Тестирование (curl)

### 1. Получить платформы
```bash
curl http://localhost:5000/api/news/platforms
```

### 2. Включить Telegram
```bash
curl -X PUT http://localhost:5000/api/news/platforms \
  -H "Content-Type: application/json" \
  -H "x-mspro-news-secret: mspro-news-secret-dev" \
  -d '{"platformId": "telegram", "enabled": true, "profileUrl": "https://t.me/mspro"}'
```

### 3. Опубликовать статью (создаёт 15 outbox)
```bash
curl -X POST http://localhost:5000/api/news/POST_ID/publish \
  -H "x-mspro-news-secret: mspro-news-secret-dev"
```

### 4. Dispatch для n8n
```bash
curl -X POST http://localhost:5000/api/news/outbox/dispatch \
  -H "Content-Type: application/json" \
  -H "x-mspro-news-secret: mspro-news-secret-dev" \
  -d '{"limit": 5}'
```

### 5. Mark от n8n
```bash
curl -X POST http://localhost:5000/api/news/outbox/mark \
  -H "Content-Type: application/json" \
  -H "x-mspro-news-secret: mspro-news-secret-dev" \
  -d '{"results": [{"id": "JOB_ID", "status": "published", "remoteUrl": "https://t.me/..."}]}'
```

## Environment Variables

```env
NEWS_INGEST_SECRET=your-secret
SITE_URL=https://mspro-ltd.ru
```

## Файлы изменены/созданы

### Backend
- `shared/newsPlatforms.ts` — NEW: реестр 15 платформ
- `content/news_distribution_settings.json` — NEW: настройки платформ
- `server/services/distribution-settings.ts` — NEW: settings service
- `server/repositories/news-repository.ts` — MOD: +ensureOutboxForPost, +getQueuedJobs, +markJobsBatch
- `server/routes/news-api.ts` — MOD: +platforms API, +outbox dispatch/mark

### Frontend
- `client/src/components/PlatformShareBlock.tsx` — NEW
- `client/src/pages/admin/NewsDistribution.tsx` — NEW
- `client/src/pages/NewsArticle.tsx` — MOD: +PlatformShareBlock
- `client/src/App.tsx` — MOD: +admin route

### Docs
- `docs/news-distribution.md` — NEW
- `reports/news-distribution-plan.md` — NEW
- `reports/news-distribution-report.md` — NEW

## Acceptance Criteria

| # | Критерий | Статус |
|---|----------|--------|
| 1 | 15 платформ существуют как registry + выводятся в UI | ✅ |
| 2 | Настройки платформ сохраняются и переживают перезапуск | ✅ |
| 3 | Publish создаёт/обновляет outbox по 15 платформам без дублей | ✅ |
| 4 | Есть 2 endpoint'а под n8n: dispatch и mark | ✅ |
| 5 | На странице новости блок 15 платформ работает | ✅ |
| 6 | OG/JSON-LD, RSS, news sitemap не сломаны | ✅ |
| 7 | Никаких реальных токенов в git | ✅ |
