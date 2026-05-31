# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json vite.config.ts tailwind.config.ts postcss.config.js index.html ./
COPY public ./public
COPY src ./src
# VITE_API_URL and VITE_API_TOKEN are baked into the bundle at build time.
ARG VITE_API_URL
ARG VITE_API_TOKEN
ARG VITE_APP_VERSION
ENV VITE_API_URL=$VITE_API_URL \
    VITE_API_TOKEN=$VITE_API_TOKEN \
    VITE_APP_VERSION=$VITE_APP_VERSION
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/package.json ./
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
USER app
EXPOSE 4173
ENV PORT=4173
CMD ["npm", "run", "start"]
