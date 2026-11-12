# 🌐 2D Metaverse

A real-time multiplayer 2D metaverse platform where users can create virtual spaces, place interactive elements, and move around with other players in a shared grid-based world — rendered with a **custom HTML5 Canvas engine** and synced over **WebSockets**.

Built as a full-stack **TypeScript monorepo** powered by **Turborepo**.

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)

---

## 📸 Project Screenshots

### 🌍 Multiplayer Arena
Experience real-time multiplayer interaction in a shared virtual space.

![Multiplayer Arena](./screenshots/arena.png)

### 🛠️ Map Builder
Customize virtual spaces by placing furniture, workstations, and decorative elements on the grid.

![Map Builder](./screenshots/map-builder.png)

### 🏠 Dashboard & Community Worlds
Browse custom worlds and explore featured multiplayer environments.

![Dashboard](./screenshots/dashboard.png)

### 🎭 Avatar Wardrobe
Choose and customize your pixel-art avatar across different metaverse spaces.

![Avatar Wardrobe](./screenshots/avatar-wardrobe.png)

---

## ✨ Features

- **User Authentication** — Signup/signin with JWT tokens and scrypt password hashing (with `timingSafeEqual`)
- **Avatar System** — Choose from admin-created SVG avatars (10+ character sprites)
- **Space Management** — Create, delete, and browse virtual 2D spaces; optionally use map templates
- **Element Placement** — Add, reposition, and remove SVG elements (30+ furniture/decor items) within spaces
- **Real-Time Multiplayer** — WebSocket-driven live presence: see other players join, move, and leave
- **Server-Validated Movement** — Tile-based movement with server-side validation (single-step orthogonal only, boundary checks)
- **2D Canvas Game Engine** — Custom `requestAnimationFrame` renderer with Minecraft-themed tiled floor, smooth camera interpolation, 2.5D depth-sorted players, nametags, and emoji speech bubbles
- **Minimap** — Toggleable minimap overlay for spatial awareness
- **Emoji Reactions** — In-game emoji reaction system with speech bubbles
- **Build Mode** — Place elements at your current position in the arena
- **Map Templates** — Admins can create reusable map templates with pre-placed elements
- **Admin Studio** — Admin panel for managing elements, avatars, and map templates
- **Featured Community Worlds** — Pre-built maps (Multi-Room Campus, Coffee Lounge, Keynote Auditorium)
- **CI/CD Pipeline** — GitHub Actions workflow for automated testing and builds

---

## 🏗️ Architecture

```
┌─────────────┐       HTTP (REST)       ┌──────────────┐       Prisma       ┌──────────────┐
│   Frontend   │ ◄───────────────────► │  HTTP Server  │ ◄──────────────► │  PostgreSQL   │
│  (React +    │                        │  (Express)    │                   │  (Docker)     │
│   Canvas)    │                        │  Port 3000    │                   │  Port 5432    │
│  Port 5173   │       WebSocket        ├──────────────┤                   └──────────────┘
│              │ ◄───────────────────► │  WS Server    │ ◄──────────────►       ▲
└─────────────┘                        │  (ws)         │       Prisma          │
                                        │  Port 3001    │                       │
                                        └──────────────┘                       │
                                                                                │
                                        ┌──────────────┐                       │
                                        │  @repo/db     │ ──────────────────────┘
                                        │  (Shared      │
                                        │   Prisma pkg) │
                                        └──────────────┘
```

---

## 📁 Repository Structure

```
2d-metaverse v2/
├── metaverse/                        # Turborepo monorepo root
│   ├── apps/
│   │   ├── frontend/                 # React + Vite + Canvas SPA
│   │   │   └── src/
│   │   │       ├── pages/            # Arena, Dashboard, Signin, Signup
│   │   │       ├── components/
│   │   │       │   ├── arena/        # ArenaCanvas, ArenaControls, ArenaSidebar, BuildElementModal
│   │   │       │   ├── admin/        # AdminStudioModal
│   │   │       │   ├── avatar/       # AvatarSelectModal
│   │   │       │   ├── dashboard/    # CreateSpaceModal, SpaceCard
│   │   │       │   ├── layout/       # Navbar
│   │   │       │   └── ui/           # Avatar, Badge, Button, Card, Input, Modal, Toast
│   │   │       ├── hooks/            # useWebSocket, usePlayerMovement, useAuth
│   │   │       ├── services/         # api, auth, space, avatar, admin service layers
│   │   │       ├── context/          # AuthContext (JWT + localStorage session)
│   │   │       ├── assets/           # 10 avatar SVGs + 30+ element SVGs
│   │   │       ├── types/            # API & WebSocket TypeScript interfaces
│   │   │       └── utils/            # Sound utilities
│   │   ├── http/                     # Express REST API
│   │   │   └── src/
│   │   │       ├── routes/v1/        # user, space, admin route handlers
│   │   │       ├── middleware/       # JWT auth (user) + admin role middleware
│   │   │       ├── types/            # Zod validation schemas
│   │   │       ├── config.ts         # JWT_PASSWORD from env
│   │   │       └── scrypt.ts         # Password hashing (scrypt + timingSafeEqual)
│   │   └── ws/                       # WebSocket multiplayer server
│   │       └── src/
│   │           ├── User.ts           # Connection handler (join, move, spawn logic)
│   │           └── RoomManager.ts    # Room/space session management (singleton)
│   ├── packages/
│   │   └── db/                       # Shared Prisma schema & client (@repo/db)
│   │       └── prisma/
│   │           ├── schema.prisma     # 7 database models
│   │           └── migrations/       # 5 migration files
│   └── turbo.json                    # Turborepo pipeline config
├── tests/                            # Integration & WebSocket E2E tests
│   └── index.test.js                 # 1242 lines, 31 tests across 7 suites
├── docker-compose.yml                # PostgreSQL 15 container
├── .github/workflows/
│   └── deploy.yml                    # CI pipeline
├── package.json                      # Root workspace config & scripts
└── README.md
```

