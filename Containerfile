# syntax=docker/dockerfile:1
# Compatível com Docker BuildKit e Podman build.

FROM node:22-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm ci

COPY apps/api apps/api
RUN npm run build -w @playbook/api

FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm ci --omit=dev

COPY --from=build /app/apps/api/dist apps/api/dist

EXPOSE 3000
USER node

CMD ["node", "apps/api/dist/server.js"]
