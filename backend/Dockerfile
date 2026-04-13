# ---- Dependencies Installation Stage ----
ARG NODE_VERSION=25-alpine
FROM node:${NODE_VERSION} AS dependencies

# Set working directory
WORKDIR /app

# Copy only what is needed for deps first (better caching)
COPY package*.json ./
COPY prisma ./prisma
# COPY prisma.config.ts ./

# Install project dependencies
RUN npm ci

# Copy rest of the app
COPY src ./src
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Generate Prisma client
RUN npx prisma generate

# Build NestJS application
RUN npm run build

# ---- Runtime stage ----
FROM node:${NODE_VERSION} AS builder

# Set working directory
WORKDIR /app

# Install dumb-init and postgresql client
RUN apk add --no-cache dumb-init postgresql-client

# Set production environment variables
ENV NODE_ENV=production

# Copy only necessary files
COPY package*.json ./

# Install production deps only
RUN npm ci --omit=dev && npm cache clean --force

# Copy Prisma files + generated client
COPY --from=dependencies /app/prisma ./prisma
COPY --from=dependencies /app/prisma.config.ts ./
COPY --from=dependencies /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=dependencies /app/node_modules/@prisma ./node_modules/@prisma
# COPY prisma ./prisma
# COPY prisma.config.ts ./

# Copy compiled/built app
# COPY --from=dependencies /app/dist ./dist
COPY --from=dependencies /app/dist ./dist

# Install production dependencies only
# RUN npm ci --only=production

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
