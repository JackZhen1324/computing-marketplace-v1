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

# Step 2: Handle untracked docker-compose.yml
echo -e "${YELLOW}📝 Step 2: Handling untracked files...${NC}"
if [ -f "docker-compose.yml" ] && ! git ls-files --error-unmatch docker-compose.yml >/dev/null 2>&1; then
  echo -e "${YELLOW}Found untracked docker-compose.yml, backing up...${NC}"
  mv docker-compose.yml docker-compose.yml.backup
  echo -e "${GREEN}✅ Backed up docker-compose.yml${NC}"
fi
echo ""

# Step 3: Pull latest code
echo -e "${YELLOW}📥 Step 3: Pulling latest code from GitHub...${NC}"
if git pull origin main 2>&1; then
  echo -e "${GREEN}✅ Code updated successfully${NC}"
else
  echo -e "${RED}❌ Git pull failed${NC}"
  exit 1
fi
echo ""

# Step 4: Rebuild and restart container
echo -e "${YELLOW}🐳 Step 4: Rebuilding and restarting container...${NC}"
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
