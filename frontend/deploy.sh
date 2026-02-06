#!/bin/bash

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Deployment...${NC}"

# Set variables
APP_PORT="9210"
DEPLOY_DIR="/opt/computing-marketplace/computing-marketplace-v1/frontend"

echo "Deploy directory: $DEPLOY_DIR"
echo "App port: $APP_PORT"
echo ""

# Step 1: Change to frontend directory
echo -e "${YELLOW}📁 Step 1: Changing to frontend directory...${NC}"
cd "$DEPLOY_DIR" || {
  echo -e "${RED}❌ Failed to change to directory: $DEPLOY_DIR${NC}"
  exit 1
}
echo -e "${GREEN}✅ Changed to: $(pwd)${NC}"
echo ""

# Step 2: Handle local changes and pull latest code
echo -e "${YELLOW}📝 Step 2: Handling local changes and pulling latest code...${NC}"

# Stash any local modifications
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}📦 Found local changes, stashing...${NC}"
  git stash push -m "Auto-stash before deployment $(date +%Y%m%d_%H%M%S)" || {
    echo -e "${YELLOW}⚠️  Warning: Failed to stash changes, attempting reset...${NC}"
  }
fi

# Pull latest code with fetch + reset to avoid conflicts
git fetch origin main
git reset --hard origin/main || {
  echo -e "${RED}❌ Git reset failed${NC}"
  exit 1
}
echo -e "${GREEN}✅ Code updated successfully${NC}"
echo ""

# Step 3: Rebuild and restart container
echo -e "${YELLOW}🐳 Step 3: Rebuilding and restarting container...${NC}"
if docker-compose up -d --build 2>&1; then
  echo -e "${GREEN}✅ Container restarted successfully${NC}"
else
  echo -e "${RED}❌ Docker compose failed${NC}"
  docker-compose logs
  exit 1
fi
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "🌐 Application is running at: http://localhost:$APP_PORT"
echo ""
echo -e "${YELLOW}📊 Container status:${NC}"
docker ps --filter "name=computing-marketplace"
echo ""

echo -e "${GREEN}Deployment completed at $(date)${NC}"
