# Stage 1: build dell'app
FROM node:20-alpine AS build

WORKDIR /app

# Copia package.json e package-lock.json e installa dipendenze
COPY package*.json ./
RUN npm install

# Copia il resto del codice
COPY . .

# Build dell'app (Vite)
RUN npm run build

# Stage 2: server con Nginx
FROM nginx:alpine

# Copia la build nella cartella servita da Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Esponi la porta 80 del container
EXPOSE 80

# Avvia Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
