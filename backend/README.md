# SamariumTCG Backend

A NestJS backend for the SamariumTCG Pokémon Trading Card Game collection tracker.

## Features

- **Authentication & User Management**: JWT-based authentication with user registration and login
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful API with validation and error handling

## Authentication API

### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "access_token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

### Get User Profile

```http
GET /users/profile
Authorization: Bearer <jwt-token>
```

## Development

### Prerequisites

- Node.js 24+
- Docker & Docker Compose
- PostgreSQL 18

### Setup

1. Install dependencies:

```bash
npm install
```

2. Start the database:

```bash
docker-compose -f ../docker-compose-dev.yml up -d samariumtcg-postgres
```

3. Run database migrations:

```bash
npx prisma migrate dev
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Start the development server:

```bash
npm run start:dev
```

### Testing

```bash
npm test
```

### Building

```bash
npm run build
```
