# Repository Summary: Leadership ToDo

> Auto-maintained by Sim Development. Last updated: 2026-08-13T17:17:16.889Z.

## Overview

A polished, mobile-first iOS-native styled task tracker for Position2 leadership, backed by an Arena workflow API via a secure server-side proxy, with Tasks, Add, Done, and Stats tabs, urgency color coding, and a bottom-sheet task detail editor.

**Repository:** `leadership-todo-v2`  
**File count:** 29

## Features

- iOS-native visual design with SF Pro system font stack, light/dark themes via prefers-color-scheme, and safe-area support
- Tasks tab with grouped list, search box, urgency-colored avatars, and due-date sorting
- Add tab with task/owner/due-date form (entry date auto-set to today)
- Done tab listing completed tasks with CompletedDate and one-tap reopen
- Stats tab with Total, Open, Completed, Overdue, and Due-within-7-days cards
- Bottom-sheet task detail with editable comment and due date, complete/reopen, and delete with confirm
- Server-side /api/todo proxy keeps ARENA_API_KEY secret; optimistic UI with re-fetch

## Tech Stack

- Next.js ^15.3.3 (App Router)
- React ^19.0.0
- Tailwind CSS v3
- TypeScript
- Prisma + PostgreSQL (Neon on Vercel)

## Infrastructure

- **Neon project ID:** `solitary-tree-71434736` — managed by Sim Development; do not delete or replace
- **DATABASE_URL:** set on Vercel when Neon is connected — do not commit real credentials

## Routes & Pages

- `/` — `app/page.tsx`

## Database Models

- `AppSetting`

## File Inventory

### App pages

- `app/error.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/not-found.tsx`
- `app/page.tsx`

### API routes

- `app/api/todo/route.ts`

### Components

- `components/AddTaskForm.tsx`
- `components/AppClient.tsx`
- `components/DoneList.tsx`
- `components/NavHeader.tsx`
- `components/StatsView.tsx`
- `components/TabBar.tsx`
- `components/TaskList.tsx`
- `components/TaskRow.tsx`
- `components/TaskSheet.tsx`

### Libraries

- `lib/prisma.ts`
- `lib/todo.ts`
- `lib/types.ts`
- `prisma/schema.prisma`

### Config

- `.env.example`
- `.gitignore`
- `next-env.d.ts`
- `next.config.ts`
- `package.json`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `tsconfig.json`

### Other

- `README.md`
- `REPO_SUMMARY.md`

## Complete File Index

- `.env.example`
- `.gitignore`
- `README.md`
- `REPO_SUMMARY.md`
- `app/api/todo/route.ts`
- `app/error.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/not-found.tsx`
- `app/page.tsx`
- `components/AddTaskForm.tsx`
- `components/AppClient.tsx`
- `components/DoneList.tsx`
- `components/NavHeader.tsx`
- `components/StatsView.tsx`
- `components/TabBar.tsx`
- `components/TaskList.tsx`
- `components/TaskRow.tsx`
- `components/TaskSheet.tsx`
- `lib/prisma.ts`
- `lib/todo.ts`
- `lib/types.ts`
- `next-env.d.ts`
- `next.config.ts`
- `package.json`
- `postcss.config.mjs`
- `prisma/schema.prisma`
- `tailwind.config.ts`
- `tsconfig.json`

## Latest Change

- **Updated at:** 2026-08-13T17:17:16.889Z
- **Request:** Build a polished, mobile-first "Leadership ToDo" web app for Position2 leadership — an ALTERNATIVE redesign of an existing task tracker. This is a brand-new standalone app; do not reference or break any existing deployment.

