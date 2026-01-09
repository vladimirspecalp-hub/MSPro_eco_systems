# MS-PRO_Ecosystems

A digital ecosystem for MS-PRO industrial services company, focused on SEO-driven lead generation.

## Overview

MS-PRO_Ecosystems is a scalable web application designed for industrial services including chimney painting, anti-corrosion protection, and MSPRO Quad fireproof coating. The platform prioritizes SEO optimization and efficient lead capture.

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS + shadcn/ui
- **Routing**: Wouter (frontend)

## Project Structure

```
MS-PRO_Ecosystems/
├── client/src/
│   ├── pages/              # Page components
│   ├── components/ui/      # Reusable UI components (buttons, forms, cards)
│   ├── modules/            # Feature modules
│   │   ├── calculator/     # Commercial proposal calculator
│   │   ├── leads/          # Lead submission logic
│   │   ├── telegram/       # Telegram API integration
│   │   └── msproquad/      # MSPRO Quad coating presentation
│   └── lib/                # Utilities and clients
│       ├── supabase.ts     # Supabase client (future)
│       ├── email.ts        # Email service (future)
│       └── geo.ts          # Geo-targeting (future)
├── content/
│   └── seo_core.json       # SEO content data
├── public/brend/           # Brand assets (logos, images)
├── server/                 # Backend API routes
└── shared/                 # Shared types and schemas
```

## Key Features (Planned)

### Dynamic SEO Pages
- Universal catch-all routing via `app/[[...slug]]/page.tsx`
- Content-driven pages from `seo_core.json`
- Optimized meta tags and structured data

### Lead Generation
- Interactive pricing calculator
- Multi-step lead capture forms
- Telegram notifications for new leads
- Email automation

### MSPRO Quad Presentation
- Technical specifications showcase
- Before/after galleries
- Product benefits and applications

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# .env
DATABASE_URL=your_supabase_connection_string
```

3. Run development server:
```bash
npm run dev
```

## Architecture Principles

- **SEO-First**: Every page optimized for search engines
- **Modular Design**: Features organized in independent modules
- **Scalability**: Structure supports future integrations (CRM, analytics, etc.)
- **Type Safety**: TypeScript throughout for reliability

## Future Integrations

- Supabase for data persistence and analytics
- Telegram Bot API for instant lead notifications
- Email service for automated follow-ups
- Geo-targeting for regional SEO optimization

## License

Proprietary - MS-PRO Company
