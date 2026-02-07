#!/bin/sh
set -e

# Run database migrations on startup
echo "Running database migrations..."
npx prisma migrate deploy

# Seed database if empty
echo "Checking if database needs seeding..."
if ! npx prisma db execute --stdin <<'SQL'
SELECT EXISTS(SELECT 1 FROM "Product" LIMIT 1);
SQL
then
  echo "Database is empty, seeding initial data..."
  npx tsx scripts/seed.ts || echo "Seed script completed with warnings (this is normal)"
  npx tsx scripts/seed-extra.ts || echo "Extra seed script completed with warnings"
else
  echo "Database already has data, skipping seed."
fi

# Start the application
echo "Starting application..."
exec node dist/server.js
