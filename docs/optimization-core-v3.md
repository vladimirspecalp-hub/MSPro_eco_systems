# MSPRO Optimization Core v3.0 — Architecture

## Overview

MS-PRO Optimization Core v3.0 is a comprehensive API layer providing SEO, GEO, AEO (AI-powered), UX personalization, and health monitoring capabilities for the B2B industrial services platform.

## Module Architecture

```
server/
├── services/
│   ├── seo-service.ts      # SEO data layer with 5-min cache
│   ├── aeo-service.ts      # AI FAQ generator (OpenAI gpt-4o-mini)
│   └── ux-personalization.ts  # A/B testing engine
├── middleware/
│   └── geo-context.ts      # GEO region detection middleware
├── routes/
│   ├── seo-api.ts          # 6 SEO endpoints
│   ├── geo-api.ts          # 4 GEO endpoints
│   ├── aeo-api.ts          # 4 AEO endpoints
│   ├── ux-api.ts           # 6 UX endpoints
│   └── health-api.ts       # 4 Health endpoints
└── routes.ts               # Main router (mounts all API modules)
```

## API Endpoints (27 total)

### SEO API (6 endpoints)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/seo/pages` | GET | Paginated page list (2449 pages) |
| `/api/seo/page/:slug` | GET | Single page data by slug |
| `/api/seo/search` | GET | Search pages by query |
| `/api/seo/stats` | GET | SEO statistics |
| `/api/seo/related/:slug` | GET | Related pages |
| `/api/seo/cache/invalidate` | POST | Clear SEO cache |

### GEO API (4 endpoints)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/geo/context` | GET | Current region context |
| `/api/geo/regions` | GET | All 17 regions |
| `/api/geo/region/:code` | GET | Region by code |
| `/api/geo/localize` | POST | Localize content for region |

### AEO API (4 endpoints)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/aeo/generate` | POST | Generate AI FAQ |
| `/api/aeo/schema/:type` | GET | JSON-LD schema templates |
| `/api/aeo/validate` | POST | Validate FAQ content |
| `/api/aeo/quality-gates` | GET | Quality gate rules |

### UX API (6 endpoints)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ux/profile` | GET | User profile by session |
| `/api/ux/experiments` | GET | Active A/B experiments |
| `/api/ux/experiment/assign` | POST | Assign user to experiment |
| `/api/ux/track` | POST | Track UX events |
| `/api/ux/personalize` | POST | Get personalized content |
| `/api/ux/metrics` | GET | CRO metrics summary |

### Health API (4 endpoints)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Full health check |
| `/api/health/live` | GET | Kubernetes liveness probe |
| `/api/health/ready` | GET | Kubernetes readiness probe |
| `/api/health/api-status` | GET | All API module status |

### Legacy API (3 endpoints)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads` | POST | Submit lead form |
| `/api/calculations` | POST | Pricing calculation |
| `/api/ai_seo` | POST | AI SEO generation |

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Express API   │────▶│   PostgreSQL    │
│   React + TS    │     │   + Middleware  │     │   (Drizzle ORM) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   OpenAI API    │
                        │   (gpt-4o-mini) │
                        └─────────────────┘
```

## SEO Data Structure

Content stored in `content/seo_core.json` (2449 pages):
- `seo_full.json` — Main SEO pages
- `seo_industry.json` — Industry-specific pages
- `seo_location.json` — Location-based pages
- `seo_case.json` — Case study pages
- `seo_tech.json` — Technical pages
- `seo_faq.json` — FAQ pages (500 entries)

## GEO Regions (17 total)

| Code | Region | Priority |
|------|--------|----------|
| msk | Москва | high |
| spb | Санкт-Петербург | high |
| ural | Урал | medium |
| siberia | Сибирь | medium |
| volga | Поволжье | medium |
| south | Юг России | medium |
| ... | ... | ... |

## A/B Experiments

| ID | Name | Variants |
|----|------|----------|
| hero_cta_test | Hero CTA Test | A: "Получить КП", B: "Рассчитать стоимость" |
| pricing_layout | Pricing Layout | A: cards, B: table |
| form_length | Form Length | A: short, B: long |

## Environment Variables

```bash
# Required
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...

# Optional
OPENAI_MODEL=gpt-4o-mini
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

## Quick Start

```bash
# Development
npm run dev

# Test endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/seo/stats
curl http://localhost:5000/api/geo/context

# AI Generation (requires OPENAI_API_KEY)
curl -X POST http://localhost:5000/api/aeo/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"антикоррозийная защита","service":"Покраска дымовых труб"}'
```

## Caching Strategy

- **SEO Cache**: 5-minute TTL, in-memory Map
- **GEO Context**: Per-request middleware, no cache
- **AEO Generation**: No cache (AI calls are expensive)
- **UX Sessions**: In-memory Map (resets on restart)

## Security

- No API keys in git history
- `.env.example` provided with placeholder values
- OpenAI calls server-side only
- Input validation with Zod schemas
