# Offline Field Operations Dashboard

A full-stack TypeScript portfolio project demonstrating a production-style field operations dashboard with authentication, role-based access control, offline mutation queueing, and expected-version conflict handling.

The app is designed around a realistic field-work scenario: users may lose connectivity while updating assigned tasks, so changes can be queued locally and synced later without silently overwriting newer server data.

---

## Project Summary

Offline Field Operations Dashboard is a React/Node/PostgreSQL application for managing field tasks in environments where connectivity may be unreliable.

Users can log in as different roles, view only the tasks they are authorized to access, filter task lists through URL-driven query state, open task detail pages, update task status, complete checklist items, add notes, queue changes while offline, and sync those changes later.

The backend protects task access and mutations with JWT authentication, role-based visibility rules, and optimistic concurrency checks using a task `version` field.

---

## What This Project Demonstrates

This project was built to showcase practical full-stack engineering patterns commonly expected in modern TypeScript roles:

- React + TypeScript application architecture
- Node/Express + TypeScript REST API
- PostgreSQL data modeling with Prisma
- JWT authentication
- Role-based resource visibility
- Server-side authorization checks
- URL-driven filters with React Router
- Server-state management with TanStack Query
- Offline-first mutation queue using `localStorage`
- Sync-later workflow for failed/offline updates
- Expected-version conflict detection
- Docker-based local PostgreSQL development
- Automated linting, typechecking, builds, and tests
- GitHub Actions CI

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Vitest
- Testing Library
- CSS

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT
- bcrypt
- Vitest
- Supertest

### DevOps / Tooling

- Docker Compose
- ESLint
- Prettier
- GitHub Actions
- npm workspaces-style root scripts

---

## Core Features

### Authentication

Users sign in with a seeded demo account. The backend verifies the password with bcrypt and returns a JWT. Protected API routes require a valid bearer token.

Demo users include:

| Role       | Email                 | Password      |
| ---------- | --------------------- | ------------- |
| Admin      | `admin@example.com`   | `password123` |
| Manager    | `manager@example.com` | `password123` |
| Field User | `field@example.com`   | `password123` |
| Field User | `alex@example.com`    | `password123` |

---

### Role-Based Task Visibility

Task visibility is enforced on the backend, not just hidden in the frontend.

| Role       | Access                          |
| ---------- | ------------------------------- |
| Admin      | Can view all tasks              |
| Manager    | Can view tasks they created     |
| Field User | Can view tasks assigned to them |

The frontend reflects the current user’s role, but the API determines which resources the authenticated user can actually access.

---

### URL-Driven Task Filters

The task list supports search, status filtering, and priority filtering through URL query parameters.

Example:

```txt
/tasks?q=generator&status=IN_PROGRESS&priority=HIGH
```

This makes filter state:

- Shareable
- Refresh-safe
- Compatible with browser back/forward navigation
- Usable as part of the TanStack Query cache key

---

### Task Detail Workflow

Users can open a task and view:

- Title and description
- Location
- Assigned user
- Created-by user
- Status
- Priority
- Due date
- Checklist items
- Field notes
- Server version

Users can also update:

- Task status
- Checklist item completion
- Field notes

---

### Offline Pending Mutation Queue

If the browser is offline or the API request fails, task mutations can be saved locally as pending changes.

Supported offline mutation types:

```txt
UPDATE_TASK_STATUS
UPDATE_CHECKLIST_ITEM
CREATE_TASK_NOTE
```

Queued mutations are stored in `localStorage`, displayed in the UI as pending sync items, and replayed later when the user clicks **Sync now**.

---

### Expected-Version Conflict Handling

Each task has a `version` field. Every mutation sends the task version the client was looking at when the change was created.

If the server’s current version no longer matches the client’s `expectedVersion`, the API rejects the update with a `409 VERSION_CONFLICT`.

This prevents stale offline or multi-tab updates from silently overwriting newer task data.

Example flow:

```txt
Client sees task version 3
Another user updates the task to version 4
Original client tries to sync an update based on version 3
Server rejects the mutation with 409 VERSION_CONFLICT
```

This is an optimistic concurrency control pattern.

---

## Local Development

### Prerequisites

You need:

- Node.js
- npm
- Docker Desktop

