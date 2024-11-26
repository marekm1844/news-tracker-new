FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Install pnpm globally as root
RUN corepack enable && \
    corepack prepare pnpm@latest --activate

# Set up node user and permissions
RUN chown -R node:node /app
USER node

# Install dependencies
COPY --chown=node:node package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm globally as root first
RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    chown -R node:node /app

USER node

# First copy only package files and install dependencies
COPY --chown=node:node package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Clean up node_modules before copying source
RUN rm -rf node_modules

# Then copy source files
COPY --chown=node:node . .

# Install dependencies again after copying source
RUN pnpm install --frozen-lockfile

ENV NEXT_TELEMETRY_DISABLED 1

# Build arguments for environment variables
ARG OPENAI_API_KEY
ARG UNSPLASH_ACCESS_KEY
ARG SCRAPER_API_URL
ARG SCRAPER_API_KEY
ARG NEXT_PUBLIC_NEWS_API

# Set environment variables for build
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV UNSPLASH_ACCESS_KEY=$UNSPLASH_ACCESS_KEY
ENV SCRAPER_API_URL=$SCRAPER_API_URL
ENV SCRAPER_API_KEY=$SCRAPER_API_KEY
ENV NEXT_PUBLIC_NEWS_API=$NEXT_PUBLIC_NEWS_API

RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

# Create necessary directories
RUN mkdir -p .next/static && chown -R nextjs:nodejs .next

# Copy built files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Runtime environment variables
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV UNSPLASH_ACCESS_KEY=$UNSPLASH_ACCESS_KEY
ENV SCRAPER_API_URL=$SCRAPER_API_URL
ENV SCRAPER_API_KEY=$SCRAPER_API_KEY
ENV NEXT_PUBLIC_NEWS_API=$NEXT_PUBLIC_NEWS_API

CMD ["node", "server.js"]
