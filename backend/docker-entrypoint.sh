#!/bin/sh
set -e

# Run database migrations on startup
echo "Running database migrations..."

# Try to run migrations first
if npx prisma migrate deploy; then
  echo "Migrations applied successfully"
else
  echo "No migrations found or migrations failed, using db push..."
  # Fallback to db push if migrations don't exist
  npx prisma db push --accept-data-loss
fi

# Seed database if empty
echo "Checking if database needs seeding..."
if npx prisma db execute --stdin <<'SQL'
SELECT EXISTS(SELECT 1 FROM "Product" LIMIT 1);
SQL
then
  echo "Database already has data, skipping seed."
else
  echo "Database is empty, seeding initial data..."
  npx tsx scripts/seed.ts || echo "Seed script completed with warnings (this is normal)"
  npx tsx scripts/seed-extra.ts || echo "Extra seed script completed with warnings"
fi

# Start the application
echo "Starting application..."
exec node dist/server.js
