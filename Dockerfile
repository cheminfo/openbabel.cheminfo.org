# ── Stage 1: build the frontend ──────────────────────────────────────────────
FROM node:24-bookworm-slim AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN npm ci --workspace=frontend --ignore-scripts

COPY frontend ./frontend

RUN npm run build --workspace=frontend

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM node:24-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openbabel \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN npm ci --workspace=backend --omit=dev --ignore-scripts

COPY backend ./backend

COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production
ENV PORT=20808
EXPOSE 20808

USER node

WORKDIR /app/backend
CMD ["node", "src/server.ts"]
