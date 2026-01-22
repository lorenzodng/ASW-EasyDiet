# Immagine base Node.js
FROM node:20-alpine

# Cartella di lavoro nel container
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto del backend
COPY . .

# Esponi la porta del backend
EXPOSE 5000

# Comando per avviare il server
CMD ["npm", "start"]
