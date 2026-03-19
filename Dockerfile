# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Config nginx pour SSG bilingue
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location = / {\n\
        return 302 /en;\n\
    }\n\
\n\
    location / {\n\
        try_files $uri $uri/index.html /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
