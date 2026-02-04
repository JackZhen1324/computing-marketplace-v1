#!/bin/bash

###############################################################################
# Computing Marketplace - Server Deployment Script
#
# This script handles automated deployment on a production server
# Designed to work with GitHub Actions CI/CD pipeline
#
# Usage:
#   ./server-deploy.sh [options]
#
# Options:
#   -e, --env <file>     Environment file to load (default: .env)
#   -n, --no-pull        Skip pulling latest image (use local image)
#   -b, --backup         Backup current container before deployment
#   -h, --help           Show this help message
#
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="computing-marketplace"
CONTAINER_NAME="computing-marketplace-frontend"
DEPLOY_DIR="${DEPLOY_PATH:-/opt/app}"
BACKUP_DIR="${DEPLOY_DIR}/backups"
LOG_FILE="${DEPLOY_DIR}/deploy.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
    log "SUCCESS: $1"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
    log "ERROR: $1"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
    log "WARNING: $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

show_help() {
    cat << EOF
Computing Marketplace - Server Deployment Script

Usage: $0 [options]

Options:
    -e, --env <file>     Environment file to load (default: .env)
    -n, --no-pull        Skip pulling latest image (use local image)
    -b, --backup         Backup current container before deployment
    -h, --help           Show this help message

Environment Variables:
    DOCKER_USERNAME      Docker Hub username
    DEPLOY_PATH          Deployment directory (default: /opt/app)
    IMAGE_NAME           Full image name (including registry)
    IMAGE_TAG            Image tag to deploy (default: latest)
    APP_PORT             Application port (default: 3000)
    APP_URL              Application URL for health check

Examples:
    # Standard deployment
    $0

    # Deploy specific version
    IMAGE_TAG=v1.0.0 $0

    # Deploy without pulling new image
    $0 --no-pull

    # Deploy with backup
    $0 --backup

EOF
}

# Parse command line arguments
PULL_IMAGE=true
CREATE_BACKUP=false
ENV_FILE=".env"

while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENV_FILE="$2"
            shift 2
            ;;
        -n|--no-pull)
            PULL_IMAGE=false
            shift
            ;;
        -b|--backup)
            CREATE_BACKUP=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Load environment variables if file exists
if [ -f "$ENV_FILE" ]; then
    log "Loading environment from $ENV_FILE"
    source "$ENV_FILE"
fi

# Use environment variables or defaults
IMAGE_NAME="${IMAGE_NAME:-${DOCKER_USERNAME:-yourusername}/${PROJECT_NAME}-frontend}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"

print_header "Computing Marketplace - Server Deployment"
log "Starting deployment process..."
log "Image: ${FULL_IMAGE_NAME}"
log "Deploy directory: ${DEPLOY_DIR}"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    log_warning "Running as root. Consider using a non-root user with sudo privileges."
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create deploy directory if not exists
log "Creating deploy directory..."
sudo mkdir -p "$DEPLOY_DIR"
sudo mkdir -p "$BACKUP_DIR"

# Change to deploy directory
cd "$DEPLOY_DIR" || exit 1

# Create docker-compose.yml if not exists
if [ ! -f "docker-compose.yml" ]; then
    log "Creating docker-compose.yml..."
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  frontend:
    image: ${FULL_IMAGE_NAME}
    container_name: ${CONTAINER_NAME}
    ports:
      - "${APP_PORT:-3000}:8080"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  app-network:
    driver: bridge
EOF
    log_success "Created docker-compose.yml"
else
    log "docker-compose.yml exists, updating image tag..."
    sed -i.bak "s|image:.*|image: ${FULL_IMAGE_NAME}|g" docker-compose.yml
    log_success "Updated docker-compose.yml"
fi

# Login to Docker Hub if credentials are provided
if [ -n "$DOCKER_USERNAME" ] && [ -n "$DOCKER_PASSWORD" ]; then
    log "Logging in to Docker Hub..."
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
    log_success "Logged in to Docker Hub"
fi

# Pull latest image
if [ "$PULL_IMAGE" = true ]; then
    log "Pulling latest image: ${FULL_IMAGE_NAME}"
    if docker pull "${FULL_IMAGE_NAME}"; then
        log_success "Image pulled successfully"
    else
        log_error "Failed to pull image. Make sure the image exists and you have access."
        exit 1
    fi
else
    log_warning "Skipping image pull (--no-pull flag)"
fi

# Backup current container if requested
if [ "$CREATE_BACKUP" = true ]; then
    log "Creating backup..."
    BACKUP_FILE="${BACKUP_DIR}/backup-$(date +%Y%m%d-%H%M%S).tar.gz"

    if docker ps -a | grep -q "$CONTAINER_NAME"; then
        # Backup container config
        cp docker-compose.yml "${BACKUP_DIR}/docker-compose.yml.$(date +%Y%m%d-%H%M%S)"

        log_success "Backup created: ${BACKUP_FILE}"
    else
        log_warning "No existing container to backup"
    fi
fi

# Stop and remove old container
log "Stopping old container..."
if docker ps -a | grep -q "$CONTAINER_NAME"; then
    docker stop "$CONTAINER_NAME" 2>/dev/null || true
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
    log_success "Old container stopped and removed"
else
    log "No existing container found"
fi

# Start new container
log "Starting new container..."
if docker-compose up -d; then
    log_success "Container started successfully"
else
    log_error "Failed to start container"
    exit 1
fi

# Wait for container to be healthy
log "Waiting for container to be healthy..."
MAX_WAIT=60
WAIT_TIME=0
while [ $WAIT_TIME -lt $MAX_WAIT ]; do
    if docker ps | grep -q "$CONTAINER_NAME"; then
        # Check if container is running and responding
        if curl -f -s "http://localhost:${APP_PORT:-3000}/" > /dev/null 2>&1; then
            log_success "Container is healthy and responding!"
            break
        fi
    fi

    log "Waiting... ($WAIT_TIME/$MAX_WAIT seconds)"
    sleep 5
    WAIT_TIME=$((WAIT_TIME + 5))
done

if [ $WAIT_TIME -ge $MAX_WAIT ]; then
    log_warning "Container health check timed out after ${MAX_WAIT} seconds"
fi

# Show container status
log "Container status:"
docker ps -f name="$CONTAINER_NAME"

# Show recent logs
log "Recent container logs:"
docker logs --tail 20 "$CONTAINER_NAME"

# Clean up old images
log "Cleaning up old images..."
docker image prune -af --filter "until=72h" 2>/dev/null || true

# Test application endpoint
APP_URL="${APP_URL:-http://localhost:${APP_PORT:-3000}}"
log "Testing application endpoint: ${APP_URL}"
if curl -f -s -o /dev/null "$APP_URL"; then
    log_success "Application is responding!"
else
    log_warning "Application endpoint test failed. Please check manually."
fi

print_header "Deployment Complete!"
log_success "Deployment finished successfully!"
log "Application is running at: ${APP_URL}"
log "View logs: docker logs -f $CONTAINER_NAME"
log "View status: docker ps -f name=$CONTAINER_NAME"

# Show deployment info
echo ""
echo -e "${GREEN}Deployment Summary:${NC}"
echo "  Container: $CONTAINER_NAME"
echo "  Image: ${FULL_IMAGE_NAME}"
echo "  Port: ${APP_PORT:-3000}"
echo "  URL: ${APP_URL}"
echo ""
