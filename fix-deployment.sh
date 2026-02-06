#!/bin/bash

# Quick fix for deployment conflict
# Run this on the deployment server

echo "🔧 Fixing deployment conflict..."

cd /opt/computing-marketplace/computing-marketplace-v1/frontend || exit 1

# Backup and remove local docker-compose.yml
if [ -f "docker-compose.yml" ]; then
  echo "Found local docker-compose.yml, backing up..."
  mv docker-compose.yml docker-compose.yml.backup.$(date +%Y%m%d_%H%M%S)
fi

# Pull latest code
echo "Pulling latest code..."
git pull origin main

# Build and start containers
echo "Building and starting containers..."
docker-compose up -d --build

echo "✅ Deployment completed!"
echo ""
echo "🌐 Application: http://localhost:9210"
docker ps --filter "name=computing-marketplace"
