# Pokémon TCG Collection Tracker

Self-hosted web application to track your Pokémon Trading Card Game collection with analytics, virtual binders, and collection management.

This repo is set up for **incremental delivery**: each git step adds one slice of functionality on a stable foundation.

## Features (planned)

| Area | Status |
| --- | --- |
| Collection management (cards, quantities) | Planned |
| Expansion overview & checklists | Planned |
| Advanced search & filters | Planned |
| Virtual binders | Planned |
| Statistics dashboard | Planned |
| Dark / light themes (per user) | Schema ready |
| Multi-account OAuth2 (Google, GitHub, extensible) | Skeleton ready |
| CSV / PDF export | Planned |
| Admin panel & card data sync | Planned |
| Backup & restore | Planned |
| Image proxy / cache | Schema ready |
| i18n (English first) | Schema ready |

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **PostgreSQL** + **Prisma**
- **Auth.js** (NextAuth v5) with optional Google / GitHub providers
- **Docker Compose** for self-hosting

## Quick start (Docker)

1. Copy environment template and set secrets:

   ```bash
   cp .env.example .env
   # Edit AUTH_SECRET (openssl rand -base64 32) and optional OAuth keys
   ```

2. Start the stack:

   ```bash
   docker compose up --build
   ```

3. Open [http://localhost:3000](http://localhost:3000).

Migrations run automatically on container start via `prisma migrate deploy`.

## Local development (without Docker app)

1. Start PostgreSQL only:

   ```bash
   docker compose up -d db
   ```

2. Install dependencies and apply migrations:

   ```bash
   cp .env.example .env
   npm install
   npm run db:migrate
   npm run dev
   ```

## OAuth setup

Configure at least one provider in `.env`:

- **Google**: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- **GitHub**: `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`

Set callback URLs to:

- Google: `{AUTH_URL}/api/auth/callback/google`
- GitHub: `{AUTH_URL}/api/auth/callback/github`

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Create/apply migrations (dev) |
| `npm run db:deploy` | Apply migrations (production) |
| `npm run db:studio` | Prisma Studio |

## Suggested git workflow

Work in small PRs or commits aligned with the roadmap on the home page:

1. Collection CRUD API + UI  
2. Expansions import & checklist views  
3. Search  
4. Binders  
5. Dashboard  
6. Themes & locale  
7. Export  
8. Admin & sync  
9. Backup & image cache  

## Project layout

```
prisma/           Schema & migrations
src/app/          Routes & pages
src/lib/          Prisma client, auth config
src/auth.ts       Auth.js entry
docker/           Container entrypoint
```

## License

Private / your choice — add a LICENSE file when you publish the repo.
