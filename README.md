# Pokémon TCG Collection Tracker

A self-hosted web application to track your Pokémon Trading Card Game collection with detailed analytics, virtual binders, and collection management features.

## 🎯 Features (Planned)

- **Collection Management**: Track cards, quantities, and collection numbers
- **Expansion Overview**: View sets with completion progress and checklists
- **Advanced Search**: Filter by name, type, rarity, HP, artist, and ownership status
- **Virtual Binders**: Create custom binders for organization and viewing
- **Statistics Dashboard**: Total progress, rarity breakdown, and detailed analytics
- **Dark/Light Themes**: Customizable per user profile
- **Multi-Account Support**: OAuth2 SSO (ready for Google, GitHub, custom)
- **Data Export**: CSV and PDF export of collections and checklists
- **Admin Panel**: Manage users, sync card data, configure backups
- **Backup & Restore**: Selective backup of collections, users, cards, images, and system data
- **Image Proxy/Cache**: Fast local caching of card images
- **Internationalization**: Multi-language support (English ready, extensible)

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** (v2.0+)
- **Node.js** 20+ (for local development without Docker)
- **PostgreSQL** 14+ (if running outside Docker)

### Running with Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd samariumtcg

# Copy environment template
cp .env.example .env

# Start all services
docker-compose up -d

# Verify services
docker-compose ps
```

Services will be available at:

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:3001>
- **API Health Check**: <http://localhost:3001/api/health>
- **Database**: localhost:5432 (PostgreSQL)

### Local Development

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit <http://localhost:3000> (frontend) and <http://localhost:3001> (backend)

## 🔄 CI/CD & Deployment

This project includes comprehensive GitHub Actions workflows for automated testing, building, and deployment.

### Workflows Overview

#### 1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)

- **Triggers**: Push to `main`/`develop`, Pull Requests
- **Jobs**:
  - `test`: Run backend/frontend tests and linting
  - `build-and-push`: Build and push Docker images to GitHub Container Registry

#### 2. **Pull Request Tests** (`.github/workflows/pr-tests.yml`)

- **Triggers**: PR opened/updated on `main`/`develop`
- **Features**:
  - Security validation (no committed secrets)
  - Full test suite with coverage
  - Docker build validation
  - Codecov integration

#### 3. **Security & Maintenance** (`.github/workflows/security.yml`)

- **Triggers**: Weekly schedule + manual
- **Features**:
  - NPM audit scanning
  - Docker image vulnerability scanning
  - Dependency update checks
  - Trivy security scanning

### Deployment Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub        │    │   GitHub        │    │   Production    │
│   Actions       │--->│   Container     │--->│   Server        │
│                 │    │   Registry      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                 │                        │
                                 ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Docker        │    │   Docker        │
                       │   Compose       │    │   Compose       │
                       │   Pull & Run    │    │   Pull & Run    │
                       └─────────────────┘    └─────────────────┘
```

### Manual Deployment

To manually deploy to an environment:

1. Go to **Actions** tab in GitHub
2. Select **"Deploy to Environment"** workflow
3. Click **"Run workflow"**
4. Choose environment (`staging` or `production`)
5. Optionally specify image tag (defaults to `latest`/`develop`)

### Database Operations

To perform database operations:

1. Go to **Actions** tab
2. Select **"Database Operations"** workflow
3. Choose operation: `backup`, `migrate`, `seed`, or `restore`
4. Select environment
5. For restore: provide backup file path

## 📁 Project Structure

```text
samariumtcg/
├── docker-compose.yml          # Multi-container orchestration
├── .env.example                # Environment configuration template
├── .gitignore                  # Git ignore patterns
│
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── main.ts
│   │   └── (future modules: auth, users, cards, collections, etc.)
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (all entities)
│   │   ├── migrations/         # Database migrations
│   │   └── prisma.config.ts
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   └── package.json
│
├── frontend/                   # Next.js App
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── (future routes: auth, dashboard, expansion, search, collection, binders, admin)
│   ├── components/             # Reusable React components
│   ├── lib/
│   │   ├── api-client.ts      # Axios with JWT auth
│   │   └── store.ts           # Zustand state management
│   ├── public/                 # Static assets
│   ├── Dockerfile
│   ├── tailwind.config.ts
│   └── package.json
│
└── README.md
```

## 🗄️ Database Schema

### Core Tables

- **User** - User accounts, preferences, and roles
- **Expansion** - Card sets/expansions from TCGdex
- **Card** - Individual cards with metadata (name, type, rarity, HP, artist)
- **UserCollection** - User's owned cards with quantities and collection numbers
- **VirtualBinder** - Custom collection groupings
- **VirtualBinderCard** - Cards within binders
- **BackupLog** - Backup history and metadata
- **SyncLog** - Card sync history and status

### Relationships

```text
User ──┬── UserCollection ──── Card (via Expansion)
       ├── VirtualBinder ──────┐
       └─────────────────────┐ │
Entity (Card) ◄─────────────── VirtualBinderCard
                              │
                              └─ Card
```

## 🔄 Development Workflow

### Phase 1: ✅ Complete - Scaffolding & Infrastructure

- ✅ Docker Compose setup
- ✅ NestJS backend initialization
- ✅ Next.js frontend initialization
- ✅ Prisma schema & migrations
- ✅ Health check endpoints
- ✅ All services running and verified

### Phase 2: Next - Authentication & User Management

- [ ] OAuth/SSO (custom login, later: Google, GitHub)
- [ ] JWT token management
- [ ] User registration and login endpoints
- [ ] User profile and preferences
- [ ] Theme toggle (dark/light)
- [ ] Language selection

### Phase 3: Card Management