---

## 🗄️ Database Schema

| Model | Description |
|---|---|
| **User** | Username (unique), scrypt-hashed password, role (`User` / `Admin`), optional avatarId |
| **Space** | Virtual room with name, dimensions (width × height), thumbnail, creator relation |
| **SpaceElements** | Instance of an Element placed in a Space at (x, y), optionally static |
| **Element** | Reusable tile/object definition (imageUrl, width, height, static flag) |
| **Map** | Predefined map template (width, height, name, thumbnail) |
| **MapElements** | Elements pre-placed in a Map at (x, y) |
| **Avatar** | Character sprite (imageUrl, name) |

---

## 🔌 API Reference

### Authentication — `/api/v1`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | ✗ | Register a new user (Admin or User role) |
| POST | `/signin` | ✗ | Login and receive JWT token |

### User Routes — `/api/v1/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/metadata` | ✓ | Update user's avatar selection |
| GET | `/metadata/bulk?ids=[...]` | ✓ | Get avatar info for multiple users |

### Space Routes — `/api/v1/space`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | ✓ | Create a new space (with optional mapId for templates) |
| DELETE | `/:spaceId` | ✓ | Delete a space (owner only, cascades elements) |
| GET | `/all` | ✓ | List all spaces for current user |
| GET | `/:spaceId` | ✓ | Get space details with all elements |
| POST | `/element` | ✓ | Add an element to a space (with bounds checking) |
| DELETE | `/element` | ✓ | Remove an element from a space (owner only) |

### Admin Routes — `/api/v1/admin`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/element` | Admin | Create a new element |
| PUT | `/element/:elementId` | Admin | Update an element's imageUrl |
| POST | `/avatar` | Admin | Create a new avatar |
| POST | `/map` | Admin | Create a map template with default elements |

### Public Routes — `/api/v1`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/elements` | ✗ | List all available elements |
| GET | `/avatars` | ✗ | List all available avatars |

---

## 🎮 WebSocket Protocol

The WebSocket server runs on **port 3001** and uses a JSON message protocol.

### Client → Server

| Type | Payload | Description |
|---|---|---|
| `join` | `{ spaceId, token }` | Join a space (authenticates via JWT) |
| `move` | `{ x, y }` | Request movement to a tile |

### Server → Client

| Type | Payload | Description |
|---|---|---|
| `space-joined` | `{ spawn: {x,y}, users: [{id}] }` | Confirmation with spawn point and existing users |
| `join-rejected` | — | Invalid token or space |
| `user-joined` | `{ userId, x, y }` | Broadcast: another player entered |
| `movement` | `{ x, y }` or `{ x, y, userId }` | Accepted move (self) / broadcast (others) |
| `movement-rejected` | `{ x, y }` | Invalid move — returns original position |
| `user-left` | `{ userId }` | Broadcast: a player disconnected |

**Movement Rules:** Only single-tile orthogonal moves are allowed (no diagonals). The server validates bounds against the space dimensions. Messages are processed through a serial queue (`Promise` chain) to prevent race conditions.

**Spawn Logic:** New players spawn near existing players using an expanding-radius search algorithm.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Monorepo** | Turborepo + npm workspaces |
| **Frontend** | React 18, Vite, Tailwind CSS 4, Lucide React icons |
| **Game Engine** | Custom HTML5 Canvas with `requestAnimationFrame`, smooth camera interpolation (0.32 lerp), 2.5D depth sorting |
| **HTTP API** | Express, Zod validation, JWT (jsonwebtoken), scrypt (Node.js crypto) |
| **WebSocket** | `ws` library (raw WebSocket server) |
| **Database** | PostgreSQL 15 (Docker), Prisma ORM (with `@prisma/adapter-pg`) |
| **Build** | esbuild (backend), Vite (frontend) |
| **Testing** | Jest 29 (integration tests), Axios, ws client |
| **CI/CD** | GitHub Actions |
| **Language** | TypeScript (end-to-end) |

---

## 🎨 Frontend Architecture

