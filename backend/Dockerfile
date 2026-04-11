# Build stage
FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Build application
RUN npm run build

# Runtime stage
FROM node:25-alpine

WORKDIR /app

# Install dumb-init and postgresql client
RUN apk add --no-cache dumb-init postgresql-client

# Copy package files
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Create images directory for caching
RUN mkdir -p /app/images

# Copy entrypoint script
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application with entrypoint script
CMD ["./docker-entrypoint.sh"]
