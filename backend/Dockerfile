# ---- Dependencies Installation Stage ----
ARG NODE_VERSION=24-slim

FROM node:${NODE_VERSION} AS dependencies

# Set working directory
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy package json for npm install
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm ci

# Copy the files
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Build NestJS application
RUN npm run build

# ---- Runtime stage ----
FROM node:${NODE_VERSION} AS builder

# Set working directory
WORKDIR /app

# Install required binaries
RUN apt-get update && apt-get install -y postgresql-client openssl dumb-init && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set production environment variables
ENV NODE_ENV=production

# Copy necessary files
COPY --chown=node:node --from=dependencies /app/dist ./dist
COPY --chown=node:node --from=dependencies /app/package.json .
COPY --chown=node:node --from=dependencies /app/package-lock.json .

# Install production deps only
RUN npm ci --omit=dev && npm cache clean --force

# Copy Prisma files + generated client
COPY --chown=node:node --from=dependencies /app/prisma ./prisma
COPY --chown=node:node --from=dependencies /app/prisma.config.ts ./

# Create images directory for caching
RUN mkdir -p /app/images

# Copy entrypoint script
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Switch to non-root user for security best practices
USER node

# Expose port 3001 to allow API traffic
EXPOSE 3001

# Add healthcheck to ensure the application is running and responsive
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start NestJS application with entrypoint script
CMD ["./docker-entrypoint.sh"]
