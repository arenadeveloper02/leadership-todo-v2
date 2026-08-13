# Leadership ToDo

A polished, mobile-first task tracker for Position2 leadership with an iOS-native look (light/dark), backed by an Arena workflow API through a secure server-side proxy.

## Features

- **Tasks tab** — open tasks grouped on white cards, sorted by due date, with urgency-colored avatar dots (red = overdue, orange = due in 3 days, blue = due in 7 days, green = later/no date) and inline search
- **Add tab** — create a task with Task, Owner, and DueDate; EntryDate is auto-set to today
- **Done tab** — completed tasks with CompletedDate and one-tap Reopen
- **Stats tab** — Total, Open, Completed, Overdue, and Due-within-7-days cards
- **Bottom-sheet detail** — editable Comment and DueDate, Mark Complete / Reopen, Delete with confirm
- Full dark-mode support via `prefers-color-scheme`, safe-area insets, blur tab bar, smooth iOS-style transitions

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v3 + CSS design tokens (iOS system palette)
- Arena workflow backend proxied via `app/api/todo/route.ts` (key stays server-side)
- Prisma + Neon Postgres (app settings model)

## Local Setup

```bash
npm install
cp .env.example .env   # fill in ARENA_API_KEY (and DATABASE_URL for Prisma)
npm run dev
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `ARENA_WORKFLOW_URL` | Arena workflow execute endpoint (has a sensible default) |
| `ARENA_API_KEY` | Bearer token for the workflow — **server-side only** |
| `DATABASE_URL` | Neon Postgres connection string (injected by Vercel when Neon is connected) |

## Deploy

Deploy to Vercel. Set `ARENA_API_KEY` (and optionally `ARENA_WORKFLOW_URL`) in project environment variables. Connect Neon so `DATABASE_URL` is injected; the build runs `prisma generate && prisma db push && next build`.
