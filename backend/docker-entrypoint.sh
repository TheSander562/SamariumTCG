#!/bin/sh
set -e

echo "⏳ Waiting for database to be ready..."
# Wait for postgres to be ready
until pg_isready -d $DATABASE_URL; do
  sleep 1
done

echo "✅ Database is ready!"

echo "🔄 Generating Prisma Client..."
npx prisma generate

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

echo "🚀 Starting NestJS application..."
exec node dist/main
