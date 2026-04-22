# DEPRECATED — НЕ ЗАПУСКАТЬ

Автогенерация SEO-страниц через OpenAI остановлена по решению **2026-04-21**.

## Почему
- Автогенерация давала нестабильное качество.
- Подход «1500 клонов по городам» больше не соответствует стратегии.
- Ключи OpenAI/Gemini удалены из `.env` — скрипты не запустятся.

## Что в этой папке
- [`generate-seo.mjs`](generate-seo.mjs) — генератор SEO-страниц через OpenAI
- [`generate-price-guides.mjs`](generate-price-guides.mjs) — генератор ценовых гайдов по городам
- [`verify-seo-benefits.ts`](verify-seo-benefits.ts) — верификатор TextMixer уникальности
- [`intermediate-output/`](intermediate-output/) — промежуточные артефакты автогенерации (~1491 JSON), не используются в рантайме

## Что НЕ устарело
- `scripts/generate-sitemap.mjs` — **оставлен в работе**, sitemap генерируется регулярно.
- `scripts/expert_audit.mjs` — SEO-аудит, используется visibility-агентом.
- `content/seo_generated/all_seo_content.json` + слаги — **работают в production**, не трогать. План ретайра — отдельная задача visibility-агента.

## Если всё же нужно запустить (исторически)
Не запускать. Обсудить с visibility/devops прежде чем даже думать.
