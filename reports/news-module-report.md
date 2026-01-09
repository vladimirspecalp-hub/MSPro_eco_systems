# News Module Report v2.0

## Что сделано

### 1. Модель данных
- ✅ Расширенная схема NewsPost с полями:
  - externalId для идемпотентности n8n
  - contentMarkdown/contentHtml
  - geo (regionCode, city)
  - seo (title, description, keywords, canonicalUrl)
  - aeo (answerBlock, faq) - заглушки для ConfiuiAI
  - source (type, ref)

### 2. Хранилище
- ✅ INewsRepository интерфейс
- ✅ FileNewsRepository реализация
- ✅ JSON storage: /content/news_store.json
- ✅ In-memory cache
- ✅ Идемпотентность через externalId

### 3. API Endpoints
- ✅ POST /api/news/ingest (n8n)
- ✅ GET /api/news (list)
- ✅ GET /api/news/:slug (detail)
- ✅ POST /api/news/:id/publish
- ✅ GET /api/news/rss.xml
- ✅ GET /api/news/sitemap.xml
- ✅ POST /api/news/distribution/enqueue
- ✅ POST /api/news/distribution/callback
- ✅ GET /api/news/distribution/jobs
- ✅ POST /api/news/compile (stub)

### 4. Distribution Outbox
- ✅ NewsDistributionJob модель
- ✅ Создание заданий для платформ
- ✅ Callback обработка
- ✅ UTM-ссылки генерация

### 5. UI
- ✅ /news - листинг
- ✅ /news/:slug - детальная страница
- ✅ JSON-LD schema
- ✅ OG meta tags

### 6. Документация
- ✅ docs/news-architecture.md
- ✅ reports/news-module-report.md

## Как проверить (curl)

### Ingest новости
```bash
curl -X POST http://localhost:5000/api/news/ingest \
  -H "Content-Type: application/json" \
  -H "x-mspro-news-secret: mspro-news-secret-dev" \
  -d '{
    "externalId": "test-001",
    "title": "Тестовая новость",
    "excerpt": "Краткое описание тестовой новости",
    "contentMarkdown": "# Заголовок\n\nТекст новости...",
    "status": "published"
  }'
```

### Получить список
```bash
curl http://localhost:5000/api/news
```

### Получить статью
```bash
curl http://localhost:5000/api/news/testovaya-novost
```

### RSS feed
```bash
curl http://localhost:5000/api/news/rss.xml
```

### Enqueue distribution
```bash
curl -X POST http://localhost:5000/api/news/distribution/enqueue \
  -H "Content-Type: application/json" \
  -H "x-mspro-news-secret: mspro-news-secret-dev" \
  -d '{"postId": "...", "platforms": ["telegram", "vk"]}'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEWS_INGEST_SECRET | Secret для n8n | mspro-news-secret-dev |
| SITE_URL | Base URL сайта | https://mspro-ecosystems.replit.app |
| NEWS_CANONICAL_BASE | Base path для новостей | /news |

## Заглушки для будущего

1. **ConfiuiAI** - endpoint /api/news/compile готов
2. **Real platform adapters** - структура готова в distribution service
3. **Supabase storage** - schema.ts уже содержит модели

## Известные ограничения

1. Файловое хранилище - временное решение
2. Platform adapters - заглушки без реальных API calls
3. AEO поля - пустые, ждут ConfiuiAI
