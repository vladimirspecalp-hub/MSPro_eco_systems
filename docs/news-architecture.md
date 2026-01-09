# News/Media Architecture v2.0

## Обзор

Модуль News/Media обеспечивает полный цикл управления новостями:
материал → n8n → ingest → publish → canonical URL → n8n crosspost → callback → outbox statuses

## Схема потока данных

```
┌─────────────┐     ┌─────────┐     ┌─────────────┐     ┌───────────────┐
│  Material   │────▶│   n8n   │────▶│  /api/news  │────▶│  News Store   │
│  (source)   │     │ workflow│     │   /ingest   │     │  (JSON/DB)    │
└─────────────┘     └─────────┘     └─────────────┘     └───────────────┘
                                           │                    │
                                           ▼                    ▼
                                    ┌─────────────┐     ┌───────────────┐
                                    │  Canonical  │     │  Distribution │
                                    │    URL      │     │    Outbox     │
                                    └─────────────┘     └───────────────┘
                                           │                    │
                                           ▼                    ▼
                                    ┌─────────────┐     ┌───────────────┐
                                    │ Share Links │     │  n8n Crosspost│
                                    │  (UTM)      │────▶│   Callback    │
                                    └─────────────┘     └───────────────┘
```

## API Endpoints

### Ingest (n8n integration)

**POST /api/news/ingest**
- Security: `x-mspro-news-secret` header
- Body:
```json
{
  "externalId": "n8n-run-12345",
  "slug": "novaya-statya",
  "title": "Заголовок статьи",
  "excerpt": "Краткое описание",
  "contentMarkdown": "# Markdown content",
  "contentHtml": "<h1>HTML content</h1>",
  "tags": ["покраска", "антикоррозия"],
  "category": "технологии",
  "coverImageUrl": "https://example.com/image.jpg",
  "geo": { "regionCode": "msk", "city": "Москва" },
  "status": "draft"
}
```
- Response:
```json
{
  "ok": true,
  "post": { ... },
  "canonicalUrl": "https://site.com/news/novaya-statya",
  "shareLinks": {
    "telegram": "https://site.com/news/novaya-statya?utm_source=telegram&utm_medium=social&utm_campaign=news&utm_content=novaya-statya",
    "vk": "...",
    "dzen": "..."
  }
}
```

### Public Reading

**GET /api/news**
- Query: `?status=published&tag=покраска&limit=20&offset=0`

**GET /api/news/:slug**
- Для draft: добавить `?draft=1` + header `x-mspro-news-secret`

**GET /api/news/rss.xml**
- RSS 2.0 feed

**GET /api/news/sitemap.xml**
- News Sitemap для Google

### Distribution

**POST /api/news/:id/publish**
- Security: `x-mspro-news-secret`

**POST /api/news/distribution/enqueue**
- Body: `{ "postId": "...", "platforms": ["telegram", "vk", "dzen"] }`

**POST /api/news/distribution/callback**
- Body: `{ "jobId": "...", "status": "posted", "remoteUrl": "https://t.me/..." }`

**GET /api/news/distribution/jobs**
- Query: `?postId=...`

## Модель данных

### NewsPost
```typescript
interface NewsPost {
  id: string;
  externalId: string | null;  // для идемпотентности n8n
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  contentHtml: string;
  coverImageUrl: string | null;
  tags: string[];
  category: string | null;
  geo: { regionCode?: string; city?: string } | null;
  status: "draft" | "scheduled" | "published" | "archived";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo: { title?; description?; keywords?; canonicalUrl? };
  aeo: { answerBlock?; faq?: {q,a}[] };
  source: { type: "material"|"manual"|"n8n"; ref? };
}
```

### NewsDistributionJob
```typescript
interface NewsDistributionJob {
  id: string;
  postId: string;
  platform: string;  // telegram|vk|dzen|ok|linkedin|medium|reddit|...
  status: "queued" | "posting" | "posted" | "failed";
  attempts: number;
  scheduledAt: string | null;
  postedAt: string | null;
  remoteUrl: string | null;
  backlinkUrl: string;  // с UTM
  lastError: string | null;
}
```

## Платформы (targets)

| Platform | Status | Notes |
|----------|--------|-------|
| telegram | ✅ Stub | Готов к интеграции |
| vk | ✅ Stub | Готов к интеграции |
| dzen | ✅ Stub | Планируется |
| ok | ✅ Stub | Планируется |
| linkedin | ✅ Stub | Планируется |
| twitter | ✅ Stub | Планируется |
| facebook | ✅ Stub | Планируется |
| medium | ✅ Stub | Планируется |
| reddit | ✅ Stub | Планируется |
| youtube | ⏳ TBD | Требует видео-контент |
| rutube | ⏳ TBD | Требует видео-контент |

## Backlinks/CTR стратегия

Каждая новость автоматически получает:
1. **Canonical URL** - стабильный адрес
2. **OpenGraph/Twitter meta** - для превью в соцсетях
3. **JSON-LD schema** - NewsArticle для поисковиков
4. **Share links с UTM** - для трекинга источников трафика

UTM структура:
- `utm_source` = platform (telegram, vk, dzen...)
- `utm_medium` = social
- `utm_campaign` = news
- `utm_content` = slug

## Environment Variables

```env
NEWS_INGEST_SECRET=your-secret-here
SITE_URL=https://mspro-ltd.ru
NEWS_CANONICAL_BASE=/news
```

## Хранилище

### Текущая реализация (v1)
- Файловое хранилище: `/content/news_store.json`
- In-memory cache для производительности
- Идемпотентность через externalId

### Планируемая реализация (v2)
- PostgreSQL через Drizzle ORM
- Supabase интеграция
- Real-time обновления
