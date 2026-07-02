# ==============================================================================
# AptitudePro Server - Multi-Stage Docker Build
# ==============================================================================
# Stage 1: Install dependencies (cached layer unless package.json changes)
# Stage 2: Production image with minimal footprint
# ==============================================================================

# --------------- Stage 1: Dependencies ---------------
FROM node:18-alpine AS deps

WORKDIR /app

# Copy only package files first to leverage Docker layer caching.
# This means npm install only re-runs when dependencies actually change.
COPY package.json package-lock.json* ./

# Install production dependencies only (no devDependencies).
# --ignore-scripts prevents potentially malicious postinstall scripts.
RUN npm ci --omit=dev --ignore-scripts

# --------------- Stage 2: Production ---------------
FROM node:18-alpine AS production

# Security: Add labels for container metadata (OCI standard)
LABEL org.opencontainers.image.title="AptitudePro Server" \
      org.opencontainers.image.description="Node.js API server for AptitudePro" \
      org.opencontainers.image.vendor="AptitudePro" \
      org.opencontainers.image.version="1.0.0"

# Security: Install dumb-init for proper PID 1 signal handling.
# Node.js doesn't handle SIGTERM properly as PID 1 without this.
RUN apk add --no-cache dumb-init

# Security: Run as non-root user to limit blast radius of container escape
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# Copy production dependencies from deps stage
COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules

# Copy application source code
COPY --chown=appuser:appgroup package.json ./
COPY --chown=appuser:appgroup src/ ./src/

# Switch to non-root user
USER appuser

# Expose the API port
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production \
    PORT=5000

# Healthcheck: verify the server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Use dumb-init as entrypoint for proper signal forwarding
ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "src/server.js"]
