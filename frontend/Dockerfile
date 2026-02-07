# Multi-stage build for optimized production image

# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Install Chinese npm registry for faster downloads
RUN npm config set registry https://registry.npmmirror.com

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with cache preference
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production server with Nginx
FROM nginx:alpine

# Install OpenSSL if not present
RUN apk add --no-cache openssl

# Create SSL directory and generate self-signed certificate
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=ComputingMarketplace/CN=zqian24.synology.me" && \
    chmod 600 /etc/nginx/ssl/key.pem && \
    chmod 644 /etc/nginx/ssl/cert.pem

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add non-root user
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S nginx-app -u 1001 && \
    chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx && \
    chown -R nginx-app:nginx-app /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx-app:nginx-app /var/run/nginx.pid && \
    chown -R nginx-app:nginx-app /etc/nginx/ssl

# Switch to non-root user
USER nginx-app

# Expose both HTTP and HTTPS ports
EXPOSE 8080 8443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider --no-check-certificate https://localhost:8443/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
