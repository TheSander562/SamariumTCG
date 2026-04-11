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
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health
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

Visit http://localhost:3000 (frontend) and http://localhost:3001 (backend)

## 📁 Project Structure

```
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

```
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

### Database

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

### Backend

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

### Frontend

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

```
┌─────────────────────────────────────────────────────────────┐
│                 Docker Compose Network                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐          ┌──────────────┐                  │
│  │  Next.js     │          │  NestJS      │                  │
│  │  Frontend    │◄────────►│  Backend     │                  │
│  │  :3000       │          │  :3001       │                  │
│  └──────────────┘          └──────────────┘                  │
│                                    │                          │
│                                    ▼ (Prisma ORM)            │
│                          ┌──────────────────┐                │
│                          │   PostgreSQL     │                │
│                          │   :5432          │                │
│                          └──────────────────┘                │
│                                    │                          │
│                                    ▼                          │
│                          ┌──────────────────┐                │
│                          │  Docker Volumes  │                │
│                          │ (data, images)   │                │
│                          └──────────────────┘                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🤝 Contributing

1. Create a branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## 📝 API Documentation

### Health Check

```
GET /health
GET /api/health

Response: { status: "ok", api: "Pokémon TCG Collection Tracker", version: "1.0.0" }
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

**Status**: Phase 1 Complete ✅ | Phase 2 In Progress 🚀
