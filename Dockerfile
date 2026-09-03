
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


COPY . .

# VITE_* values are compiled into the bundle at BUILD time, so they must be
# passed as build args (see docker-compose.yaml). A runtime `environment:`
# block on the container is ignored and cannot change the bundled URL.
# Empty default => the SPA uses same-origin relative URLs (/api/v1),
# which nginx proxies to http://gateway:8222.
ARG VITE_BASE_API_URL=
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL


RUN npm run build

FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4173

CMD ["nginx", "-g", "daemon off;"]