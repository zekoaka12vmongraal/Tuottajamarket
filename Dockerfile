# Käytetään Node 20
FROM node:20

# Työkansio
WORKDIR /app

# Kopioi backendin package.json
COPY package*.json ./

# Asenna backendin riippuvuudet
RUN npm install

# Kopioi frontend
COPY frontend ./frontend

# Rakenna frontend
RUN cd frontend && npm install && npm run build

# Kopioi frontend-build backendin dist-kansioon
RUN mkdir -p dist && cp -r frontend/dist/* dist/

# Kopioi loput tiedostot
COPY . .

# Avaa portti
EXPOSE 3000

# Käynnistä palvelin
CMD ["node", "server.js"]
