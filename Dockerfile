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

# Config nginx pour SSG bilingue avec détection de langue
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location = / {\n\
        # Langue par défaut : Accept-Language\n\
        set $lang "en";\n\
        if ($http_accept_language ~* "^fr") { set $lang "fr"; }\n\
\n\
        # Cookie "lang" (posé par i18next) prend le dessus\n\
        if ($cookie_lang = "fr") { set $lang "fr"; }\n\
        if ($cookie_lang = "en") { set $lang "en"; }\n\
\n\
        return 302 $scheme://$http_host/$lang;\n\
    }\n\
\n\
    location / {\n\
        try_files $uri $uri/index.html /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
