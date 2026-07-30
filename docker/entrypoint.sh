#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "Applying database migrations..."
  npx --no-update-notifier prisma migrate deploy
fi

exec "$@"
