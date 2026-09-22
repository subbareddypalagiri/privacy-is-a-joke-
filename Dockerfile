# FUF Sovereign Privacy Engine - Containerized Daemon
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Minimal Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV SHIELD_PORT=53

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts

# Expose DNS UDP/TCP Port 53 and Control/DoH API Port 5354
EXPOSE 53/udp
EXPOSE 53/tcp
EXPOSE 5354/tcp

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --spider -q http://127.0.0.1:5354/api/stats || exit 1

CMD ["node", "dist/daemon.js"]