---

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd offline-field-operations-dashboard
```

---

### 2. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

---

### 3. Create server environment file

Create:

```txt
server/.env
```

Use:

```env
NODE_ENV=development
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=dev-only-secret-change-me
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/offline_field_ops
```

---

### 4. Create client environment file

Create:

```txt
client/.env
```

Use:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

### 5. Start PostgreSQL

From the repo root:

```bash
docker compose up -d
```

---

### 6. Generate Prisma client, migrate, and seed

From `server/`:

```bash
npx prisma generate
npm run db:migrate
npm run db:seed
```

---

### 7. Run the app

From the repo root, use two terminals.

Terminal 1:

```bash
npm run server:dev
```

Terminal 2:

```bash
npm run client:dev
```

Open:

```txt
http://localhost:5173
```

---

## Available Root Scripts

From the repo root:

```bash
npm run client:dev
npm run server:dev

npm run lint
npm run typecheck
npm run build
npm test

npm run format
npm run format:check
```

The main quality gate is:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

---

## Testing

The project includes a focused automated test suite.

### Server Tests

Server tests cover:

- Successful login
- Failed login
- Protected route rejection without token
- Role-based task visibility
- Expected-version conflict response

Tools:

- Vitest
- Supertest

Run:

```bash
npm run server:test
```

---

### Client Tests

Client tests cover:

- Offline queue storage
- Adding/removing queued mutations
- Syncing successful mutations
- Keeping failed mutations in the queue
- Removing/reporting conflicted mutations

Tools:

- Vitest
- jsdom

Run:

```bash
npm run client:test
```

---

### Run All Tests

From the repo root:

```bash
npm test
```

---

## Continuous Integration

The repo includes GitHub Actions CI.

On push or pull request, CI runs:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

The workflow also starts a PostgreSQL service, runs Prisma setup, seeds demo data, and verifies the application quality gate.

---

## Manual QA Checklist

Before considering the app release-ready, verify:

```txt
Logged-out users redirect to /login
Valid users can log in
Invalid login fails
Logout clears auth state
Admin sees all tasks
Manager sees only created tasks
Field users see only assigned tasks
Task filters update the URL
Task filters survive refresh
Task detail pages load
Bad task IDs show an error state
Status updates persist
Checklist updates persist
Notes persist
Offline changes increase pending sync count
Sync now replays queued changes
Server failure queues mutations
Two-tab stale updates return 409 conflict
Offline stale updates report conflict during sync
```

---

## Architecture Notes

### Backend Authorization

The backend attaches the authenticated user to `req.user` after JWT verification. Task queries and mutations use that authenticated user to apply visibility rules at the database query level.

This means users cannot bypass role restrictions by manually changing frontend routes or API URLs.

---

### Offline Queue

The offline queue is intentionally simple and transparent.

Queued mutations are stored locally with:

- A generated mutation ID
- Mutation type
- Creation timestamp
- Payload
- Expected task version

During sync, the queue is replayed sequentially so changes are applied in the order they were created.

---

### Conflict Handling

Conflict handling is based on optimistic concurrency.

Every mutation includes:

```ts
expectedVersion: number;
```

The API compares that value to the current task version. If they differ, the mutation is rejected instead of applied.

This is especially important for offline workflows, where the user may be working from stale data.

---

## Project Status

The portfolio MVP is feature-complete.

Completed:

- App shell
- Authentication
- Role-based access control
- Task list and filters
- Task detail page
- Online mutations
- Offline pending queue
- Sync workflow
- Conflict detection
- Automated tests
- CI

Potential future improvements:

- Conflict resolution UI
- Toast notifications
- More component tests
- Admin task creation
- Deployment
- Screenshots and demo GIFs
- More granular manager permissions

---

## Portfolio Talking Points

This project demonstrates more than a basic CRUD app.

It includes real-world concerns such as:

- Authenticated API access
- Backend-enforced authorization
- Typed client/server contracts
- Offline-first user behavior
- Retryable mutation queues
- Optimistic concurrency control
- Automated quality gates
- CI-backed maintainability

A concise explanation:

> Offline Field Operations Dashboard is a full-stack TypeScript app for managing field tasks in unreliable network conditions. It uses JWT authentication, role-based task visibility, TanStack Query, URL-driven filters, an offline pending mutation queue, and expected-version conflict handling to prevent stale updates from overwriting newer server data.

---

## License

This project is intended as a portfolio/demo project.
