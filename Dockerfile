# --- Build stage (frontend) ---
FROM node:20 AS builder

WORKDIR /app

# Kopioi frontendin package.json
COPY frontend/package*.json ./frontend/

# Asenna frontendin riippuvuudet
WORKDIR /app/frontend
RUN npm install

# Kopioi frontend-koodi
COPY frontend/ /app/frontend/

# Rakenna frontend
RUN npm run build


# --- Runtime stage (backend) ---
FROM node:20

WORKDIR /app

# Kopioi backend package.json
COPY package*.json ./

# Asenna backendin riippuvuudet
RUN npm install

# Kopioi backend-koodi
COPY . .

# Kopioi FRONTENDIN valmiiksi rakennettu versio dist-kansioon
COPY --from=builder /app/frontend/dist ./dist

EXPOSE 3000

CMD ["node", "server.js"]