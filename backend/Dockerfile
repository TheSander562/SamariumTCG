# ---- Dependencies Installation Stage ----
ARG NODE_VERSION=25-slim
FROM node:${NODE_VERSION} AS dependencies

# Set working directory
WORKDIR /app

# Copy only what's needed for deps first (better caching)
COPY package*.json ./
COPY prisma ./prisma

# Install project dependencies
RUN npm ci

# Copy rest of the app
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Generate Prisma client
RUN npx prisma generate

# Build NestJS app
RUN npm run build

# ---- Runtime stage ----
FROM node:${NODE_VERSION} AS builder

# Set working directory
WORKDIR /app

# Install runtime tools
RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/* && apt-get clean

# Set production environment variables
ENV NODE_ENV=production

# Copy only necessary files
COPY package*.json ./

# Install production deps only
RUN npm ci --omit=dev && npm cache clean --force

# Copy Prisma files + generated client
COPY --from=dependencies /app/prisma ./prisma
COPY --from=dependencies /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled app
COPY --from=dependencies /app/dist ./dist

# Create runtime dirs
RUN mkdir -p /app/images

# Copy entrypoint
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Switch to non-root user for security best practices
USER node

# Expose port 3001to allow API traffic
EXPOSE 3001

# Add healthcheck to ensure the application is running and responsive
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start NestJS standalone application
ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]
