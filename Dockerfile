# -------------------------------------------------------------
# VAPELAB Unified Storefront & Nuxt Dashboard Admin Dockerfile
# Multi-stage production build for Nuxt 3 / Nitro
# -------------------------------------------------------------

# Stage 1: Build & Compile
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm install

COPY . .

# Build Nuxt 3 production output (.output)
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache curl

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy compiled standalone Nitro server
COPY --from=builder /app/.output ./.output

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 0

CMD ["node", ".output/server/index.mjs"]