```
App.tsx (AuthProvider)
├── Signin / Signup          ← Auth forms
├── Dashboard                ← Space management, avatar wardrobe, admin studio
│   ├── Featured worlds      ← 3 pre-built community maps
│   ├── My worlds grid       ← SpaceCards with create/delete
│   ├── CreateSpaceModal     ← Map template selection
│   ├── AvatarSelectModal    ← Character sprite picker
│   └── AdminStudioModal     ← Element, avatar, map creation
└── Arena                    ← The multiplayer game view
    ├── ArenaCanvas          ← Custom Canvas renderer (487 lines)
    │   ├── Minecraft-style tiled floor
    │   ├── SVG element rendering (with image cache)
    │   ├── 2.5D depth-sorted players
    │   ├── Smooth camera following (lerp interpolation)
    │   ├── Nametags & emoji speech bubbles
    │   ├── Stone-brick wall borders
    │   └── Minimap overlay
    ├── ArenaControls        ← D-pad, emoji reactions, build, minimap toggle
    ├── ArenaSidebar         ← Player roster, share link
    └── BuildElementModal    ← Place elements at current position
```

**Custom Hooks:**
- `useWebSocket` — Full WebSocket lifecycle, message handling, optimistic movement updates
- `usePlayerMovement` — WASD/Arrow key + D-pad input with obstacle collision detection
- `useAuth` — Authentication context consumer

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20 or newer
- **npm** (ships with Node)
- **Docker** & Docker Compose (for PostgreSQL)

### 1. Clone & Install

```bash
git clone <repo-url>
cd 2d-metaverse-v2
npm install
```

### 2. Environment Variables

Create a `.env` file in the `metaverse/` directory:

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/metaverse"
JWT_PASSWORD="your-long-random-secret"
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✓ | PostgreSQL connection string |
| `JWT_PASSWORD` | ✓ | Secret for signing/verifying JWT tokens |

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

This spins up a PostgreSQL 15 container on port **5432** with:
- User: `postgres` · Password: `mypassword` · Database: `metaverse`

### 4. Set Up the Database

```bash
# Generate the Prisma client
npm run db:generate

# Push the schema to the database
npm run db:push
```

### 5. Start Development Servers

```bash
npm run dev
```

This starts all three services via Turborepo:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| HTTP API | http://localhost:3000 |
| WebSocket | ws://localhost:3001 |

### 6. Open the App

Navigate to **http://localhost:5173** — sign up, create a space, and start exploring!

---

## 🧪 Testing

The project includes a comprehensive integration test suite that exercises the full stack end-to-end.

### Running Tests

> **Note:** The HTTP server (port 3000) and WebSocket server (port 3001) must be running before executing tests.

```bash
npm test
```

### Test Coverage

The test suite ([`tests/index.test.js`](file:///d:/A%20Work/PROJECT%20ZONE/Resume%20Project/2d-metaverse%20v2/tests/index.test.js)) contains **1242 lines** with **31 tests** across **7 suites**:

| Suite | Tests | What's Covered |
|---|---|---|
| **Authentication** | 4 | Signup uniqueness, empty username validation, correct signin returns token, wrong credentials fail |
| **User Metadata** | 4 | Avatar update (valid/invalid), auth middleware enforcement, metadata queries |
| **User Avatar Info** | 2 | Bulk avatar info by user IDs, avatar catalog listing |
| **Space Information** | 8 | Create with/without mapId, dimension validation, delete (own/others/nonexistent), list, get with elements |
| **Arena Endpoints** | — | Element add, position update, delete, cross-user access control |
| **Admin Endpoints** | 3 | Role-based access control (403 for non-admin), admin CRUD for elements/avatars/maps, element update |
| **WebSocket** | 4 | Join + spawn ack, boundary rejection, two-block move rejection, movement broadcast, user-left on disconnect |

**Test infrastructure:** Creates full data chains per run (signup → signin → create avatar → elements → map → space → test operations) with randomized usernames.

---

## 📜 Available Scripts

All scripts run from the repository root:

| Command | Description |
|---|---|
| `npm run dev` | Start all services in development mode (via Turborepo) |
| `npm run build` | Build all apps and packages |
| `npm test` | Run the integration test suite |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema changes directly to the database |
| `npm run db:seed` | Seed the database with initial data |

---

## 🤝 CI/CD

The GitHub Actions pipeline ([`.github/workflows/deploy.yml`](file:///d:/A%20Work/PROJECT%20ZONE/Resume%20Project/2d-metaverse%20v2/.github/workflows/deploy.yml)) runs on push:

1. **Checkout** code → **Setup** Node.js 20
2. `npm install`
3. Start **PostgreSQL** service container
4. **Generate** Prisma client → **Push** schema
5. Run full **test suite**
6. **Build** all applications

---

## 📝 Project Status

This is a **portfolio / prototype project**. Current areas for improvement:

- Frontend uses a hardcoded local WebSocket URL (configurable via `VITE_WS_URL`)
- No rate limiting or advanced security hardening
- Element rendering uses SVG sprites (functional, but not pixel-art style)
- No unit tests — the test suite is integration/E2E only
- `Game.tsx` is a legacy standalone renderer (production uses the `Arena` + `ArenaCanvas` system)

---

## 📄 License

This project does not currently declare a license. Add a `LICENSE` file before distribution.
