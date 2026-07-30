ARG NODE_VERSION=24-alpine

FROM node:${NODE_VERSION} AS base

# Build Next.js application in standalone mode only when needed
FROM base AS builder

# Set working directory
WORKDIR /app

# Install project dependencies
COPY package.json package-lock.json prisma.config.ts tsconfig.json next.config.ts ./
COPY prisma/ ./prisma

# Install project dependencies with frozen lockfile for reproducible builds
RUN npm --no-fund --no-update-notifier ci

# Build Next.js application in standalone mode
COPY public/ ./public
COPY src/ ./src
COPY . .

RUN npx prisma generate && NEXT_TELEMETRY_DISABLED=1 npm run build

# Run Next.js application
FROM base AS app

# Set working directory
WORKDIR /app

COPY --from=builder --chown=node:node /app/prisma.config.ts /app/package-lock.json /app/package.json ./
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/src/generated ./src/generated
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

RUN npm install --omit=optional --no-save --no-fund --no-update-notifier "prisma@$(node --print 'require("./node_modules/@prisma/client/package.json").version')" \
    && npm cache clean --force

# Copy the entrypoint script and make it executable
COPY --chmod=+x docker/entrypoint.sh /entrypoint.sh

# Disable telemetry for Next.js to prevent sending anonymous usage data
# and set the environment to production for optimized builds
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    CHECKPOINT_DISABLE=1 \
    DISABLE_PRISMA_TELEMETRY=true \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Expose port 3000 to allow HTTP traffic
EXPOSE 3000

# Switch to non-root user for security best practices
USER node

# Add healthcheck to ensure the application is running and responsive
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start Next.js standalone application
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "server.js"]
