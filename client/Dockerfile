# ==============================================================================
# AptitudePro Client - Multi-Stage Docker Build
# ==============================================================================
# Stage 1: Install dependencies
# Stage 2: Build the Vite/React application
# Stage 3: Serve with nginx (tiny production image)
# ==============================================================================

# --------------- Stage 1: Dependencies ---------------
FROM node:18-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci --ignore-scripts

# --------------- Stage 2: Build ---------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and config files
COPY package.json ./
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY public/ ./public/
COPY src/ ./src/

# Build the production bundle.
# VITE_API_URL can be overridden at build time for different environments.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# --------------- Stage 3: Production (nginx) ---------------
FROM nginx:1.25-alpine AS production

LABEL org.opencontainers.image.title="AptitudePro Client" \
      org.opencontainers.image.description="React SPA for AptitudePro" \
      org.opencontainers.image.vendor="AptitudePro" \
      org.opencontainers.image.version="1.0.0"

# Remove default nginx config and static content
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Custom nginx configuration optimized for SPAs
COPY --from=builder /app/dist /usr/share/nginx/html

# Inline nginx config: gzip, SPA fallback, security headers, caching
RUN cat > /etc/nginx/conf.d/default.conf << 'NGINX'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # ---------- Security Headers ----------
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' ws: wss: http: https:;" always;

    # ---------- Gzip Compression ----------
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    # ---------- Static Asset Caching ----------
    # Vite hashes filenames, so immutable caching is safe for assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # ---------- SPA Fallback ----------
    # All non-file routes fall back to index.html for client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ---------- API Proxy ----------
    # Proxies /api requests to the backend server (overrideable via env)
    location /api/ {
        proxy_pass http://server:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
