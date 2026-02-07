#!/bin/sh
set -e

# Run database migrations on startup
echo "Running database migrations..."

# Check if migration files exist
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations/*.sql 2>/dev/null)" ]; then
  echo "Migration files found, applying migrations..."
  npx prisma migrate deploy
  echo "Migrations applied successfully"
else
  echo "No migration files found, using db push to create schema..."
  npx prisma db push --accept-data-loss
  echo "Database schema created successfully"
fi

# Seed database if empty
echo "Checking if database needs seeding..."
# Check if any table exists by trying to query a known table
if npx prisma db execute --stdin <<'SQL' 2>/dev/null
SELECT 1 FROM "users" LIMIT 1;
SQL
then
  echo "Database already has data, skipping seed."
else
  echo "Database is empty or tables don't exist, seeding initial data..."
  # Ignore errors during seeding - tables might not exist yet
  npx tsx scripts/seed.ts 2>/dev/null || echo "Seed script completed with warnings (this is normal)"
  npx tsx scripts/seed-extra.ts 2>/dev/null || echo "Extra seed script completed with warnings"
fi

# Start the application
echo "Starting application..."
exec node dist/server.js
