# SamariumTCG

A self-hosted web application to track your Trading Card Game collection with detailed analytics, virtual binders andcollection management.

## Features (Implemented)

- **Website using docker**: Through docker compose port 3000 can be opened
- **Multi-Account Support**: OAuth SSO (Authelia tested but supporting many OIDC providers)

## Features (Planned)

- **Collection Management**: Track cards, quantities, and collection numbers
- **Expansion Overview**: View sets with completion progress and checklists
- **Advanced Search**: Filter by name, type, rarity, HP, artist, and ownership status
- **Virtual Binders**: Create custom binders for organization and viewing
- **Statistics Dashboard**: Total progress, rarity breakdown, and detailed analytics
- **Dark/Light Themes**: Customizable per user profile
- **Data Export**: CSV and PDF export of collections and checklists
- **Admin Panel**: Manage users, sync card data, configure backups
- **Backup & Restore**: Selective backup of collections, users, cards, images, and system data
- **Image Proxy/Cache**: Fast local caching of card images
- **Internationalization**: Multi-language support (English ready, extensible)

## Quick Start

### Prerequisites

- **Docker** and **Docker Compose** (v2+)
- **Node.js** 20+ (for local development without Docker)
- **PostgreSQL** 14+ (if running outside Docker)

### Running with Docker

```bash
cp .env.example .env

docker compose up --build
```

Open the app at:

- **Frontend**: [http://localhost:3000](http://localhost:3000).

### Local Development

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

## Environment

Copy `.env.example` and update values before running the app.

Example values in `.env.example`:

```env
DATABASE_URL="postgresql://samariumtcg:samariumtcg@localhost:5432/samariumtcg"
# Generate: openssl rand -base64 32
BETTER_AUTH_SECRET="change-me-generate-with-openssl-rand-base64-32"
BETTER_AUTH_URL=http://localhost:3000  # Public URL of website

REGISTRATION=true # Default true, set to false to disable registration (only for local email/password)

# OAuth — Needed for login with your own OIDC provider (e.g. Authelia, Keycloak, etc.)
AUTH_OIDC_LOGIN_ONLY=false # Default false, set to true if you want to disable local email/password login 
AUTH_OIDC_PROVIDER_ID="authelia"
AUTH_OIDC_NAME="Authelia"
AUTH_OIDC_CLIENT_ID=""
AUTH_OIDC_CLIENT_SECRET=""
AUTH_OIDC_ISSUER="https://your-identity-provider.example.com"
AUTH_OIDC_SCOPE="openid profile email groups offline_access" # Default , not needed if this is all its needed
```

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **PostgreSQL** + **Prisma**
- **Auth.js** (NextAuth v5)
- **Docker Compose** for local and containerized deployment

## Project Structure

```text
samariumtcg/
├── docker/                # Container entrypoint and scripts
├── prisma/                # Prisma schema and migrations
├── public/                # Static assets
├── src/                   # Application source
│   ├── app/               # Next.js routes and pages
│   ├── generated/         # Prisma client output
│   └── lib/               # Shared app utilities
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## Database Schema

### Core Tables

- **User** — User accounts, preferences, and roles
- **Expansion** — Card sets / expansions
- **Card** — Individual cards with metadata (name, type, rarity, HP, artist)
- **CollectionItem** — User-owned cards with quantities and collection numbers
- **Binder** — Virtual binder groups
- **BinderSlot** — Cards placed into binders
- **BackupLog** — Backup metadata
- **SyncLog** — Sync history and status

## Development Workflow

### Phase 1: ✅ Complete - Scaffolding & Infrastructure

- ✅ Docker Compose setup
- ✅ Prisma schema & migrations
- ✅ Next.js frontend initialization
- ✅ Auth infrastructure skeleton
- ✅ Health check / runtime startup

### Phase 2: Next - Authentication & User Management

- ✅ OAuth / SSO (Custom OIDC)
- ✅ User registration and login
- [ ] User profile and preferences
- [ ] Theme toggle (dark/light)
- [ ] Language selection

### Phase 3: Card Management

- [ ] TCGdex API integration
- [ ] Card sync
- [ ] Search and filtering
- [ ] Expansion browser UI

### Phase 4: Collection Tracking

- [ ] Add / edit / delete cards
- [ ] Quantity tracking
- [ ] Collection numbers
- [ ] Stats and completion %
- [ ] Rarity breakdown

### Phase 5: Advanced Features

- [ ] Virtual binders
- [ ] CSV / PDF export
- [ ] Backup / restore
- [ ] Admin panel & scheduler
- [ ] Performance optimization

## CI/CD & Deployment

This repo can be extended with GitHub Actions workflows for CI, PR validation, and deployment. The current source contains Docker Compose and production build tooling, but no `.github/workflows` files are present yet.

## Blocked NPM upgrades

Major-version bumps that cannot land today because a transitive plugin in our ESLint/build/test stack has not published a compatible release. We track them here so Dependabot is told to ignore the major (preventing repeated failing-CI noise) and we revisit when upstream catches up.

| Package | Stuck on | Blocker | Re-evaluate when | Tracking |
| --- | --- | --- | --- | --- |
| `eslint` | `^9.x` | `eslint-plugin-react@7.37.5` peer caps at `^9.7`; ESLint 10 also removed the `RuleContext` API the plugin uses (upstream PRs [jsx-eslint/eslint-plugin-react#3972](https://github.com/jsx-eslint/eslint-plugin-react/pull/3972), [#3979](https://github.com/jsx-eslint/eslint-plugin-react/pull/3979) open, no release). `@eslint/js` would also need a sibling bump. | `eslint-plugin-react@8` (or successor with `eslint: "^10"` peer) is published. | PR [#132](https://github.com/TheSander562/SamariumTCG/pull/132) closed via `@dependabot ignore this major version`. |
| `typescript-eslint` | `^6.X` | `typescript@^6.0.3` peer caps at `^6.0.3`; | `typescript@^7.1` (or successor) is published. | PR [#116](https://github.com/TheSander562/SamariumTCG/pull/116),[#119](https://github.com/TheSander562/SamariumTCG/pull/119) closed via `@dependabot ignore this major version`. |

When an entry's blocker clears: remove the row, drop the corresponding `ignore` from `.github/dependabot.yml` (if one was added there as a belt-and-braces alongside the PR-comment ignore), and let Dependabot reopen the bump. The upgrade itself ships in its own PR, not bundled with unrelated changes.

## Contributing

1. Create a branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## Troubleshooting

### Services not starting

```bash
docker compose logs -f
```

### Database connection issues

```bash
docker exec -it <db_container> psql -U samariumtcg -d samariumtcg -c "SELECT 1"
```

### Next.js build issues

```bash
npm run build
```
