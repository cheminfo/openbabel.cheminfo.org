# ── Stage 1: build the frontend ──────────────────────────────────────────────
FROM node:24-trixie-slim AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN npm ci --workspace=frontend --ignore-scripts

COPY frontend ./frontend

RUN npm run build --workspace=frontend

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM node:24-trixie-slim

# Open Babel 3.2 is the first release that reads ChemDraw's current CDXML with
# its bond orders intact; under 3.1.1 — what trixie itself ships — aspirin comes
# back as a radical with no aromatic ring. Only openbabel and its library are
# taken from sid; the pin keeps every other package on trixie.
RUN echo 'deb http://deb.debian.org/debian sid main' \
    > /etc/apt/sources.list.d/sid.list \
  && printf 'Package: *\nPin: release a=sid\nPin-Priority: 100\n\nPackage: openbabel libopenbabel*\nPin: release a=sid\nPin-Priority: 990\n' \
    > /etc/apt/preferences.d/openbabel-sid \
  && apt-get update \
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
