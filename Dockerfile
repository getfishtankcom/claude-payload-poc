##
# FRAS Canada — Production Dockerfile
#
# Multi-stage build adapted from the Payload CMS website template
# and the official Next.js with-docker example.
#
# Prerequisites:
#   - next.config.mjs must include `output: 'standalone'` for production
#   - All env vars must be set at build time or via runtime injection
#
# Build:
#   docker build -t fras-canada .
#
# Run:
#   docker run -p 3000:3000 --env-file .env fras-canada
##

FROM node:22-alpine AS base

# ── Stage 1: Install dependencies ──────────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ── Stage 2: Build the application ────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: Production runner ─────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets (if they exist)
COPY --from=builder /app/public ./public

# Create .next directory with correct permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone output + static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy media uploads directory (Payload local storage)
RUN mkdir -p media
RUN chown nextjs:nodejs media

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
