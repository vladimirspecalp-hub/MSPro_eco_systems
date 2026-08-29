# AGENTS.md

## Cursor Cloud specific instructions

### Overview
MS-PRO_Ecosystems is a single full-stack application (not a monorepo): React + Vite frontend and Express.js backend served from one Node.js process on port 5000. PostgreSQL is the only required external service.

### Services

| Service | Required | How to run |
|---------|----------|------------|
| PostgreSQL | Yes | `sudo pg_ctlcluster 16 main start` (if not already running) |
| App (dev) | Yes | `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mspro" OPENAI_API_KEY="sk-dummy" npm run dev` |

### Key commands
See `package.json` scripts. Summary:
- **Dev server**: `npm run dev` (tsx + Vite HMR on port 5000)
- **Build**: `npm run build` (Vite client + esbuild server)
- **Type check**: `npm run check` (tsc)
- **DB migrations**: `npm run db:push` (drizzle-kit push)

### Non-obvious caveats

- **OPENAI_API_KEY required at startup**: The `server/services/ai_seo.ts` module eagerly initializes the OpenAI client at import time. The server will crash without `OPENAI_API_KEY` set. Use `OPENAI_API_KEY="sk-dummy"` for local dev if you don't need AEO/AI features.
- **DATABASE_URL**: Must point to a running PostgreSQL instance. Local dev default: `postgresql://postgres:postgres@localhost:5432/mspro`.
- **Pre-existing TypeScript errors**: `npm run check` (tsc) reports several type errors in `server/storage.ts`, `server/services/news-service.ts`, `server/repositories/news-repository.ts`, and `server/supabase-sync.ts`. These are pre-existing and do not block the dev server or build.
- **No automated test suite**: The repository does not include unit/integration tests or a test runner configuration.
- **No linter configured**: There is no ESLint or similar linter configuration in the repository.
- **Port 5000**: The app always serves on port 5000 (both API and client). Configure via `PORT` env var.
