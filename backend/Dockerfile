# -------------------------------------------------------------------
# Backend Dockerfile (NestJS + Prisma + MinIO S3 SDK)
# Multi-stage production build
# -------------------------------------------------------------------

# Stage 1: Build & Compile
FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl for Prisma engines
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Generate Prisma client and build NestJS
RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl curl

ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm install --omit=dev --ignore-scripts
RUN npx prisma generate

# Copy compiled application from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory for fallback storage
RUN mkdir -p /app/public/uploads

EXPOSE 4000

# Entrypoint script: safe migrations deploy + start server
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/main.js"]

