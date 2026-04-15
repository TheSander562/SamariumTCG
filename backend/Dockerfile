# ---- Dependencies Installation Stage ----
ARG NODE_VERSION=24-alpine

FROM node:${NODE_VERSION} AS dependencies

# Set working directory
WORKDIR /app

# Install OpenSSL for Prisma
# RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
#  --mount=type=cache,target=/var/lib/apt,sharing=locked \
#  apt update && apt-get --no-install-recommends install -y openssl

# Copy the prisma schema for the post install
COPY prisma ./prisma

# Copy package json for npm install
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the files
COPY prisma.config.ts ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Build NestJS application
RUN npm run build

# Clean up dev dependencies after build
RUN npm prune --omit=dev && npm cache clean --force

# ---- Runtime stage ----
FROM node:${NODE_VERSION} AS runtime

# Set working directory
WORKDIR /app

# Install required binaries
# RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
#  --mount=type=cache,target=/var/lib/apt,sharing=locked \
#  apt update && apt-get --no-install-recommends install -y postgresql-client openssl dumb-init
RUN apk add --no-cache postgresql-client dumb-init

# Set production environment variables
ENV NODE_ENV=production

# Copy necessary files
COPY --chown=node:node --from=dependencies /app/dist ./dist
COPY --chown=node:node --from=dependencies /app/package.json .
COPY --chown=node:node --from=dependencies /app/package-lock.json .
COPY --chown=node:node --from=dependencies /app/prisma ./prisma
COPY --chown=node:node --from=dependencies /app/prisma.config.ts .
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=dependencies /app/src ./src

# Copy entrypoint script
COPY --chown=node:node docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Create images directory for caching
RUN mkdir -p /app/images && mkdir -p /app/src
RUN chown node:node -R /app/images && chown node:node -R /app/src

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
