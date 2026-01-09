# MS-PRO_Ecosystems

## Overview

MS-PRO_Ecosystems is a B2B industrial services platform for MS-PRO company, specializing in **industrial rope access** (промышленный альпинизм) for applying fireproof coatings (ОГЗ) and anticorrosion protection (АКЗ) on industrial structures at height. The application is designed as an SEO-driven lead generation system with conversion-focused features including interactive pricing calculators, multi-step forms, and real-time notifications.

**Core Positioning**: Industrial rope access is the primary service, not coating manufacturing. MS-PRO applies customer-provided materials or supplies by agreement.

The platform follows a modular architecture with a React frontend, Express backend, and PostgreSQL database (via Drizzle ORM). It uses a content-driven approach for SEO pages with dynamic routing and structured data optimization.

**Status**: v3.3 Complete - Adaptive Copy System + 8-Intent Hero
- ✅ Copy System v1.0 with 8 Hero variants (default, price, urgent, safety, lep, ams, stack, single)
- ✅ AdaptiveHero component with ?intent= query param switching
- ✅ Service pages: rope-access, fireproofing-at-height, anticorrosion-at-height with Answer Blocks + FAQ
- ✅ Documents page with MChS license (63-06-2023-003418) + SRO credentials (#1623, #455)
- ✅ Lead capture system with database persistence
- ✅ Interactive pricing calculator
- ✅ MSPRO Quad presentation module
- ✅ Dynamic SEO pages from JSON (2449 pages)
- ✅ Dark mode support
- ✅ Fully responsive B2B design
- ✅ SEO API Live (6 endpoints, 5-min cache)
- ✅ GEO Layer 2.0 (17 regions, middleware)
- ✅ AEO Smart Generator (AI FAQ, JSON-LD schemas)
- ✅ UX Personalization (A/B testing, CRO metrics)
- ✅ Health Check API (liveness/readiness probes)
- ✅ News/Media Module v1.0 (10 endpoints, n8n integration)
- ✅ Distribution Outbox (Telegram, VK, Dzen, RSS adapters)
- ✅ RSS Feed + News Sitemap generation
- ✅ Analytics Scaffold v1 (unified tracking layer, dataLayer, GTM/YM/GA support)

## User Preferences

Preferred communication style: Simple, everyday language (Russian).

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety and modern component patterns
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management with disabled refetching (staleTime: Infinity)

**UI Framework:**
- shadcn/ui component library (New York style) with Radix UI primitives
- TailwindCSS for styling with custom design system
- CSS variables for theming with light/dark mode support

**Design System:**
- Custom B2B industrial design inspired by Stripe and Linear
- Primary brand colors: Deep professional blue (220 85% 35%) for trust
- Inter font family for excellent Russian character support
- Mobile-first responsive approach for field managers and contractors

**State Management:**
- React Query for API data with custom fetch utilities
- Form state managed via React Hook Form with Zod validation (@hookform/resolvers)
- Local component state for UI interactions

**Module Organization:**
The application uses feature-based modules under `client/src/modules/`:
- `calculator/` - Commercial proposal pricing calculator
- `leads/` - Lead capture and submission forms
- `telegram/` - Telegram notification integration
- `msproquad/` - Product presentation for MSPRO Quad coating
- `analytics/` - Unified tracking layer (dataLayer, GTM, YM, GA, Hotjar support)

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript running on Node.js
- ESM module system (type: "module" in package.json)
- Custom request logging middleware for API endpoints

**Database Layer:**
- PostgreSQL via Replit's built-in database service
- Drizzle ORM for type-safe database queries and migrations
- Schema defined in `shared/schema.ts` for frontend/backend sharing
- Migrations applied via `npm run db:push` (drizzle-kit)
- Connection via DATABASE_URL environment variable

**Storage Interface:**
- Abstract `IStorage` interface in `server/storage.ts`
- Current implementation: `DatabaseStorage` with Drizzle ORM
- All data persisted in PostgreSQL database
- Automatic cost calculation for pricing estimates

**Tables:**
- `leads` - Customer inquiries with contact info and service type
- `calculations` - Pricing estimates with auto-calculated costs based on surface area and height
- `news_articles` - News content with SEO metadata, JSON-LD, canonical URLs
- `news_outbox` - Distribution queue for cross-posting to platforms (Outbox pattern)

**API Design:**
- RESTful endpoints prefixed with `/api`
- JSON request/response format
- Session management via connect-pg-simple (PostgreSQL session store)
- CRUD operations abstracted through storage interface

**Optimization Core v3.0 API Modules:**
- `server/services/seo-service.ts` — SEO data with 5-min cache (2449 pages)
- `server/services/aeo-service.ts` — AI FAQ generator with OpenAI gpt-4o-mini
- `server/services/ux-personalization.ts` — A/B testing and CRO metrics
- `server/middleware/geo-context.ts` — GEO region detection (17 regions)
- `server/routes/seo-api.ts` — 6 SEO endpoints
- `server/routes/geo-api.ts` — 4 GEO endpoints
- `server/routes/aeo-api.ts` — 4 AEO endpoints
- `server/routes/ux-api.ts` — 6 UX endpoints
- `server/routes/health-api.ts` — 4 Health endpoints
- `server/routes/news-api.ts` — 10 News endpoints (CRUD, ingest, RSS, sitemap)
- `server/services/news-service.ts` — News management with n8n integration
- `server/services/distribution-service.ts` — Cross-posting Outbox with platform adapters
- `server/middleware/n8n-auth.ts` — n8n webhook authentication

### Content-Driven SEO Architecture

**SEO Strategy:**
- JSON-based content management in `content/seo_core.json`
- Structured data for service pages (chimney painting, anti-corrosion, MSPRO Quad)
- Catch-all routing pattern for dynamic page generation
- Meta tag optimization per service/location

**Content Structure:**
Each SEO entry contains:
- `slug` - URL path
- `title` - Page title for SEO
- `description` - Meta description
- `cta` - Call-to-action text

### Build and Deployment

**Development:**
- `npm run dev` - Runs tsx server with Vite middleware in development mode
- Hot module replacement (HMR) via Vite dev server
- Replit-specific plugins for error overlay and dev tools

**Production:**
- `npm run build` - Vite builds client to `dist/public`, esbuild bundles server to `dist/`
- `npm start` - Runs compiled server in production mode
- Server-side rendering setup in `server/vite.ts` for initial page loads

**Database:**
- `npm run db:push` - Pushes Drizzle schema changes to PostgreSQL

### Authentication & Sessions

**Planned Implementation:**
- User schema defined with username/password fields
- Session storage via connect-pg-simple with PostgreSQL backing
- Password hashing (implementation pending)
- API routes will use storage interface for user CRUD

### Form Handling

**Architecture:**
- React Hook Form for form state and validation
- Zod schemas via @hookform/resolvers for runtime validation
- Drizzle-zod integration for generating validation schemas from database models
- Multi-step form patterns for lead capture workflow

## External Dependencies

### Database & Backend Services

**PostgreSQL Database:**
- Replit's built-in PostgreSQL database service
- Database URL configured via `DATABASE_URL` environment variable
- Drizzle ORM integration for type-safe queries
- Tables: `leads`, `calculations`
- Auto-generated UUIDs for primary keys
- Automatic cost calculation in calculations endpoint

**Required Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string (automatically provided by Replit)
- `OPENAI_API_KEY` - OpenAI API key for AEO AI generation
- `TELEGRAM_BOT_TOKEN` - Telegram bot token for notifications (optional)
- `TELEGRAM_CHAT_ID` - Telegram chat ID for alerts (optional)
- `VITE_SUPABASE_URL` - Supabase project URL (configured)
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key for client (configured)
- `GITHUB_TOKEN` - GitHub token for automatic sync (configured)
- `N8N_WEBHOOK_SECRET` - Shared secret for n8n webhook authentication (optional)
- `BASE_URL` - Base URL for canonical URLs in news articles (optional)

### Third-Party APIs

**Telegram Bot API (Planned):**
- Real-time lead notifications to MS-PRO team
- Module placeholder in `client/src/modules/telegram/`
- Integration logic to be implemented

**Email Service (Planned):**
- Email utilities placeholder in `client/src/lib/email.ts`
- For lead confirmation and customer communication

**Geo-Targeting (Planned):**
- Geographic targeting utilities in `client/src/lib/geo.ts`
- For location-based content and lead routing

### UI Component Libraries

**Radix UI:**
- Headless component primitives for accessibility
- Comprehensive set: Accordion, Dialog, Dropdown, Popover, Toast, Tabs, etc.
- Provides keyboard navigation and ARIA attributes

**shadcn/ui:**
- Pre-styled Radix components with TailwindCSS
- Customizable via `components.json` configuration
- New York style variant selected

### Development Tools

**Replit Integration:**
- `@replit/vite-plugin-runtime-error-modal` - Development error overlay
- `@replit/vite-plugin-cartographer` - Code navigation
- `@replit/vite-plugin-dev-banner` - Development environment banner
- Conditionally loaded only in Replit development environment

### Asset Management

**Brand Assets:**
- Stored in `public/brend/` directory
- Includes logos and marketing images
- Accessible via Vite's public directory serving

### Typography

**Google Fonts:**
- Inter - Primary font for UI and content
- Architects Daughter, DM Sans, Fira Code, Geist Mono - Additional fonts loaded
- Optimized loading via preconnect to fonts.googleapis.com