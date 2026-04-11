#!/bin/sh
set -e

echo "⏳ Waiting for database to be ready..."
# Wait for postgres to be ready
until pg_isready -h postgres -p 5432; do
  sleep 1
done

echo "✅ Database is ready!"

echo "🔄 Generating Prisma Client..."
npx prisma generate

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

echo "🚀 Starting NestJS application..."
exec node dist/main
