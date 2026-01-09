# News Distribution Center v1 — Архитектура

## Обзор

News Distribution Center — это система автоматической публикации новостей на 15 внешних площадок через n8n интеграцию. Каждая новость при публикации автоматически создаёт outbox-записи для всех платформ с корректными UTM-метками.

## Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                      NEWS ARTICLE                            │
│                    POST /:id/publish                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               ensureOutboxForPost(postId)                    │
│   Создаёт/обновляет 15 outbox jobs (идемпотентно)           │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │ Telegram│        │   VK    │        │   ...   │
   │ queued  │        │ disabled│        │  x15    │
   └────┬────┘        └─────────┘        └────┬────┘
        │                                      │
        └──────────────────┬───────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│            POST /api/news/outbox/dispatch                    │
│      n8n забирает queued jobs пачками                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       n8n WORKFLOW                           │
│   Публикует на площадки → возвращает статусы                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│            POST /api/news/outbox/mark                        │
│   Обновляет статусы: published/failed + remoteUrl            │
└─────────────────────────────────────────────────────────────┘
```

## Реестр 15 платформ

| ID | Название | Share URL |
|----|----------|-----------|
| telegram | Telegram | t.me/share/url |
| vk | ВКонтакте | vk.com/share.php |
| dzen | Дзен | — |
| tenchat | TenChat | — |
| vc | VC.ru | — |
| habr | Хабр | — |
| youtube | YouTube | — |
| rutube | Rutube | — |
| ok | Одноклассники | connect.ok.ru/offer |
| yandex_business | Яндекс Бизнес | — |
| google_business | Google Мой Бизнес | — |
| 2gis | 2ГИС | — |
| threads | Threads | — |
| linkedin | LinkedIn | linkedin.com/sharing |
| email_digest | Email рассылка | — |

## Структура Settings

Файл: `content/news_distribution_settings.json`

```json
{
  "platforms": {
    "telegram": {
      "enabled": true,
      "profileUrl": "https://t.me/mspro_news",
      "webhookTokenPlaceholder": null,
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "lastUpdated": "2025-01-01T00:00:00.000Z"
}
```

## Outbox Payload Schema

```typescript
interface OutboxPayload {
  title: string;        // Заголовок статьи
  excerpt: string;      // Краткое описание
  url: string;          // Canonical URL + UTM
  image: string | null; // Cover image
  tags: string[];       // Теги
  publishedAt: string;  // Дата публикации
}
```

## API Endpoints

### Платформы

#### GET /api/news/platforms
Получить список платформ и настройки.

**Без секрета:** возвращает публичные данные (enabled, profileUrl)
**С секретом:** возвращает полные настройки + webhookTokenPlaceholder

```bash
curl http://localhost:5000/api/news/platforms
```

Ответ:
```json
{
  "ok": true,
  "platforms": [...],
  "settings": { "telegram": { "enabled": true, "profileUrl": "..." } },
  "aggregated": { "telegram": { "lastStatus": "published", "publishedCount": 5 } }
}
```

#### PUT /api/news/platforms
Обновить настройку платформы.

**Security:** x-mspro-news-secret

```bash
curl -X PUT http://localhost:5000/api/news/platforms \
  -H "Content-Type: application/json" \
  -H "x-mspro-news-secret: your-secret" \
  -d '{"platformId": "telegram", "enabled": true, "profileUrl": "https://t.me/mspro"}'
```

### Outbox (n8n)

#### POST /api/news/outbox/dispatch
Выдать queued jobs для n8n. При выдаче помечает jobs как "posting".

**Security:** x-mspro-news-secret

```bash
curl -X POST http://localhost:5000/api/news/outbox/dispatch \
  -H "Content-Type: application/json" \
  -H "x-mspro-news-secret: your-secret" \
  -d '{"limit": 10, "platforms": ["telegram", "vk"]}'
```

Ответ:
```json
{
  "ok": true,
  "items": [
    {
      "id": "job-123",
      "postId": "post-456",
      "platform": "telegram",
      "status": "posting",
      "payload": {
        "title": "Новая статья",
        "excerpt": "...",
        "url": "https://site.ru/news/slug?utm_source=telegram&...",
        "image": "...",
        "tags": ["tech"],
        "publishedAt": "2025-01-01T00:00:00.000Z"
      }
    }
  ],
  "count": 1
}
```

#### POST /api/news/outbox/mark
Обновить статусы jobs от n8n.

**Security:** x-mspro-news-secret

```bash
curl -X POST http://localhost:5000/api/news/outbox/mark \
  -H "Content-Type: application/json" \
  -H "x-mspro-news-secret: your-secret" \
  -d '{
    "results": [
      {"id": "job-123", "status": "published", "remoteUrl": "https://t.me/mspro/456"},
      {"id": "job-124", "status": "failed", "error": "Rate limit exceeded"}
    ]
  }'
```

### Публикация (с auto-outbox)

#### POST /api/news/:id/publish
Публикует статью и автоматически создаёт/обновляет 15 outbox jobs.

```bash
curl -X POST http://localhost:5000/api/news/post-123/publish \
  -H "x-mspro-news-secret: your-secret"
```

Ответ:
```json
{
  "ok": true,
  "post": {...},
  "outboxJobs": 15
}
```

## n8n Flow (пример)

1. **Schedule Trigger** → каждые 5 минут
2. **HTTP Request** → POST /api/news/outbox/dispatch
3. **Split In Batches** → обработка по одному
4. **Switch** → по platform
5. **Telegram/VK/etc. Node** → публикация
6. **Set** → формирование результата
7. **HTTP Request** → POST /api/news/outbox/mark

## Environment Variables

```env
NEWS_INGEST_SECRET=your-secret-here
SITE_URL=https://mspro-ltd.ru
```

## UI Компоненты

### PlatformShareBlock
Блок на странице новости с 15 иконками:
- enabled + profileUrl → кликабельная иконка + share кнопка
- disabled → серая иконка + tooltip "Скоро"

### /admin/news-distribution
Админ-панель для управления платформами:
- Toggle enabled/disabled
- Поле profileUrl
- Статус последней публикации
- Дата последней попытки

## Приватность

Никакие реальные токены площадок не хранятся в git.
webhookTokenPlaceholder — заглушка для будущей интеграции.