=== VISUAL DESIGN (match this exact aesthetic) ===
Clone the iOS-native look of Position2's "P2 People" app:
- SF Pro / -apple-system font stack, -webkit-font-smoothing:antialiased
- Light theme tokens: --bg #F2F2F7, --card #FFFFFF, --text #1C1C1E, --secondary #8E8E93, --accent #007AFF, --accent2 #5856D6, --green #34C759, --orange #FF9500, --red #FF3B30, --separator #C6C6C8
- Full dark-mode support via prefers-color-scheme (dark: --bg #000, --card #1C1C1E, --text #F2F2F7, --separator #38383A)
- Large 34px bold sticky nav title with a 13px grey subtitle underneath
- Rounded search box (bg #E5E5EA) with inline magnifier
- Fixed bottom tab bar with blur backdrop and SF-style icons + 10px labels; active tab in accent color
- Grouped list rows on white cards with 0.5px separators, colored circular avatars (initials), chevrons
- Bottom-sheet modal (slide up, rounded 16px top corners, drag handle) for task detail/edit — same as the People app profile sheet
- Respect safe-area insets (env(safe-area-inset-*)), viewport-fit=cover, apple-mobile-web-app meta tags
- Smooth 0.1-0.3s transitions, :active press states

=== TABS (bottom bar) ===
1. Tasks — grouped list of open tasks, sorted by DueDate (soonest first). Each row: colored urgency avatar dot, task title, owner + due date subtitle, chevron. Tapping opens the bottom-sheet to view/edit/complete.
2. Add — a form to create a task (Task text, Owner, DueDate date picker; EntryDate auto-set to today).
3. Done — completed tasks list showing CompletedDate; allow un-completing.
4. Stats — cards: Total, Open, Completed, Overdue, Due within 7 days.

=== URGENCY COLOR CODING (avatar dot / accents) ===
- Overdue (DueDate < today, not done): red #FF3B30
- Due within 3 days: orange #FF9500
- Due within 7 days: accent blue #007AFF
- Further out / no due date: green #34C759
- Completed: green #34C759

=== BACKEND API CONTRACT (use exactly) ===
All data lives in an Arena workflow endpoint. Use a Next.js server-side API route (app/api/todo/route.ts) as a proxy so the API key stays server-side; the browser calls /api/todo only. NEVER hardcode secrets in client code.
- Env vars: ARENA_WORKFLOW_URL and ARENA_API_KEY (document in .env.example). ARENA_WORKFLOW_URL default example: https://agent.thearena.ai/api/workflows/3f3f2f7c-2ade-41b0-b4ec-09a855d50638/execute
- The proxy POSTs to ARENA_WORKFLOW_URL with header Authorization: Bearer ${ARENA_API_KEY} and Content-Type: application/json.
- Request body shape to the workflow: { "action": "list"|"add"|"update"|"delete", "rowId": "<id for update/delete>", "data": { ...fields } }
- action=list returns { rows: [ { id, data: { Task, Owner, EntryDate, DueDate, Done, CompletedDate, Comment } } ] }. Field names may appear as friendly names (DueDate, CompletedDate, EntryDate) and/or raw column ids — prefer friendly names and normalize defensively.
- action=add: data = { Task, Owner, EntryDate (YYYY-MM-DD today), DueDate (YYYY-MM-DD) }
- action=update: rowId + data = { Done: true/false, Comment, DueDate }. When Done flips true the backend auto-sets CompletedDate; when false it clears it — the client just sends Done.
- action=delete: rowId only.

=== TASK FIELDS ===
Task (string), Owner (string), EntryDate (date, auto today on add), DueDate (date), Done (boolean), CompletedDate (date, backend-managed), Comment (string, editable in the detail sheet).

=== BEHAVIOR ===
- On load, call list and render Tasks tab. Show graceful loading and empty states.
- Detail bottom-sheet: show Task, Owner, DueDate, EntryDate, editable Comment (save via update), a big 'Mark Complete'/'Reopen' button, and Delete (with confirm).
- Optimistic UI where reasonable, then re-fetch.
- Phone-first but fully responsive; must look great embedded in an iframe or added to the iOS home screen.

Stack: Next.js (App Router) + TypeScript + Tailwind (or CSS variables matching the tokens above). Deploy to Vercel. Keep it clean, fast, single-purpose.
