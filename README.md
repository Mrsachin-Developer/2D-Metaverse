# 2D Metaverse

A small monorepo for a multiplayer 2D metaverse prototype with:

- React + Vite frontend
- Express REST API
- WebSocket multiplayer server
- Prisma + PostgreSQL data layer
- Turborepo workspace orchestration

## Tech stack

- Node.js 20+
- TypeScript
- React 18
- Express
- ws (WebSocket server)
- Prisma ORM
- PostgreSQL
- Turbo repo

## Repository structure

```text
metaverse/
├── apps/
│   ├── frontend/      # React client
│   ├── http/          # Express API
│   └── ws/            # Multiplayer WebSocket server
├── packages/
│   ├── db/            # Prisma schema and generated client
│   ├── eslint-config/
│   ├── typescript-config/
│   └── ui/
├── .env               # Local environment variables
├── package.json
├── turbo.json
├── pnpm-workspace.yaml
├── package-lock.json
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 20 or newer
- npm (preferred for this repo) or pnpm
- PostgreSQL database access
- A local `.env` file in the repo root

## Environment variables

Create a root `.env` file with at least:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<db>?sslmode=require"
JWT_PASSWORD="your-long-random-secret"
```

Notes:
- `DATABASE_URL` is required by Prisma.
- `JWT_PASSWORD` is used for signing/verifying authenticated tokens.
- Keep this file local and do not commit real secrets.

## Install dependencies

From the repo root:

```bash
npm install
```

If you prefer pnpm, this repo is configured for pnpm as well:

```bash
pnpm install
```

## Generate Prisma client

After installing dependencies, generate the Prisma client:

```bash
cd packages/db
npx prisma generate
```

If you need to apply schema changes to the database, run migrations from the same package:

```bash
cd packages/db
npx prisma migrate deploy
```

For local development with a fresh database, you may also use:

```bash
cd packages/db
npx prisma migrate dev
```

## Run the app in development mode

From the repo root, run:

```bash
npm run dev
```

This starts the Turbo workspace tasks for the apps in the monorepo.

### App ports

- Frontend: http://localhost:5173
- HTTP API: http://localhost:3000
- WebSocket server: ws://localhost:3001

## Run individual apps manually

If you want to start only one app:

### Frontend

```bash
cd apps/frontend
npm run dev
```

### HTTP API

```bash
cd apps/http
npm run dev
```

### WebSocket server

```bash
cd apps/ws
npm run dev
```

## Production build

Build the full workspace:

```bash
npm run build
```

This runs the Turbo build pipeline for all apps and packages.

## Useful commands

### Root-level

```bash
npm run build
npm run dev
npm run lint
```

### Database

```bash
cd packages/db
npx prisma studio
npx prisma generate
npx prisma migrate dev
npx prisma migrate deploy
```

## Notes about current project status

This repository is a prototype project and is not yet fully hardened for production. In particular:

- the frontend uses a local WebSocket URL
- the backend relies on a shared JWT secret from `.env`
- some auth and authorization flows are still simple and should be reviewed before public production use
- there is no dedicated automated test suite configured in the repo yet

## Troubleshooting

### Prisma errors

If Prisma cannot connect to the database:

1. Check the `DATABASE_URL` in your root `.env`
2. Ensure the PostgreSQL server is reachable
3. Run:

```bash
cd packages/db
npx prisma validate
```

### Port already in use

If 3000, 3001, or 5173 is already occupied:

- stop the conflicting process, or
- change the port in the respective app before running it again

### Missing environment variables

Make sure the repo root `.env` contains both:

- `DATABASE_URL`
- `JWT_PASSWORD`

## Project flow summary

1. Configure the `.env` file
2. Install dependencies with `npm install`
3. Generate Prisma client
4. Start the app with `npm run dev`
5. Open the frontend in the browser
6. Use the HTTP API for auth and resource operations
7. Connect WebSocket clients to the multiplayer server for live game state

## License

This project does not currently declare a license in the repo root. If this is meant for shared or production use, add a license file before distribution.
