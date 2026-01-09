# News Architecture v1 — Implementation Plan

## ЭТАП 0: Audit Results

### Текущая структура проекта

**Server Routes (server/routes.ts):**
- News API уже подключен: `app.use("/api/news", newsApiRouter)` (строка 36)
- Существующие API модули: seo-api, geo-api, aeo-api, ux-api, health-api

**Server Routes Directory (server/routes/):**
- news-api.ts ✅ (уже создан)
- Паттерн: Express Router, экспорт default

**Server Services Directory (server/services/):**
- news-service.ts ✅ (уже создан)
- distribution-service.ts ✅ (уже создан)
- Паттерн: классы с методами, export singleton

**Client Routing (client/src/App.tsx):**
- `/news` → News component ✅
- `/news/:slug` → NewsArticle component ✅
- Паттерн: wouter Switch/Route

### Файлы для добавления/модификации

| Файл | Действие | Назначение |
|------|----------|------------|
| server/repositories/news-repository.ts | Существует | File-based fallback storage |
| server/routes/news-api.ts | Модификация | Добавить RSS, sitemap |
| server/services/distribution-service.ts | Существует | Outbox pattern для n8n |
| content/news_store.json | Создать | JSON storage для новостей |
| client/src/pages/News.tsx | Существует | Список новостей |
| client/src/pages/NewsArticle.tsx | Существует | Детальная страница |
| docs/news-architecture.md | Создать | Техническая документация |
| reports/news-module-report.md | Создать | Финальный отчёт |

### Endpoint Structure

```
POST /api/news/ingest          — n8n webhook (protected)
GET  /api/news                 — Public list
GET  /api/news/:slug           — Public detail + JSON-LD
GET  /api/news/rss.xml         — RSS 2.0 feed
GET  /api/news/sitemap.xml     — News Sitemap
POST /api/news/:id/publish     — Publish draft (protected)
POST /api/news/distribution/enqueue   — Queue crosspost
POST /api/news/distribution/callback  — n8n callback
GET  /api/news/distribution/jobs      — List jobs
```

### Storage Strategy

**Primary:** PostgreSQL через Drizzle ORM
- Таблица `news_articles` (schema.ts)
- Таблица `news_outbox` для distribution jobs

**Fallback:** File-based JSON
- Путь: `content/news_store.json`
- Формат: `{ posts: NewsPost[], jobs: DistributionJob[] }`

### n8n Integration Flow

```
1. n8n собирает контент → POST /api/news/ingest
2. API возвращает canonicalUrl + shareLinks с UTM
3. n8n постит в платформы (Telegram, VK, Dzen...)
4. Платформы возвращают remoteUrl
5. n8n вызывает POST /api/news/distribution/callback
6. Outbox обновляет статус job
```

### Security

- Header: `x-mspro-news-secret`
- Env: `NEWS_INGEST_SECRET`
- Идемпотентность: по `externalId` (upsert)

### UTM Structure

```
?utm_source={platform}
&utm_medium=social
&utm_campaign=news
&utm_content={slug}
```

### Environment Variables

```env
NEWS_INGEST_SECRET=your-secret-here
SITE_URL=https://mspro-ecosystems.replit.app
NEWS_CANONICAL_BASE=/news
```

---

## Чеклист CHECKPOINT #1

- [x] Изучен server/routes.ts — news-api уже подключен
- [x] Изучена структура server/routes/* — паттерн Express Router
- [x] Изучена структура server/services/* — паттерн service classes
- [x] Изучен клиентский роутинг — wouter, /news и /news/:slug
- [x] Создан /reports/news-plan.md

**Готов к ЭТАПУ 1: Data model + Repository + Ingest API**