- [ ] TCGdex API integration
- [ ] Card sync (populate database)
- [ ] Local image caching
- [ ] Search and filtering
- [ ] Expansion browser UI

### Phase 4: Collection Tracking

- [ ] Add/edit/delete cards
- [ ] Quantity tracking
- [ ] Collection numbers
- [ ] Stats and completion %
- [ ] Rarity breakdown

### Phase 5: Advanced Features

- [ ] Virtual binders
- [ ] CSV/PDF export
- [ ] Backup/restore
- [ ] Admin panel & scheduler
- [ ] Performance optimization

## 🛠️ Common Commands

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Rebuild images
docker-compose build

# Access database
docker exec -it samarium_postgres psql -U samarium -d samarium_tcg
```

### Database commands

```bash
# Create migration
cd backend && npx prisma migrate dev --name migration_name

# View + Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# View database schema
npx prisma studio
```

### Backend commands

```bash
cd backend

# Install dependencies
npm install

# Run tests
npm run test

# Format code
npm run format

# Lint
npm run lint
```

### Frontend commands

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## 🔐 Environment Variables

See `.env.example` for all available options:

```env
# Database
DB_USER=samarium
DB_PASSWORD=changeme
DB_NAME=samarium_tcg

# Backend
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
PORT=3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001

# OAuth (future)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GITHUB_CLIENT_ID=
# GITHUB_CLIENT_SECRET=
```

## 📊 Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                 Docker Compose Network                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐          ┌──────────────┐                 │
│  │  Next.js     │          │  NestJS      │                 │
│  │  Frontend    │◄────────►│  Backend     │                 │
│  │  :3000       │          │  :3001       │                 │
│  └──────────────┘          └──────────────┘                 │
│                                    │                        │
│                                    ▼ (Prisma ORM)           │
│                          ┌──────────────────┐               │
│                          │   PostgreSQL     │               │
│                          │   :5432          │               │
│                          └──────────────────┘               │
│                                    │                        │
│                                    ▼                        │
│                          ┌──────────────────┐               │
│                          │  Docker Volumes  │               │
│                          │ (data, images)   │               │
│                          └──────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🤝 Contributing

1. Create a branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## 📝 API Documentation

### Health Check

```http
GET /health
GET /api/health
```

```json
{
  "status": "ok",
  "api": "Pokémon TCG Collection Tracker",
  "version": "1.0.0"
}
```

More endpoints coming in Phase 2+

## 🐛 Troubleshooting

### Services not starting

```bash
# Check container logs
docker-compose logs

# Verify Docker is running
docker ps

# Rebuild images
docker-compose build --no-cache
```

### Database connection issues

```bash
# Verify PostgreSQL is accessible
docker exec samarium_postgres psql -U samarium -d samarium_tcg -c "SELECT 1"

# Check migrations
cd backend
npx prisma migrate status
```

### Frontend not loading

```bash
# Check Next.js build
docker logs samarium_frontend

# Rebuild frontend image
docker-compose build frontend --no-cache
```

## 📄 License

This project is open source. See LICENSE file for details.

## 🚀 Deployment

For production deployment:

1. Update `.env` with production values (strong JWT_SECRET, real DB credentials)
2. Set `NODE_ENV=production`
3. Configure proper SSL/TLS certificates
4. Use a reverse proxy (nginx, traefik)
5. Set up automated backups
6. Configure monitoring and logging
7. Use volumes or external storage for images and backups

## 👨‍💻 Support

For issues or questions:

- Check existing issues on GitHub
- Create a new issue with detailed information
- Submit pull requests for improvements

---

**Status**: Phase 1 Complete ✅ | Phase 2 In Progress 🚀 | CI/CD Ready ✅

### GitHub Actions Workflows

| Workflow | Trigger | Purpose |
| -------- | ------- | ------- |
| **CI/CD Pipeline** | Push to main/develop | Build images, run tests, auto-deploy |
| **PR Tests** | Pull requests | Security checks, test coverage, validation |
| **Security** | Weekly + manual | Vulnerability scanning, dependency checks |

## Blocked NPM upgrades

Major-version bumps that cannot land today because a transitive plugin in our ESLint/build/test stack has not published a compatible release. We track them here so Dependabot is told to ignore the major (preventing repeated failing-CI noise) and we revisit when upstream catches up.

| Package | Stuck on | Blocker | Re-evaluate when | Tracking |
| --- | --- | --- | --- | --- |
| `eslint` | `^9.x` | `eslint-plugin-react@7.37.5` peer caps at `^9.7`; ESLint 10 also removed the `RuleContext` API the plugin uses (upstream PRs [jsx-eslint/eslint-plugin-react#3972](https://github.com/jsx-eslint/eslint-plugin-react/pull/3972), [#3979](https://github.com/jsx-eslint/eslint-plugin-react/pull/3979) open, no release). `@eslint/js` would also need a sibling bump. | `eslint-plugin-react@8` (or successor with `eslint: "^10"` peer) is published. | PR [#132](https://github.com/TheSander562/SamariumTCG/pull/132) closed via `@dependabot ignore this major version`. |
| `typescript-eslint` | `^6.X` | `typescript@^6.0.3` peer caps at `^6.0.3`; | `typescript@^7.1` (or successor) is published. | PR [#116](https://github.com/TheSander562/SamariumTCG/pull/116),[#119](https://github.com/TheSander562/SamariumTCG/pull/119) closed via `@dependabot ignore this major version`. |

When an entry's blocker clears: remove the row, drop the corresponding `ignore` from `.github/dependabot.yml` (if one was added there as a belt-and-braces alongside the PR-comment ignore), and let Dependabot reopen the bump. The upgrade itself ships in its own PR, not bundled with unrelated changes.
