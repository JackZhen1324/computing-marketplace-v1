#!/bin/sh
set -e

# Run database migrations on startup
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting application..."
exec node dist/server.js
