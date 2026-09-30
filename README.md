# AI Social Media Agent MVP

A full-stack Next.js MVP for generating, reviewing, and scheduling social posts for LinkedIn and X with a polished dashboard UI and mock backend foundations.

## Features

- Responsive dashboard with navigation for:
  - Dashboard
  - Create Post
  - Calendar
  - Drafts / Approval Queue
  - Analytics
  - Connected Accounts
  - Settings
- Dashboard overview cards + weekly activity chart (clearly labeled mock/demo data)
- Create Post flow with:
  - Topic/prompt input
  - Platform selection (LinkedIn, X)
  - Language (English, Hindi, Hinglish)
  - Tone and publish mode
  - `AI Generate` button hitting local API route
- Deterministic mock content generation when no AI credentials are configured
- Platform-specific variants with editable text, character counts, hashtags, regenerate buttons, and preview cards
- Approval queue to approve, edit, reject, or move drafts to scheduling
- Calendar/agenda scheduling UI with date-time selection and scheduled post listing
- Connected Accounts and Settings pages with explicit OAuth/API integration placeholders
- Typed API and service abstractions for generation, drafts, scheduling, and analytics

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- API routes for backend foundation

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy env template:

   ```bash
   cp .env.example .env.local
   ```

3. Run development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Available Scripts

- `npm run dev` – start local dev server
- `npm run lint` – run ESLint
- `npx tsc --noEmit` – typecheck
- `npm run build` – production build

## Environment Variables

See `.env.example`.

Important notes:

- Do **not** commit real secrets.
- If `OPENAI_API_KEY` is not set, `/api/generate` returns deterministic mock content by design.
- Connected Accounts page is a placeholder only; publishing does not work without real LinkedIn/X credentials and OAuth flow.

## Architecture Notes

- `lib/models.ts` – shared domain types
- `lib/validation.ts` – request validation helpers
- `lib/services/mock-generator.ts` – deterministic mock generation service
- `lib/services/mock-store.ts` – in-memory draft/schedule/analytics store (easy to replace with DB layer)
- `app/api/*` – backend API route boundaries for generation, drafts, scheduling, analytics
- `app/*` – UI pages and responsive dashboard layout

## Next Steps for Production

1. **OpenAI integration**
   - Replace `mock-generator` with provider adapter calling OpenAI responses API/chat API.
   - Add prompt templates, guardrails, and retry/rate-limit handling.
2. **LinkedIn OAuth/API**
   - Implement OAuth callback route.
   - Persist encrypted tokens and account mapping.
   - Publish posts via LinkedIn API endpoints.
3. **X API integration**
   - Add OAuth/token lifecycle handling.
   - Publish tweets/threads via X endpoints.
4. **Database**
   - Replace in-memory `mock-store` with PostgreSQL (e.g., Prisma/Drizzle).
   - Add migrations for drafts, schedules, approvals, account tokens, and analytics snapshots.
5. **Production scheduler**
   - Add worker queue (BullMQ/Redis, Temporal, or cloud scheduler).
   - Execute scheduled posts reliably with retries and audit logs.
6. **Auth + RBAC**
   - Add user authentication and role-based approvals.
7. **Observability**
   - Add structured logs, metrics, and alerting for publishing failures.

## Current MVP Scope

This repository currently provides a runnable frontend + backend foundation with mock persistence and deterministic local generation, suitable for iterative integration with real AI and social APIs.
