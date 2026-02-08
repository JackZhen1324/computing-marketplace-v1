# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Install Chinese npm registry for faster downloads
RUN npm config set registry https://registry.npmmirror.com

# Set Prisma engines mirror for more reliable downloads
ENV PRISMA_ENGINES_MIRROR=https://npmmirror.com/mirrors/prisma/

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies without postinstall scripts to avoid Prisma download issues
RUN npm ci --prefer-offline --no-audit --ignore-scripts

# Copy source code and entrypoint script
COPY . .
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Install and generate Prisma client separately
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Install Chinese npm registry for faster downloads
RUN npm config set registry https://registry.npmmirror.com

# Set Prisma engines mirror for more reliable downloads
ENV PRISMA_ENGINES_MIRROR=https://npmmirror.com/mirrors/prisma/

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only (skip postinstall to avoid Prisma download)
RUN npm ci --only=production --prefer-offline --no-audit --ignore-scripts

# Copy built files and entrypoint from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /usr/local/bin/docker-entrypoint.sh /usr/local/bin/

# Generate Prisma client for production
RUN npx prisma generate

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
